import { z } from "zod";

// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { AI_MAX_OUTPUT_CHARACTERS } from "../constants/ai-limits.ts";
import type { AiCredibleSourceContext } from "../data/credible-sources.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { reviewedSuggestedAnswerFor } from "../data/reviewed-suggested-answers.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { isAiAnswerRelevant } from "./ai-search-grounding.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { assessAiOutputSafety } from "./ai-output-safety.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { parseAiProviderText } from "../../../services/ai/response-parser.ts";

export const AI_INSUFFICIENT_EVIDENCE_MESSAGE =
  "I don’t have reviewed information for the specific part of that question yet. I can still help with any related Type 2 diabetes concept I do have evidence for—for example, ask how it generally connects to blood sugar, food, activity, monitoring, medicines, emotions, daily life, or preventing complications.";

const fallbackStopWords = new Set([
  "about",
  "again",
  "another",
  "does",
  "explain",
  "have",
  "help",
  "into",
  "more",
  "that",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
]);

function fallbackTerms(value: string) {
  return (
    value
      .toLocaleLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((term) => term.length > 3 && !fallbackStopWords.has(term)) ?? []
  );
}

function fallbackSentences(sources: readonly AiCredibleSourceContext[]) {
  return sources.flatMap((source, sourceIndex) =>
    source.summary
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .map((sentence, sentenceIndex) => ({ sentence, sentenceIndex, sourceIndex })),
  );
}

function trimSentenceEnding(value: string) {
  return value.trim().replace(/[.!?]+$/, "");
}

function uppercaseFirst(value: string) {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

function reviewedMedicationDecisionFallback(
  question: string,
  sources: readonly AiCredibleSourceContext[],
) {
  const medicine = sources.find((source) =>
    /(?:MOUNJARO|METFORMIN|OZEMPIC|JARDIANCE|JANUVIA|GLIPIZIDE|PIOGLITAZONE)/i.test(source.title),
  );
  if (!medicine) return null;

  const asksSchedule =
    /\b(daily|every day|each day|weekly|once a week|schedule|timing|how often|when.*take)\b/i.test(
      question,
    );
  if (asksSchedule && medicine.id === "FDA-MOUNJARO-LABEL") {
    return "Mounjaro is normally taken once-weekly, not daily. Use the day and dose on your prescription label; I can explain the standard schedule, but I can’t safely tell you to change the instructions prescribed for you.";
  }

  if (/\b(?:should|can|could) i\b.{0,40}\b(?:use|start|take|try)\b/i.test(question)) {
    const name = medicine.title.split(/[ (]/)[0] ?? "That medicine";
    return `I can’t determine whether ${name} is right for you because that depends on your health history, other medicines, risks, and treatment goals. ${medicine.summary}`;
  }

  if (/\b(?:stop|skip|increase|decrease|change|adjust|double|halve|missed)\b/i.test(question)) {
    return `I can’t safely tell you to change this prescription because the right action depends on the exact medicine, dose, timing, and your health situation. ${medicine.summary}`;
  }

  return null;
}

/**
 * Reframes common evidence-summary sentence shapes without adding new facts.
 * This is used only when the model is unavailable and a learner explicitly asks
 * for another explanation, so a follow-up never becomes the same sentence with
 * a cosmetic prefix.
 */
function reframeReviewedSentence(value: string) {
  const sentence = trimSentenceEnding(value);
  const changing = sentence.match(
    /^(.+?) can change (.+?) in response to (?:factors such as )?(.+)$/i,
  );
  if (changing) {
    const subject = changing[1]!;
    const timing = changing[2]!;
    const causes = changing[3]!;
    return `${subject} does not stay at one level ${timing}. ${uppercaseFirst(causes)} are some of the things that can make it vary.`;
  }

  const definition = sentence.match(/^(.+?) is an? (.+)$/i);
  if (definition) {
    const subject = definition[1]!;
    const description = definition[2]!;
    return `In everyday terms, ${subject} is a kind of ${description}.`;
  }

  const cause = sentence.match(/^(.+?) because (.+)$/i);
  if (cause) {
    const result = cause[1]!;
    const reason = cause[2]!;
    return `${uppercaseFirst(reason)}. That is why ${result.charAt(0).toLocaleLowerCase()}${result.slice(1)}.`;
  }

  const twoParts = sentence.match(/^(.+?), and (.+)$/i);
  if (twoParts) {
    const first = twoParts[1]!;
    const second = twoParts[2]!;
    return `There are two parts to the idea: ${first.charAt(0).toLocaleLowerCase()}${first.slice(1)}. It also means ${second}.`;
  }

  return `Here is the main idea in plain language: ${sentence}.`;
}

/**
 * Provides a concise, source-backed turn when the optional model is unavailable.
 * It ranks details against the current question and avoids repeating sentences
 * already shown in the conversation.
 */
export function buildReviewedEvidenceFallback({
  previousAnswers = [],
  question,
  sources,
}: {
  readonly previousAnswers?: readonly string[];
  readonly question: string;
  readonly sources: readonly AiCredibleSourceContext[];
}): string {
  const reviewedSuggestedAnswer = reviewedSuggestedAnswerFor(question);
  if (reviewedSuggestedAnswer) return reviewedSuggestedAnswer.answer;

  const medicationDecision = reviewedMedicationDecisionFallback(question, sources);
  if (medicationDecision) return medicationDecision;

  const candidates = fallbackSentences(sources);
  if (!candidates.length) return AI_INSUFFICIENT_EVIDENCE_MESSAGE;

  const priorText = previousAnswers.join(" ").toLocaleLowerCase();
  const questionTerms = new Set(fallbackTerms(question));
  const asksHow = /\b(how|work|works|working|mechanism)\b/i.test(question);
  const asksSafety = /\b(side effects?|risks?|safe|safety|warning|symptoms?)\b/i.test(question);
  const asksSchedule =
    /\b(daily|every day|each day|weekly|once a week|schedule|timing|how often|when.*take)\b/i.test(
      question,
    );
  const asksForSimpler =
    /\b(simple|simply|simpler|plain language|another way)\b|\bwhat (?:does that|do you) mean\b/i.test(
      question,
    );
  const asksForDefinition = /\bwhat (?:is|are)\b/i.test(question);
  const asksAcrossTopics = /\b(and|both|compare|comparison|difference|versus|vs\.?)\b/i.test(
    question,
  );

  const ranked = candidates
    .map((candidate) => {
      const sentenceTerms = new Set(fallbackTerms(candidate.sentence));
      const overlap = [...questionTerms].filter((term) => sentenceTerms.has(term)).length;
      const mechanismBonus =
        asksHow &&
        (overlap > 0 || questionTerms.size <= 1) &&
        /\b(work|activat|insulin|glucagon|receptor|slows?|reduces?|increases?)\w*\b/i.test(
          candidate.sentence,
        )
          ? 4
          : 0;
      const safetyBonus =
        asksSafety &&
        /\b(side effects?|risks?|safe|safety|warning|symptoms?|emergency)\b/i.test(
          candidate.sentence,
        )
          ? 5
          : 0;
      const scheduleBonus =
        asksSchedule &&
        /\b(once-weekly|daily|weekly|dose|timing|schedule)\b/i.test(candidate.sentence)
          ? 6
          : 0;
      const repeated = priorText.includes(candidate.sentence.toLocaleLowerCase());
      return {
        ...candidate,
        repeated,
        score: overlap + mechanismBonus + safetyBonus + scheduleBonus,
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        Number(left.repeated) - Number(right.repeated) ||
        left.sourceIndex - right.sourceIndex ||
        left.sentenceIndex - right.sentenceIndex,
    );

  if (asksForSimpler) {
    const sentenceBeingExplained = ranked.find((candidate) => candidate.repeated) ?? ranked[0]!;
    return reframeReviewedSentence(sentenceBeingExplained.sentence);
  }

  const best = ranked[0]!;
  const directDetail = asksForDefinition
    ? candidates.find(
        (candidate) =>
          candidate.sourceIndex === best.sourceIndex &&
          candidate.sentenceIndex === best.sentenceIndex + 1 &&
          !priorText.includes(candidate.sentence.toLocaleLowerCase()),
      )
    : undefined;
  const explanatoryDetail = asksHow
    ? ranked.find(
        (candidate) =>
          candidate.sourceIndex === best.sourceIndex &&
          candidate.sentenceIndex === best.sentenceIndex + 1 &&
          candidate.score > 0 &&
          !candidate.repeated,
      )
    : undefined;
  const crossTopic = asksAcrossTopics
    ? ranked.find(
        (candidate) =>
          !candidate.repeated && candidate.score > 0 && candidate.sourceIndex !== best.sourceIndex,
      )
    : undefined;
  const answer = crossTopic
    ? `${best.sentence}\n\n${crossTopic.sentence}`
    : directDetail || explanatoryDetail
      ? `${best.sentence} ${(directDetail ?? explanatoryDetail)!.sentence}`
      : best.sentence;
  const finalAnswer = best.repeated ? `The key reviewed point is: ${answer}` : answer;
  return isAiAnswerRelevant(finalAnswer, { question })
    ? finalAnswer
    : AI_INSUFFICIENT_EVIDENCE_MESSAGE;
}

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
