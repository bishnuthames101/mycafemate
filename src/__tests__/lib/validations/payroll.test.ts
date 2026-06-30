import { describe, it, expect } from "vitest";
import {
  createEmployeeProfileSchema,
  updateEmployeeProfileSchema,
  createPayrollRunSchema,
  updatePayrollRunStatusSchema,
  updatePayrollRecordSchema,
} from "@/lib/validations/payroll";

// ============= createEmployeeProfileSchema =============
describe("createEmployeeProfileSchema", () => {
  const validInput = {
    userId: "user-1",
    locationId: "loc-1",
    department: "Service",
    payType: "MONTHLY" as const,
    baseSalary: 20000,
    joiningDate: "2025-01-15",
  };

  it("accepts valid input with all required fields", () => {
    const result = createEmployeeProfileSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all optional fields", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      designation: "Head Barista",
      bankName: "NMB Bank",
      bankAccountNo: "123456",
      bankBranch: "Kathmandu",
      notes: "Test note",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing userId", () => {
    const { userId, ...rest } = validInput;
    const result = createEmployeeProfileSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects empty userId", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      userId: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative salary", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      baseSalary: -1000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero salary", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      baseSalary: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects unreasonably high salary", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      baseSalary: 99999999,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid payType", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      payType: "WEEKLY",
    });
    expect(result.success).toBe(false);
  });

  it("accepts DAILY payType", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      payType: "DAILY",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing joiningDate", () => {
    const { joiningDate, ...rest } = validInput;
    const result = createEmployeeProfileSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("trims department whitespace", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      department: "  Kitchen  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.department).toBe("Kitchen");
    }
  });

  it("transforms empty optional strings to undefined", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      bankName: "",
      designation: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bankName).toBeUndefined();
      expect(result.data.designation).toBeUndefined();
    }
  });

  it("rejects department exceeding 100 characters", () => {
    const result = createEmployeeProfileSchema.safeParse({
      ...validInput,
      department: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

// ============= updateEmployeeProfileSchema =============
describe("updateEmployeeProfileSchema", () => {
  it("accepts empty object (all fields optional)", () => {
    const result = updateEmployeeProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial updates", () => {
    const result = updateEmployeeProfileSchema.safeParse({
      baseSalary: 25000,
      department: "Kitchen",
    });
    expect(result.success).toBe(true);
  });

  it("accepts isActive flag", () => {
    const result = updateEmployeeProfileSchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it("accepts nullable fields", () => {
    const result = updateEmployeeProfileSchema.safeParse({
      designation: null,
      bankName: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid salary", () => {
    const result = updateEmployeeProfileSchema.safeParse({
      baseSalary: -500,
    });
    expect(result.success).toBe(false);
  });
});

// ============= createPayrollRunSchema =============
describe("createPayrollRunSchema", () => {
  const validInput = {
    periodLabel: "2026-06",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
  };

  it("accepts valid input", () => {
    const result = createPayrollRunSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts with optional locationId", () => {
    const result = createPayrollRunSchema.safeParse({
      ...validInput,
      locationId: "loc-1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid periodLabel format", () => {
    const result = createPayrollRunSchema.safeParse({
      ...validInput,
      periodLabel: "June 2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects periodLabel with wrong separator", () => {
    const result = createPayrollRunSchema.safeParse({
      ...validInput,
      periodLabel: "2026/06",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when periodEnd is before periodStart", () => {
    const result = createPayrollRunSchema.safeParse({
      ...validInput,
      periodStart: "2026-06-30",
      periodEnd: "2026-06-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing periodStart", () => {
    const { periodStart, ...rest } = validInput;
    const result = createPayrollRunSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("transforms empty locationId to undefined", () => {
    const result = createPayrollRunSchema.safeParse({
      ...validInput,
      locationId: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locationId).toBeUndefined();
    }
  });
});

// ============= updatePayrollRunStatusSchema =============
describe("updatePayrollRunStatusSchema", () => {
  it("accepts PROCESSED status", () => {
    const result = updatePayrollRunStatusSchema.safeParse({
      status: "PROCESSED",
    });
    expect(result.success).toBe(true);
  });

  it("accepts PAID status", () => {
    const result = updatePayrollRunStatusSchema.safeParse({ status: "PAID" });
    expect(result.success).toBe(true);
  });

  it("rejects DRAFT status (cannot transition to DRAFT)", () => {
    const result = updatePayrollRunStatusSchema.safeParse({ status: "DRAFT" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = updatePayrollRunStatusSchema.safeParse({
      status: "CANCELLED",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional notes", () => {
    const result = updatePayrollRunStatusSchema.safeParse({
      status: "PAID",
      notes: "Paid via bank transfer",
    });
    expect(result.success).toBe(true);
  });
});

// ============= updatePayrollRecordSchema =============
describe("updatePayrollRecordSchema", () => {
  it("accepts empty object (all optional)", () => {
    const result = updatePayrollRecordSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts valid earnings", () => {
    const result = updatePayrollRecordSchema.safeParse({
      overtime: 2000,
      bonus: 5000,
      allowance: 1000,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid deductions", () => {
    const result = updatePayrollRecordSchema.safeParse({
      deductionSSF: 200,
      deductionTax: 1500,
      deductionAdvance: 3000,
      deductionOther: 500,
      deductionNotes: "Uniform cost",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative overtime", () => {
    const result = updatePayrollRecordSchema.safeParse({ overtime: -100 });
    expect(result.success).toBe(false);
  });

  it("rejects negative deductions", () => {
    const result = updatePayrollRecordSchema.safeParse({
      deductionSSF: -50,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid daysWorked", () => {
    const result = updatePayrollRecordSchema.safeParse({ daysWorked: 25 });
    expect(result.success).toBe(true);
  });

  it("rejects daysWorked > 31", () => {
    const result = updatePayrollRecordSchema.safeParse({ daysWorked: 32 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer daysWorked", () => {
    const result = updatePayrollRecordSchema.safeParse({ daysWorked: 20.5 });
    expect(result.success).toBe(false);
  });

  it("accepts nullable daysWorked", () => {
    const result = updatePayrollRecordSchema.safeParse({ daysWorked: null });
    expect(result.success).toBe(true);
  });

  it("rejects overly large values", () => {
    const result = updatePayrollRecordSchema.safeParse({
      bonus: 99999999,
    });
    expect(result.success).toBe(false);
  });
});
