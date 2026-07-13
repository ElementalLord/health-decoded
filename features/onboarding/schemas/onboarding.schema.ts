import { z } from "zod";

const supportedTimezones = new Set(Intl.supportedValuesOf("timeZone"));

export const onboardingSchema = z.object({
  displayName: z.string().trim().min(1, "Enter the name you would like us to use.").max(100),
  locale: z.literal("en"),
  preferredTextScale: z.enum(["default", "large"]),
  reducedMotion: z.enum(["true", "false"]).transform((value) => value === "true"),
  timezone: z
    .string()
    .max(64)
    .refine((value) => supportedTimezones.has(value), "Choose a valid timezone."),
});
