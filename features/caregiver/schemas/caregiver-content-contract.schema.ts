import { z } from "zod";

const htmlPattern = /<\/?[a-z][^>]*>/i;

const deterministicCopy = (maximumLength: number) =>
  z
    .string()
    .min(1)
    .max(maximumLength)
    .refine((value) => value.trim() === value, "Approved copy may not gain outer whitespace.")
    .refine((value) => !htmlPattern.test(value), "HTML is not permitted in approved copy.");

export const caregiverSourceTraceSchema = z
  .object({
    document: z.enum([
      "docs/caregiver/00-CAREGIVER-SYSTEM.md",
      "docs/caregiver/01-CAREGIVER-CONTENT.md",
      "docs/caregiver/02-CAREGIVER-TOOLS.md",
      "docs/caregiver/03-CAREGIVER-CODEX-BUILD.md",
    ]),
    heading: z.string().trim().min(1).max(180),
    contentId: z.string().regex(/^CG-[A-Z0-9-]+$/),
    correction: z.literal("CG-TOOL-ISSUE-001").optional(),
  })
  .strict();

export const caregiverDeterministicTextSchema = z
  .object({
    value: deterministicCopy(5_000),
    source: caregiverSourceTraceSchema,
    runtimeGenerated: z.literal(false),
  })
  .strict();

export const caregiverContentBlockSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("narrative"),
      id: z.string().regex(/^CG-[A-Z0-9-]+$/),
      body: caregiverDeterministicTextSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("dialogue"),
      id: z.string().regex(/^CG-[A-Z0-9-]+$/),
      speaker: caregiverDeterministicTextSchema,
      body: caregiverDeterministicTextSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("list"),
      id: z.string().regex(/^CG-[A-Z0-9-]+$/),
      heading: caregiverDeterministicTextSchema.optional(),
      items: z.array(caregiverDeterministicTextSchema).min(1).max(20),
    })
    .strict(),
  z
    .object({
      kind: z.literal("notice"),
      id: z.string().regex(/^CG-[A-Z0-9-]+$/),
      tone: z.enum(["privacy", "authority", "information", "urgent"]),
      heading: caregiverDeterministicTextSchema.optional(),
      body: caregiverDeterministicTextSchema,
    })
    .strict(),
]);

export const caregiverModuleContractSchema = z
  .object({
    id: z.enum(["CG-M1", "CG-M2", "CG-M3", "CG-M4", "CG-M5"]),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: caregiverDeterministicTextSchema,
    sectionIds: z.array(z.string().regex(/^CG-M[1-5]-S\d{2}$/)).min(1),
    interactionIds: z.array(z.string().regex(/^CG-M[1-5]-I\d{2}$/)).min(1),
    coreApplicationId: z.enum(["CG-M1-I01", "CG-M2-I03", "CG-M3-I02", "CG-M4-I02", "CG-M5-I01"]),
    questionIds: z.array(z.string().regex(/^CG-M[1-5]-Q\d{2}$/)).min(1),
    reflectionId: z.string().regex(/^CG-M[1-5]-R01$/),
    renderingMode: z.literal("deterministic"),
    runtimeGeneration: z.literal(false),
  })
  .strict()
  .superRefine((module, context) => {
    const modulePrefix = `${module.id}-`;
    const relatedIds = [
      ...module.sectionIds,
      ...module.interactionIds,
      ...module.questionIds,
      module.reflectionId,
      module.coreApplicationId,
    ];

    if (!relatedIds.every((id) => id.startsWith(modulePrefix))) {
      context.addIssue({
        code: "custom",
        message: "Every module child ID must belong to its declared module.",
      });
    }

    if (!module.interactionIds.includes(module.coreApplicationId)) {
      context.addIssue({
        code: "custom",
        message: "The core application must be one of the module interactions.",
      });
    }
  });

export const caregiverContentContractSchema = z
  .object({
    publicSectionName: z.literal("Support Someone You Care About"),
    centralPromise: z.literal("Help without taking over."),
    renderingMode: z.literal("deterministic"),
    runtimeGeneration: z.literal(false),
    modules: z.array(caregiverModuleContractSchema).length(5),
    authoritativeDocuments: z
      .tuple([
        z.literal("docs/caregiver/00-CAREGIVER-SYSTEM.md"),
        z.literal("docs/caregiver/01-CAREGIVER-CONTENT.md"),
        z.literal("docs/caregiver/02-CAREGIVER-TOOLS.md"),
        z.literal("docs/caregiver/03-CAREGIVER-CODEX-BUILD.md"),
      ])
      .readonly(),
  })
  .strict();
