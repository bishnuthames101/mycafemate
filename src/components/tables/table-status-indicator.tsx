import { TableStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig = {
  AVAILABLE: {
    label: "Available",
    color: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
  OCCUPIED: {
    label: "Occupied",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    dot: "bg-orange-500",
  },
  RESERVED: {
    label: "Reserved",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
  },
  CLEANING: {
    label: "Cleaning",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    dot: "bg-gray-500",
  },
};

interface TableStatusIndicatorProps {
  status: TableStatus;
  className?: string;
  showLabel?: boolean;
}

export function TableStatusIndicator({
  status,
  className,
  showLabel = true,
}: TableStatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium",
        config.color,
        className
      )}
    >
      <div className={cn("w-2 h-2 rounded-full", config.dot)} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
