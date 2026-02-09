import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { MODIFIABLE_ORDER_STATUSES } from "@/lib/validations/order";
import { logger } from "@/lib/utils/logger";
import { calculateTax } from "@/lib/config/business";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only STAFF and ADMIN can remove items (not KITCHEN_STAFF)
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

    // Fetch order with all items
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

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

    // Verify item exists and belongs to this order
    const itemToRemove = order.items.find((item) => item.id === params.itemId);
    if (!itemToRemove) {
      return NextResponse.json(
        {
          error: "ITEM_NOT_FOUND",
          message: "Item not found or does not belong to this order",
        },
        { status: 404 }
      );
    }

    // Verify order will have at least 1 item remaining
    if (order.items.length <= 1) {
      return NextResponse.json(
        {
          error: "LAST_ITEM",
          message: "Cannot remove the last item. Order must have at least 1 item.",
        },
        { status: 400 }
      );
    }

    // Determine if order has tax
    const hasTax = order.tax > 0;

    // Delete item and recalculate totals
    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      // Delete the OrderItem record
      await tx.orderItem.delete({
        where: { id: params.itemId },
      });

      // Fetch remaining items
      const remainingItems = await tx.orderItem.findMany({
        where: { orderId: params.id },
        include: { product: true },
      });

      // Recalculate totals
      const newSubtotal = remainingItems.reduce(
        (sum: number, item: any) => sum + item.subtotal,
        0
      );
      const newTax = hasTax ? calculateTax(newSubtotal, true) : 0;
      const newTotal = newSubtotal + newTax;

      // Update order totals
      const updated = await tx.order.update({
        where: { id: params.id },
        data: {
          subtotal: newSubtotal,
          tax: newTax,
          total: newTotal,
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
          payments: {
            include: {
              creditor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return updated;
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    logger.error("Error removing item from order", error instanceof Error ? error : undefined);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order or item not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to remove item from order" },
      { status: 500 }
    );
  }
}
