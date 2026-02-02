"use client";

import { Order, OrderItem, Product, User, Table } from "@prisma/client";
import { OrderCard } from "./order-card";

interface OrderWithRelations extends Order {
  items: (OrderItem & { product: Product })[];
  table: Table | null;
  staff: Pick<User, "name" | "email">;
}

interface OrderListProps {
  orders: OrderWithRelations[];
  onOrderClick?: (order: OrderWithRelations) => void;
}

export function OrderList({ orders, onOrderClick }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClick={onOrderClick ? () => onOrderClick(order) : undefined}
        />
      ))}
    </div>
  );
}
