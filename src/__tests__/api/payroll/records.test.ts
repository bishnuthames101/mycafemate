import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { adminSession, staffSession } from "../../helpers/mock-session";
import { createMockPrisma, samplePayrollRecord } from "../../helpers/mock-prisma";

import { PATCH } from "@/app/api/payroll/runs/[id]/records/[recordId]/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetTenantPrisma = vi.mocked(getTenantPrisma);

describe("PATCH /api/payroll/runs/[id]/records/[recordId]", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({ bonus: 1000 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-ADMIN", async () => {
    mockGetServerSession.mockResolvedValue(staffSession as any);
    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({ bonus: 1000 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(403);
  });

  it("returns 404 when record not found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRecord.findUnique.mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/nonexistent",
      {
        method: "PATCH",
        body: JSON.stringify({ bonus: 1000 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "nonexistent" },
    });
    expect(res.status).toBe(404);
  });

  it("returns 400 when record does not belong to run", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRecord.findUnique.mockResolvedValue({
      ...samplePayrollRecord,
      payrollRunId: "run-OTHER",
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({ bonus: 1000 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 when run is not DRAFT", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRecord.findUnique.mockResolvedValue({
      ...samplePayrollRecord,
      payrollRun: { id: "run-1", status: "PROCESSED" },
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({ bonus: 1000 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("DRAFT");
  });

  it("recalculates grossPay and netPay for MONTHLY employee", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRecord.findUnique.mockResolvedValue(
      samplePayrollRecord as any
    );
    mockPrisma.payrollRecord.update.mockResolvedValue({
      ...samplePayrollRecord,
      bonus: 5000,
      grossPay: 25000,
      netPay: 25000,
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({ bonus: 5000 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(200);

    // baseSalary(20000) + overtime(0) + bonus(5000) + allowance(0) = 25000
    expect(mockPrisma.payrollRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          bonus: 5000,
          grossPay: 25000,
          totalDeductions: 0,
          netPay: 25000,
        }),
      })
    );
  });

  it("recalculates with deductions", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRecord.findUnique.mockResolvedValue(
      samplePayrollRecord as any
    );
    mockPrisma.payrollRecord.update.mockResolvedValue({
      ...samplePayrollRecord,
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({
          bonus: 2000,
          deductionSSF: 200,
          deductionTax: 1000,
        }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(200);

    // grossPay = 20000 + 0 + 2000 + 0 = 22000
    // totalDeductions = 200 + 1000 + 0 + 0 = 1200
    // netPay = 22000 - 1200 = 20800
    expect(mockPrisma.payrollRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          grossPay: 22000,
          totalDeductions: 1200,
          netPay: 20800,
        }),
      })
    );
  });

  it("recalculates for DAILY pay type with daysWorked", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    const dailyRecord = {
      ...samplePayrollRecord,
      employeeProfile: {
        payType: "DAILY",
        baseSalary: 18000,
        user: { id: "user-2", name: "Sita" },
      },
      baseSalary: 18000,
      daysWorked: null,
    };
    mockPrisma.payrollRecord.findUnique.mockResolvedValue(dailyRecord as any);
    mockPrisma.payrollRecord.update.mockResolvedValue({
      ...dailyRecord,
    } as any);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({ daysWorked: 25 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(200);

    // dailyRate = 18000 / 30 = 600
    // grossPay = 600 * 25 + 0 + 0 + 0 = 15000
    expect(mockPrisma.payrollRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          daysWorked: 25,
          grossPay: 15000,
          netPay: 15000,
        }),
      })
    );
  });

  it("rejects invalid data (negative bonus)", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRecord.findUnique.mockResolvedValue(
      samplePayrollRecord as any
    );

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/run-1/records/rec-1",
      {
        method: "PATCH",
        body: JSON.stringify({ bonus: -500 }),
      }
    );
    const res = await PATCH(req, {
      params: { id: "run-1", recordId: "rec-1" },
    });
    expect(res.status).toBe(400);
  });
});
