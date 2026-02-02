import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updateCategorySchema } from "@/lib/validations/category";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

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
    const validatedData = updateCategorySchema.parse(body);

    // Build update data
    const updateData: Record<string, any> = {};
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
      // Auto-update slug if name changes and no explicit slug given
      if (validatedData.slug === undefined) {
        updateData.slug = validatedData.name
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/[^A-Z0-9_]/g, "");
      }
    }
    if (validatedData.slug !== undefined) {
      updateData.slug = validatedData.slug;
    }
    if (validatedData.sortOrder !== undefined) {
      updateData.sortOrder = validatedData.sortOrder;
    }
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    // Check slug uniqueness if slug is changing
    if (updateData.slug) {
      const existing = await prisma.productCategory.findFirst({
        where: { slug: updateData.slug, id: { not: params.id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const category = await prisma.productCategory.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(category);
  } catch (error: any) {
    logger.error("Error updating category", error instanceof Error ? error : undefined);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
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

    // Find the category to get its slug
    const category = await prisma.productCategory.findUnique({
      where: { id: params.id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if any products use this category
    const productCount = await prisma.product.count({
      where: { category: category.slug },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${productCount} product(s) are using it. Reassign products first.`,
        },
        { status: 409 }
      );
    }

    await prisma.productCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error("Error deleting category", error instanceof Error ? error : undefined);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
