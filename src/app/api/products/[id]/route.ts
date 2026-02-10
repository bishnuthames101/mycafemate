import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updateProductSchema } from "@/lib/validations/product";
import { logger } from '@/lib/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    logger.error("Error fetching product", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const { recipes, ...productData } = body;
    const validatedData = updateProductSchema.parse(productData);

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
    });

    // If recipes are provided, validate then replace all existing recipes
    if (recipes !== undefined) {
      // Validate recipes before modifying
      if (Array.isArray(recipes) && recipes.length > 0) {
        for (const recipe of recipes) {
          if (!recipe.inventoryId || typeof recipe.inventoryId !== "string") {
            return NextResponse.json(
              { error: "Each recipe item must have a valid inventoryId" },
              { status: 400 }
            );
          }
          if (!recipe.quantityUsed || typeof recipe.quantityUsed !== "number" || recipe.quantityUsed <= 0) {
            return NextResponse.json(
              { error: "Each recipe item must have a quantityUsed > 0" },
              { status: 400 }
            );
          }
          const inventory = await prisma.inventory.findUnique({
            where: { id: recipe.inventoryId },
            select: { id: true },
          });
          if (!inventory) {
            return NextResponse.json(
              { error: `Inventory '${recipe.inventoryId}' not found` },
              { status: 400 }
            );
          }
        }
      }

      // Delete existing recipes
      await prisma.recipeItem.deleteMany({
        where: { productId: params.id },
      });

      // Create new recipes
      if (Array.isArray(recipes) && recipes.length > 0) {
        await prisma.recipeItem.createMany({
          data: recipes.map((recipe: { inventoryId: string; quantityUsed: number }) => ({
            productId: params.id,
            inventoryId: recipe.inventoryId,
            quantityUsed: recipe.quantityUsed,
          })),
        });
      }
    }

    return NextResponse.json(product);
  } catch (error: any) {
    logger.error("Error updating product", error instanceof Error ? error : undefined);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    logger.error("Error deleting product", error instanceof Error ? error : undefined);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
