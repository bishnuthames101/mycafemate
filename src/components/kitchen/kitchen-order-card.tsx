"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getOrderAge, getPriorityBorderColor } from "@/lib/utils/kitchen";
import { cn } from "@/lib/utils";
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

interface KitchenOrderCardProps {
  order: OrderWithRelations;
  onMarkReady?: (orderId: string) => Promise<void>;
  onMarkServed?: (orderId: string) => Promise<void>;
}

export function KitchenOrderCard({ order, onMarkReady, onMarkServed }: KitchenOrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkReady = async () => {
    if (!onMarkReady) return;
    setIsUpdating(true);
    try {
      await onMarkReady(order.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkServed = async () => {
    if (!onMarkServed) return;
    setIsUpdating(true);
    try {
      await onMarkServed(order.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const orderAge = getOrderAge(new Date(order.createdAt));
  const priorityBorder = order.status === "PENDING"
    ? getPriorityBorderColor(new Date(order.createdAt))
    : order.status === "READY"
    ? "border-green-500"
    : "";

  return (
    <Card
      className={cn(
        "border-2 transition-all",
        order.status === "PENDING" && `${priorityBorder} bg-yellow-50`,
        order.status === "READY" && "border-green-400 bg-green-50",
        order.status === "SERVED" && "border-gray-300 bg-gray-50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-2xl text-coffee-700">{order.orderNumber}</h3>
            <p className="text-lg text-coffee-600 mt-1">
              Table: {order.table?.number || "No table"}
            </p>
            <p className="text-sm text-coffee-500 mt-1">{orderAge}</p>
          </div>
          <OrderStatusBadge status={order.status} className="text-base px-3 py-1" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items - LARGE FONT for kitchen visibility */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-coffee-600 uppercase">Items:</h4>
          {order.items.map((item) => (
            <div key={item.id} className="border-b border-coffee-200 pb-2 last:border-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-coffee-700">
                  {item.quantity}x {item.product.name}
                </span>
              </div>
              {item.notes && (
                <p className="text-sm text-coffee-500 mt-1 italic">Note: {item.notes}</p>
              )}
            </div>
          ))}
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm font-medium text-blue-900">Special Instructions:</p>
            <p className="text-blue-800 mt-1">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        {order.status === "PENDING" && onMarkReady && (
          <Button
            onClick={handleMarkReady}
            disabled={isUpdating}
            className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6 font-semibold"
          >
            {isUpdating ? "Updating..." : "Mark as Ready"}
          </Button>
        )}

        {order.status === "READY" && onMarkServed && (
          <Button
            onClick={handleMarkServed}
            disabled={isUpdating}
            className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 font-semibold"
          >
            {isUpdating ? "Updating..." : "Mark as Served ✓"}
          </Button>
        )}

        {order.status === "READY" && !onMarkServed && (
          <div className="text-center py-4 text-green-700 font-medium bg-green-100 rounded-lg">
            Ready - Waiting for pickup
          </div>
        )}

        {order.status === "SERVED" && (
          <div className="text-center py-4 text-gray-600 font-medium">
            ✓ Served - Waiting for payment
          </div>
        )}
      </CardContent>
    </Card>
  );
}
