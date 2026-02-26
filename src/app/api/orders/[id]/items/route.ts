import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { addOrderItemsSchema, MODIFIABLE_ORDER_STATUSES } from "@/lib/validations/order";
import {
  validateInventoryForOrder,
  createLowStockNotifications,
} from "@/lib/utils/inventory-management";
import { logger } from "@/lib/utils/logger";
import { BUSINESS_CONFIG, calculateTax } from "@/lib/config/business";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only STAFF and ADMIN can add items (not KITCHEN_STAFF)
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
    const { items } = addOrderItemsSchema.parse(body);

    // Fetch order with existing items
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

    // Validate inventory for new items
    const inventoryValidation = await validateInventoryForOrder(
      prisma,
      order.locationId,
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    if (!inventoryValidation.isValid) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_INVENTORY",
          message: inventoryValidation.message,
          insufficientItems: inventoryValidation.insufficientItems,
        },
        { status: 400 }
      );
    }

    // Calculate new totals in-memory (no need to re-fetch items from DB)
    const hasTax = order.tax > 0;
    const existingSubtotal = order.items.reduce(
      (sum: number, item: any) => sum + item.subtotal,
      0
    );
    const newItemsSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newSubtotal = existingSubtotal + newItemsSubtotal;
    const newTax = hasTax ? calculateTax(newSubtotal, true) : 0;
    const newTotal = newSubtotal + newTax;

    // Create new order items and update totals in one transaction
    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      // Create new OrderItem records
      await Promise.all(
        items.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: params.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
              notes: item.notes,
            },
          })
        )
      );

      // Update order totals and return with includes
      return tx.order.update({
        where: { id: params.id },
        data: {
          subtotal: newSubtotal,
          tax: newTax,
          total: newTotal,
        },
        include: {
          items: { include: { product: true } },
          table: true,
          staff: { select: { name: true, email: true } },
          creditor: { select: { id: true, name: true, currentBalance: true } },
        },
      });
    });

    // Deduct inventory and check low stock in parallel
    const deductInventory = async () => {
      try {
        // Fetch products with recipes (simple query, not the entire order tree)
        const products = await prisma.product.findMany({
          where: { id: { in: items.map((i) => i.productId) } },
          include: { recipeItems: true },
        });

        // Calculate deductions
        const inventoryDeductions = new Map<string, number>();
        for (const item of items) {
          const product = products.find((p: any) => p.id === item.productId);
          if (!product) continue;
          for (const recipeItem of product.recipeItems) {
            const current = inventoryDeductions.get(recipeItem.inventoryId) || 0;
            inventoryDeductions.set(
              recipeItem.inventoryId,
              current + item.quantity * recipeItem.quantityUsed
            );
          }
        }

        // Apply all deductions in parallel
        await Promise.all(
          Array.from(inventoryDeductions.entries()).map(([inventoryId, amount]) =>
            prisma.inventoryItem.updateMany({
              where: {
                inventoryId,
                inventory: { locationId: order.locationId },
              },
              data: { currentStock: { decrement: amount } },
            })
          )
        );
      } catch (err) {
        logger.error(
          "Error deducting inventory for added items",
          err instanceof Error ? err : undefined
        );
      }
    };

    // Fire-and-forget: deduct inventory and check low stock
    Promise.all([
      deductInventory(),
      createLowStockNotifications(prisma, order.locationId).catch((err) =>
        logger.error(
          "Error creating low stock notifications",
          err instanceof Error ? err : undefined
        )
      ),
    ]).catch(err => logger.error("Post-add-items background ops failed", err instanceof Error ? err : undefined));

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    logger.error("Error adding items to order", error instanceof Error ? error : undefined);
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
      { error: "Failed to add items to order" },
      { status: 500 }
    );
  }
}
