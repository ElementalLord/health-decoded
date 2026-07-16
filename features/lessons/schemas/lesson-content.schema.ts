import { z } from "zod";

const shortText = z.string().trim().min(1).max(180);
const bodyText = z.string().trim().min(1).max(3000);

const presentationSchema = z
  .object({
    align: z.enum(["left", "center", "offset_left", "offset_right"]).optional(),
    spacing: z.enum(["compact", "standard", "expansive"]).optional(),
    tone: z.enum(["canvas", "paper", "warm", "sage", "charcoal"]).optional(),
    width: z.enum(["reading", "wide", "full"]).optional(),
  })
  .strict();

const presentationField = { presentation: presentationSchema.optional() };

const textBlockSchema = z
  .object({
    type: z.literal("text"),
    eyebrow: shortText.optional(),
    heading: z.string().trim().min(1).max(120).optional(),
    body: bodyText,
    ...presentationField,
  })
  .strict();

const heroBlockSchema = z
  .object({
    type: z.literal("hero"),
    eyebrow: shortText.optional(),
    title: z.string().trim().min(1).max(180),
    body: bodyText.optional(),
    ...presentationField,
  })
  .strict();

const calloutBlockSchema = z
  .object({
    type: z.literal("callout"),
    label: shortText.optional(),
    title: z.string().trim().min(1).max(120),
    body: bodyText,
    ...presentationField,
  })
  .strict();

const summaryBlockSchema = z
  .object({
    type: z.literal("summary"),
    title: z.string().trim().min(1).max(120).optional(),
    points: z.array(z.string().trim().min(1).max(300)).min(1).max(12),
    ...presentationField,
  })
  .strict();

const imageBlockSchema = z
  .object({
    type: z.literal("image"),
    src: z.string().regex(/^\/(?:[a-zA-Z0-9._/-]+)$/, "Use an approved local image path."),
    alt: z.string().trim().max(160),
    width: z.number().int().min(1).max(2400),
    height: z.number().int().min(1).max(2400),
    caption: z.string().trim().min(1).max(300).optional(),
    ...presentationField,
  })
  .strict();

const statisticBlockSchema = z
  .object({
    type: z.literal("statistic"),
    value: z.string().trim().min(1).max(24),
    label: z.string().trim().min(1).max(120),
    body: bodyText.optional(),
    ...presentationField,
  })
  .strict();

const quoteBlockSchema = z
  .object({
    type: z.literal("quote"),
    quote: bodyText,
    attribution: shortText.optional(),
    ...presentationField,
  })
  .strict();

const storyBlockSchema = z
  .object({
    type: z.literal("story"),
    eyebrow: shortText.optional(),
    title: z.string().trim().min(1).max(140).optional(),
    body: bodyText,
    ...presentationField,
  })
  .strict();

const definitionBlockSchema = z
  .object({
    type: z.literal("definition"),
    term: z.string().trim().min(1).max(100),
    definition: bodyText,
    plain_language: bodyText.optional(),
    ...presentationField,
  })
  .strict();

const mythFactBlockSchema = z
  .object({
    type: z.literal("myth_fact"),
    myth: bodyText,
    fact: bodyText,
    ...presentationField,
  })
  .strict();

const comparisonColumnSchema = z
  .object({
    title: z.string().trim().min(1).max(100),
    body: bodyText.optional(),
    points: z.array(z.string().trim().min(1).max(240)).min(1).max(8).optional(),
  })
  .strict()
  .refine((column) => Boolean(column.body || column.points?.length), {
    message: "A comparison column needs a body or at least one point.",
  });

const comparisonBlockSchema = z
  .object({
    type: z.literal("comparison"),
    eyebrow: shortText.optional(),
    title: z.string().trim().min(1).max(140).optional(),
    columns: z.array(comparisonColumnSchema).min(2).max(3),
    ...presentationField,
  })
  .strict();

const timelineItemSchema = z
  .object({
    label: shortText.optional(),
    title: z.string().trim().min(1).max(120),
    body: bodyText,
  })
  .strict();

const timelineBlockSchema = z
  .object({
    type: z.literal("timeline"),
    eyebrow: shortText.optional(),
    title: z.string().trim().min(1).max(140),
    items: z.array(timelineItemSchema).min(2).max(10),
    ...presentationField,
  })
  .strict();

const diagramNodeSchema = z
  .object({
    label: z.string().trim().min(1).max(100),
    body: z.string().trim().min(1).max(300).optional(),
  })
  .strict();

const diagramBlockSchema = z
  .object({
    type: z.literal("diagram"),
    eyebrow: shortText.optional(),
    title: z.string().trim().min(1).max(140),
    description: bodyText.optional(),
    nodes: z.array(diagramNodeSchema).min(2).max(8),
    ...presentationField,
  })
  .strict();

const expandableItemSchema = z
  .object({
    title: z.string().trim().min(1).max(140),
    body: bodyText,
  })
  .strict();

const expandableBlockSchema = z
  .object({
    type: z.literal("expandable"),
    eyebrow: shortText.optional(),
    title: z.string().trim().min(1).max(140).optional(),
    items: z.array(expandableItemSchema).min(1).max(10),
    ...presentationField,
  })
  .strict();

const glossaryBlockSchema = z
  .object({
    type: z.literal("glossary"),
    title: z.string().trim().min(1).max(120).optional(),
    terms: z
      .array(
        z
          .object({
            term: z.string().trim().min(1).max(100),
            definition: z.string().trim().min(1).max(500),
          })
          .strict(),
      )
      .min(1)
      .max(12),
    ...presentationField,
  })
  .strict();

const reflectionBlockSchema = z
  .object({
    type: z.literal("reflection"),
    eyebrow: shortText.optional(),
    prompt: z.string().trim().min(1).max(300),
    helper_text: z.string().trim().min(1).max(240).optional(),
    ...presentationField,
  })
  .strict();

const takeawayBlockSchema = z
  .object({
    type: z.literal("takeaway"),
    label: shortText.optional(),
    body: bodyText,
    ...presentationField,
  })
  .strict();

const activityPlacementBlockSchema = z
  .object({
    type: z.literal("activity"),
    activity_id: z.string().uuid(),
    ...presentationField,
  })
  .strict();

export const lessonContentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  heroBlockSchema,
  calloutBlockSchema,
  summaryBlockSchema,
  imageBlockSchema,
  statisticBlockSchema,
  quoteBlockSchema,
  storyBlockSchema,
  definitionBlockSchema,
  mythFactBlockSchema,
  comparisonBlockSchema,
  timelineBlockSchema,
  diagramBlockSchema,
  expandableBlockSchema,
  glossaryBlockSchema,
  reflectionBlockSchema,
  takeawayBlockSchema,
  activityPlacementBlockSchema,
]);

export const lessonContentBlocksSchema = z
  .array(lessonContentBlockSchema)
  .min(1)
  .max(60)
  .superRefine((blocks, context) => {
    const activityIds = blocks
      .filter((block) => block.type === "activity")
      .map((block) => block.activity_id);
    if (new Set(activityIds).size !== activityIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each activity can appear only once in a lesson composition.",
      });
    }
  });

export type LessonContentBlock = z.infer<typeof lessonContentBlockSchema>;
export type RenderableLessonContentBlock = Exclude<LessonContentBlock, { type: "activity" }>;
