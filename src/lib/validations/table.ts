import { z } from "zod";
import { TableStatus } from "@prisma/client";

export const createTableSchema = z.object({
  number: z.string().min(1, "Table number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  locationId: z.string().min(1, "Location is required"),
  status: z.nativeEnum(TableStatus).default("AVAILABLE"),
});

export const updateTableSchema = createTableSchema.partial();

export const updateTableStatusSchema = z.object({
  status: z.nativeEnum(TableStatus),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>;
