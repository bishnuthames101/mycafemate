import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { subHours } from "date-fns";
import { logger } from '@/lib/utils/logger';

/**
 * Auto-complete orders that have been in SERVED status for more than 24 hours.
 *
 * Security: Requires either a valid session (ADMIN role) or CRON_SECRET.
 * Tenant is resolved from the authenticated session or subdomain — never from user input.
 */
export async function POST(request: NextRequest) {
  try {
    // Auth: require either CRON_SECRET or an authenticated ADMIN session
    const cronSecretHeader = request.headers.get("x-cron-secret");
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    let tenantSlug: string | null = null;

    if (cronSecret && (cronSecretHeader === cronSecret || authHeader === `Bearer ${cronSecret}`)) {
      // Cron caller — tenant slug must come from the request body (trusted since secret is verified)
      const body = await request.json().catch(() => ({}));
      tenantSlug = body.tenantSlug || null;
    } else {
      // Session-based auth — tenant slug from session
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      tenantSlug = session.user.tenantSlug || null;
    }

    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 400 });
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

    // Update them to COMPLETED with PAID status
    const updatePromises = oldOrders.map((order) =>
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          paymentStatus: "PAID",
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
    });
  } catch (error) {
    logger.error("Error auto-completing orders", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to auto-complete orders" },
      { status: 500 }
    );
  }
}
