import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createPayrollRunSchema } from "@/lib/validations/payroll";
import { ZodError } from "zod";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/payroll/runs
 * List payroll runs (ADMIN only)
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    const status = searchParams.get("status");
    const year = searchParams.get("year");

    const whereClause: any = {};

    if (locationId) {
      whereClause.locationId = locationId;
    }
    if (status) {
      whereClause.status = status;
    }
    if (year) {
      whereClause.periodLabel = { startsWith: year };
    }

    const runs = await prisma.payrollRun.findMany({
      where: whereClause,
      include: {
        processedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            records: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(runs);
  } catch (error) {
    logger.error(
      "Error fetching payroll runs",
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { error: "Failed to fetch payroll runs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payroll/runs
 * Create a new payroll run with auto-generated records (ADMIN only)
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = createPayrollRunSchema.parse(body);

    // Check for duplicate payroll run
    const existingRun = await prisma.payrollRun.findFirst({
      where: {
        periodLabel: validatedData.periodLabel,
        locationId: validatedData.locationId || null,
      },
    });

    if (existingRun) {
      return NextResponse.json(
        {
          error: `A payroll run for ${validatedData.periodLabel} already exists${validatedData.locationId ? " for this location" : ""}`,
        },
        { status: 409 }
      );
    }

    // Find active employees matching the location filter
    const employeeWhere: any = { isActive: true };
    if (validatedData.locationId) {
      employeeWhere.locationId = validatedData.locationId;
    }

    const employees = await prisma.employeeProfile.findMany({
      where: employeeWhere,
      select: {
        id: true,
        baseSalary: true,
        payType: true,
      },
    });

    if (employees.length === 0) {
      return NextResponse.json(
        { error: "No active employees found for this payroll run" },
        { status: 400 }
      );
    }

    // Create run + records in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const run = await tx.payrollRun.create({
        data: {
          periodLabel: validatedData.periodLabel,
          periodStart: new Date(validatedData.periodStart),
          periodEnd: new Date(validatedData.periodEnd),
          locationId: validatedData.locationId || null,
          notes: validatedData.notes,
          processedById: session.user.id,
          status: "DRAFT",
          employeeCount: employees.length,
          totalGross: employees.reduce((sum, e) => sum + e.baseSalary, 0),
          totalDeductions: 0,
          totalNet: employees.reduce((sum, e) => sum + e.baseSalary, 0),
        },
      });

      // Auto-generate payroll records for each active employee
      await tx.payrollRecord.createMany({
        data: employees.map((emp) => ({
          payrollRunId: run.id,
          employeeProfileId: emp.id,
          baseSalary: emp.baseSalary,
          grossPay: emp.baseSalary,
          totalDeductions: 0,
          netPay: emp.baseSalary,
        })),
      });

      // Return run with records
      return tx.payrollRun.findUnique({
        where: { id: run.id },
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
                    select: { id: true, name: true },
                  },
                },
              },
            },
          },
          _count: {
            select: { records: true },
          },
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    logger.error(
      "Error creating payroll run",
      error instanceof Error ? error : undefined
    );
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create payroll run" },
      { status: 500 }
    );
  }
}
