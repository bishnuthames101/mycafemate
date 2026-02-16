import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { Order, OrderItem, Product, Table, User, OrderStatus } from "@prisma/client";
import { usePageVisibility } from "./use-visibility";

export interface OrderWithRelations extends Order {
  items: (OrderItem & { product: Product })[];
  table: Table | null;
  staff: Pick<User, "name" | "email">;
}

export interface PaginatedOrders {
  orders: OrderWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface UseOrdersOptions {
  locationId?: string;
  status?: string;
  refreshInterval?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { locationId, status, refreshInterval } = options;
  const isVisible = usePageVisibility();

  const params = new URLSearchParams();
  if (locationId) {
    params.set("locationId", locationId);
  }
  if (status) {
    params.set("status", status);
  }

  const queryString = params.toString();
  const url = locationId ? `/api/orders${queryString ? `?${queryString}` : ""}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<OrderWithRelations[]>(
    url,
    {
      refreshInterval: isVisible ? refreshInterval : 0,
      revalidateOnFocus: false,
      dedupingInterval: 5000, // 5 seconds deduplication for orders
      onSuccess: () => {
        // When tab becomes visible and we had polling paused, SWR auto-revalidates
      },
    }
  );

  // Optimistic update helper
  const optimisticUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    onError?: () => void
  ) => {
    // Optimistically update the UI
    const optimisticData = data?.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    mutate(optimisticData, false);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      // Revalidate to get server truth
      mutate();
    } catch (err) {
      // Revert on error
      mutate();
      onError?.();
      throw err;
    }
  };

  return {
    orders: data ?? [],
    isLoading,
    isValidating,
    error,
    mutate,
    optimisticUpdateStatus,
  };
}

// Hook for paginated orders (infinite scroll)
export function useOrdersInfinite(options: UseOrdersOptions & { limit?: number } = {}) {
  const { locationId, status, limit = 20 } = options;

  const getKey = (pageIndex: number, previousPageData: PaginatedOrders | null) => {
    // Return null if locationId is not set
    if (!locationId) return null;

    // Reached the end
    if (previousPageData && !previousPageData.pagination.hasMore) return null;

    const params = new URLSearchParams();
    params.set("locationId", locationId);
    params.set("page", String(pageIndex + 1));
    params.set("limit", String(limit));
    if (status) {
      params.set("status", status);
    }

    return `/api/orders?${params.toString()}`;
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<PaginatedOrders>(getKey, {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    });

  // Flatten all pages into single array
  const orders = data?.flatMap((page) => page.orders) ?? [];
  const hasMore = data?.[data.length - 1]?.pagination.hasMore ?? false;
  const total = data?.[0]?.pagination.total ?? 0;

  const loadMore = () => {
    if (hasMore && !isValidating) {
      setSize(size + 1);
    }
  };

  return {
    orders,
    hasMore,
    total,
    isLoading,
    isValidating,
    error,
    loadMore,
    mutate,
  };
}

// Hook for kitchen orders with polling
export function useKitchenOrders(locationId?: string, pollingInterval = 10000) {
  return useOrders({
    locationId,
    status: "PENDING,READY,SERVED",
    refreshInterval: pollingInterval,
  });
}

// Hook for staff orders with polling
export function useStaffOrders(locationId?: string, pollingInterval = 5000) {
  return useOrders({
    locationId,
    status: "PENDING,PREPARING,READY,SERVED",
    refreshInterval: pollingInterval,
  });
}
