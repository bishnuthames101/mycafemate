import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!locationId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "locationId, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    const start = startOfDay(parseISO(startDate));
    const end = endOfDay(parseISO(endDate));

    // Credit orders in the date range
    const creditOrders = await prisma.order.findMany({
      where: {
        locationId,
        status: "COMPLETED",
        paymentMethod: "CREDIT",
        createdAt: { gte: start, lte: end },
      },
      select: { total: true },
    });

    const creditSalesTotal = creditOrders.reduce((sum, o) => sum + o.total, 0);
    const creditOrderCount = creditOrders.length;

    // Payments received in the date range
    const payments = await prisma.creditPayment.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        creditor: { locationId },
      },
      select: { amount: true },
    });

    const paymentsReceived = payments.reduce((sum, p) => sum + p.amount, 0);
    const paymentCount = payments.length;

    // Overall outstanding balance (all creditors at this location)
    const creditors = await prisma.creditor.findMany({
      where: { locationId, currentBalance: { gt: 0 } },
      select: {
        id: true,
        name: true,
        currentBalance: true,
      },
      orderBy: { currentBalance: "desc" },
      take: 5,
    });

    const totalOutstanding = creditors.reduce((sum, c) => sum + c.currentBalance, 0);

    // Total creditors count
    const totalCreditors = await prisma.creditor.count({
      where: { locationId, currentBalance: { gt: 0 } },
    });

    return NextResponse.json({
      creditSalesTotal,
      creditOrderCount,
      paymentsReceived,
      paymentCount,
      totalOutstanding,
      totalCreditors,
      topCreditors: creditors,
    });
  } catch (error) {
    logger.error("Error fetching credit summary:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch credit summary" },
      { status: 500 }
    );
  }
}
