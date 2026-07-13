import { z } from "zod";

const medicationStatuses = ["draft", "in_review", "approved", "published", "archived"] as const;
const htmlPattern = /<\/?[a-z][^>]*>/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function safeText(maximumLength: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(maximumLength)
    .refine((value) => !htmlPattern.test(value), "HTML is not permitted.");
}

const sourceReferenceSchema = z
  .object({
    accessed_at: z.string().datetime({ offset: true }).optional(),
    published_or_reviewed_at: z.string().datetime({ offset: true }).optional(),
    publisher: safeText(160),
    title: safeText(240),
    url: z.url().refine((value) => new URL(value).protocol === "https:", "Use an HTTPS URL."),
  })
  .strict();

const medicationContentSchema = z
  .object({
    common_benefits: z.array(safeText(240)).min(1).max(8),
    common_side_effects: z.array(safeText(240)).min(1).max(8),
    how_it_works: z.array(safeText(600)).min(1).max(4),
    important_considerations: z.array(safeText(240)).min(1).max(8),
    key_takeaway: safeText(300),
    questions_for_healthcare_team: z.array(safeText(240)).min(1).max(8),
    short_summary: safeText(240),
    why_it_is_used: z.array(safeText(600)).min(1).max(4),
  })
  .strict();

export const medicationSeedRecordSchema = z
  .object({
    brand_names: z.array(safeText(120)).max(12),
    content: medicationContentSchema,
    generic_name: safeText(120),
    medication_class: safeText(120),
    published_at: z.string().datetime({ offset: true }).nullable(),
    reviewed_at: z.string().datetime({ offset: true }).nullable(),
    reviewed_by: safeText(160).nullable(),
    slug: z.string().regex(slugPattern).max(120),
    source_references: z.array(sourceReferenceSchema).max(12),
    status: z.enum(medicationStatuses),
    updated_at: z.string().datetime({ offset: true }),
    version: z.number().int().positive(),
  })
  .strict()
  .superRefine((record, context) => {
    if (
      record.status === "published" &&
      (!record.reviewed_by ||
        !record.reviewed_at ||
        !record.published_at ||
        record.source_references.length === 0)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Published medication records require review metadata, a publication date, and source references.",
      });
    }

    if (record.status !== "published" && record.published_at !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only published medication records may include a publication date.",
      });
    }
  });

export type MedicationSeedRecord = z.infer<typeof medicationSeedRecordSchema>;
export type MedicationContent = z.infer<typeof medicationContentSchema>;
export type MedicationSourceReference = z.infer<typeof sourceReferenceSchema>;
