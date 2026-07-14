import { z } from "zod";

import {
  AI_MAX_CONVERSATION_MESSAGES,
  AI_MAX_MESSAGE_CHARACTERS,
  AI_MAX_OUTPUT_CHARACTERS,
} from "@/features/ai/constants/ai-limits";

const markupPattern = /<\/?[a-z][^>]*>/i;

const plainTextMessage = z
  .string()
  .trim()
  .min(1)
  .max(AI_MAX_MESSAGE_CHARACTERS)
  .refine((value) => !markupPattern.test(value), "Messages must be plain text.");

export const aiChatRequestSchema = z
  .object({
    conversationId: z.string().uuid().optional(),
    message: plainTextMessage,
    messages: z
      .array(
        z
          .object({
            content: plainTextMessage,
            role: z.enum(["assistant", "user"]),
          })
          .strict(),
      )
      .max(AI_MAX_CONVERSATION_MESSAGES)
      .optional(),
    lessonId: z.string().uuid().optional(),
    medicationId: z.string().uuid().optional(),
  })
  .strict();

export type AiChatRequestInput = z.infer<typeof aiChatRequestSchema>;

export const aiChatResponseSchema = z
  .object({
    assistantMessage: z.string().trim().min(1).max(AI_MAX_OUTPUT_CHARACTERS),
  })
  .strict();

/** Server-side configuration shape; never accepted from a browser request. */
export const aiProviderConfigurationSchema = z
  .object({
    provider: z.literal("gemini"),
  })
  .strict();
