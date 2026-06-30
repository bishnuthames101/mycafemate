import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { createEmployeeProfileSchema } from "@/lib/validations/payroll";
import { ZodError } from "zod";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/payroll/employees
 * List employee profiles (ADMIN only)
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
    const department = searchParams.get("department");
    const isActive = searchParams.get("isActive");

    const whereClause: any = {};

    if (locationId) {
      whereClause.locationId = locationId;
    }
    if (department) {
      whereClause.department = department;
    }
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      whereClause.isActive = isActive === "true";
    } else {
      whereClause.isActive = true;
    }

    const employees = await prisma.employeeProfile.findMany({
      where: whereClause,
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
        _count: {
          select: {
            payrollRecords: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    logger.error(
      "Error fetching employee profiles",
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { error: "Failed to fetch employee profiles" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payroll/employees
 * Create a new employee profile (ADMIN only)
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
    const validatedData = createEmployeeProfileSchema.parse(body);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has an employee profile
    const existingProfile = await prisma.employeeProfile.findUnique({
      where: { userId: validatedData.userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "This user already has an employee profile" },
        { status: 409 }
      );
    }

    // Verify location exists
    const location = await prisma.location.findUnique({
      where: { id: validatedData.locationId },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    const employeeProfile = await prisma.employeeProfile.create({
      data: {
        userId: validatedData.userId,
        locationId: validatedData.locationId,
        department: validatedData.department,
        designation: validatedData.designation,
        payType: validatedData.payType,
        baseSalary: validatedData.baseSalary,
        bankName: validatedData.bankName,
        bankAccountNo: validatedData.bankAccountNo,
        bankBranch: validatedData.bankBranch,
        joiningDate: new Date(validatedData.joiningDate),
        notes: validatedData.notes,
      },
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

    return NextResponse.json(employeeProfile, { status: 201 });
  } catch (error: any) {
    logger.error(
      "Error creating employee profile",
      error instanceof Error ? error : undefined
    );
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create employee profile" },
      { status: 500 }
    );
  }
}
