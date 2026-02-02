import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { getTopProductsReport } from "@/lib/utils/analytics";
import { parseISO } from "date-fns";
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
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!locationId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "locationId, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    const data = await getTopProductsReport(
      locationId,
      parseISO(startDate),
      parseISO(endDate),
      limit,
      prisma
    );
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error fetching top products:", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to fetch top products" }, { status: 500 });
  }
}
