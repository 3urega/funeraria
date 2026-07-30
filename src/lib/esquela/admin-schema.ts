import { z } from "zod";

export const createEsquelaSchema = z.object({
  name: z.string().min(1),
  deathPlace: z.string().min(1),
  deathDay: z.string().min(1),
  ageAtDeath: z.coerce.number().int().positive(),
  funeralDatetime: z.string().min(1),
  churchId: z.string().min(1),
  cemeteryId: z.string().min(1),
  wakeRoomId: z.string().min(1),
  wakeSchedule: z.string().min(1),
  mortuaryAddress: z.string().optional(),
  showEpd: z.boolean().optional().default(true),
  visitCode: z.string().min(4),
  expedientCode: z.string().optional(),
  isActive: z.boolean(),
  isVisible: z.boolean(),
  isReady: z.boolean(),
});

export type CreateEsquelaInput = z.infer<typeof createEsquelaSchema>;

export const updateEsquelaSchema = createEsquelaSchema;
export type UpdateEsquelaInput = z.infer<typeof updateEsquelaSchema>;
