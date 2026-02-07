import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createProductSchema, productQuerySchema } from "@/lib/validations/product";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

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

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    try {
      productQuerySchema.parse(queryParams);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Invalid query parameters",
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
          },
          { status: 400 }
        );
      }
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const category = searchParams.get("category");
    const isAvailable = searchParams.get("isAvailable");
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(isAvailable !== null && { isAvailable: isAvailable === "true" }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        category: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    logger.error("Error fetching products", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const validatedData = createProductSchema.parse(productData);

    // Validate recipes BEFORE creating anything
    if (recipes && Array.isArray(recipes) && recipes.length > 0) {
      for (const recipe of recipes) {
        if (!recipe.inventoryId || typeof recipe.inventoryId !== "string") {
          throw new Error("Each recipe item must have a valid inventoryId");
        }
        if (!recipe.quantityUsed || typeof recipe.quantityUsed !== "number" || recipe.quantityUsed <= 0) {
          throw new Error("Each recipe item must have a quantityUsed greater than 0");
        }

        // Verify inventory exists
        const inventory = await prisma.inventory.findUnique({
          where: { id: recipe.inventoryId },
          select: { id: true },
        });
        if (!inventory) {
          throw new Error(`Inventory '${recipe.inventoryId}' not found`);
        }
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: validatedData,
    });

    // Create recipe items if provided
    if (recipes && Array.isArray(recipes) && recipes.length > 0) {
      await prisma.recipeItem.createMany({
        data: recipes.map((recipe: any) => ({
          productId: product.id,
          inventoryId: recipe.inventoryId,
          quantityUsed: recipe.quantityUsed,
        })),
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating product", error instanceof Error ? error : undefined);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
