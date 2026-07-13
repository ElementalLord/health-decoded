import { z } from "zod";

const conciseText = z.string().trim().min(1).max(600);

const textBlockSchema = z
  .object({
    type: z.literal("text"),
    heading: z.string().trim().min(1).max(120).optional(),
    body: conciseText,
  })
  .strict();

const calloutBlockSchema = z
  .object({
    type: z.literal("callout"),
    title: z.string().trim().min(1).max(120),
    body: conciseText,
  })
  .strict();

const summaryBlockSchema = z
  .object({
    type: z.literal("summary"),
    title: z.string().trim().min(1).max(120).optional(),
    points: z.array(z.string().trim().min(1).max(180)).min(1).max(5),
  })
  .strict();

const imageBlockSchema = z
  .object({
    type: z.literal("image"),
    src: z.string().regex(/^\/(?:[a-zA-Z0-9._/-]+)$/, "Use an approved local image path."),
    alt: z.string().trim().max(160),
    width: z.number().int().min(1).max(1600),
    height: z.number().int().min(1).max(1600),
    caption: z.string().trim().min(1).max(180).optional(),
  })
  .strict();

export const lessonContentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  calloutBlockSchema,
  summaryBlockSchema,
  imageBlockSchema,
]);

export const lessonContentBlocksSchema = z.array(lessonContentBlockSchema).min(1).max(20);
