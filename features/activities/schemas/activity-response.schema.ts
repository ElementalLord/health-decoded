import { z } from "zod";

const stableIdentifier = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(64);

export const matchPairResponseSchema = z
  .object({
    activityId: z.string().uuid(),
    lessonProgressId: z.string().uuid(),
    pairs: z.record(stableIdentifier, stableIdentifier),
  })
  .strict()
  .superRefine((value, context) => {
    const entries = Object.entries(value.pairs);
    if (entries.length < 2 || entries.length > 6) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Complete each matching pair before continuing.",
      });
    }

    if (new Set(Object.values(value.pairs)).size !== entries.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each description can be matched only once.",
      });
    }
  });
