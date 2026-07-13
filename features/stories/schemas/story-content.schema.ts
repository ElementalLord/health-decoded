import { z } from "zod";

const htmlPattern = /<\/?[a-z][^>]*>/i;
const plainText = (maximum: number) =>
  z.string().trim().min(1).max(maximum).refine((value) => !htmlPattern.test(value));

const blockSchema = z
  .object({ body: plainText(2_000), heading: plainText(160), type: z.literal("text") })
  .strict();

export const storySchema = z
  .object({
    content_blocks: z.array(blockSchema).min(1).max(8),
    content_status: z.enum(["development", "published"]),
    development_notice: plainText(400).nullable(),
    estimated_reading_minutes: z.number().int().min(1).max(10),
    introduction: plainText(600),
    journey_week: z.number().int().positive().nullable(),
    key_takeaway: plainText(600),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
    title: plainText(160),
    version: z.number().int().positive(),
  })
  .strict();

export type StoryViewModel = z.infer<typeof storySchema>;
