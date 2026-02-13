"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { KitchenOrderList } from "@/components/kitchen/kitchen-order-list";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { playNewOrderSound } from "@/lib/utils/notification-sound";
import { KitchenOrdersSkeleton } from "@/components/skeletons/page-skeletons";
import { useKitchenOrders } from "@/lib/hooks/use-orders";

export default function KitchenOrdersPage() {
  const { data: session } = useSession();
  const locationId = session?.user?.locationId;

  const { orders, isLoading, isValidating, optimisticUpdateStatus } =
    useKitchenOrders(locationId, 7000);

  // --- Audio alert refs ---
  const previousPendingCountRef = useRef(0);
  const isFirstRenderRef = useRef(true);
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

  // Play sound when new PENDING orders arrive
  useEffect(() => {
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;

    if (isFirstRenderRef.current) {
      previousPendingCountRef.current = pendingCount;
      isFirstRenderRef.current = false;
      return;
    }

    if (pendingCount > previousPendingCountRef.current && hasInteractedRef.current) {
      playNewOrderSound();
    }

    previousPendingCountRef.current = pendingCount;
  }, [orders]);

  const handleMarkReady = async (orderId: string) => {
    try {
      await optimisticUpdateStatus(orderId, "READY");
    } catch {
      alert("Failed to update order. Please try again.");
    }
  };

  const handleMarkServed = async (orderId: string) => {
    try {
      await optimisticUpdateStatus(orderId, "SERVED");
    } catch {
      alert("Failed to update order. Please try again.");
    }
  };

  if (isLoading) {
    return <KitchenOrdersSkeleton />;
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
              Auto-refreshing every 7 seconds
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-coffee-500">
            {isValidating && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>Live</span>
          </div>
        </div>

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
