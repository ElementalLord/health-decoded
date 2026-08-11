import { z } from "zod";

export const explainItBackRequestSchema = z
  .object({
    challengeId: z.enum([
      "blood-glucose",
      "insulin",
      "insulin-resistance",
      "type-2-diabetes",
      "a1c",
      "a1c-vs-glucose",
      "carbohydrates",
      "serving-size",
      "total-vs-added-sugars",
      "total-carbohydrate",
    ]),
    explanation: z
      .string()
      .trim()
      .min(1)
      .max(1_000)
      .refine((value) => {
        const alphabeticWords = value.match(/\p{L}+/gu) ?? [];
        return alphabeticWords.length >= 3 && value.replace(/\s/g, "").length >= 12;
      }, "Add a little more so there is an idea to check.")
      .refine(
        (value) =>
          !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(value),
        "Explanation must be plain text.",
      ),
    mode: z.enum(["practice", "spaced-review"]).default("practice"),
    resultToken: z.uuid().optional(),
    hadRetry: z.boolean().default(false),
    exampleViewed: z.boolean().default(false),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.mode === "spaced-review" && !value.resultToken) {
      context.addIssue({ code: "custom", path: ["resultToken"], message: "A review result token is required." });
    }
  });

export type ExplainItBackRequestInput = z.infer<typeof explainItBackRequestSchema>;
