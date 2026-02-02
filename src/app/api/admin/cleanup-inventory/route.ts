import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { logger } from '@/lib/utils/logger';

/**
 * Admin utility to clean up duplicate inventory items
 * Keeps the most recent InventoryItem for each unique Inventory
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can run cleanup
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const { locationId } = await request.json();

    if (!locationId) {
      return NextResponse.json({ error: "locationId is required" }, { status: 400 });
    }

    // Get all inventory items for this location
    const allItems = await prisma.inventoryItem.findMany({
      where: {
        inventory: {
          locationId,
        },
      },
      include: {
        inventory: true,
      },
      orderBy: {
        createdAt: "desc", // Most recent first
      },
    });

    // Group by inventoryId to find duplicates
    const itemsByInventory = new Map<string, typeof allItems>();

    for (const item of allItems) {
      const inventoryId = item.inventoryId;
      if (!itemsByInventory.has(inventoryId)) {
        itemsByInventory.set(inventoryId, []);
      }
      itemsByInventory.get(inventoryId)!.push(item);
    }

    let duplicatesRemoved = 0;
    const toDelete: string[] = [];

    // For each inventory, keep only the most recent item
    for (const [inventoryId, items] of itemsByInventory.entries()) {
      if (items.length > 1) {
        // Keep the first one (most recent), delete the rest
        const [keep, ...deleteItems] = items;
        toDelete.push(...deleteItems.map(item => item.id));
        duplicatesRemoved += deleteItems.length;
      }
    }

    // Delete duplicates
    if (toDelete.length > 0) {
      await prisma.inventoryItem.deleteMany({
        where: {
          id: {
            in: toDelete,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${duplicatesRemoved} duplicate inventory items`,
      duplicatesRemoved,
      itemsKept: allItems.length - duplicatesRemoved,
    });
  } catch (error) {
    logger.error("Error cleaning up inventory", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to cleanup inventory" },
      { status: 500 }
    );
  }
}
