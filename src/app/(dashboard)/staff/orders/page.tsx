"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OrderList } from "@/components/orders/order-list";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

const POLLING_INTERVAL = 3000; // 3 seconds

export default function StaffOrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (!session?.user?.locationId) {
      if (showLoading) setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/orders?locationId=${session.user.locationId}&status=PENDING,PREPARING,READY,SERVED`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [session?.user?.locationId]);

  // Auto-refresh orders with visibility awareness
  useEffect(() => {
    if (!session?.user?.locationId) return;

    let interval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (interval) return;
      interval = setInterval(() => {
        fetchOrders(false); // Background refresh without loading indicator
      }, POLLING_INTERVAL);
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // Fetch immediately when tab becomes visible, then resume polling
        fetchOrders(false);
        startPolling();
      }
    };

    // Initial fetch with loading
    fetchOrders(true);

    // Start polling only if page is visible
    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session?.user?.locationId, fetchOrders]);

  const handleOrderClick = (order: any) => {
    router.push(`/staff/orders/${order.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link href="/staff">
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-coffee-700">Orders</h1>
                <div className="flex items-center gap-2 text-sm text-coffee-500 mt-1">
                  <span>Manage and track all active orders</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Updated {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/staff/orders/new" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Plus className="h-5 w-5" />
                New Order
              </Button>
            </Link>
          </div>
        </div>

        <OrderList orders={orders} onOrderClick={handleOrderClick} />
      </div>
    </div>
  );
}
