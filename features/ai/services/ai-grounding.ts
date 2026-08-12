import { z } from "zod";

// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { AI_MAX_OUTPUT_CHARACTERS } from "../constants/ai-limits.ts";
import type { AiCredibleSourceContext } from "../data/credible-sources.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { assessAiOutputSafety } from "./ai-output-safety.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { parseAiProviderText } from "../../../services/ai/response-parser.ts";

export const AI_INSUFFICIENT_EVIDENCE_MESSAGE =
  "Health Decoded doesn’t have enough approved information to answer that confidently. Try asking about a Type 2 diabetes concept covered in the lessons or reviewed sources.";

const aiGroundedOutputSchema = z
  .object({
    answer: z.string().trim().min(1).max(AI_MAX_OUTPUT_CHARACTERS),
    sourceIds: z.array(z.string().trim().min(1).max(64)).min(1).max(3),
  })
  .strict();

export type ValidatedAiGroundedOutput = {
  readonly answer: string;
  readonly sources: readonly AiCredibleSourceContext[];
};

export function buildAiResponseJsonSchema(retrievedSources: readonly AiCredibleSourceContext[]) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["answer", "sourceIds"],
    properties: {
      answer: { type: "string", minLength: 1, maxLength: AI_MAX_OUTPUT_CHARACTERS },
      sourceIds: {
        type: "array",
        minItems: 1,
        maxItems: Math.min(3, retrievedSources.length),
        uniqueItems: true,
        items: { type: "string", enum: retrievedSources.map(({ id }) => id) },
      },
    },
  } as const;
}

/** Rejects the complete response if any citation or content invariant is violated. */
export function parseAndValidateAiGroundedOutput(
  rawValue: unknown,
  retrievedSources: readonly AiCredibleSourceContext[],
): ValidatedAiGroundedOutput | null {
  const parsed = aiGroundedOutputSchema.safeParse(rawValue);
  if (!parsed.success) return null;
  if (new Set(parsed.data.sourceIds).size !== parsed.data.sourceIds.length) return null;

  const retrievedById = new Map(retrievedSources.map((source) => [source.id, source]));
  const citedSources = parsed.data.sourceIds.map((id) => retrievedById.get(id));
  if (citedSources.some((source) => !source)) return null;

  const answer = parseAiProviderText(parsed.data.answer);
  if (!answer.ok || !assessAiOutputSafety(answer.text).safe) return null;
  return { answer: answer.text, sources: citedSources as AiCredibleSourceContext[] };
}
