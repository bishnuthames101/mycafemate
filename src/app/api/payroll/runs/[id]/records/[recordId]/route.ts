import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { updatePayrollRecordSchema } from "@/lib/validations/payroll";
import { ZodError } from "zod";
import { logger } from "@/lib/utils/logger";

/**
 * PATCH /api/payroll/runs/[id]/records/[recordId]
 * Update a payroll record (earnings/deductions) — only for DRAFT runs (ADMIN only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; recordId: string } }
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

    // Get record with its parent run and employee profile
    const record = await prisma.payrollRecord.findUnique({
      where: { id: params.recordId },
      include: {
        payrollRun: {
          select: { id: true, status: true },
        },
        employeeProfile: {
          select: { payType: true, baseSalary: true },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Payroll record not found" },
        { status: 404 }
      );
    }

    // Verify record belongs to the specified run
    if (record.payrollRunId !== params.id) {
      return NextResponse.json(
        { error: "Record does not belong to this payroll run" },
        { status: 400 }
      );
    }

    // Only allow edits on DRAFT runs
    if (record.payrollRun.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Can only edit records in DRAFT payroll runs" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updatePayrollRecordSchema.parse(body);

    // Merge with existing values
    const daysWorked =
      validatedData.daysWorked !== undefined
        ? validatedData.daysWorked
        : record.daysWorked;
    const overtime =
      validatedData.overtime !== undefined
        ? validatedData.overtime
        : record.overtime;
    const bonus =
      validatedData.bonus !== undefined ? validatedData.bonus : record.bonus;
    const allowance =
      validatedData.allowance !== undefined
        ? validatedData.allowance
        : record.allowance;
    const deductionSSF =
      validatedData.deductionSSF !== undefined
        ? validatedData.deductionSSF
        : record.deductionSSF;
    const deductionTax =
      validatedData.deductionTax !== undefined
        ? validatedData.deductionTax
        : record.deductionTax;
    const deductionAdvance =
      validatedData.deductionAdvance !== undefined
        ? validatedData.deductionAdvance
        : record.deductionAdvance;
    const deductionOther =
      validatedData.deductionOther !== undefined
        ? validatedData.deductionOther
        : record.deductionOther;

    // Server-side recalculation
    let grossPay: number;
    if (
      record.employeeProfile.payType === "DAILY" &&
      daysWorked !== null &&
      daysWorked !== undefined
    ) {
      const dailyRate = record.baseSalary / 30;
      grossPay = dailyRate * daysWorked + overtime + bonus + allowance;
    } else {
      grossPay = record.baseSalary + overtime + bonus + allowance;
    }

    const totalDeductions =
      deductionSSF + deductionTax + deductionAdvance + deductionOther;
    const netPay = grossPay - totalDeductions;

    const updated = await prisma.payrollRecord.update({
      where: { id: params.recordId },
      data: {
        daysWorked,
        overtime,
        bonus,
        allowance,
        deductionSSF,
        deductionTax,
        deductionAdvance,
        deductionOther,
        deductionNotes:
          validatedData.deductionNotes !== undefined
            ? validatedData.deductionNotes
            : record.deductionNotes,
        grossPay,
        totalDeductions,
        netPay,
      },
      include: {
        employeeProfile: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    logger.error(
      "Error updating payroll record",
      error instanceof Error ? error : undefined
    );
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update payroll record" },
      { status: 500 }
    );
  }
}
