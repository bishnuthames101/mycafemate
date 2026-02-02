"use client";

import { Order, OrderItem, Product, User, Table, Location } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface OrderWithRelations extends Order {
  items: (OrderItem & { product: Product })[];
  table: Table | null;
  staff: Pick<User, "name" | "email">;
  location?: Location | null;
}

interface OrderCardProps {
  order: OrderWithRelations;
  onClick?: () => void;
  showLocation?: boolean;
}

export function OrderCard({ order, onClick, showLocation = false }: OrderCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-cafe transition-all"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">
              {order.table?.number || "No table"}
            </p>
            {showLocation && order.location && (
              <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {order.location.name}
              </span>
            )}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.quantity}x {item.product.name}
              </span>
              <span className="font-medium">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>

        <div className="pt-3 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </span>
          <span className="font-bold text-coffee-600">
            {formatCurrency(order.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
