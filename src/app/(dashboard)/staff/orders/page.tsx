"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OrderList } from "@/components/orders/order-list";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { StaffOrdersSkeleton } from "@/components/skeletons/page-skeletons";
import { useStaffOrders } from "@/lib/hooks/use-orders";

export default function StaffOrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const locationId = session?.user?.locationId;

  const { orders, isLoading, isValidating } = useStaffOrders(locationId, 3000);

  const handleOrderClick = (order: any) => {
    router.push(`/staff/orders/${order.id}`);
  };

  if (isLoading) {
    return <StaffOrdersSkeleton />;
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
                    {isValidating && <RefreshCw className="h-3 w-3 animate-spin" />}
                    Auto-refreshing
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
