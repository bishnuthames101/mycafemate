import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .trim()
    .optional(),
  category: z.string().min(1, "Category is required").max(50),
  price: z
    .number()
    .positive("Price must be positive")
    .max(100000, "Price seems unreasonably high")
    .refine((val) => Number.isFinite(val), {
      message: "Price must be a valid number"
    }),
  isAvailable: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

// Query parameter validation for GET /api/products
export const productQuerySchema = z.object({
  category: z.string().max(50).optional(),
  isAvailable: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  search: z
    .string()
    .max(100, "Search query too long")
    .trim()
    .optional(),
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

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
