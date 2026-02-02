import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  READY: {
    label: "Ready",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  SERVED: {
    label: "Served",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
