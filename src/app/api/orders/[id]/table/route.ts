import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { changeOrderTableSchema, MODIFIABLE_ORDER_STATUSES } from "@/lib/validations/order";
import { logger } from "@/lib/utils/logger";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only STAFF and ADMIN can change tables (not KITCHEN_STAFF)
    if (session.user.role === "KITCHEN_STAFF") {
      return NextResponse.json(
        { error: "Kitchen staff cannot modify orders" },
        { status: 403 }
      );
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const { newTableId } = changeOrderTableSchema.parse(body);

    // Fetch order and new table in parallel
    const [order, newTable] = await Promise.all([
      prisma.order.findUnique({
        where: { id: params.id },
      }),
      prisma.table.findUnique({
        where: { id: newTableId },
      }),
    ]);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // STAFF location restriction
    if (
      session.user.role === "STAFF" &&
      order.locationId !== session.user.locationId
    ) {
      return NextResponse.json(
        { error: "Unauthorized - order from different location" },
        { status: 403 }
      );
    }

    // Check if order status allows modification
    if (!MODIFIABLE_ORDER_STATUSES.includes(order.status)) {
      return NextResponse.json(
        {
          error: "ORDER_NOT_MODIFIABLE",
          message: `Cannot modify order with status ${order.status}. Only orders with status ${MODIFIABLE_ORDER_STATUSES.join(", ")} can be modified.`,
        },
        { status: 400 }
      );
    }

    // Check if same table
    if (order.tableId === newTableId) {
      return NextResponse.json(
        {
          error: "SAME_TABLE",
          message: "Order is already at this table",
        },
        { status: 400 }
      );
    }

    if (!newTable) {
      return NextResponse.json(
        {
          error: "TABLE_NOT_FOUND",
          message: "New table not found",
        },
        { status: 404 }
      );
    }

    // Check if new table is from the same location
    if (newTable.locationId !== order.locationId) {
      return NextResponse.json(
        {
          error: "TABLE_DIFFERENT_LOCATION",
          message: "Cannot move order to a table in a different location",
        },
        { status: 400 }
      );
    }

    // Perform transaction with table availability re-check inside
    const oldTableId = order.tableId;

    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      // Re-check table availability inside transaction to prevent race condition
      const freshTable = await tx.table.findUnique({ where: { id: newTableId } });
      if (freshTable && freshTable.status !== "AVAILABLE") {
        const activeOrdersOnNewTable = await tx.order.count({
          where: {
            tableId: newTableId,
            status: { in: ["PENDING", "PREPARING", "READY", "SERVED"] },
          },
        });
        if (activeOrdersOnNewTable > 0) {
          throw new Error("TABLE_OCCUPIED");
        }
      }

      // Update order table and set new table to OCCUPIED in parallel
      const [updated] = await Promise.all([
        tx.order.update({
          where: { id: params.id },
          data: { tableId: newTableId },
          include: {
            items: { include: { product: true } },
            table: true,
            staff: { select: { name: true, email: true } },
          },
        }),
        tx.table.update({
          where: { id: newTableId },
          data: { status: "OCCUPIED" },
        }),
      ]);

      // Check if old table has other active orders
      if (oldTableId) {
        const otherActiveOrders = await tx.order.count({
          where: {
            tableId: oldTableId,
            id: { not: params.id },
            status: { in: ["PENDING", "PREPARING", "READY", "SERVED"] },
          },
        });

        // If no other orders, set old table to AVAILABLE
        if (otherActiveOrders === 0) {
          await tx.table.update({
            where: { id: oldTableId },
            data: { status: "AVAILABLE" },
          });
        }
      }

      return updated;
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    if (error.message === "TABLE_OCCUPIED") {
      return NextResponse.json(
        {
          error: "TABLE_OCCUPIED",
          message: "Table already has active orders",
        },
        { status: 400 }
      );
    }
    logger.error("Error changing order table", error instanceof Error ? error : undefined);
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
      { error: "Failed to change order table" },
      { status: 500 }
    );
  }
}
