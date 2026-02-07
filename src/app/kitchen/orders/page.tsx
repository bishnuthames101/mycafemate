"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { KitchenOrderList } from "@/components/kitchen/kitchen-order-list";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { playNewOrderSound } from "@/lib/utils/notification-sound";

const POLLING_INTERVAL = 7000; // 7 seconds

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
  };
  notes?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string | null;
  table?: {
    number: string;
  } | null;
  items: OrderItem[];
}

export default function KitchenOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const previousPendingCountRef = useRef(0);
  const isFirstFetchRef = useRef(true);
  const hasInteractedRef = useRef(false);

  // Track user interaction to enable sound
  useEffect(() => {
    const handleInteraction = () => {
      hasInteractedRef.current = true;
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.locationId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/orders?locationId=${session.user.locationId}&status=PENDING,READY,SERVED`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      // Count pending orders and play sound if new ones arrived
      const pendingCount = data.filter((o: Order) => o.status === "PENDING").length;
      if (!isFirstFetchRef.current && pendingCount > previousPendingCountRef.current && hasInteractedRef.current) {
        playNewOrderSound();
      }
      previousPendingCountRef.current = pendingCount;
      isFirstFetchRef.current = false;

      setOrders(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.locationId]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Polling for new orders
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, POLLING_INTERVAL);

    // Cleanup on unmount - CRITICAL to prevent memory leaks
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleMarkReady = async (orderId: string) => {
    // Optimistically update UI
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "READY" as OrderStatus } : order
      )
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READY" }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      // Refresh to get latest data
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
      // Revert on error
      await fetchOrders();
      alert("Failed to update order. Please try again.");
    }
  };

  const handleMarkServed = async (orderId: string) => {
    // Optimistically update UI
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "SERVED" as OrderStatus } : order
      )
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SERVED" }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      // Refresh to get latest data
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
      // Revert on error
      await fetchOrders();
      alert("Failed to update order. Please try again.");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-coffee-600" />
            <span className="text-coffee-700 font-medium">Loading orders...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Auto-refresh Indicator */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-coffee-700">
              Order Queue
            </h1>
            <p className="text-sm text-coffee-500 mt-1">
              Auto-refreshing every {POLLING_INTERVAL / 1000} seconds
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-coffee-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        <KitchenOrderList
          orders={orders}
          onMarkReady={handleMarkReady}
          onMarkServed={handleMarkServed}
        />
      </div>
    </div>
  );
}
