import { z } from "zod";

const cuidSchema = z.string().min(1, "ID is required");

const stockField = z
  .number({ invalid_type_error: "Must be a number" })
  .min(0, "Cannot be negative")
  .max(999999, "Value too large");

export const createInventoryItemSchema = z.object({
  inventoryId: cuidSchema,
  productId: cuidSchema.optional().nullable(),
  currentStock: stockField,
  minimumStock: stockField,
  maximumStock: stockField.optional().nullable(),
});

export const updateInventoryItemSchema = z.object({
  currentStock: stockField.optional(),
  minimumStock: stockField.optional(),
  maximumStock: stockField.optional().nullable(),
});

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;
