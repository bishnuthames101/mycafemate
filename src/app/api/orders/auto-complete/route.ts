import { NextRequest, NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { subHours } from "date-fns";
import { logger } from '@/lib/utils/logger';

/**
 * Auto-complete orders that have been in SERVED status for more than 24 hours
 * This endpoint can be called by a cron job or scheduled task
 */
export async function POST(request: NextRequest) {
  try {
    // Optional API key check for security
    const apiKey = request.headers.get("x-api-key");
    if (process.env.CRON_API_KEY && apiKey !== process.env.CRON_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tenant from header or body
    const tenantSlug = request.headers.get("x-tenant-slug") || (await request.json()).tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant slug is required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    // Find orders that are SERVED and older than 24 hours
    const twentyFourHoursAgo = subHours(new Date(), 24);

    const oldOrders = await prisma.order.findMany({
      where: {
        status: "SERVED",
        updatedAt: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    // Update them to COMPLETED with PAID status if not already paid
    const updatePromises = oldOrders.map((order) =>
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          paymentStatus: order.paymentStatus === "PAID" ? "PAID" : "PAID",
          paymentMethod: order.paymentMethod || "CASH",
          completedAt: new Date(),
          paidAt: order.paidAt || new Date(),
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      ordersCompleted: oldOrders.length,
      orders: oldOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: o.total,
      })),
    });
  } catch (error) {
    logger.error("Error auto-completing orders", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to auto-complete orders" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check which orders would be auto-completed
 * Useful for testing and monitoring
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (process.env.CRON_API_KEY && apiKey !== process.env.CRON_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tenant from header
    const tenantSlug = request.headers.get("x-tenant-slug");
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant slug is required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const twentyFourHoursAgo = subHours(new Date(), 24);

    const oldOrders = await prisma.order.findMany({
      where: {
        status: "SERVED",
        updatedAt: {
          lt: twentyFourHoursAgo,
        },
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        updatedAt: true,
        paymentStatus: true,
      },
    });

    return NextResponse.json({
      count: oldOrders.length,
      orders: oldOrders,
    });
  } catch (error) {
    logger.error("Error checking auto-complete orders", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to check orders" },
      { status: 500 }
    );
  }
}
