import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import { upsertDailySales } from "@/lib/utils/sales-aggregation";
import { createOrderReadyNotification } from "@/lib/services/notification-service";
import { logger } from '@/lib/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
        staff: {
          select: {
            name: true,
            email: true,
          },
        },
        creditor: {
          select: {
            id: true,
            name: true,
            currentBalance: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // STAFF and KITCHEN_STAFF can only view orders from their location
    if (
      (session.user.role === "STAFF" || session.user.role === "KITCHEN_STAFF") &&
      order.locationId !== session.user.locationId
    ) {
      return NextResponse.json(
        { error: "Unauthorized - order from different location" },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    logger.error("Error fetching order", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const { status } = updateOrderStatusSchema.parse(body);

    // STAFF location restriction - can only update orders at their location
    if (session.user.role === "STAFF") {
      const existingOrder = await prisma.order.findUnique({
        where: { id: params.id },
        select: { locationId: true },
      });

      if (!existingOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (existingOrder.locationId !== session.user.locationId) {
        return NextResponse.json(
          { error: "Unauthorized - order from different location" },
          { status: 403 }
        );
      }
    }

    // KITCHEN_STAFF restrictions
    if (session.user.role === "KITCHEN_STAFF") {
      // Can update to READY or SERVED status
      if (status !== "READY" && status !== "SERVED") {
        return NextResponse.json(
          { error: "Kitchen staff can only mark orders as READY or SERVED" },
          { status: 403 }
        );
      }

      // Verify order belongs to their location
      const existingOrder = await prisma.order.findUnique({
        where: { id: params.id },
        select: { locationId: true, status: true },
      });

      if (!existingOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (existingOrder.locationId !== session.user.locationId) {
        return NextResponse.json(
          { error: "Unauthorized - order from different location" },
          { status: 403 }
        );
      }

      // Valid transitions: PENDING→READY, PENDING→SERVED, READY→SERVED
      const validTransitions: Record<string, string[]> = {
        PENDING: ["READY", "SERVED"],
        READY: ["SERVED"],
      };

      const allowedStatuses = validTransitions[existingOrder.status] || [];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Cannot change from ${existingOrder.status} to ${status}` },
          { status: 400 }
        );
      }
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
        staff: {
          select: {
            name: true,
            email: true,
          },
        },
        creditor: {
          select: {
            id: true,
            name: true,
            currentBalance: true,
          },
        },
      },
    });

    // If completed, free up the table
    if (status === "COMPLETED" && order.tableId) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: { status: "AVAILABLE" },
      });
    }

    // If completed, trigger daily sales aggregation
    if (status === "COMPLETED") {
      try {
        await upsertDailySales(new Date(), order.locationId, prisma);
      } catch (error) {
        logger.error("Error aggregating daily sales", error instanceof Error ? error : undefined);
        // Don't fail the order update if aggregation fails
      }
    }

    // If order is ready, create notification for staff
    if (status === "READY") {
      try {
        await createOrderReadyNotification(prisma, {
          orderId: order.id,
          orderNumber: order.orderNumber,
          tableNumber: order.table?.number,
          locationId: order.locationId,
        });
      } catch (error) {
        logger.error("Error creating order ready notification", error instanceof Error ? error : undefined);
        // Don't fail the order update if notification fails
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    logger.error("Error updating order", error instanceof Error ? error : undefined);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    // Find order first to get table info for cleanup
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { id: true, tableId: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.delete({
      where: { id: params.id },
    });

    // Free the table back to AVAILABLE if it was associated
    if (order.tableId) {
      // Only free if no other active orders on this table
      const otherActiveOrders = await prisma.order.count({
        where: {
          tableId: order.tableId,
          status: { in: ["PENDING", "PREPARING", "READY", "SERVED"] },
        },
      });

      if (otherActiveOrders === 0) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: { status: "AVAILABLE" },
        });
      }
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error: any) {
    logger.error("Error deleting order", error instanceof Error ? error : undefined);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
