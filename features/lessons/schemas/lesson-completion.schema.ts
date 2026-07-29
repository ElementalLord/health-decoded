import { z } from "zod";

export const lessonCompletionSchema = z
  .object({
    lessonProgressId: z.string().uuid(),
    reflection: z.string().trim().min(1).max(300).optional(),
  })
  .strict();
