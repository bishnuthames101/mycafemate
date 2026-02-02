/**
 * Usage Calculator Service
 *
 * Calculates current usage from tenant database schema
 * and computes billing with overage charges
 */

import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';
import { USAGE_LIMITS, calculateOverageCharges } from "@/lib/constants/usage-limits";
import { Client } from "pg";
import { decryptDatabaseUrl } from "@/lib/prisma-multi-tenant";

export interface TenantUsageData {
  tenantId: string;
  tenantSlug: string;
  databaseStorageMB: number;
  bandwidthGB: number;
  ordersCount: number;
  staffCount: number;
  menuItemsCount: number;
  tablesCount: number;
  hasPrioritySupport: boolean;
}

export interface UsageLimits {
  databaseStorageMB: number;
  bandwidthGB: number;
  ordersPerMonth: number;
  staffAccounts: number;
}

export interface BillingCalculation {
  tenantId: string;
  tenantSlug: string;
  billingPeriod: {
    start: Date;
    end: Date;
  };
  usage: TenantUsageData;
  limits: UsageLimits;
  charges: {
    baseCharge: number;
    overageCharges: {
      databaseStorage: number;
      bandwidth: number;
      orders: number;
      staff: number;
      prioritySupport: number;
    };
    totalOverage: number;
    totalBill: number;
  };
  usagePercentages: {
    databaseStorage: number;
    bandwidth: number;
    orders: number;
    staff: number;
  };
}

/**
 * Get current usage for a tenant from their database schema
 */
export async function getTenantUsage(tenantSlug: string): Promise<TenantUsageData> {
  const masterPrisma = getMasterPrisma();

  // Get tenant info
  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: {
      id: true,
      slug: true,
      databaseUrl: true,
      currentStorageUsageMB: true,
      currentBandwidthGB: true,
      currentMonthOrders: true,
      currentStaffCount: true,
      hasPrioritySupport: true,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantSlug}`);
  }

  // Get database storage size from PostgreSQL
  const databaseStorageMB = await getDatabaseSizeMB(tenant.databaseUrl);

  // Get counts from tenant database
  const tenantPrisma = await getTenantPrisma(tenantSlug);

  const [ordersCount, staffCount, menuItemsCount, tablesCount] = await Promise.all([
    // Count orders for current month
    tenantPrisma.order.count({
      where: {
        createdAt: {
          gte: getMonthStart(),
        },
      },
    }),
    // Count all staff/users
    tenantPrisma.user.count(),
    // Count menu items (products)
    tenantPrisma.product.count(),
    // Count tables
    tenantPrisma.table.count(),
  ]);

  // Update tenant's current usage in master DB
  await masterPrisma.tenant.update({
    where: { id: tenant.id },
    data: {
      currentStorageUsageMB: databaseStorageMB,
      currentBandwidthGB: tenant.currentBandwidthGB, // This would be tracked separately
      currentMonthOrders: ordersCount,
      currentStaffCount: staffCount,
    },
  });

  return {
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    databaseStorageMB,
    bandwidthGB: tenant.currentBandwidthGB,
    ordersCount,
    staffCount,
    menuItemsCount,
    tablesCount,
    hasPrioritySupport: tenant.hasPrioritySupport,
  };
}

/**
 * Calculate billing for a tenant based on current usage
 */
export async function calculateTenantBilling(tenantSlug: string): Promise<BillingCalculation> {
  const masterPrisma = getMasterPrisma();

  // Get tenant info and custom limits
  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: {
      id: true,
      slug: true,
      customStorageLimitMB: true,
      customBandwidthLimitGB: true,
      customOrdersLimit: true,
      customStaffLimit: true,
      hasPrioritySupport: true,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantSlug}`);
  }

  // Get current usage
  const usage = await getTenantUsage(tenantSlug);

  // Determine limits (custom or default)
  const limits: UsageLimits = {
    databaseStorageMB: tenant.customStorageLimitMB || USAGE_LIMITS.DATABASE_STORAGE_MB,
    bandwidthGB: tenant.customBandwidthLimitGB || USAGE_LIMITS.BANDWIDTH_GB,
    ordersPerMonth: tenant.customOrdersLimit || USAGE_LIMITS.ORDERS_PER_MONTH,
    staffAccounts: tenant.customStaffLimit || USAGE_LIMITS.STAFF_ACCOUNTS,
  };

  // Calculate charges
  const charges = calculateOverageCharges({
    databaseStorageMB: usage.databaseStorageMB,
    bandwidthGB: usage.bandwidthGB,
    ordersCount: usage.ordersCount,
    staffCount: usage.staffCount,
    hasPrioritySupport: usage.hasPrioritySupport,
  });

  // Calculate usage percentages
  const usagePercentages = {
    databaseStorage: (usage.databaseStorageMB / limits.databaseStorageMB) * 100,
    bandwidth: (usage.bandwidthGB / limits.bandwidthGB) * 100,
    orders: (usage.ordersCount / limits.ordersPerMonth) * 100,
    staff: (usage.staffCount / limits.staffAccounts) * 100,
  };

  // Update tenant billing info
  await masterPrisma.tenant.update({
    where: { id: tenant.id },
    data: {
      lastBillingCalculation: new Date(),
      lastMonthOverageCharges: charges.totalOverage,
      lastMonthTotalBill: charges.totalBill,
    },
  });

  return {
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    billingPeriod: {
      start: getMonthStart(),
      end: getMonthEnd(),
    },
    usage,
    limits,
    charges,
    usagePercentages,
  };
}

/**
 * Get database size in MB from PostgreSQL
 */
async function getDatabaseSizeMB(encryptedDatabaseUrl: string): Promise<number> {
  const databaseUrl = decryptDatabaseUrl(encryptedDatabaseUrl);
  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();

    // Get database name from connection string
    const dbNameMatch = databaseUrl.match(/\/([^/?]+)(?:\?|$)/);
    const dbName = dbNameMatch ? dbNameMatch[1] : null;

    if (!dbName) {
      throw new Error("Could not extract database name from connection string");
    }

    // Query database size
    const result = await client.query(
      `SELECT pg_database_size($1) as size`,
      [dbName]
    );

    const sizeBytes = parseInt(result.rows[0].size);
    const sizeMB = sizeBytes / (1024 * 1024);

    return parseFloat(sizeMB.toFixed(2));
  } catch (error) {
    logger.error("Error getting database size:", error instanceof Error ? error : undefined);
    return 0;
  } finally {
    await client.end();
  }
}

/**
 * Get start of current month
 */
function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Get end of current month
 */
function getMonthEnd(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Calculate billing for all active tenants
 */
export async function calculateAllTenantsBilling(): Promise<BillingCalculation[]> {
  const masterPrisma = getMasterPrisma();

  const tenants = await masterPrisma.tenant.findMany({
    where: {
      status: "ACTIVE",
      isActive: true,
    },
    select: {
      slug: true,
    },
  });

  const billingPromises = tenants.map((tenant) =>
    calculateTenantBilling(tenant.slug).catch((error) => {
      logger.error(`Error calculating billing for ${tenant.slug}:`, error instanceof Error ? error : undefined);
      return null;
    })
  );

  const results = await Promise.all(billingPromises);
  return results.filter((result): result is BillingCalculation => result !== null);
}
