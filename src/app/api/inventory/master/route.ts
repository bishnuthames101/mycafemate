import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';
import { z } from "zod";

const createInventoryMasterSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must not exceed 100 characters").trim(),
  unit: z.string().min(1, "Unit is required").max(30, "Unit must not exceed 30 characters").trim(),
  locationId: z.string().min(1, "Location ID is required"),
});

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
    const validatedData = createInventoryMasterSchema.parse(body);

    const inventory = await prisma.inventory.create({
      data: {
        name: validatedData.name,
        unit: validatedData.unit,
        locationId: validatedData.locationId,
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`) },
        { status: 400 }
      );
    }
    logger.error("Error creating inventory", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to create inventory" },
      { status: 500 }
    );
  }
}
