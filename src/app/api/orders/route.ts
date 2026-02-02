import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createOrderSchema, orderQuerySchema } from "@/lib/validations/order";
import { calculateTax } from "@/lib/config/business";
import { deductInventoryForOrder, createLowStockNotifications, validateInventoryForOrder } from "@/lib/utils/inventory-management";
import { createNewOrderNotification } from "@/lib/services/notification-service";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    try {
      orderQuerySchema.parse(queryParams);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Invalid query parameters",
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
          },
          { status: 400 }
        );
      }
    }

    const prisma = await getTenantPrisma(tenantSlug);

    // KITCHEN_STAFF can only view their location's PENDING and SERVED orders
    if (session.user.role === "KITCHEN_STAFF") {
      const locationId = session.user.locationId;
      const status = searchParams.get("status");

      // Only allow PENDING and SERVED statuses
      const allowedStatuses = ["PENDING", "SERVED"];
      const statusFilter = status
        ? status.split(',').filter(s => allowedStatuses.includes(s))
        : allowedStatuses;

      const orders = await prisma.order.findMany({
        where: {
          locationId,
          status: { in: statusFilter as any },
        },
        include: {
          location: true,
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
        },
        orderBy: {
          createdAt: "asc", // Oldest first for kitchen queue
        },
      });

      return NextResponse.json(orders);
    }

    // Admin can view all locations if no locationId param is provided
    const locationId = searchParams.get("locationId") === null && session.user.role === "ADMIN"
      ? null
      : searchParams.get("locationId") || session.user.locationId;
    const status = searchParams.get("status");
    const tableId = searchParams.get("tableId");

    // Handle comma-separated statuses
    const statusFilter = status
      ? status.includes(',')
        ? { in: status.split(',') as any }
        : status as any
      : undefined;

    const orders = await prisma.order.findMany({
      where: {
        ...(locationId && { locationId }),
        ...(statusFilter && { status: statusFilter }),
        ...(tableId && { tableId }),
      },
      include: {
        location: true,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    logger.error("Error fetching orders", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // KITCHEN_STAFF cannot create orders
    if (session.user.role === "KITCHEN_STAFF") {
      return NextResponse.json(
        { error: "Kitchen staff cannot create orders" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Validate inventory availability before creating order
    const inventoryCheck = await validateInventoryForOrder(
      prisma,
      validatedData.locationId,
      validatedData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    if (!inventoryCheck.isValid) {
      return NextResponse.json(
        {
          error: "Insufficient inventory",
          message: inventoryCheck.message,
          insufficientItems: inventoryCheck.insufficientItems,
        },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = calculateTax(subtotal, validatedData.includeTax);
    const total = subtotal + tax;

    // Use transaction with retry for order number generation + order creation
    // This prevents race conditions on duplicate order numbers
    const MAX_RETRIES = 3;
    let order;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        order = await prisma.$transaction(async (tx) => {
          // Generate order number inside transaction
          const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const count = await tx.order.count({
            where: {
              orderNumber: {
                startsWith: `ORD-${today}`,
              },
            },
          });
          const orderNumber = `ORD-${today}-${String(count + 1).padStart(4, "0")}`;

          // Re-validate inventory inside transaction to prevent race condition
          const txInventoryCheck = await validateInventoryForOrder(
            tx,
            validatedData.locationId,
            validatedData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          );

          if (!txInventoryCheck.isValid) {
            throw new Error(`Insufficient inventory: ${txInventoryCheck.message}`);
          }

          // Create order with items
          const newOrder = await tx.order.create({
            data: {
              orderNumber,
              tableId: validatedData.tableId,
              locationId: validatedData.locationId,
              staffId: validatedData.staffId,
              subtotal,
              tax,
              total,
              notes: validatedData.notes,
              items: {
                create: validatedData.items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  subtotal: item.price * item.quantity,
                  notes: item.notes,
                })),
              },
            },
            include: {
              location: true,
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
            },
          });

          // Update table status
          await tx.table.update({
            where: { id: validatedData.tableId },
            data: { status: "OCCUPIED" },
          });

          return newOrder;
        });
        break; // Success - exit retry loop
      } catch (error: any) {
        // If unique constraint violation on orderNumber, retry
        if (error.code === "P2002" && attempt < MAX_RETRIES - 1) {
          continue;
        }
        throw error;
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order after multiple attempts" },
        { status: 500 }
      );
    }

    // Deduct inventory (best-effort, don't fail order if this fails)
    await deductInventoryForOrder(prisma, order.id);

    // Check for low stock and create notifications
    await createLowStockNotifications(prisma, validatedData.locationId);

    // Create NEW_ORDER notification for kitchen staff
    try {
      await createNewOrderNotification(prisma, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.table?.number,
        locationId: order.locationId,
        totalAmount: order.total,
      });
    } catch (error) {
      logger.error("Error creating new order notification", error instanceof Error ? error : undefined);
      // Don't fail order creation if notification fails
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating order", error instanceof Error ? error : undefined);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
