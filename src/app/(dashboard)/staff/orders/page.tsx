"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OrderList } from "@/components/orders/order-list";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StaffOrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-refresh orders every 3 seconds for real-time updates
  useEffect(() => {
    if (session?.user?.locationId) {
      fetchOrders(); // Initial fetch with loading

      // Set up polling interval for background updates
      const interval = setInterval(() => {
        fetchOrders(false); // Background refresh without loading indicator
      }, 3000); // Refresh every 3 seconds

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/orders?locationId=${session?.user?.locationId}&status=PENDING,PREPARING,READY,SERVED`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

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
                <p className="text-sm md:text-base text-coffee-600 mt-1">
                  Manage and track all active orders
                </p>
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
