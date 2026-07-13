import { z } from "zod";

const htmlPattern = /<\/?[a-z][^>]*>/i;

function plainText(maximumLength: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(maximumLength)
    .refine((value) => !htmlPattern.test(value), "HTML is not permitted.");
}

const contentBlockSchema = z.discriminatedUnion("type", [
  z
    .object({ body: plainText(2_000), heading: plainText(160).optional(), type: z.literal("text") })
    .strict(),
  z.object({ body: plainText(2_000), title: plainText(160), type: z.literal("callout") }).strict(),
  z
    .object({
      points: z.array(plainText(320)).min(1).max(8),
      title: plainText(160),
      type: z.literal("list"),
    })
    .strict(),
]);

export const caregiverArticleSchema = z
  .object({
    content_blocks: z.array(contentBlockSchema).min(1).max(12),
    conversation_prompt: plainText(600).nullable(),
    id: z.string().uuid(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(120),
    support_tip: plainText(600).nullable(),
    title: plainText(160),
    what_not_to_say: plainText(600).nullable(),
  })
  .strict();

export type CaregiverArticle = z.infer<typeof caregiverArticleSchema>;
