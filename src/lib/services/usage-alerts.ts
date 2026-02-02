/**
 * Usage Alerts Service
 *
 * Monitors usage and creates alerts when thresholds are exceeded
 */

import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';
import { USAGE_LIMITS, USAGE_ALERT_THRESHOLDS, checkUsageAlerts } from "@/lib/constants/usage-limits";
import { getTenantUsage, calculateTenantBilling } from "./usage-calculator";

export interface UsageAlertData {
  id: string;
  resource: string;
  level: "WARNING" | "CRITICAL" | "EXCEEDED";
  percentage: number;
  current: number;
  limit: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Check and create usage alerts for a tenant
 */
export async function checkAndCreateAlerts(tenantSlug: string): Promise<UsageAlertData[]> {
  const masterPrisma = getMasterPrisma();

  // Get tenant
  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: {
      id: true,
      slug: true,
      customStorageLimitMB: true,
      customBandwidthLimitGB: true,
      customOrdersLimit: true,
      customStaffLimit: true,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantSlug}`);
  }

  // Get current usage
  const usage = await getTenantUsage(tenantSlug);

  // Get limits (custom or default)
  const limits = {
    databaseStorageMB: tenant.customStorageLimitMB || USAGE_LIMITS.DATABASE_STORAGE_MB,
    bandwidthGB: tenant.customBandwidthLimitGB || USAGE_LIMITS.BANDWIDTH_GB,
    ordersPerMonth: tenant.customOrdersLimit || USAGE_LIMITS.ORDERS_PER_MONTH,
    staffAccounts: tenant.customStaffLimit || USAGE_LIMITS.STAFF_ACCOUNTS,
  };

  // Check for alerts
  const alertCheck = checkUsageAlerts({
    databaseStorageMB: usage.databaseStorageMB,
    bandwidthGB: usage.bandwidthGB,
    ordersCount: usage.ordersCount,
    staffCount: usage.staffCount,
  });

  const createdAlerts: UsageAlertData[] = [];

  // Create alerts in database
  for (const alert of alertCheck.alerts) {
    // Check if similar alert already exists and is not resolved
    const existingAlert = await masterPrisma.usageAlert.findFirst({
      where: {
        tenantId: tenant.id,
        resource: mapResourceToDbKey(alert.resource),
        level: alert.level.toUpperCase(),
        resolvedAt: null,
      },
    });

    // Only create new alert if no existing unresolved alert
    if (!existingAlert) {
      const newAlert = await masterPrisma.usageAlert.create({
        data: {
          tenantId: tenant.id,
          resource: mapResourceToDbKey(alert.resource),
          level: alert.level.toUpperCase(),
          percentage: alert.percentage,
          current: alert.current,
          limit: alert.limit,
          message: alert.message,
          isRead: false,
          isSent: false,
        },
      });

      createdAlerts.push({
        id: newAlert.id,
        resource: newAlert.resource,
        level: newAlert.level as "WARNING" | "CRITICAL" | "EXCEEDED",
        percentage: newAlert.percentage,
        current: newAlert.current,
        limit: newAlert.limit,
        message: newAlert.message,
        isRead: newAlert.isRead,
        createdAt: newAlert.createdAt,
      });
    }
  }

  // Resolve alerts that are no longer applicable
  await resolveObsoleteAlerts(tenant.id, usage, limits);

  return createdAlerts;
}

/**
 * Get active alerts for a tenant
 */
export async function getActiveAlerts(tenantSlug: string): Promise<UsageAlertData[]> {
  const masterPrisma = getMasterPrisma();

  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantSlug}`);
  }

  const alerts = await masterPrisma.usageAlert.findMany({
    where: {
      tenantId: tenant.id,
      resolvedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return alerts.map((alert) => ({
    id: alert.id,
    resource: alert.resource,
    level: alert.level as "WARNING" | "CRITICAL" | "EXCEEDED",
    percentage: alert.percentage,
    current: alert.current,
    limit: alert.limit,
    message: alert.message,
    isRead: alert.isRead,
    createdAt: alert.createdAt,
  }));
}

/**
 * Mark alert as read
 */
export async function markAlertAsRead(alertId: string): Promise<void> {
  const masterPrisma = getMasterPrisma();

  await masterPrisma.usageAlert.update({
    where: { id: alertId },
    data: { isRead: true },
  });
}

/**
 * Mark all alerts as read for a tenant
 */
export async function markAllAlertsAsRead(tenantSlug: string): Promise<void> {
  const masterPrisma = getMasterPrisma();

  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantSlug}`);
  }

  await masterPrisma.usageAlert.updateMany({
    where: {
      tenantId: tenant.id,
      resolvedAt: null,
    },
    data: { isRead: true },
  });
}

/**
 * Resolve obsolete alerts (usage dropped below threshold)
 */
async function resolveObsoleteAlerts(
  tenantId: string,
  usage: { databaseStorageMB: number; bandwidthGB: number; ordersCount: number; staffCount: number },
  limits: { databaseStorageMB: number; bandwidthGB: number; ordersPerMonth: number; staffAccounts: number }
): Promise<void> {
  const masterPrisma = getMasterPrisma();

  // Get all unresolved alerts
  const unresolvedAlerts = await masterPrisma.usageAlert.findMany({
    where: {
      tenantId,
      resolvedAt: null,
    },
  });

  // Check each alert to see if it should be resolved
  for (const alert of unresolvedAlerts) {
    let shouldResolve = false;

    switch (alert.resource) {
      case "DATABASE_STORAGE":
        const storagePercentage = (usage.databaseStorageMB / limits.databaseStorageMB) * 100;
        shouldResolve = storagePercentage < USAGE_ALERT_THRESHOLDS.WARNING * 100;
        break;

      case "BANDWIDTH":
        const bandwidthPercentage = (usage.bandwidthGB / limits.bandwidthGB) * 100;
        shouldResolve = bandwidthPercentage < USAGE_ALERT_THRESHOLDS.WARNING * 100;
        break;

      case "ORDERS":
        const ordersPercentage = (usage.ordersCount / limits.ordersPerMonth) * 100;
        shouldResolve = ordersPercentage < USAGE_ALERT_THRESHOLDS.WARNING * 100;
        break;

      case "STAFF":
        const staffPercentage = (usage.staffCount / limits.staffAccounts) * 100;
        shouldResolve = staffPercentage < USAGE_ALERT_THRESHOLDS.WARNING * 100;
        break;
    }

    if (shouldResolve) {
      await masterPrisma.usageAlert.update({
        where: { id: alert.id },
        data: { resolvedAt: new Date() },
      });
    }
  }
}

/**
 * Check alerts for all active tenants
 */
export async function checkAllTenantsAlerts(): Promise<{
  tenantSlug: string;
  alertsCreated: number;
}[]> {
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

  const results = await Promise.all(
    tenants.map(async (tenant) => {
      try {
        const alerts = await checkAndCreateAlerts(tenant.slug);
        return {
          tenantSlug: tenant.slug,
          alertsCreated: alerts.length,
        };
      } catch (error) {
        logger.error(`Error checking alerts for ${tenant.slug}:`, error instanceof Error ? error : undefined);
        return {
          tenantSlug: tenant.slug,
          alertsCreated: 0,
        };
      }
    })
  );

  return results;
}

/**
 * Get alerts that need email notification
 */
export async function getAlertsToNotify(): Promise<Array<{
  alert: UsageAlertData;
  tenant: {
    id: string;
    slug: string;
    businessName: string;
    contactEmail: string;
  };
}>> {
  const masterPrisma = getMasterPrisma();

  const alerts = await masterPrisma.usageAlert.findMany({
    where: {
      isSent: false,
      resolvedAt: null,
    },
    include: {
      tenant: {
        select: {
          id: true,
          slug: true,
          businessName: true,
          contactEmail: true,
        },
      },
    },
  });

  return alerts.map((alert) => ({
    alert: {
      id: alert.id,
      resource: alert.resource,
      level: alert.level as "WARNING" | "CRITICAL" | "EXCEEDED",
      percentage: alert.percentage,
      current: alert.current,
      limit: alert.limit,
      message: alert.message,
      isRead: alert.isRead,
      createdAt: alert.createdAt,
    },
    tenant: alert.tenant,
  }));
}

/**
 * Mark alert as sent
 */
export async function markAlertAsSent(alertId: string): Promise<void> {
  const masterPrisma = getMasterPrisma();

  await masterPrisma.usageAlert.update({
    where: { id: alertId },
    data: {
      isSent: true,
      sentAt: new Date(),
    },
  });
}

/**
 * Map resource name to database key
 */
function mapResourceToDbKey(resource: string): string {
  const mapping: Record<string, string> = {
    "Database Storage": "DATABASE_STORAGE",
    "Bandwidth": "BANDWIDTH",
    "Orders": "ORDERS",
    "Staff Accounts": "STAFF",
  };

  return mapping[resource] || resource.toUpperCase().replace(/\s+/g, "_");
}
