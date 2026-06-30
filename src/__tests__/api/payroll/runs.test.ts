import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import {
  adminSession,
  staffSession,
} from "../../helpers/mock-session";
import {
  createMockPrisma,
  samplePayrollRun,
  sampleEmployee,
} from "../../helpers/mock-prisma";

import { GET, POST } from "@/app/api/payroll/runs/route";
import {
  GET as GET_ONE,
  PATCH,
  DELETE,
} from "@/app/api/payroll/runs/[id]/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetTenantPrisma = vi.mocked(getTenantPrisma);

describe("GET /api/payroll/runs", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/payroll/runs");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 for STAFF", async () => {
    mockGetServerSession.mockResolvedValue(staffSession as any);
    const req = new NextRequest("http://localhost/api/payroll/runs");
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns runs for ADMIN", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findMany.mockResolvedValue([samplePayrollRun]);

    const req = new NextRequest("http://localhost/api/payroll/runs");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].periodLabel).toBe("2026-06");
  });

  it("filters by status query param", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findMany.mockResolvedValue([]);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs?status=DRAFT"
    );
    await GET(req);

    expect(mockPrisma.payrollRun.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "DRAFT" }),
      })
    );
  });

  it("filters by year query param", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findMany.mockResolvedValue([]);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs?year=2026"
    );
    await GET(req);

    expect(mockPrisma.payrollRun.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          periodLabel: { startsWith: "2026" },
        }),
      })
    );
  });
});

describe("POST /api/payroll/runs", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  const validBody = {
    periodLabel: "2026-06",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
  };

  it("returns 400 for invalid data", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    const req = new NextRequest("http://localhost/api/payroll/runs", {
      method: "POST",
      body: JSON.stringify({ periodLabel: "invalid" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 409 for duplicate period", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findFirst.mockResolvedValue(samplePayrollRun as any);

    const req = new NextRequest("http://localhost/api/payroll/runs", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it("returns 400 when no active employees found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findFirst.mockResolvedValue(null);
    mockPrisma.employeeProfile.findMany.mockResolvedValue([]);

    const req = new NextRequest("http://localhost/api/payroll/runs", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("No active employees");
  });

  it("creates run with auto-generated records in transaction", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findFirst.mockResolvedValue(null);
    mockPrisma.employeeProfile.findMany.mockResolvedValue([
      { id: "emp-1", baseSalary: 20000, payType: "MONTHLY" },
      { id: "emp-2", baseSalary: 15000, payType: "MONTHLY" },
    ] as any);

    // Mock transaction — the $transaction callback receives a transaction prisma
    const txPrisma = createMockPrisma();
    txPrisma.payrollRun.create.mockResolvedValue({
      ...samplePayrollRun,
      id: "run-new",
    });
    txPrisma.payrollRecord.createMany.mockResolvedValue({ count: 2 });
    txPrisma.payrollRun.findUnique.mockResolvedValue({
      ...samplePayrollRun,
      id: "run-new",
      records: [],
    });
    mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(txPrisma));

    const req = new NextRequest("http://localhost/api/payroll/runs", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    // Verify records were created for both employees
    expect(txPrisma.payrollRecord.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            employeeProfileId: "emp-1",
            baseSalary: 20000,
          }),
          expect.objectContaining({
            employeeProfileId: "emp-2",
            baseSalary: 15000,
          }),
        ]),
      })
    );
  });
});

describe("PATCH /api/payroll/runs/[id]", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("returns 404 when run not found", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findUnique.mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/payroll/runs/nonexistent",
      {
        method: "PATCH",
        body: JSON.stringify({ status: "PROCESSED" }),
      }
    );
    const res = await PATCH(req, { params: { id: "nonexistent" } });
    expect(res.status).toBe(404);
  });

  it("transitions DRAFT -> PROCESSED and recalculates totals", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    const runWithRecords = {
      ...samplePayrollRun,
      status: "DRAFT",
      records: [
        { grossPay: 20000, totalDeductions: 200, netPay: 19800 },
        { grossPay: 15000, totalDeductions: 150, netPay: 14850 },
      ],
    };
    mockPrisma.payrollRun.findUnique.mockResolvedValue(runWithRecords as any);
    mockPrisma.payrollRun.update.mockResolvedValue({
      ...samplePayrollRun,
      status: "PROCESSED",
    } as any);

    const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "PROCESSED" }),
    });
    const res = await PATCH(req, { params: { id: "run-1" } });
    expect(res.status).toBe(200);

    expect(mockPrisma.payrollRun.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PROCESSED",
          totalGross: 35000,
          totalDeductions: 350,
          totalNet: 34650,
          employeeCount: 2,
        }),
      })
    );
  });

  it("transitions PROCESSED -> PAID", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findUnique.mockResolvedValue({
      ...samplePayrollRun,
      status: "PROCESSED",
      records: [],
    } as any);
    mockPrisma.payrollRun.update.mockResolvedValue({
      ...samplePayrollRun,
      status: "PAID",
    } as any);

    const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "PAID" }),
    });
    const res = await PATCH(req, { params: { id: "run-1" } });
    expect(res.status).toBe(200);
  });

  it("rejects backward transition PROCESSED -> DRAFT", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findUnique.mockResolvedValue({
      ...samplePayrollRun,
      status: "PROCESSED",
      records: [],
    } as any);

    const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "PROCESSED" }),
    });
    // PROCESSED -> PROCESSED is not in valid transitions
    const res = await PATCH(req, { params: { id: "run-1" } });
    expect(res.status).toBe(400);
  });

  it("rejects transition from PAID", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findUnique.mockResolvedValue({
      ...samplePayrollRun,
      status: "PAID",
      records: [],
    } as any);

    const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "PROCESSED" }),
    });
    const res = await PATCH(req, { params: { id: "run-1" } });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/payroll/runs/[id]", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
  });

  it("deletes DRAFT run", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findUnique.mockResolvedValue({
      ...samplePayrollRun,
      status: "DRAFT",
    } as any);
    mockPrisma.payrollRun.delete.mockResolvedValue(samplePayrollRun as any);

    const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: "run-1" } });
    expect(res.status).toBe(200);
  });

  it("rejects deleting PROCESSED run", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findUnique.mockResolvedValue({
      ...samplePayrollRun,
      status: "PROCESSED",
    } as any);

    const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: "run-1" } });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("DRAFT");
  });

  it("rejects deleting PAID run", async () => {
    mockGetServerSession.mockResolvedValue(adminSession as any);
    mockPrisma.payrollRun.findUnique.mockResolvedValue({
      ...samplePayrollRun,
      status: "PAID",
    } as any);

    const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: "run-1" } });
    expect(res.status).toBe(400);
  });
});
