import { z } from "zod";

import { confidenceLevels } from "@/features/journeys/types/journey-home";

export const confidenceCheckInSchema = z.object({
  lessonProgressId: z.string().uuid(),
  confidenceLevel: z.enum(confidenceLevels),
});
