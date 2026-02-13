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
  const { data, error, isLoading, isValidating, mutate } = useSWR<Category[]>(
    "/api/categories",
    async (url: string) => {
      // Try cache first for instant display
      const cachedOptions = getCached<CategoryOption[]>(CACHE_KEYS.CATEGORIES);
      if (cachedOptions) {
        // Return cached data structure, but still fetch fresh in background
        setTimeout(async () => {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const fresh = await res.json();
              const options = [
                { value: "ALL", label: "All" },
                ...fresh.map((c: Category) => ({ value: c.slug, label: c.name })),
              ];
              setCache(CACHE_KEYS.CATEGORIES, options, CACHE_TTL.CATEGORIES);
              mutate(fresh, false);
            }
          } catch {
            // Ignore background fetch errors
          }
        }, 0);
        // Convert cached options back to categories (approximate)
        return cachedOptions
          .filter((o) => o.value !== "ALL")
          .map((o) => ({
            id: o.value,
            name: o.label,
            slug: o.value,
            description: null,
            createdAt: "",
            updatedAt: "",
          }));
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const categories = await res.json();

      // Cache as options for faster future access
      const options = [
        { value: "ALL", label: "All" },
        ...categories.map((c: Category) => ({ value: c.slug, label: c.name })),
      ];
      setCache(CACHE_KEYS.CATEGORIES, options, CACHE_TTL.CATEGORIES);

      return categories;
    },
    {
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
