import { z } from "zod";

export const lessonPositionSchema = z.object({
  blockIndex: z.number().int().min(0).max(59),
  lessonProgressId: z.string().uuid(),
});
