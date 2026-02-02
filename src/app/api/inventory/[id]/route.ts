import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: {
        inventory: true,
        product: true,
      },
    });

    if (!inventoryItem) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
    }

    return NextResponse.json(inventoryItem);
  } catch (error) {
    logger.error("Error fetching inventory item", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to fetch inventory item" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { currentStock, minimumStock, maximumStock } = body;

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        ...(currentStock !== undefined && { currentStock: parseFloat(currentStock) }),
        ...(minimumStock !== undefined && { minimumStock: parseFloat(minimumStock) }),
        ...(maximumStock !== undefined && { maximumStock: parseFloat(maximumStock) }),
      },
      include: {
        inventory: true,
        product: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    logger.error("Error updating inventory item", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.inventoryItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    logger.error("Error deleting inventory item", error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 });
  }
}
