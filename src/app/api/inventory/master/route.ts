import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * Create a new master Inventory record
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, unit, locationId } = body;

    if (!name || !unit || !locationId) {
      return NextResponse.json(
        { error: "name, unit, and locationId are required" },
        { status: 400 }
      );
    }

    const inventory = await prisma.inventory.create({
      data: {
        name,
        unit,
        locationId,
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    logger.error("Error creating inventory", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to create inventory" },
      { status: 500 }
    );
  }
}
