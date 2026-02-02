import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only kitchen staff can access this endpoint
    if (session.user.role !== "KITCHEN_STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");

    if (!locationId) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    // Get pending orders count
    const pendingOrders = await prisma.order.count({
      where: {
        locationId: locationId,
        status: "PENDING",
      },
    });

    // Get served orders today count
    const servedToday = await prisma.order.count({
      where: {
        locationId: locationId,
        status: "SERVED",
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    // Get total orders today
    const totalToday = await prisma.order.count({
      where: {
        locationId: locationId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    // Get recent pending orders
    const recentOrders = await prisma.order.findMany({
      where: {
        locationId: locationId,
        status: "PENDING",
      },
      include: {
        table: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest first
      },
      take: 5,
    });

    return NextResponse.json({
      pendingOrders,
      servedToday,
      totalToday,
      recentOrders,
    });
  } catch (error) {
    logger.error("Error fetching kitchen stats:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
