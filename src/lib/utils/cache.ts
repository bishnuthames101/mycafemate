/**
 * Client-side cache utility with sessionStorage and TTL support
 * Used for caching API responses to improve perceived performance
 */

export const CACHE_KEYS = {
  PRODUCTS: 'cm_products',
  CATEGORIES: 'cm_categories',
  TABLES: 'cm_tables',
  EMPLOYEES: 'cm_employees',
} as const;

export const CACHE_TTL = {
  PRODUCTS: 5 * 60 * 1000,     // 5 minutes - products change moderately
  CATEGORIES: 30 * 60 * 1000,  // 30 minutes - categories rarely change
  TABLES: 2 * 60 * 1000,       // 2 minutes - table status changes frequently
  EMPLOYEES: 5 * 60 * 1000,    // 5 minutes - employee data changes infrequently
} as const;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Get cached data if valid (not expired)
 * @param key - Cache key from CACHE_KEYS
 * @returns Cached data or null if expired/missing
 */
export function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    if (now - entry.timestamp > entry.ttl) {
      // Cache expired, remove it
      sessionStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    // Invalid cache entry, remove it
    sessionStorage.removeItem(key);
    return null;
  }
}

/**
 * Set data in cache with TTL
 * @param key - Cache key from CACHE_KEYS
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds
 */
export function setCache<T>(key: string, data: T, ttl: number): void {
  if (typeof window === 'undefined') return;

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    // Storage might be full or disabled, fail silently
    console.warn('Failed to cache data');
  }
}

/**
 * Invalidate (remove) a specific cache entry
 * @param key - Cache key to invalidate
 */
export function invalidateCache(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(key);
  } catch {
    // Fail silently
  }
}

/**
 * Invalidate all CafeMate cache entries
 */
export function invalidateAllCache(): void {
  if (typeof window === 'undefined') return;

  try {
    Object.values(CACHE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Create a location-specific cache key
 * @param baseKey - Base cache key from CACHE_KEYS
 * @param locationId - Location ID to scope the cache
 */
export function locationCacheKey(baseKey: string, locationId: string): string {
  return `${baseKey}_${locationId}`;
}
