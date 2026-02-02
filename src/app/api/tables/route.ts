import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createTableSchema } from "@/lib/validations/table";
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tenant slug from session
    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId") || session.user.locationId;
    const status = searchParams.get("status");

    const tables = await prisma.table.findMany({
      where: {
        ...(locationId && { locationId }),
        ...(status && { status: status as any }),
      },
      orderBy: {
        number: "asc",
      },
      include: {
        orders: {
          where: {
            status: {
              in: ["PENDING", "PREPARING", "READY", "SERVED"],
            },
          },
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    logger.error("Error fetching tables:", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
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

    // Get tenant slug from session
    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const body = await request.json();
    const validatedData = createTableSchema.parse(body);

    const table = await prisma.table.create({
      data: validatedData,
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating table:", error instanceof Error ? error : undefined);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 }
    );
  }
}
