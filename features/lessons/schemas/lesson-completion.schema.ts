import { z } from "zod";

export const lessonCompletionSchema = z
  .object({
    lessonProgressId: z.string().uuid(),
  })
  .strict();
