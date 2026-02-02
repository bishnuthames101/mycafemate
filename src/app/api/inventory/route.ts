import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
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
    const { inventoryId, productId, currentStock, minimumStock, maximumStock } = body;

    if (!inventoryId || currentStock === undefined || minimumStock === undefined) {
      return NextResponse.json(
        { error: "inventoryId, currentStock, and minimumStock are required" },
        { status: 400 }
      );
    }

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        inventoryId,
        productId: productId || null,
        currentStock: parseFloat(currentStock),
        minimumStock: parseFloat(minimumStock),
        maximumStock: maximumStock ? parseFloat(maximumStock) : null,
      },
      include: {
        inventory: true,
        product: true,
      },
    });

    return NextResponse.json(inventoryItem, { status: 201 });
  } catch (error) {
    logger.error("Error creating inventory item", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}
