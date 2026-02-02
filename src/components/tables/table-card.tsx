"use client";

import { Table, Order } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableStatusIndicator } from "./table-status-indicator";
import { cn } from "@/lib/utils";

interface TableWithOrders extends Table {
  orders?: Order[];
}

interface TableCardProps {
  table: TableWithOrders;
  onClick?: () => void;
}

export function TableCard({ table, onClick }: TableCardProps) {
  const isOccupied = table.status === "OCCUPIED";
  const activeOrder = table.orders && table.orders.length > 0 ? table.orders[0] : null;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-cafe-lg",
        isOccupied && "ring-2 ring-coffee-400",
        onClick && "hover:scale-105"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-coffee-700">{table.number}</h3>
          <TableStatusIndicator status={table.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Capacity:</span>
            <span className="font-medium">{table.capacity} seats</span>
          </div>
          {activeOrder && (
            <div className="pt-2 border-t border-coffee-100">
              <p className="text-xs text-coffee-600">
                Order: {activeOrder.orderNumber}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
