/**
 * API Usage Tracker
 *
 * Tracks API request counts per tenant for billing and rate limiting
 */

import { getMasterPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

// In-memory cache for API request counts (flushed to DB periodically)
const apiRequestCache = new Map<string, {
  count: number;
  byEndpoint: Record<string, number>;
  lastFlushed: Date;
}>();

const FLUSH_INTERVAL_MS = 60000; // Flush to DB every 60 seconds

/**
 * Increment API request counter for a tenant
 *
 * @param tenantSlugOrId - Tenant slug (e.g., "cafe-abc") or tenant ID
 * @param endpoint - API endpoint path (e.g., "/api/orders")
 */
export async function trackApiRequest(
  tenantSlugOrId: string,
  endpoint: string
): Promise<void> {
  // Resolve tenant ID from slug if needed
  let tenantId = tenantSlugOrId;

  // If it looks like a slug (contains hyphens), resolve to ID
  if (tenantSlugOrId.includes('-') || tenantSlugOrId.length < 20) {
    const masterPrisma = getMasterPrisma();
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: tenantSlugOrId },
      select: { id: true },
    });

    if (!tenant) {
      logger.warn(`Tenant not found for slug: ${tenantSlugOrId}`);
      return;
    }

    tenantId = tenant.id;
  }

  const today = getTodayDate();
  const cacheKey = `${tenantId}:${today.toISOString()}`;

  // Get or initialize cache entry
  let cacheEntry = apiRequestCache.get(cacheKey);
  if (!cacheEntry) {
    cacheEntry = {
      count: 0,
      byEndpoint: {},
      lastFlushed: new Date(),
    };
    apiRequestCache.set(cacheKey, cacheEntry);
  }

  // Increment counters
  cacheEntry.count++;
  cacheEntry.byEndpoint[endpoint] = (cacheEntry.byEndpoint[endpoint] || 0) + 1;

  // Check if we should flush to database
  const timeSinceFlush = Date.now() - cacheEntry.lastFlushed.getTime();
  if (timeSinceFlush >= FLUSH_INTERVAL_MS) {
    await flushApiUsageToDb(tenantId, today, cacheEntry);
    cacheEntry.lastFlushed = new Date();
  }
}

/**
 * Flush cached API usage to database
 */
async function flushApiUsageToDb(
  tenantId: string,
  date: Date,
  cacheEntry: { count: number; byEndpoint: Record<string, number> }
): Promise<void> {
  const masterPrisma = getMasterPrisma();

  try {
    // Get current usage from DB
    const existingUsage = await masterPrisma.tenantUsage.findUnique({
      where: {
        tenantId_date: { tenantId, date },
      },
      select: {
        apiRequests: true,
        apiRequestsByEndpoint: true,
      },
    });

    // Merge endpoint counts
    const existingByEndpoint = (existingUsage?.apiRequestsByEndpoint as Record<string, number>) || {};
    const mergedByEndpoint = { ...existingByEndpoint };

    for (const [endpoint, count] of Object.entries(cacheEntry.byEndpoint)) {
      mergedByEndpoint[endpoint] = (mergedByEndpoint[endpoint] || 0) + count;
    }

    // Upsert usage record
    await masterPrisma.tenantUsage.upsert({
      where: {
        tenantId_date: { tenantId, date },
      },
      create: {
        tenantId,
        date,
        apiRequests: cacheEntry.count,
        apiRequestsByEndpoint: mergedByEndpoint,
        dbSizeBytes: 0,
        dbSizeMB: 0,
      },
      update: {
        apiRequests: {
          increment: cacheEntry.count,
        },
        apiRequestsByEndpoint: mergedByEndpoint,
      },
    });

    // Reset cache entry counts
    cacheEntry.count = 0;
    cacheEntry.byEndpoint = {};
  } catch (error) {
    logger.error('Failed to flush API usage to DB:', error instanceof Error ? error : undefined);
    // Don't throw - we'll retry on next flush
  }
}

/**
 * Get today's date normalized to start of day
 */
function getTodayDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Force flush all cached API usage to database
 * Should be called on server shutdown or periodically
 */
export async function flushAllApiUsage(): Promise<void> {
  const promises: Promise<void>[] = [];

  for (const [cacheKey, cacheEntry] of apiRequestCache.entries()) {
    const [tenantId, dateStr] = cacheKey.split(':');
    const date = new Date(dateStr);

    if (cacheEntry.count > 0) {
      promises.push(flushApiUsageToDb(tenantId, date, cacheEntry));
    }
  }

  await Promise.all(promises);
  apiRequestCache.clear();
}

/**
 * Get current API request count for a tenant today (from cache + DB)
 *
 * @param tenantId - Tenant ID
 * @returns Current API request count for today
 */
export async function getCurrentApiRequestCount(tenantId: string): Promise<number> {
  const today = getTodayDate();
  const cacheKey = `${tenantId}:${today.toISOString()}`;

  // Get cached count
  const cacheEntry = apiRequestCache.get(cacheKey);
  const cachedCount = cacheEntry?.count || 0;

  // Get DB count
  const masterPrisma = getMasterPrisma();
  const dbUsage = await masterPrisma.tenantUsage.findUnique({
    where: {
      tenantId_date: { tenantId, date: today },
    },
    select: {
      apiRequests: true,
    },
  });

  return (dbUsage?.apiRequests || 0) + cachedCount;
}

// Setup periodic flush (only in Node.js runtime, not Edge Runtime)
if (typeof setInterval !== 'undefined' && typeof process !== 'undefined' && typeof process.on === 'function') {
  setInterval(async () => {
    await flushAllApiUsage();
  }, FLUSH_INTERVAL_MS);
}

// Graceful shutdown handler (only in Node.js runtime, not Edge Runtime)
if (typeof process !== 'undefined' && typeof process.on === 'function') {
  process.on('beforeExit', async () => {
    await flushAllApiUsage();
  });

  process.on('SIGINT', async () => {
    await flushAllApiUsage();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await flushAllApiUsage();
    process.exit(0);
  });
}
