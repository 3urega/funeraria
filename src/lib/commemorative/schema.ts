import { z } from "zod";

export const createCommemorativeMessageSchema = z.object({
  obituaryId: z.string().min(1),
  senderName: z.string().trim().min(1).max(200),
  messageText: z.string().trim().min(1).max(4000),
});

export type CreateCommemorativeMessageInput = z.infer<
  typeof createCommemorativeMessageSchema
>;
