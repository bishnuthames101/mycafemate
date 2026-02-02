import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createCreditorSchema } from "@/lib/validations/creditor";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/creditors
 * List all creditors with outstanding balances
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

    const prisma = await getTenantPrisma(tenantSlug);

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");

    // Staff can only see creditors from their location
    let whereClause: any = {
      currentBalance: { gt: 0 }, // Only show creditors with outstanding balance
    };

    if (session.user.role === "STAFF") {
      whereClause.locationId = session.user.locationId;
    } else if (locationId) {
      // Admin can filter by location
      whereClause.locationId = locationId;
    }

    const creditors = await prisma.creditor.findMany({
      where: whereClause,
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        currentBalance: "desc",
      },
    });

    return NextResponse.json(creditors);
  } catch (error) {
    logger.error("Error fetching creditors", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch creditors" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/creditors
 * Create a new creditor
 */
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

    const body = await request.json();
    const validatedData = createCreditorSchema.parse(body);

    // Verify location exists and user has access
    const location = await prisma.location.findUnique({
      where: { id: validatedData.locationId },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    // Staff can only create creditors for their location
    if (session.user.role === "STAFF" && session.user.locationId !== validatedData.locationId) {
      return NextResponse.json(
        { error: "You can only create creditors for your assigned location" },
        { status: 403 }
      );
    }

    const creditor = await prisma.creditor.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email,
        locationId: validatedData.locationId,
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(creditor, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating creditor", error instanceof Error ? error : undefined);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create creditor" },
      { status: 500 }
    );
  }
}
