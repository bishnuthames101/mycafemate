import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updateCreditorSchema } from "@/lib/validations/creditor";
import { ZodError } from "zod";
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/creditors/:id
 * Get creditor details with orders and payment history
 */
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

    const creditor = await prisma.creditor.findUnique({
      where: { id: params.id },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
            table: {
              select: {
                id: true,
                number: true,
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          include: {
            recordedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!creditor) {
      return NextResponse.json(
        { error: "Creditor not found" },
        { status: 404 }
      );
    }

    // Staff can only view creditors from their location
    if (session.user.role === "STAFF" && session.user.locationId !== creditor.locationId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json(creditor);
  } catch (error) {
    logger.error("Error fetching creditor", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to fetch creditor" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/creditors/:id
 * Update creditor details (name, phone, email only)
 */
export async function PATCH(
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

    // Check if creditor exists and user has access
    const existingCreditor = await prisma.creditor.findUnique({
      where: { id: params.id },
    });

    if (!existingCreditor) {
      return NextResponse.json(
        { error: "Creditor not found" },
        { status: 404 }
      );
    }

    // Staff can only update creditors from their location
    if (session.user.role === "STAFF" && session.user.locationId !== existingCreditor.locationId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateCreditorSchema.parse(body);

    const creditor = await prisma.creditor.update({
      where: { id: params.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
        ...(validatedData.email !== undefined && { email: validatedData.email }),
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(creditor);
  } catch (error: any) {
    logger.error("Error updating creditor", error instanceof Error ? error : undefined);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update creditor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/creditors/:id
 * Delete a creditor (only if balance is 0)
 */
export async function DELETE(
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

    const creditor = await prisma.creditor.findUnique({
      where: { id: params.id },
    });

    if (!creditor) {
      return NextResponse.json(
        { error: "Creditor not found" },
        { status: 404 }
      );
    }

    // Staff can only delete creditors from their location
    if (session.user.role === "STAFF" && session.user.locationId !== creditor.locationId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Can only delete if balance is 0
    if (creditor.currentBalance > 0) {
      return NextResponse.json(
        { error: "Cannot delete creditor with outstanding balance" },
        { status: 400 }
      );
    }

    await prisma.creditor.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Creditor deleted successfully" });
  } catch (error) {
    logger.error("Error deleting creditor", error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "Failed to delete creditor" },
      { status: 500 }
    );
  }
}
