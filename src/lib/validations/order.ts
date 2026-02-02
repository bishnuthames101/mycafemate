import { z } from "zod";
import { OrderStatus, PaymentMethod } from "@prisma/client";

// CUID validation helper
const cuidSchema = z
  .string()
  .regex(/^c[a-z0-9]{24}$/i, "Invalid ID format");

export const orderItemSchema = z.object({
  productId: cuidSchema,
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100 per item"),
  price: z.number().positive("Price must be positive").max(100000, "Price seems unreasonably high"),
  notes: z.string().max(500, "Item notes must not exceed 500 characters").optional(),
});

export const createOrderSchema = z.object({
  tableId: z.string().optional(), // Optional for takeaway orders
  locationId: cuidSchema,
  staffId: cuidSchema,
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Order cannot exceed 50 items"),
  notes: z.string().max(1000, "Order notes must not exceed 1000 characters").optional(),
  includeTax: z.boolean().optional().default(true),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const completeOrderPaymentSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
});

// Query parameter validation for GET /api/orders
export const orderQuerySchema = z.object({
  locationId: cuidSchema.optional(),
  status: z
    .string()
    .refine(
      (val) => {
        const statuses = val.split(',');
        return statuses.every(s => Object.values(OrderStatus).includes(s as OrderStatus));
      },
      { message: "Invalid status value" }
    )
    .optional(),
  tableId: cuidSchema.optional(),
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

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type CompleteOrderPaymentInput = z.infer<typeof completeOrderPaymentSchema>;
