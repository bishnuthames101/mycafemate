import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createInventoryItemSchema } from "@/lib/validations/inventory";
import { ZodError } from "zod";
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
    // STAFF can only view their own location's inventory
    const locationId = session.user.role === "STAFF" || session.user.role === "KITCHEN_STAFF"
      ? session.user.locationId
      : searchParams.get("locationId") || session.user.locationId;

    if (!locationId) {
      return NextResponse.json({ error: "locationId is required" }, { status: 400 });
    }

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        inventory: {
          locationId,
        },
      },
      include: {
        inventory: true,
        product: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        inventory: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(inventoryItems);
  } catch (error) {
    logger.error("Error fetching inventory", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

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
    const validatedData = createInventoryItemSchema.parse(body);

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        inventoryId: validatedData.inventoryId,
        productId: validatedData.productId || null,
        currentStock: validatedData.currentStock,
        minimumStock: validatedData.minimumStock,
        maximumStock: validatedData.maximumStock ?? null,
      },
      include: {
        inventory: true,
        product: true,
      },
    });

    return NextResponse.json(inventoryItem, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`) },
        { status: 400 }
      );
    }
    logger.error("Error creating inventory item", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}
