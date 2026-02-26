import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createCategorySchema } from "@/lib/validations/category";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

export async function GET() {
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

    const categories = await prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    logger.error("Error fetching categories", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const validatedData = createCategorySchema.parse(body);

    // Auto-generate slug from name if not provided
    const slug =
      validatedData.slug ||
      validatedData.name.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");

    // Check for duplicate slug
    const existing = await prisma.productCategory.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    // Get next sort order if not provided
    let sortOrder = validatedData.sortOrder;
    if (sortOrder === undefined) {
      const maxSort = await prisma.productCategory.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      sortOrder = (maxSort?.sortOrder ?? 0) + 1;
    }

    const category = await prisma.productCategory.create({
      data: {
        name: validatedData.name,
        slug,
        sortOrder,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating category", error instanceof Error ? error : undefined);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
