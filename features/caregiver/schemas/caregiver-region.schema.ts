import { z } from "zod";

export const caregiverRegionStatusSchema = z.enum(["unavailable", "draft", "verified", "expired"]);

const nullableText = (maximumLength: number) =>
  z.string().trim().min(1).max(maximumLength).nullable();

const professionalResourceSchema = z
  .object({
    label: z.string().trim().min(1).max(120),
    contact: z.string().trim().min(1).max(240),
    limitations: nullableText(300),
  })
  .strict();

export const caregiverRegionConfigurationSchema = z
  .object({
    regionId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    displayName: z.string().trim().min(1).max(120),
    language: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
    status: caregiverRegionStatusSchema,
    emergencyServiceLabel: nullableText(120),
    emergencyContact: nullableText(240),
    crisisServiceLabel: nullableText(120),
    crisisContact: nullableText(240),
    professionalResources: z.array(professionalResourceSchema).max(12),
    sourceName: nullableText(160),
    sourceReference: nullableText(500),
    verifiedAt: z.iso.datetime().nullable(),
    expiresAt: z.iso.datetime().nullable(),
    reviewerName: nullableText(120),
    reviewerRole: nullableText(160),
    fallbackHeading: z.string().trim().min(1).max(160),
    fallbackCopy: z.string().trim().min(1).max(1_000),
  })
  .strict()
  .superRefine((region, context) => {
    if (region.status !== "verified") return;

    const requiredForVerification = [
      region.emergencyServiceLabel,
      region.emergencyContact,
      region.sourceName,
      region.sourceReference,
      region.verifiedAt,
      region.expiresAt,
      region.reviewerName,
      region.reviewerRole,
    ];

    if (requiredForVerification.some((value) => value === null)) {
      context.addIssue({
        code: "custom",
        message:
          "Verified regional configuration requires contact, source, review, and expiry data.",
      });
    }
  });
