/**
 * API Input Validation Schemas
 * Using Zod for runtime type checking and validation
 */

import { z } from "zod";

// ============= COMMON VALIDATORS =============

export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(5, "Email must be at least 5 characters")
  .max(100, "Email must not exceed 100 characters")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)"
  );

export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must not exceed 50 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens"
  )
  .trim();

export const cuidSchema = z
  .string()
  .regex(/^c[a-z0-9]{24}$/i, "Invalid ID format");

// ============= ORDER VALIDATION =============

export const orderQuerySchema = z.object({
  locationId: cuidSchema.optional(),
  status: z
    .enum(["PENDING", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"])
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .optional(),
  offset: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(0))
    .optional(),
});

export const orderItemSchema = z.object({
  productId: cuidSchema,
  quantity: z.number().int().min(1).max(100, "Quantity cannot exceed 100"),
  price: z.number().positive("Price must be positive"),
  notes: z.string().max(500, "Notes must not exceed 500 characters").optional(),
});

export const createOrderSchema = z.object({
  tableId: cuidSchema.optional(),
  locationId: cuidSchema,
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item")
    .max(50, "Order cannot exceed 50 items"),
  notes: z.string().max(1000, "Notes must not exceed 1000 characters").optional(),
  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .default(0),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"]),
});

export const completeOrderPaymentSchema = z.object({
  paymentMethod: z.enum(["CASH", "ESEWA", "FONEPAY", "BANK_TRANSFER"]),
});

// ============= PRODUCT VALIDATION =============

export const productQuerySchema = z.object({
  category: z.string().max(50).optional(),
  isAvailable: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  search: z.string().max(100, "Search query too long").optional(),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  category: z.string().min(1, "Category is required").max(50),
  price: z
    .number()
    .positive("Price must be positive")
    .max(100000, "Price seems unreasonably high"),
  isAvailable: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

// ============= USER VALIDATION =============

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN", "STAFF", "KITCHEN_STAFF"]),
  locationId: cuidSchema.optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),
  email: emailSchema.optional(),
  role: z.enum(["ADMIN", "STAFF", "KITCHEN_STAFF"]).optional(),
  locationId: cuidSchema.optional().nullable(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// ============= LOCATION VALIDATION =============

export const createLocationSchema = z.object({
  name: z
    .string()
    .min(2, "Location name must be at least 2 characters")
    .max(100, "Location name must not exceed 100 characters")
    .trim(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters")
    .trim(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .max(20, "Phone number must not exceed 20 characters")
    .optional(),
});

export const updateLocationSchema = createLocationSchema.partial();

// ============= TABLE VALIDATION =============

export const createTableSchema = z.object({
  number: z
    .string()
    .min(1, "Table number is required")
    .max(10, "Table number must not exceed 10 characters")
    .trim(),
  capacity: z
    .number()
    .int()
    .min(1, "Capacity must be at least 1")
    .max(20, "Capacity seems unreasonably high"),
  locationId: cuidSchema,
});

export const updateTableStatusSchema = z.object({
  status: z.enum(["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"]),
});

// ============= TENANT VALIDATION (Super Admin) =============

export const createTenantSchema = z.object({
  slug: slugSchema,
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must not exceed 100 characters")
    .trim(),
  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must not exceed 100 characters")
    .trim(),
  contactEmail: emailSchema,
  contactPhone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .max(20, "Phone number must not exceed 20 characters")
    .optional(),
  ownerPassword: passwordSchema,
});

export const createPaymentRecordSchema = z.object({
  amount: z.number().positive("Payment amount must be positive"),
  paymentDate: z.string().datetime("Invalid payment date"),
  paymentMethod: z
    .string()
    .min(2, "Payment method is required")
    .max(50, "Payment method must not exceed 50 characters"),
  referenceNumber: z
    .string()
    .max(100, "Reference number must not exceed 100 characters")
    .optional(),
  billingPeriodStart: z.string().datetime("Invalid billing period start date"),
  billingPeriodEnd: z.string().datetime("Invalid billing period end date"),
  notes: z.string().max(1000, "Notes must not exceed 1000 characters").optional(),
});

// ============= INVENTORY VALIDATION =============

export const createInventorySchema = z.object({
  name: z
    .string()
    .min(2, "Inventory item name must be at least 2 characters")
    .max(100, "Inventory item name must not exceed 100 characters")
    .trim(),
  unit: z
    .string()
    .min(1, "Unit is required")
    .max(20, "Unit must not exceed 20 characters")
    .trim(),
  locationId: cuidSchema,
});

export const updateInventoryItemSchema = z.object({
  currentStock: z
    .number()
    .min(0, "Stock cannot be negative")
    .max(1000000, "Stock value seems unreasonably high"),
  minimumStock: z
    .number()
    .min(0, "Minimum stock cannot be negative")
    .max(1000000, "Stock value seems unreasonably high"),
  maximumStock: z
    .number()
    .positive("Maximum stock must be positive")
    .max(1000000, "Stock value seems unreasonably high")
    .optional(),
});

// ============= HELPER FUNCTION FOR VALIDATION =============

/**
 * Validates request data against a Zod schema
 * Returns validated data or throws an error with detailed messages
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
      throw new Error(`Validation failed: ${messages.join(", ")}`);
    }
    throw error;
  }
}

/**
 * Safely validates and returns validation result with success flag
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
      return { success: false, error: messages.join(", ") };
    }
    return { success: false, error: "Unknown validation error" };
  }
}
