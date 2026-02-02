/**
 * Notification Service
 *
 * Core service for creating, managing, and querying notifications
 */

import { PrismaClient } from "@prisma/client";

// Import the enum type (will be available after Prisma generation)
type NotificationType =
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "TRIAL_EXPIRING_SOON"
  | "TRIAL_EXPIRED"
  | "PAYMENT_DUE"
  | "PAYMENT_OVERDUE"
  | "SUBSCRIPTION_RENEWED"
  | "SUBSCRIPTION_UPGRADED"
  | "SUBSCRIPTION_DOWNGRADED"
  | "USAGE_LIMIT_WARNING"
  | "DB_LIMIT_EXCEEDED"
  | "API_LIMIT_EXCEEDED"
  | "NEW_ORDER"
  | "ORDER_READY"
  | "TABLE_RESERVED"
  | "DAILY_REPORT_READY"
  | "DAILY_REPORT"
  | "SYSTEM";

type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  locationId?: string | null;
  userId?: string | null;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

export interface NotificationFilters {
  locationId?: string | null;
  userId?: string | null;
  isRead?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
}

/**
 * Create a single notification
 */
export async function createNotification(
  prisma: PrismaClient,
  input: CreateNotificationInput
) {
  return await prisma.notification.create({
    data: {
      type: input.type as any,
      title: input.title,
      message: input.message,
      locationId: input.locationId,
      userId: input.userId,
      priority: (input.priority || "NORMAL") as any,
      metadata: input.metadata || undefined,
      expiresAt: input.expiresAt,
    },
  });
}

/**
 * Create multiple notifications in bulk
 */
export async function createBulkNotifications(
  prisma: PrismaClient,
  inputs: CreateNotificationInput[]
) {
  const notifications = inputs.map((input) => ({
    type: input.type as any,
    title: input.title,
    message: input.message,
    locationId: input.locationId,
    userId: input.userId,
    priority: (input.priority || "NORMAL") as any,
    metadata: input.metadata || undefined,
    expiresAt: input.expiresAt,
  }));

  return await prisma.notification.createMany({
    data: notifications,
  });
}

/**
 * Get notifications with filters and pagination
 */
export async function getNotifications(
  prisma: PrismaClient,
  filters: NotificationFilters = {},
  options: {
    limit?: number;
    offset?: number;
    orderBy?: "createdAt" | "priority";
  } = {}
) {
  const { limit = 50, offset = 0, orderBy = "createdAt" } = options;

  const where: any = {};

  if (filters.locationId !== undefined) {
    where.locationId = filters.locationId;
  }
  if (filters.userId !== undefined) {
    where.userId = filters.userId;
  }
  if (filters.isRead !== undefined) {
    where.isRead = filters.isRead;
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.priority) {
    where.priority = filters.priority;
  }

  return await prisma.notification.findMany({
    where,
    orderBy:
      orderBy === "priority"
        ? [{ priority: "desc" }, { createdAt: "desc" }]
        : { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(
  prisma: PrismaClient,
  filters: { locationId?: string | null; userId?: string | null } = {}
): Promise<number> {
  const where: any = { isRead: false };

  if (filters.locationId !== undefined) {
    where.locationId = filters.locationId;
  }
  if (filters.userId !== undefined) {
    where.userId = filters.userId;
  }

  return await prisma.notification.count({ where });
}

/**
 * Mark notifications as read
 */
export async function markAsRead(
  prisma: PrismaClient,
  notificationIds: string[]
) {
  return await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
    },
    data: {
      isRead: true,
    },
  });
}

/**
 * Mark all notifications as read for a user/location
 */
export async function markAllAsRead(
  prisma: PrismaClient,
  filters: { locationId?: string | null; userId?: string | null }
) {
  const where: any = {};

  if (filters.locationId !== undefined) {
    where.locationId = filters.locationId;
  }
  if (filters.userId !== undefined) {
    where.userId = filters.userId;
  }

  return await prisma.notification.updateMany({
    where,
    data: {
      isRead: true,
    },
  });
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  prisma: PrismaClient,
  notificationId: string
) {
  return await prisma.notification.delete({
    where: { id: notificationId },
  });
}

/**
 * Delete expired notifications
 */
export async function deleteExpiredNotifications(prisma: PrismaClient) {
  const now = new Date();

  return await prisma.notification.deleteMany({
    where: {
      expiresAt: {
        lte: now,
      },
    },
  });
}

/**
 * Delete old read notifications (cleanup)
 * Deletes notifications older than specified days
 */
export async function deleteOldReadNotifications(
  prisma: PrismaClient,
  daysOld: number = 30
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return await prisma.notification.deleteMany({
    where: {
      isRead: true,
      createdAt: {
        lte: cutoffDate,
      },
    },
  });
}

/**
 * Helper: Create inventory low stock notification
 */
export async function createLowStockNotification(
  prisma: PrismaClient,
  data: {
    locationId: string;
    inventoryItemId: string;
    inventoryName: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    isOutOfStock: boolean;
  }
) {
  return await createNotification(prisma, {
    type: data.isOutOfStock ? "OUT_OF_STOCK" : "LOW_STOCK",
    title: data.isOutOfStock ? "Out of Stock" : "Low Stock Alert",
    message: `${data.inventoryName} is ${
      data.isOutOfStock ? "out of stock" : "running low"
    }. Current: ${data.currentStock}${data.unit}, Minimum: ${data.minimumStock}${data.unit}`,
    locationId: data.locationId,
    priority: data.isOutOfStock ? "HIGH" : "NORMAL",
    metadata: {
      inventoryItemId: data.inventoryItemId,
      inventoryName: data.inventoryName,
      currentStock: data.currentStock,
      minimumStock: data.minimumStock,
      unit: data.unit,
    },
  });
}

/**
 * Helper: Create new order notification
 */
export async function createNewOrderNotification(
  prisma: PrismaClient,
  data: {
    orderId: string;
    orderNumber: string;
    tableNumber?: string;
    locationId: string;
    totalAmount: number;
  }
) {
  return await createNotification(prisma, {
    type: "NEW_ORDER",
    title: "New Order",
    message: `Order ${data.orderNumber}${
      data.tableNumber ? ` for Table ${data.tableNumber}` : ""
    } has been placed`,
    locationId: data.locationId,
    priority: "NORMAL",
    metadata: {
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      tableNumber: data.tableNumber,
      totalAmount: data.totalAmount,
    },
  });
}

/**
 * Helper: Create order ready notification
 */
export async function createOrderReadyNotification(
  prisma: PrismaClient,
  data: {
    orderId: string;
    orderNumber: string;
    tableNumber?: string;
    locationId: string;
  }
) {
  return await createNotification(prisma, {
    type: "ORDER_READY",
    title: "Order Ready",
    message: `Order ${data.orderNumber}${
      data.tableNumber ? ` for Table ${data.tableNumber}` : ""
    } is ready for serving`,
    locationId: data.locationId,
    priority: "HIGH",
    metadata: {
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      tableNumber: data.tableNumber,
    },
  });
}

/**
 * Helper: Create daily report notification
 */
export async function createDailyReportNotification(
  prisma: PrismaClient,
  data: {
    locationId?: string;
    reportDate: Date;
    totalRevenue: number;
    totalOrders: number;
  }
) {
  return await createNotification(prisma, {
    type: "DAILY_REPORT_READY",
    title: "Daily Report Ready",
    message: `Daily sales report for ${data.reportDate.toLocaleDateString()} is ready. Revenue: NPR ${data.totalRevenue.toFixed(
      2
    )}, Orders: ${data.totalOrders}`,
    locationId: data.locationId,
    priority: "LOW",
    metadata: {
      reportDate: data.reportDate.toISOString(),
      totalRevenue: data.totalRevenue,
      totalOrders: data.totalOrders,
    },
  });
}
