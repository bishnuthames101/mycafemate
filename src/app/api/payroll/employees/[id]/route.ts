import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updateEmployeeProfileSchema } from "@/lib/validations/payroll";
import { ZodError } from "zod";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/payroll/employees/[id]
 * Get a single employee profile with recent payroll records (ADMIN only)
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

    const employee = await prisma.employeeProfile.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        payrollRecords: {
          include: {
            payrollRun: {
              select: {
                id: true,
                periodLabel: true,
                status: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    logger.error(
      "Error fetching employee profile",
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { error: "Failed to fetch employee profile" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/payroll/employees/[id]
 * Update an employee profile (ADMIN only)
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

    const existing = await prisma.employeeProfile.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Employee profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateEmployeeProfileSchema.parse(body);

    // If changing location, verify it exists
    if (validatedData.locationId) {
      const location = await prisma.location.findUnique({
        where: { id: validatedData.locationId },
      });
      if (!location) {
        return NextResponse.json(
          { error: "Location not found" },
          { status: 404 }
        );
      }
    }

    const updateData: any = { ...validatedData };
    if (validatedData.joiningDate) {
      updateData.joiningDate = new Date(validatedData.joiningDate);
    }

    const updated = await prisma.employeeProfile.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    logger.error(
      "Error updating employee profile",
      error instanceof Error ? error : undefined
    );
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update employee profile" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/payroll/employees/[id]
 * Soft-delete an employee profile (sets isActive = false) (ADMIN only)
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

    const existing = await prisma.employeeProfile.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Employee profile not found" },
        { status: 404 }
      );
    }

    // Soft delete — preserve payroll history
    await prisma.employeeProfile.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Employee profile deactivated" });
  } catch (error) {
    logger.error(
      "Error deactivating employee profile",
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { error: "Failed to deactivate employee profile" },
      { status: 500 }
    );
  }
}
