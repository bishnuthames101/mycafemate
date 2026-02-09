import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { addOrderItemsSchema, MODIFIABLE_ORDER_STATUSES } from "@/lib/validations/order";
import {
  validateInventoryForOrder,
  deductInventoryForOrder,
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

    // Determine if order has tax
    const hasTax = order.tax > 0;

    // Create new order items and recalculate totals
    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      // Create new OrderItem records
      const createdItems = await Promise.all(
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

      // Fetch all items (existing + new)
      const allItems = await tx.orderItem.findMany({
        where: { orderId: params.id },
        include: { product: true },
      });

      // Recalculate totals
      const newSubtotal = allItems.reduce(
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

    // Deduct inventory for the new items (outside transaction, non-blocking)
    try {
      // Create a temporary "order" with just the new items for inventory deduction
      const tempOrderForDeduction = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
          location: true,
          items: {
            where: {
              productId: { in: items.map((i) => i.productId) },
            },
            include: {
              product: {
                include: {
                  recipeItems: {
                    include: {
                      inventory: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: items.length,
          },
        },
      });

      if (tempOrderForDeduction) {
        // Manually deduct inventory for new items
        const inventoryDeductions = new Map<string, number>();

        for (const item of items) {
          // Find the product with recipes
          const orderItem = tempOrderForDeduction.items.find(
            (oi: any) => oi.productId === item.productId
          );
          if (orderItem) {
            for (const recipeItem of orderItem.product.recipeItems) {
              const currentDeduction =
                inventoryDeductions.get(recipeItem.inventoryId) || 0;
              const newDeduction = item.quantity * recipeItem.quantityUsed;
              inventoryDeductions.set(
                recipeItem.inventoryId,
                currentDeduction + newDeduction
              );
            }
          }
        }

        // Apply deductions
        for (const [inventoryId, deductionAmount] of Array.from(
          inventoryDeductions.entries()
        )) {
          await prisma.inventoryItem.updateMany({
            where: {
              inventoryId,
              inventory: {
                locationId: order.locationId,
              },
            },
            data: {
              currentStock: {
                decrement: deductionAmount,
              },
            },
          });
        }
      }
    } catch (inventoryError) {
      logger.error(
        "Error deducting inventory for added items",
        inventoryError instanceof Error ? inventoryError : undefined
      );
      // Don't fail the request if inventory deduction fails
    }

    // Check low stock and create notifications (non-blocking)
    try {
      await createLowStockNotifications(prisma, order.locationId);
    } catch (notificationError) {
      logger.error(
        "Error creating low stock notifications",
        notificationError instanceof Error ? notificationError : undefined
      );
    }

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
