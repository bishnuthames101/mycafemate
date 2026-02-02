"use client";

import { KitchenOrderCard } from "./kitchen-order-card";
import { OrderStatus } from "@prisma/client";

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
  };
  notes?: string | null;
}

interface OrderWithRelations {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: Date | string;
  notes?: string | null;
  table?: {
    number: string;
  } | null;
  items: OrderItem[];
}

interface KitchenOrderListProps {
  orders: OrderWithRelations[];
  onStatusUpdate: (orderId: string) => Promise<void>;
}

export function KitchenOrderList({ orders, onStatusUpdate }: KitchenOrderListProps) {
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const servedOrders = orders.filter((o) => o.status === "SERVED");

  return (
    <div className="space-y-8">
      {/* Pending Orders Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-coffee-700">
            Pending Orders
          </h2>
          <span className="text-lg font-semibold px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
            {pendingOrders.length}
          </span>
        </div>
        {pendingOrders.length === 0 ? (
          <div className="text-center py-12 bg-cream-50 rounded-lg border-2 border-dashed border-coffee-200">
            <p className="text-lg text-coffee-500">No pending orders</p>
            <p className="text-sm text-coffee-400 mt-2">New orders will appear here automatically</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingOrders.map((order) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                onMarkServed={onStatusUpdate}
              />
            ))}
          </div>
        )}
      </section>

      {/* Served Orders Section */}
      {servedOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-600">
              Recently Served
            </h2>
            <span className="text-lg font-semibold px-4 py-2 bg-green-100 text-green-800 rounded-full">
              {servedOrders.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {servedOrders.map((order) => (
              <KitchenOrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
