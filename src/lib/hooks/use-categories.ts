import useSWR from "swr";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/utils/cache";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export function useCategories() {
  // Provide cached categories as fallback for instant render
  const cachedCategories = getCached<Category[]>(CACHE_KEYS.CATEGORIES);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Category[]>(
    "/api/categories",
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const categories = await res.json();

      // Cache raw Category[] for future visits
      setCache(CACHE_KEYS.CATEGORIES, categories, CACHE_TTL.CATEGORIES);

      return categories;
    },
    {
      fallbackData: cachedCategories ?? undefined,
      revalidateIfStale: true,
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes deduplication
    }
  );

  // Provide both raw categories and formatted options
  const categoryOptions: CategoryOption[] = data
    ? [{ value: "ALL", label: "All" }, ...data.map((c) => ({ value: c.slug, label: c.name }))]
    : [{ value: "ALL", label: "All" }];

  return {
    categories: data ?? [],
    categoryOptions,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
