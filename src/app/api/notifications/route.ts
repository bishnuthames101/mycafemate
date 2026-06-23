import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import {
  getNotifications,
  deleteNotification,
} from "@/lib/services/notification-service";
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const { searchParams } = new URL(request.url);
    const locationId = session.user.role === "ADMIN"
      ? searchParams.get("locationId") || session.user.locationId
      : session.user.locationId;
    const isRead = searchParams.get("isRead");
    const type = searchParams.get("type");
    const priority = searchParams.get("priority");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const filters: any = {};
    if (locationId) filters.locationId = locationId;
    if (isRead !== null) filters.isRead = isRead === "true";
    if (type) filters.type = type;
    if (priority) filters.priority = priority;

    const notifications = await getNotifications(prisma, filters, {
      limit,
      offset,
      orderBy: "createdAt",
    });

    return NextResponse.json(notifications);
  } catch (error) {
    logger.error("Error fetching notifications:", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { error: "notificationIds array is required" },
        { status: 400 }
      );
    }

    // Limit batch size to prevent abuse
    if (notificationIds.length > 100) {
      return NextResponse.json(
        { error: "Cannot update more than 100 notifications at once" },
        { status: 400 }
      );
    }

    // Scope to user's location so they can't mark other locations' notifications
    const locationId = session.user.role === "ADMIN"
      ? undefined
      : session.user.locationId;

    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        ...(locationId && { locationId }),
      },
      data: { isRead: true },
    });

    return NextResponse.json({ message: "Notifications marked as read successfully" });
  } catch (error) {
    logger.error("Error updating notifications:", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership: notification must belong to user's location (ADMIN can delete any)
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { locationId: true },
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && notification.locationId !== session.user.locationId) {
      return NextResponse.json(
        { error: "You can only delete notifications at your assigned location" },
        { status: 403 }
      );
    }

    await deleteNotification(prisma, notificationId);

    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    logger.error("Error deleting notification:", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}
