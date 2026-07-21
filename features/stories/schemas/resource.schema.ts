import { z } from "zod";

const approvedHosts = new Set([
  "cdc.gov",
  "www.cdc.gov",
  "diabetes.org",
  "www.diabetes.org",
  "medlineplus.gov",
  "niddk.nih.gov",
  "www.niddk.nih.gov",
]);

export const resourceSchema = z
  .object({
    category: z.enum([
      "Start here",
      "Everyday habits",
      "Treatment & safety",
      "Whole-body health",
      "Support & access",
    ]),
    description: z.string().trim().min(1).max(300),
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    organization: z.string().trim().min(1).max(160),
    status: z.literal("reviewed"),
    title: z.string().trim().min(1).max(160),
    url: z.url().refine((value) => {
      const url = new URL(value);
      return url.protocol === "https:" && approvedHosts.has(url.hostname) && !url.search;
    }, "Resource URL must be an allowlisted HTTPS URL without parameters."),
    verified_at: z.string().date(),
  })
  .strict();

export type Resource = z.infer<typeof resourceSchema>;
