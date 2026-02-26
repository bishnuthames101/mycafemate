import useSWR from "swr";
import { Product } from "@prisma/client";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/utils/cache";

interface UseProductsOptions {
  isAvailable?: boolean;
  category?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const params = new URLSearchParams();
  if (options.isAvailable !== undefined) {
    params.set("isAvailable", String(options.isAvailable));
  }
  if (options.category) {
    params.set("category", options.category);
  }

  const queryString = params.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ""}`;

  // Provide cached data as fallback for instant render (unfiltered only)
  const cachedProducts = !options.category
    ? getCached<Product[]>(CACHE_KEYS.PRODUCTS)
    : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Product[]>(
    url,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const products = await res.json();

      // Cache for future visits (only for unfiltered results)
      if (!options.category) {
        setCache(CACHE_KEYS.PRODUCTS, products, CACHE_TTL.PRODUCTS);
      }

      return products;
    },
    {
      fallbackData: cachedProducts ?? undefined,
      revalidateIfStale: true,
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute deduplication
    }
  );

  return {
    products: data ?? [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
