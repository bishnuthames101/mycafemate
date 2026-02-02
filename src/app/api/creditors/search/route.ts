import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/creditors/search
 * Search creditors by name
 * Query params: q (search query), locationId
 */
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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const locationId = searchParams.get("locationId");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const prisma = await getTenantPrisma(tenantSlug);

    // Build where clause
    // Include all creditors (even with zero balance) so they can be reused for new credit orders
    let whereClause: any = {
      name: { contains: query, mode: "insensitive" },
    };

    // Staff can only search within their location
    if (session.user.role === "STAFF") {
      whereClause.locationId = session.user.locationId;
    } else if (locationId) {
      // Admin can filter by location
      whereClause.locationId = locationId;
    }

    const creditors = await prisma.creditor.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        currentBalance: true,
        locationId: true,
      },
      take: 10, // Limit results for performance
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(creditors);
  } catch (error) {
    logger.error("Error searching creditors:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to search creditors" },
      { status: 500 }
    );
  }
}
