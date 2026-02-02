import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { checkLowStockItems } from "@/lib/utils/inventory-management";
import { logger } from '@/lib/utils/logger';

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
    const locationId = searchParams.get("locationId") || session.user.locationId;

    if (!locationId) {
      return NextResponse.json({ error: "locationId is required" }, { status: 400 });
    }

    const lowStockItems = await checkLowStockItems(prisma, locationId);
    return NextResponse.json(lowStockItems);
  } catch (error) {
    logger.error("Error fetching low stock items", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to fetch low stock items" }, { status: 500 });
  }
}
