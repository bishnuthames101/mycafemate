import { z } from "zod";
import { emailSchema, passwordSchema } from "./user";

// Slug validation for tenant subdomain
export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must not exceed 50 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens"
  )
  .trim();

// Phone number validation - allows empty string or valid phone
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || /^[0-9+\-\s()]+$/.test(val),
    "Invalid phone number format"
  )
  .refine(
    (val) => val === "" || val.length <= 20,
    "Phone number must not exceed 20 characters"
  )
  .optional()
  .transform((val) => val === "" ? undefined : val);

// Create tenant schema (for API with auto-generated passwords)
export const createTenantSchema = z.object({
  slug: slugSchema,
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must not exceed 100 characters")
    .trim(),
  contactEmail: emailSchema,
  contactPhone: phoneSchema,
  trialDays: z
    .number()
    .int()
    .min(1, "Trial period must be at least 1 day")
    .max(90, "Trial period cannot exceed 90 days")
    .optional()
    .default(14),
});

// Create tenant schema with custom password (for manual tenant creation)
export const createTenantWithPasswordSchema = createTenantSchema.extend({
  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must not exceed 100 characters")
    .trim(),
  ownerPassword: passwordSchema,
});

// Update tenant schema
export const updateTenantSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must not exceed 100 characters")
    .trim()
    .optional(),
  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must not exceed 100 characters")
    .trim()
    .optional(),
  contactEmail: emailSchema.optional(),
  contactPhone: phoneSchema.optional(),
  monthlyFee: z
    .number()
    .positive("Monthly fee must be positive")
    .max(100000, "Monthly fee seems unreasonably high")
    .optional(),
  maxLocations: z
    .number()
    .int()
    .min(1, "Must allow at least 1 location")
    .max(100, "Maximum locations cannot exceed 100")
    .optional(),
  maxUsers: z
    .number()
    .int()
    .min(1, "Must allow at least 1 user")
    .max(1000, "Maximum users cannot exceed 1000")
    .optional(),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
