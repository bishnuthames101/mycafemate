import { cn } from "@/lib/utils";

const statusConfig = {
  DRAFT: {
    label: "Draft",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  PROCESSED: {
    label: "Processed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  PAID: {
    label: "Paid",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

type PayrollRunStatus = "DRAFT" | "PROCESSED" | "PAID";

interface PayrollStatusBadgeProps {
  status: PayrollRunStatus;
  className?: string;
}

export function PayrollStatusBadge({
  status,
  className,
}: PayrollStatusBadgeProps) {
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
