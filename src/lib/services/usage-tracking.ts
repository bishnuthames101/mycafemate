/**
 * Usage Tracking Service
 *
 * Tracks tenant resource usage for billing and limiting:
 * - Database size per tenant schema
 * - API request counts
 * - Storage usage (future)
 */

import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { Client } from "pg";
import { logger } from '@/lib/utils/logger';

interface TenantUsageData {
  tenantId: string;
  tenantSlug: string;
  dbSizeBytes: bigint;
  dbSizeMB: number;
  apiRequests: number;
  storageMB: number;
}

/**
 * Measure database size for a specific tenant schema
 *
 * @param tenantSlug - Tenant identifier (e.g., "cafe-abc")
 * @returns Database size in bytes and MB
 */
export async function measureTenantDbSize(
  tenantSlug: string
): Promise<{ sizeBytes: bigint; sizeMB: number }> {
  const multiTenancyMode = process.env.MULTI_TENANCY_MODE || 'DATABASE';
  const adminUrl = process.env.POSTGRES_ADMIN_URL || process.env.MASTER_DATABASE_URL;

  if (!adminUrl) {
    throw new Error("POSTGRES_ADMIN_URL not configured");
  }

  // Parse connection details
  const url = new URL(adminUrl.replace("postgresql://", "http://"));
  const user = url.username;
  const password = decodeURIComponent(url.password);
  const host = url.hostname === 'localhost' ? '127.0.0.1' : url.hostname;
  const port = parseInt(url.port || "5432");

  const adminClient = new Client({ user, password, host, port, database: 'postgres' });

  try {
    await adminClient.connect();

    if (multiTenancyMode === 'SCHEMA') {
      // Schema mode: Measure schema size in shared database
      const schemaName = `tenant_${tenantSlug.replace(/-/g, '_')}`;
      const sharedDbName = url.pathname.replace('/', '') || 'cafemate_shared';

      // Reconnect to the shared database
      await adminClient.end();
      const schemaClient = new Client({ user, password, host, port, database: sharedDbName });
      await schemaClient.connect();

      // Query to calculate schema size
      const query = `
        SELECT
          COALESCE(SUM(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename))), 0) AS size_bytes
        FROM pg_tables
        WHERE schemaname = $1
      `;

      const result = await schemaClient.query(query, [schemaName]);
      await schemaClient.end();

      const sizeBytes = BigInt(result.rows[0]?.size_bytes || 0);
      const sizeMB = Number(sizeBytes) / (1024 * 1024);

      return { sizeBytes, sizeMB };
    } else {
      // Database mode: Measure entire database size
      const dbName = `cafemate_${tenantSlug.replace(/-/g, '_')}`;

      const query = `
        SELECT pg_database_size($1) AS size_bytes
      `;

      const result = await adminClient.query(query, [dbName]);
      const sizeBytes = BigInt(result.rows[0]?.size_bytes || 0);
      const sizeMB = Number(sizeBytes) / (1024 * 1024);

      return { sizeBytes, sizeMB };
    }
  } finally {
    try {
      await adminClient.end();
    } catch (e) {
      // Connection might already be closed
    }
  }
}

/**
 * Record usage data for a tenant (called daily or on-demand)
 *
 * @param tenantId - Tenant ID from master database
 * @param usageData - Usage metrics to record
 */
export async function recordTenantUsage(
  tenantId: string,
  usageData: {
    dbSizeBytes: bigint;
    dbSizeMB: number;
    apiRequests: number;
    apiRequestsByEndpoint?: Record<string, number>;
    storageMB?: number;
  }
): Promise<void> {
  const masterPrisma = getMasterPrisma();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  // Get tenant limits
  const tenant = await masterPrisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      slug: true,
      maxDbSizeMB: true,
      maxApiRequests: true,
      maxStorageMB: true,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  // Check for overages
  const dbOverage = usageData.dbSizeMB > tenant.maxDbSizeMB;
  const apiOverage = usageData.apiRequests > tenant.maxApiRequests;

  // Calculate overage charges (example: $0.01 per MB over limit, $0.001 per 100 API requests over)
  let overageAmount = 0;
  if (dbOverage) {
    const excessMB = usageData.dbSizeMB - tenant.maxDbSizeMB;
    overageAmount += excessMB * 0.01; // $0.01 per MB
  }
  if (apiOverage) {
    const excessRequests = usageData.apiRequests - tenant.maxApiRequests;
    overageAmount += (excessRequests / 100) * 0.001; // $0.001 per 100 requests
  }

  // Upsert usage record for today
  await masterPrisma.tenantUsage.upsert({
    where: {
      tenantId_date: {
        tenantId: tenant.id,
        date: today,
      },
    },
    create: {
      tenantId: tenant.id,
      date: today,
      dbSizeBytes: usageData.dbSizeBytes,
      dbSizeMB: usageData.dbSizeMB,
      apiRequests: usageData.apiRequests,
      apiRequestsByEndpoint: usageData.apiRequestsByEndpoint || {},
      storageSizeMB: usageData.storageMB || 0,
      dbOverage,
      apiOverage,
      overageAmount: overageAmount > 0 ? overageAmount : null,
    },
    update: {
      dbSizeBytes: usageData.dbSizeBytes,
      dbSizeMB: usageData.dbSizeMB,
      apiRequests: usageData.apiRequests,
      apiRequestsByEndpoint: usageData.apiRequestsByEndpoint || {},
      storageSizeMB: usageData.storageMB || 0,
      dbOverage,
      apiOverage,
      overageAmount: overageAmount > 0 ? overageAmount : null,
      recordedAt: new Date(),
    },
  });

  // Update tenant's current usage
  await masterPrisma.tenant.update({
    where: { id: tenant.id },
    data: {
      currentDbSizeMB: usageData.dbSizeMB,
      currentStorageMB: usageData.storageMB || 0,
      dbLimitExceeded: dbOverage,
      apiLimitExceeded: apiOverage,
      limitExceededAt: dbOverage || apiOverage ? new Date() : null,
    },
  });

  // Log if limits exceeded
  if (dbOverage || apiOverage) {
    await masterPrisma.tenantActivityLog.create({
      data: {
        tenantId: tenant.id,
        action: 'USAGE_LIMIT_EXCEEDED',
        details: {
          dbOverage,
          apiOverage,
          dbSizeMB: usageData.dbSizeMB,
          maxDbSizeMB: tenant.maxDbSizeMB,
          apiRequests: usageData.apiRequests,
          maxApiRequests: tenant.maxApiRequests,
        },
      },
    });
  }
}

/**
 * Measure and record usage for all active tenants
 * Should be run daily via cron job
 */
export async function measureAllTenantsUsage(): Promise<void> {
  const masterPrisma = getMasterPrisma();

  // Get all active tenants
  const tenants = await masterPrisma.tenant.findMany({
    where: {
      isActive: true,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      slug: true,
    },
  });

  logger.info(`Measuring usage for ${tenants.length} tenants...`);

  for (const tenant of tenants) {
    try {
      // Measure DB size
      const { sizeBytes, sizeMB } = await measureTenantDbSize(tenant.slug);

      // Get today's API request count (would be tracked by middleware)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingUsage = await masterPrisma.tenantUsage.findUnique({
        where: {
          tenantId_date: {
            tenantId: tenant.id,
            date: today,
          },
        },
        select: {
          apiRequests: true,
          apiRequestsByEndpoint: true,
        },
      });

      // Record usage
      await recordTenantUsage(tenant.id, {
        dbSizeBytes: sizeBytes,
        dbSizeMB: sizeMB,
        apiRequests: existingUsage?.apiRequests || 0,
        apiRequestsByEndpoint: (existingUsage?.apiRequestsByEndpoint as Record<string, number>) || {},
        storageMB: 0, // TODO: Implement storage measurement
      });

      logger.info(`${tenant.slug}: ${sizeMB.toFixed(2)} MB`);
    } catch (error: any) {
      logger.error(`Failed to measure usage for ${tenant.slug}: ${error.message}`, error instanceof Error ? error : undefined);
    }
  }

  logger.info(`Usage measurement complete`);
}

/**
 * Get usage statistics for a tenant
 *
 * @param tenantId - Tenant ID
 * @param days - Number of days to retrieve (default: 30)
 */
export async function getTenantUsageStats(
  tenantId: string,
  days: number = 30
): Promise<any[]> {
  const masterPrisma = getMasterPrisma();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const usageRecords = await masterPrisma.tenantUsage.findMany({
    where: {
      tenantId,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return usageRecords;
}

/**
 * Check if tenant has exceeded usage limits
 *
 * @param tenantId - Tenant ID
 * @returns Object indicating which limits were exceeded
 */
export async function checkTenantLimits(tenantId: string): Promise<{
  withinLimits: boolean;
  dbLimitExceeded: boolean;
  apiLimitExceeded: boolean;
  currentDbSizeMB: number;
  maxDbSizeMB: number;
  todayApiRequests: number;
  maxApiRequests: number;
}> {
  const masterPrisma = getMasterPrisma();

  const tenant = await masterPrisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      currentDbSizeMB: true,
      maxDbSizeMB: true,
      maxApiRequests: true,
      dbLimitExceeded: true,
      apiLimitExceeded: true,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  // Get today's API usage
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayUsage = await masterPrisma.tenantUsage.findUnique({
    where: {
      tenantId_date: {
        tenantId,
        date: today,
      },
    },
    select: {
      apiRequests: true,
    },
  });

  const todayApiRequests = todayUsage?.apiRequests || 0;
  const apiLimitExceeded = todayApiRequests > tenant.maxApiRequests;

  return {
    withinLimits: !tenant.dbLimitExceeded && !apiLimitExceeded,
    dbLimitExceeded: tenant.dbLimitExceeded,
    apiLimitExceeded,
    currentDbSizeMB: tenant.currentDbSizeMB,
    maxDbSizeMB: tenant.maxDbSizeMB,
    todayApiRequests,
    maxApiRequests: tenant.maxApiRequests,
  };
}
