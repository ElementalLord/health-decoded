import { z } from "zod";

import {
  AI_MAX_MESSAGE_CHARACTERS,
  AI_MAX_MESSAGE_COUNT,
  AI_MAX_TOTAL_MESSAGE_CHARACTERS,
} from "@/features/ai/constants/ai-limits";

const markupPattern = /<\/?[a-z][^>]*>/i;

const aiMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z
      .string()
      .trim()
      .min(1)
      .max(AI_MAX_MESSAGE_CHARACTERS)
      .refine((value) => !markupPattern.test(value), "Messages must be plain text."),
  })
  .strict();

export const aiChatRequestSchema = z
  .object({
    messages: z.array(aiMessageSchema).min(1).max(AI_MAX_MESSAGE_COUNT),
  })
  .strict()
  .superRefine((value, context) => {
    const totalCharacters = value.messages.reduce(
      (total, message) => total + message.content.length,
      0,
    );

    if (totalCharacters > AI_MAX_TOTAL_MESSAGE_CHARACTERS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The request is too long.",
        path: ["messages"],
      });
    }
  });

export const aiUnavailableResponseSchema = z
  .object({
    error: z
      .object({
        code: z.literal("AI_NOT_AVAILABLE"),
        message: z.literal("The AI assistant is not available yet."),
      })
      .strict(),
  })
  .strict();

/** Server-side configuration shape; never accepted from a browser request. */
export const aiProviderConfigurationSchema = z
  .object({
    provider: z.literal("anthropic"),
  })
  .strict();
