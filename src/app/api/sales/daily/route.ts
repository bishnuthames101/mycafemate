import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { upsertDailySales } from "@/lib/utils/sales-aggregation";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/sales/daily
 * Fetch daily sales records with optional date range filtering
 * Query params: locationId, startDate, endDate
 */
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
    const locationId = searchParams.get("locationId");
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    if (!locationId) {
      return NextResponse.json(
        { error: "locationId is required" },
        { status: 400 }
      );
    }

    // Build query filter
    const where: any = { locationId };

    if (startDateStr || endDateStr) {
      where.date = {};
      if (startDateStr) {
        where.date.gte = startOfDay(parseISO(startDateStr));
      }
      if (endDateStr) {
        where.date.lte = endOfDay(parseISO(endDateStr));
      }
    }

    // Fetch daily sales records
    const dailySales = await prisma.dailySales.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(dailySales);
  } catch (error) {
    logger.error("Error fetching daily sales:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch daily sales" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sales/daily
 * Manually trigger daily sales aggregation (admin utility)
 * Body: { date, locationId }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Admin-only access
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const { date, locationId } = body;

    if (!date || !locationId) {
      return NextResponse.json(
        { error: "date and locationId are required" },
        { status: 400 }
      );
    }

    const targetDate = typeof date === "string" ? parseISO(date) : new Date(date);

    // Trigger aggregation
    const dailySales = await upsertDailySales(targetDate, locationId, prisma);

    return NextResponse.json(dailySales, { status: 201 });
  } catch (error) {
    logger.error("Error aggregating daily sales:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to aggregate daily sales" },
      { status: 500 }
    );
  }
}
