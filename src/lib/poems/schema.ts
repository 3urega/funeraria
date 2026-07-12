import { z } from "zod";

export const createPoemTemplateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  text: z.string().trim().min(1).max(10000),
  isActive: z.boolean().default(true),
});

export const updatePoemTemplateSchema = createPoemTemplateSchema.partial();

export type CreatePoemTemplateInput = z.infer<typeof createPoemTemplateSchema>;
export type UpdatePoemTemplateInput = z.infer<typeof updatePoemTemplateSchema>;
