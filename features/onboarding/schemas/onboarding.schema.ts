import { z } from "zod";

import { onboardingIntents } from "@/features/onboarding/types/onboarding";

export const onboardingSchema = z.object({
  completionTarget: z.enum(["recommended", "journey"]),
  onboardingIntent: z
    .union([z.enum(onboardingIntents), z.literal("")])
    .transform((value) => (value === "" ? null : value)),
});
