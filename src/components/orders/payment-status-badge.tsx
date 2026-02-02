import { PaymentStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  PAID: {
    label: "Paid",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
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
