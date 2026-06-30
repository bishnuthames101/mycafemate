import { vi } from "vitest";

/**
 * Creates a mock Prisma client for testing payroll API routes.
 * All methods return vi.fn() so they can be configured per test.
 */
export function createMockPrisma() {
  return {
    employeeProfile: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      createMany: vi.fn(),
    },
    payrollRun: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    payrollRecord: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      createMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
    },
    location: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
    },
    $transaction: vi.fn(async (fn: any) => fn(createMockPrisma())),
  };
}

/**
 * Sample test data for payroll tests
 */
export const sampleEmployee = {
  id: "emp-1",
  userId: "user-1",
  locationId: "location-1",
  department: "Service",
  designation: "Head Barista",
  payType: "MONTHLY",
  baseSalary: 20000,
  bankName: "NMB Bank",
  bankAccountNo: "1234567890",
  bankBranch: "Kathmandu",
  joiningDate: new Date("2025-01-15"),
  isActive: true,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: { id: "user-1", name: "Ram Sharma", email: "ram@test.com", role: "STAFF" },
  location: { id: "location-1", name: "Main Branch" },
  _count: { payrollRecords: 3 },
};

export const samplePayrollRun = {
  id: "run-1",
  periodLabel: "2026-06",
  periodStart: new Date("2026-06-01"),
  periodEnd: new Date("2026-06-30"),
  locationId: null,
  status: "DRAFT",
  totalGross: 60000,
  totalDeductions: 0,
  totalNet: 60000,
  employeeCount: 3,
  notes: null,
  processedById: "admin-user-1",
  processedBy: { id: "admin-user-1", name: "Test Admin" },
  location: null,
  records: [],
  _count: { records: 3 },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const samplePayrollRecord = {
  id: "rec-1",
  payrollRunId: "run-1",
  employeeProfileId: "emp-1",
  baseSalary: 20000,
  daysWorked: null,
  overtime: 0,
  bonus: 0,
  allowance: 0,
  grossPay: 20000,
  deductionSSF: 0,
  deductionTax: 0,
  deductionAdvance: 0,
  deductionOther: 0,
  deductionNotes: null,
  totalDeductions: 0,
  netPay: 20000,
  createdAt: new Date(),
  payrollRun: { id: "run-1", status: "DRAFT" },
  employeeProfile: {
    payType: "MONTHLY",
    baseSalary: 20000,
    user: { id: "user-1", name: "Ram Sharma" },
  },
};
