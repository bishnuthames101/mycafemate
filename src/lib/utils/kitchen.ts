import { Order } from "@prisma/client";

/**
 * Get human-readable age of an order
 * @param createdAt Order creation timestamp
 * @returns String like "5 minutes ago"
 */
export function getOrderAge(createdAt: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}

/**
 * Get priority level based on order age
 * @param createdAt Order creation timestamp
 * @returns Priority level: normal, warning, or urgent
 */
export function getOrderPriority(createdAt: Date): "normal" | "warning" | "urgent" {
  const now = new Date();
  const minutes = Math.floor((now.getTime() - new Date(createdAt).getTime()) / 60000);

  if (minutes < 10) return "normal";
  if (minutes < 20) return "warning";
  return "urgent";
}

/**
 * Sort orders by priority (oldest first for kitchen queue)
 * @param orders Array of orders
 * @returns Sorted array with oldest orders first
 */
export function sortOrdersByPriority<T extends { createdAt: Date | string }>(
  orders: T[]
): T[] {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB; // Oldest first
  });
}

/**
 * Get border color class based on order priority
 * @param createdAt Order creation timestamp
 * @returns Tailwind border color class
 */
export function getPriorityBorderColor(createdAt: Date): string {
  const priority = getOrderPriority(createdAt);

  switch (priority) {
    case "normal":
      return "border-yellow-400";
    case "warning":
      return "border-orange-400";
    case "urgent":
      return "border-red-400 animate-pulse";
    default:
      return "border-gray-400";
  }
}
