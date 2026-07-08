import { z } from "zod";
import { FLOWER_ORDER_STATUSES } from "./types";

export const createFlowerProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  priceCents: z.number().int().min(1),
  currency: z.string().trim().min(3).max(3).default("EUR"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateFlowerProductSchema = createFlowerProductSchema.partial();

export const flowerCheckoutSchema = z.object({
  obituaryId: z.string().min(1),
  productId: z.string().min(1),
  dedicationText: z.string().trim().min(1).max(500),
  buyerName: z.string().trim().min(1).max(200),
  buyerEmail: z.string().trim().email().max(200),
  buyerPhone: z.string().trim().min(1).max(50),
});

export const updateFlowerOrderStatusSchema = z.object({
  status: z.enum(FLOWER_ORDER_STATUSES),
});

export type CreateFlowerProductInput = z.infer<typeof createFlowerProductSchema>;
export type UpdateFlowerProductInput = z.infer<typeof updateFlowerProductSchema>;
export type FlowerCheckoutInput = z.infer<typeof flowerCheckoutSchema>;
