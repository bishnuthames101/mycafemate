import { z } from "zod";

// Create creditor schema
export const createCreditorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  phone: z
    .string()
    .max(20, "Phone number must not exceed 20 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional(),
  email: z
    .string()
    .trim()
    .transform((val) => val || undefined)
    .pipe(z.string().email("Invalid email address").optional()),
  locationId: z
    .string()
    .regex(/^c[a-z0-9]{24}$/i, "Invalid location ID"),
});

// Update creditor schema (for editing creditor details)
export const updateCreditorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),
  phone: z
    .string()
    .max(20, "Phone number must not exceed 20 characters")
    .trim()
    .transform((val) => val || undefined)
    .optional(),
  email: z
    .string()
    .trim()
    .transform((val) => val || undefined)
    .pipe(z.string().email("Invalid email address").optional()),
});

// Record payment schema
export const recordPaymentSchema = z.object({
  amount: z
    .number()
    .positive("Payment amount must be positive")
    .max(10000000, "Payment amount seems unreasonably high"),
  paymentMethod: z.enum(["CASH", "ESEWA", "FONEPAY", "BANK_TRANSFER"]),
  notes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .trim()
    .optional(),
});

// Creditor search schema
export const creditorSearchSchema = z.object({
  q: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query must not exceed 100 characters"),
  locationId: z
    .string()
    .regex(/^c[a-z0-9]{24}$/i, "Invalid location ID"),
});

// TypeScript types
export type CreateCreditorInput = z.infer<typeof createCreditorSchema>;
export type UpdateCreditorInput = z.infer<typeof updateCreditorSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
export type CreditorSearchInput = z.infer<typeof creditorSearchSchema>;
