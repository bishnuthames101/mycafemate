import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updatePayrollRunStatusSchema } from "@/lib/validations/payroll";
import { ZodError } from "zod";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/payroll/runs/[id]
 * Get a single payroll run with all records (ADMIN only)
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can access payroll" },
        { status: 403 }
      );
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const run = await prisma.payrollRun.findUnique({
      where: { id: params.id },
      include: {
        processedBy: {
          select: { id: true, name: true },
        },
        location: {
          select: { id: true, name: true },
        },
        records: {
          include: {
            employeeProfile: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                location: {
                  select: { id: true, name: true },
                },
              },
            },
          },
          orderBy: {
            employeeProfile: {
              user: {
                name: "asc",
              },
            },
          },
        },
      },
    });

    if (!run) {
      return NextResponse.json(
        { error: "Payroll run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(run);
  } catch (error) {
    logger.error(
      "Error fetching payroll run",
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { error: "Failed to fetch payroll run" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/payroll/runs/[id]
 * Update payroll run status (ADMIN only)
 * Transitions: DRAFT -> PROCESSED, PROCESSED -> PAID
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can manage payroll" },
        { status: 403 }
      );
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const existing = await prisma.payrollRun.findUnique({
      where: { id: params.id },
      include: {
        records: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Payroll run not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updatePayrollRunStatusSchema.parse(body);

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      DRAFT: ["PROCESSED"],
      PROCESSED: ["PAID"],
      PAID: [],
    };

    if (!validTransitions[existing.status]?.includes(validatedData.status)) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${existing.status} to ${validatedData.status}`,
        },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: validatedData.status,
    };

    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes;
    }

    // When processing, recalculate totals from records
    if (validatedData.status === "PROCESSED") {
      const totalGross = existing.records.reduce(
        (sum, r) => sum + r.grossPay,
        0
      );
      const totalDeductions = existing.records.reduce(
        (sum, r) => sum + r.totalDeductions,
        0
      );
      const totalNet = existing.records.reduce((sum, r) => sum + r.netPay, 0);

      updateData.totalGross = totalGross;
      updateData.totalDeductions = totalDeductions;
      updateData.totalNet = totalNet;
      updateData.employeeCount = existing.records.length;
    }

    const updated = await prisma.payrollRun.update({
      where: { id: params.id },
      data: updateData,
      include: {
        processedBy: {
          select: { id: true, name: true },
        },
        location: {
          select: { id: true, name: true },
        },
        _count: {
          select: { records: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    logger.error(
      "Error updating payroll run",
      error instanceof Error ? error : undefined
    );
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update payroll run" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/payroll/runs/[id]
 * Delete a DRAFT payroll run (ADMIN only)
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can manage payroll" },
        { status: 403 }
      );
    }

    const tenantSlug = session.user.tenantSlug;
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantSlug);

    const existing = await prisma.payrollRun.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Payroll run not found" },
        { status: 404 }
      );
    }

    if (existing.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only DRAFT payroll runs can be deleted" },
        { status: 400 }
      );
    }

    // Cascade deletes records via onDelete: Cascade
    await prisma.payrollRun.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Payroll run deleted" });
  } catch (error) {
    logger.error(
      "Error deleting payroll run",
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { error: "Failed to delete payroll run" },
      { status: 500 }
    );
  }
}
