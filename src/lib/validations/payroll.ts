import { z } from "zod";

// ============= Employee Profile Schemas =============

export const createEmployeeProfileSchema = z.object({
  userId: z.string().min(1, "User is required"),
  locationId: z.string().min(1, "Location is required"),
  department: z
    .string()
    .min(1, "Department is required")
    .max(100, "Department must not exceed 100 characters")
    .trim()
    .default("General"),
  designation: z
    .string()
    .max(100, "Designation must not exceed 100 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional(),
  payType: z.enum(["MONTHLY", "DAILY"], {
    errorMap: () => ({ message: "Pay type must be MONTHLY or DAILY" }),
  }),
  baseSalary: z
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be positive")
    .max(10000000, "Salary seems unreasonably high"),
  bankName: z
    .string()
    .max(100, "Bank name must not exceed 100 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional(),
  bankAccountNo: z
    .string()
    .max(50, "Account number must not exceed 50 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional(),
  bankBranch: z
    .string()
    .max(100, "Branch must not exceed 100 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional(),
  joiningDate: z.string().min(1, "Joining date is required"),
  notes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional(),
});

export type CreateEmployeeProfileInput = z.infer<typeof createEmployeeProfileSchema>;

export const updateEmployeeProfileSchema = z.object({
  locationId: z.string().min(1, "Location is required").optional(),
  department: z
    .string()
    .min(1, "Department is required")
    .max(100, "Department must not exceed 100 characters")
    .trim()
    .optional(),
  designation: z
    .string()
    .max(100, "Designation must not exceed 100 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional()
    .nullable(),
  payType: z
    .enum(["MONTHLY", "DAILY"], {
      errorMap: () => ({ message: "Pay type must be MONTHLY or DAILY" }),
    })
    .optional(),
  baseSalary: z
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be positive")
    .max(10000000, "Salary seems unreasonably high")
    .optional(),
  bankName: z
    .string()
    .max(100)
    .trim()
    .transform((val) => val || undefined)
    .optional()
    .nullable(),
  bankAccountNo: z
    .string()
    .max(50)
    .trim()
    .transform((val) => val || undefined)
    .optional()
    .nullable(),
  bankBranch: z
    .string()
    .max(100)
    .trim()
    .transform((val) => val || undefined)
    .optional()
    .nullable(),
  joiningDate: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  notes: z
    .string()
    .max(500)
    .trim()
    .transform((val) => val || undefined)
    .optional()
    .nullable(),
});

export type UpdateEmployeeProfileInput = z.infer<typeof updateEmployeeProfileSchema>;

// ============= Payroll Run Schemas =============

export const createPayrollRunSchema = z
  .object({
    periodLabel: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format"),
    periodStart: z.string().min(1, "Period start is required"),
    periodEnd: z.string().min(1, "Period end is required"),
    locationId: z
      .string()
      .transform((val) => val || undefined)
      .optional(),
    notes: z
      .string()
      .max(500, "Notes must not exceed 500 characters")
      .trim()
      .transform((val) => val || undefined)
      .optional(),
  })
  .refine((data) => new Date(data.periodEnd) > new Date(data.periodStart), {
    message: "Period end must be after period start",
    path: ["periodEnd"],
  });

export type CreatePayrollRunInput = z.infer<typeof createPayrollRunSchema>;

export const updatePayrollRunStatusSchema = z.object({
  status: z.enum(["PROCESSED", "PAID"], {
    errorMap: () => ({ message: "Status must be PROCESSED or PAID" }),
  }),
  notes: z
    .string()
    .max(500)
    .trim()
    .transform((val) => val || undefined)
    .optional(),
});

export type UpdatePayrollRunStatusInput = z.infer<typeof updatePayrollRunStatusSchema>;

// ============= Payroll Record Schemas =============

export const updatePayrollRecordSchema = z.object({
  daysWorked: z
    .number({ invalid_type_error: "Days worked must be a number" })
    .int("Days worked must be a whole number")
    .min(0, "Days worked cannot be negative")
    .max(31, "Days worked cannot exceed 31")
    .optional()
    .nullable(),
  overtime: z
    .number({ invalid_type_error: "Overtime must be a number" })
    .min(0, "Overtime cannot be negative")
    .max(10000000, "Value too large")
    .optional(),
  bonus: z
    .number({ invalid_type_error: "Bonus must be a number" })
    .min(0, "Bonus cannot be negative")
    .max(10000000, "Value too large")
    .optional(),
  allowance: z
    .number({ invalid_type_error: "Allowance must be a number" })
    .min(0, "Allowance cannot be negative")
    .max(10000000, "Value too large")
    .optional(),
  deductionSSF: z
    .number({ invalid_type_error: "SSF deduction must be a number" })
    .min(0, "Deduction cannot be negative")
    .max(10000000, "Value too large")
    .optional(),
  deductionTax: z
    .number({ invalid_type_error: "Tax deduction must be a number" })
    .min(0, "Deduction cannot be negative")
    .max(10000000, "Value too large")
    .optional(),
  deductionAdvance: z
    .number({ invalid_type_error: "Advance deduction must be a number" })
    .min(0, "Deduction cannot be negative")
    .max(10000000, "Value too large")
    .optional(),
  deductionOther: z
    .number({ invalid_type_error: "Other deduction must be a number" })
    .min(0, "Deduction cannot be negative")
    .max(10000000, "Value too large")
    .optional(),
  deductionNotes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional()
    .nullable(),
});

export type UpdatePayrollRecordInput = z.infer<typeof updatePayrollRecordSchema>;
