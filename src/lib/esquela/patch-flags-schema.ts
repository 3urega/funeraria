import { z } from "zod";

export const patchObituaryFlagsSchema = z
  .object({
    isActive: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    isReady: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.isActive !== undefined ||
      data.isVisible !== undefined ||
      data.isReady !== undefined,
    { message: "At least one flag required" },
  );

export type PatchObituaryFlagsInput = z.infer<typeof patchObituaryFlagsSchema>;
