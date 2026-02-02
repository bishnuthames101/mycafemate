"use client";

import { Table, Order } from "@prisma/client";
import { TableCard } from "./table-card";

interface TableWithOrders extends Table {
  orders?: Order[];
}

interface TableGridProps {
  tables: TableWithOrders[];
  onTableClick?: (table: TableWithOrders) => void;
}

export function TableGrid({ tables, onTableClick }: TableGridProps) {
  if (tables.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tables found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onClick={onTableClick ? () => onTableClick(table) : undefined}
        />
      ))}
    </div>
  );
}
