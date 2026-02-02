import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { getWeeklySalesData } from "@/lib/utils/analytics";
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
    const weekOffset = parseInt(searchParams.get("weekOffset") || "0");

    if (!locationId) {
      return NextResponse.json({ error: "locationId is required" }, { status: 400 });
    }

    const data = await getWeeklySalesData(locationId, weekOffset, prisma);
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error fetching weekly sales:", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to fetch weekly sales" }, { status: 500 });
  }
}
