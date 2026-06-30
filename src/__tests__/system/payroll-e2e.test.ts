import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getTenantPrisma } from "@/lib/prisma-multi-tenant";
import { adminSession, staffSession } from "../helpers/mock-session";
import { createMockPrisma } from "../helpers/mock-prisma";

import {
  GET as GET_EMPLOYEES,
  POST as POST_EMPLOYEE,
} from "@/app/api/payroll/employees/route";
import {
  GET as GET_RUNS,
  POST as POST_RUN,
} from "@/app/api/payroll/runs/route";
import {
  GET as GET_RUN,
  PATCH as PATCH_RUN,
  DELETE as DELETE_RUN,
} from "@/app/api/payroll/runs/[id]/route";
import { PATCH as PATCH_RECORD } from "@/app/api/payroll/runs/[id]/records/[recordId]/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetTenantPrisma = vi.mocked(getTenantPrisma);

/**
 * System test: Full payroll lifecycle
 * Tests the complete workflow end-to-end through API route handlers
 */
describe("Payroll System E2E", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockGetTenantPrisma.mockResolvedValue(mockPrisma as any);
    mockGetServerSession.mockResolvedValue(adminSession as any);
  });

  describe("Full lifecycle: Create employees -> Run payroll -> Edit -> Process -> Pay", () => {
    it("Step 1: Create employee profiles", async () => {
      // Setup: user and location exist, no existing profile
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "Ram",
      } as any);
      mockPrisma.employeeProfile.findUnique.mockResolvedValue(null);
      mockPrisma.location.findUnique.mockResolvedValue({
        id: "loc-1",
      } as any);
      mockPrisma.employeeProfile.create.mockResolvedValue({
        id: "emp-1",
        userId: "user-1",
        baseSalary: 20000,
        payType: "MONTHLY",
        user: { id: "user-1", name: "Ram", email: "ram@test.com", role: "STAFF" },
        location: { id: "loc-1", name: "Main" },
      } as any);

      const req = new NextRequest("http://localhost/api/payroll/employees", {
        method: "POST",
        body: JSON.stringify({
          userId: "user-1",
          locationId: "loc-1",
          department: "Service",
          payType: "MONTHLY",
          baseSalary: 20000,
          joiningDate: "2025-01-15",
        }),
      });

      const res = await POST_EMPLOYEE(req);
      expect(res.status).toBe(201);
      const emp = await res.json();
      expect(emp.baseSalary).toBe(20000);
    });

    it("Step 2: Create payroll run (auto-generates records)", async () => {
      mockPrisma.payrollRun.findFirst.mockResolvedValue(null);
      mockPrisma.employeeProfile.findMany.mockResolvedValue([
        { id: "emp-1", baseSalary: 20000, payType: "MONTHLY" },
        { id: "emp-2", baseSalary: 15000, payType: "MONTHLY" },
        { id: "emp-3", baseSalary: 18000, payType: "DAILY" },
      ] as any);

      const txPrisma = createMockPrisma();
      txPrisma.payrollRun.create.mockResolvedValue({ id: "run-1" } as any);
      txPrisma.payrollRecord.createMany.mockResolvedValue({ count: 3 });
      txPrisma.payrollRun.findUnique.mockResolvedValue({
        id: "run-1",
        periodLabel: "2026-06",
        status: "DRAFT",
        totalGross: 53000,
        totalNet: 53000,
        employeeCount: 3,
        records: [
          { id: "rec-1", baseSalary: 20000, grossPay: 20000, netPay: 20000 },
          { id: "rec-2", baseSalary: 15000, grossPay: 15000, netPay: 15000 },
          { id: "rec-3", baseSalary: 18000, grossPay: 18000, netPay: 18000 },
        ],
        processedBy: { id: "admin-user-1", name: "Test Admin" },
        location: null,
        _count: { records: 3 },
      } as any);
      mockPrisma.$transaction.mockImplementation(async (fn: any) =>
        fn(txPrisma)
      );

      const req = new NextRequest("http://localhost/api/payroll/runs", {
        method: "POST",
        body: JSON.stringify({
          periodLabel: "2026-06",
          periodStart: "2026-06-01",
          periodEnd: "2026-06-30",
        }),
      });

      const res = await POST_RUN(req);
      expect(res.status).toBe(201);
      const run = await res.json();
      expect(run.records).toHaveLength(3);
      expect(run.employeeCount).toBe(3);
    });

    it("Step 3: Edit record (add bonus and deductions)", async () => {
      mockPrisma.payrollRecord.findUnique.mockResolvedValue({
        id: "rec-1",
        payrollRunId: "run-1",
        baseSalary: 20000,
        daysWorked: null,
        overtime: 0,
        bonus: 0,
        allowance: 0,
        deductionSSF: 0,
        deductionTax: 0,
        deductionAdvance: 0,
        deductionOther: 0,
        deductionNotes: null,
        grossPay: 20000,
        totalDeductions: 0,
        netPay: 20000,
        payrollRun: { id: "run-1", status: "DRAFT" },
        employeeProfile: {
          payType: "MONTHLY",
          baseSalary: 20000,
          user: { id: "user-1", name: "Ram" },
        },
      } as any);

      mockPrisma.payrollRecord.update.mockResolvedValue({
        id: "rec-1",
        bonus: 3000,
        deductionSSF: 200,
        grossPay: 23000,
        totalDeductions: 200,
        netPay: 22800,
      } as any);

      const req = new NextRequest(
        "http://localhost/api/payroll/runs/run-1/records/rec-1",
        {
          method: "PATCH",
          body: JSON.stringify({
            bonus: 3000,
            deductionSSF: 200,
          }),
        }
      );

      const res = await PATCH_RECORD(req, {
        params: { id: "run-1", recordId: "rec-1" },
      });
      expect(res.status).toBe(200);

      // Verify server-side recalculation
      expect(mockPrisma.payrollRecord.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            grossPay: 23000, // 20000 + 0 + 3000 + 0
            totalDeductions: 200,
            netPay: 22800, // 23000 - 200
          }),
        })
      );
    });

    it("Step 4: Process payroll run (DRAFT -> PROCESSED)", async () => {
      mockPrisma.payrollRun.findUnique.mockResolvedValue({
        id: "run-1",
        status: "DRAFT",
        records: [
          { grossPay: 23000, totalDeductions: 200, netPay: 22800 },
          { grossPay: 15000, totalDeductions: 150, netPay: 14850 },
          { grossPay: 15000, totalDeductions: 0, netPay: 15000 },
        ],
      } as any);

      mockPrisma.payrollRun.update.mockResolvedValue({
        id: "run-1",
        status: "PROCESSED",
        totalGross: 53000,
        totalDeductions: 350,
        totalNet: 52650,
      } as any);

      const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
        method: "PATCH",
        body: JSON.stringify({ status: "PROCESSED" }),
      });

      const res = await PATCH_RUN(req, { params: { id: "run-1" } });
      expect(res.status).toBe(200);

      expect(mockPrisma.payrollRun.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "PROCESSED",
            totalGross: 53000,
            totalDeductions: 350,
            totalNet: 52650,
            employeeCount: 3,
          }),
        })
      );
    });

    it("Step 5: Mark as paid (PROCESSED -> PAID)", async () => {
      mockPrisma.payrollRun.findUnique.mockResolvedValue({
        id: "run-1",
        status: "PROCESSED",
        records: [],
      } as any);

      mockPrisma.payrollRun.update.mockResolvedValue({
        id: "run-1",
        status: "PAID",
      } as any);

      const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
        method: "PATCH",
        body: JSON.stringify({ status: "PAID" }),
      });

      const res = await PATCH_RUN(req, { params: { id: "run-1" } });
      expect(res.status).toBe(200);
    });
  });

  describe("Access control", () => {
    it("STAFF cannot access employees endpoint", async () => {
      mockGetServerSession.mockResolvedValue(staffSession as any);

      const req = new NextRequest("http://localhost/api/payroll/employees");
      const res = await GET_EMPLOYEES(req);
      expect(res.status).toBe(403);
    });

    it("STAFF cannot access runs endpoint", async () => {
      mockGetServerSession.mockResolvedValue(staffSession as any);

      const req = new NextRequest("http://localhost/api/payroll/runs");
      const res = await GET_RUNS(req);
      expect(res.status).toBe(403);
    });

    it("STAFF cannot edit payroll records", async () => {
      mockGetServerSession.mockResolvedValue(staffSession as any);

      const req = new NextRequest(
        "http://localhost/api/payroll/runs/run-1/records/rec-1",
        {
          method: "PATCH",
          body: JSON.stringify({ bonus: 1000 }),
        }
      );
      const res = await PATCH_RECORD(req, {
        params: { id: "run-1", recordId: "rec-1" },
      });
      expect(res.status).toBe(403);
    });

    it("Unauthenticated users get 401 on all payroll endpoints", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const empReq = new NextRequest(
        "http://localhost/api/payroll/employees"
      );
      expect((await GET_EMPLOYEES(empReq)).status).toBe(401);

      const runReq = new NextRequest("http://localhost/api/payroll/runs");
      expect((await GET_RUNS(runReq)).status).toBe(401);
    });
  });

  describe("Data integrity", () => {
    it("Cannot create duplicate employee profile for same user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockPrisma.employeeProfile.findUnique.mockResolvedValue({
        id: "emp-existing",
      } as any);

      const req = new NextRequest("http://localhost/api/payroll/employees", {
        method: "POST",
        body: JSON.stringify({
          userId: "user-1",
          locationId: "loc-1",
          department: "Service",
          payType: "MONTHLY",
          baseSalary: 20000,
          joiningDate: "2025-01-15",
        }),
      });

      const res = await POST_EMPLOYEE(req);
      expect(res.status).toBe(409);
    });

    it("Cannot create duplicate payroll run for same period+location", async () => {
      mockPrisma.payrollRun.findFirst.mockResolvedValue({
        id: "existing-run",
      } as any);

      const req = new NextRequest("http://localhost/api/payroll/runs", {
        method: "POST",
        body: JSON.stringify({
          periodLabel: "2026-06",
          periodStart: "2026-06-01",
          periodEnd: "2026-06-30",
        }),
      });

      const res = await POST_RUN(req);
      expect(res.status).toBe(409);
    });

    it("Cannot edit records in PAID run", async () => {
      mockPrisma.payrollRecord.findUnique.mockResolvedValue({
        id: "rec-1",
        payrollRunId: "run-1",
        baseSalary: 20000,
        overtime: 0,
        bonus: 0,
        allowance: 0,
        deductionSSF: 0,
        deductionTax: 0,
        deductionAdvance: 0,
        deductionOther: 0,
        payrollRun: { id: "run-1", status: "PAID" },
        employeeProfile: { payType: "MONTHLY", baseSalary: 20000 },
      } as any);

      const req = new NextRequest(
        "http://localhost/api/payroll/runs/run-1/records/rec-1",
        {
          method: "PATCH",
          body: JSON.stringify({ bonus: 5000 }),
        }
      );

      const res = await PATCH_RECORD(req, {
        params: { id: "run-1", recordId: "rec-1" },
      });
      expect(res.status).toBe(400);
    });

    it("Cannot delete non-DRAFT run", async () => {
      mockPrisma.payrollRun.findUnique.mockResolvedValue({
        id: "run-1",
        status: "PAID",
      } as any);

      const req = new NextRequest("http://localhost/api/payroll/runs/run-1", {
        method: "DELETE",
      });
      const res = await DELETE_RUN(req, { params: { id: "run-1" } });
      expect(res.status).toBe(400);
    });
  });
});
