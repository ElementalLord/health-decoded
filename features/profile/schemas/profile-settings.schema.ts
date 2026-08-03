import { z } from "zod";

const timezones = new Set(Intl.supportedValuesOf("timeZone"));
timezones.add("UTC");

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1, "Enter a display name.").max(100),
});
export const browserTimezoneSchema = z
  .string()
  .trim()
  .max(64)
  .refine((value) => timezones.has(value), "Choose a valid timezone.");
export const settingsUpdateSchema = z.object({
  locale: z.literal("en"),
  preferredTextScale: z.enum(["default", "large", "extra_large"]),
  reducedMotion: z.enum(["true", "false"]).transform((value) => value === "true"),
  timezone: z
    .string()
    .trim()
    .max(64)
    .refine((value) => timezones.has(value), "Choose a valid timezone."),
});
