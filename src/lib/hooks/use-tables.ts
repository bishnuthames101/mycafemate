import useSWR from "swr";
import { Table } from "@prisma/client";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL, locationCacheKey } from "@/lib/utils/cache";

interface UseTablesOptions {
  locationId?: string;
  status?: string;
}

export function useTables(options: UseTablesOptions = {}) {
  const { locationId, status } = options;

  const params = new URLSearchParams();
  if (locationId) {
    params.set("locationId", locationId);
  }
  if (status) {
    params.set("status", status);
  }

  const queryString = params.toString();
  const url = locationId ? `/api/tables${queryString ? `?${queryString}` : ""}` : null;
  const cacheKey = locationId ? locationCacheKey(CACHE_KEYS.TABLES, locationId) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Table[]>(
    url,
    async (url: string) => {
      // Try cache first for instant display
      if (cacheKey) {
        const cached = getCached<Table[]>(cacheKey);
        if (cached) {
          // Return cached immediately, but still fetch fresh
          setTimeout(async () => {
            try {
              const res = await fetch(url);
              if (res.ok) {
                const fresh = await res.json();
                setCache(cacheKey, fresh, CACHE_TTL.TABLES);
                mutate(fresh, false);
              }
            } catch {
              // Ignore background fetch errors
            }
          }, 0);
          return cached;
        }
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tables");
      const tables = await res.json();

      // Cache for future visits
      if (cacheKey) {
        setCache(cacheKey, tables, CACHE_TTL.TABLES);
      }

      return tables;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds deduplication
    }
  );

  // Filter by status if needed (for available tables)
  const filteredTables = status && data
    ? data.filter((t) => t.status === status)
    : data ?? [];

  return {
    tables: filteredTables,
    allTables: data ?? [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
}

// Convenience hook for available tables only
export function useAvailableTables(locationId?: string) {
  return useTables({ locationId, status: "AVAILABLE" });
}
