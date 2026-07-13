import { z } from "zod";

const stableIdentifier = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(64);
const activityItemSchema = z
  .object({
    id: stableIdentifier,
    label: z.string().trim().min(1).max(120),
  })
  .strict();

function hasDuplicateIdentifiers(items: { id: string }[]) {
  return new Set(items.map((item) => item.id)).size !== items.length;
}

export const matchPairConfigurationSchema = z
  .object({
    prompt: z.string().trim().min(1).max(300),
    helper_text: z.string().trim().min(1).max(200).optional(),
    left_items: z.array(activityItemSchema).min(2).max(6),
    right_items: z.array(activityItemSchema).min(2).max(6),
    feedback: z
      .object({
        correct: z.string().trim().min(1).max(300),
        retry: z.string().trim().min(1).max(300),
      })
      .strict(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.left_items.length !== value.right_items.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Matching sides must contain the same number of items.",
      });
    }

    if (hasDuplicateIdentifiers(value.left_items) || hasDuplicateIdentifiers(value.right_items)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Matching item identifiers must be unique.",
      });
    }
  });

export const publicActivitySchema = z
  .object({
    activity_type: z.literal("match_pair"),
    configuration: matchPairConfigurationSchema,
    id: z.string().uuid(),
    instructions: z.string().trim().min(1).max(300),
    title: z.string().trim().min(1).max(120),
  })
  .strict();
