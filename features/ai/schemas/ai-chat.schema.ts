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

const assistantHistoryText = z
  .string()
  .trim()
  .min(1)
  .max(AI_MAX_OUTPUT_CHARACTERS)
  .refine((value) => !markupPattern.test(value), "Messages must be plain text.");

export const aiChatRequestSchema = z
  .object({
    message: plainTextMessage,
    messages: z
      .array(
        z.discriminatedUnion("role", [
          z.object({ content: assistantHistoryText, role: z.literal("assistant") }).strict(),
          z.object({ content: plainTextMessage, role: z.literal("user") }).strict(),
        ]),
      )
      .max(AI_MAX_CONVERSATION_MESSAGES)
      .optional(),
  })
  .strict();

export type AiChatRequestInput = z.infer<typeof aiChatRequestSchema>;

export const aiChatResponseSchema = z
  .object({
    assistantMessage: z.string().trim().min(1).max(AI_MAX_OUTPUT_CHARACTERS),
  })
  .strict();

export const aiChatStreamEventSchema = z.discriminatedUnion("type", [
  z.object({ text: z.string().min(1), type: z.literal("delta") }).strict(),
  z
    .object({
      lessonUsed: z.boolean(),
      relatedContent: z
        .array(
          z
            .object({
              href: z.string().startsWith("/"),
              kind: z.enum(["caregiver", "lesson", "medication", "story"]),
              title: z.string().trim().min(1).max(180),
            })
            .strict(),
        )
        .max(4),
      suggestedQuestions: z.array(plainTextMessage).min(1).max(3),
      type: z.literal("context"),
    })
    .strict(),
  z
    .object({
      code: z.enum(["AI_CONFIGURATION_ERROR", "AI_RATE_LIMITED", "AI_TIMEOUT", "AI_UNAVAILABLE"]),
      type: z.literal("error"),
    })
    .strict(),
  z.object({ type: z.literal("done") }).strict(),
]);

/** Server-side configuration shape; never accepted from a browser request. */
export const aiProviderConfigurationSchema = z
  .object({
    provider: z.literal("gemini"),
  })
  .strict();
