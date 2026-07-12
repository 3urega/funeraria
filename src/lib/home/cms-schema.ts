import { z } from "zod";
import { HOME_SECTION_KEYS } from "@/lib/home/defaults";

const localizedSchema = z.object({
  ca: z.string(),
  es: z.string(),
});

export const homeSectionKeySchema = z.enum(HOME_SECTION_KEYS);

export const updateContentSectionSchema = z.object({
  contentI18n: z.record(z.string(), z.unknown()),
  isPublished: z.boolean(),
});

export type UpdateContentSectionInput = z.infer<typeof updateContentSectionSchema>;

export { localizedSchema };
