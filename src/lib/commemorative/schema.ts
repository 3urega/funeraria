import { z } from "zod";

export const createCommemorativeMessageSchema = z.object({
  obituaryId: z.string().min(1),
  senderName: z.string().trim().min(1).max(200),
  messageText: z.string().trim().min(1).max(4000),
});

export type CreateCommemorativeMessageInput = z.infer<
  typeof createCommemorativeMessageSchema
>;

export const updateCommemorativeMessageReviewedSchema = z.object({
  reviewed: z.boolean(),
});

export type UpdateCommemorativeMessageReviewedInput = z.infer<
  typeof updateCommemorativeMessageReviewedSchema
>;

export const markObituaryMessagesReviewedSchema = z.object({
  obituaryId: z.string().min(1),
});

export type MarkObituaryMessagesReviewedInput = z.infer<
  typeof markObituaryMessagesReviewedSchema
>;
