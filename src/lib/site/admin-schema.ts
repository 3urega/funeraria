import { z } from "zod";

const contactSchema = z.object({
  phone: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(200),
  address: z.string().trim().min(1).max(300),
  website: z.string().trim().max(200).optional().nullable(),
  whatsapp: z.string().trim().max(30).optional().nullable(),
});

const themeSchema = z.object({
  primary: z.string().trim().min(4).max(20),
  dark: z.string().trim().min(4).max(20),
  muted: z.string().trim().min(4).max(20),
  background: z.string().trim().min(4).max(20),
  heroImagePath: z.string().trim().max(500).optional(),
  publicLogoPath: z.string().trim().max(500).optional(),
});

export const updateSiteConfigSchema = z.object({
  brandName: z.string().trim().min(1).max(200),
  mortuaryDefault: z.string().trim().max(300).optional().nullable(),
  contact: contactSchema,
  theme: themeSchema,
});

export type UpdateSiteConfigInput = z.infer<typeof updateSiteConfigSchema>;
