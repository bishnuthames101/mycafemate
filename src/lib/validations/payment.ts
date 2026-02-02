import { z } from "zod";

// Payment Method enum
export const PaymentMethod = z.enum(["CASH", "ESEWA", "FONEPAY", "BANK_TRANSFER", "CREDIT"]);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

// Payment Status enum
export const PaymentStatus = z.enum(["PENDING", "PAID", "REFUNDED"]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

// Update payment schema (for order payments)
export const updatePaymentSchema = z
  .object({
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    creditorId: z
      .string()
      .regex(/^c[a-z0-9]{24}$/i, "Invalid creditor ID")
      .optional(),
  })
  .refine(
    (data) => {
      // If payment method is CREDIT, creditorId is required
      if (data.paymentMethod === "CREDIT") {
        return !!data.creditorId;
      }
      return true;
    },
    {
      message: "Creditor ID is required for credit payments",
      path: ["creditorId"],
    }
  );

// Payment record schema (for super admin recording tenant payments)
export const createPaymentRecordSchema = z.object({
  amount: z
    .number()
    .positive("Payment amount must be positive")
    .max(1000000, "Payment amount seems unreasonably high"),
  paymentDate: z
    .string()
    .datetime("Invalid payment date format"),
  paymentMethod: z
    .string()
    .min(2, "Payment method is required")
    .max(50, "Payment method must not exceed 50 characters")
    .trim(),
  referenceNumber: z
    .string()
    .max(100, "Reference number must not exceed 100 characters")
    .trim()
    .optional(),
  billingPeriodStart: z
    .string()
    .datetime("Invalid billing period start date"),
  billingPeriodEnd: z
    .string()
    .datetime("Invalid billing period end date"),
  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .trim()
    .optional(),
}).refine(
  (data) => {
    const start = new Date(data.billingPeriodStart);
    const end = new Date(data.billingPeriodEnd);
    return end > start;
  },
  {
    message: "Billing period end must be after start",
    path: ["billingPeriodEnd"],
  }
);

export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CreatePaymentRecordInput = z.infer<typeof createPaymentRecordSchema>;
