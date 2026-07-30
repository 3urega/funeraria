import { z } from "zod";

export const patchWakeRoomActiveSchema = z.object({
  isActive: z.boolean(),
});

export type PatchWakeRoomActiveInput = z.infer<typeof patchWakeRoomActiveSchema>;
