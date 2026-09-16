import { z } from "zod";

// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { AI_MAX_OUTPUT_CHARACTERS } from "../constants/ai-limits.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { normalizeAiQuery } from "../data/query-normalizer.ts";
// @ts-expect-error -- Node's TypeScript test runner needs explicit extensions.
import { definitionSubjectFor } from "../data/question-intent.ts";
import type { AiCredibleSource } from "../types/ai.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { assessAiOutputSafety } from "./ai-output-safety.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { parseAiProviderText } from "../../../services/ai/response-parser.ts";

const MAX_SEARCH_SOURCES = 8;
const MAX_SOURCE_URL_CHARACTERS = 2_048;
const MAX_CITED_TEXT_CHARACTERS = 420;

const excludedSourceHosts = [
  "blogspot.com",
  "facebook.com",
  "instagram.com",
  "medium.com",
  "pinterest.com",
  "quora.com",
  "reddit.com",
  "substack.com",
  "tiktok.com",
  "tumblr.com",
  "twitter.com",
  "x.com",
] as const;

const citationSchema = z
  .object({
    end_index: z.number().int().nonnegative().optional(),
    endIndex: z.number().int().nonnegative().optional(),
    start_index: z.number().int().nonnegative().optional(),
    startIndex: z.number().int().nonnegative().optional(),
    title: z.string().optional(),
    type: z.literal("url_citation"),
    url: z.string(),
  })
  .passthrough();

const textContentSchema = z
  .object({
    annotations: z.array(citationSchema).optional(),
    text: z.string().min(1).max(AI_MAX_OUTPUT_CHARACTERS),
    type: z.literal("text"),
  })
  .passthrough();

const modelOutputStepSchema = z
  .object({
    content: z.array(z.unknown()).optional(),
    type: z.literal("model_output"),
  })
  .passthrough();

const interactionSchema = z
  .object({
    steps: z.array(z.unknown()),
  })
  .passthrough();

const gatewayOutputTextSchema = z
  .object({
    annotations: z.array(citationSchema).optional(),
    text: z.string().min(1).max(AI_MAX_OUTPUT_CHARACTERS),
    type: z.literal("output_text"),
  })
  .passthrough();

const gatewayMessageSchema = z
  .object({
    content: z.array(z.unknown()),
    type: z.literal("message"),
  })
  .passthrough();

const gatewayResponseSchema = z
  .object({
    output: z.array(z.unknown()),
  })
  .passthrough();

export type ValidatedAiSearchGroundedOutput = {
  readonly answer: string;
  readonly sources: readonly AiCredibleSource[];
};

export type AiAnswerRelevanceContext = {
  readonly previousQuestion?: string | undefined;
  readonly question: string;
};

const relevanceStopWords = new Set([
  "about",
  "affect",
  "another",
  "answer",
  "does",
  "explain",
  "happen",
  "happens",
  "might",
  "more",
  "question",
  "simpler",
  "that",
  "their",
  "them",
  "then",
  "these",
  "this",
  "what",
  "way",
  "when",
  "where",
  "which",
  "with",
  "work",
  "works",
  "take",
  "would",
  "please",
  "tell",
  "understand",
  "having",
  "have",
  "mean",
  "means",
  "simple",
  "words",
  "someone",
  "really",
  "always",
]);

const topicAnchors = [
  /\bmetformin\b/,
  /\binsulin\b/,
  /\ba1c\b/,
  /\b(?:exercise|activity|walking|walk)\b/,
  /\b(?:sleep|sleeping)\b/,
  /\bstress\b/,
  /\b(?:cgm|sensor)\b/,
  /\b(?:fingerstick|finger|meter)\b/,
  /\b(?:carbohydrates?|carbs?)\b/,
  /\bfiber\b/,
  /\b(?:kidney|kidneys)\b/,
  /\b(?:eyes?|retinopathy)\b/,
  /\b(?:nerves?|neuropathy)\b/,
  /\b(?:feet|foot)\b/,
  /\b(?:ketones?|ketoacidosis|dka)\b/,
  /\bremission\b/,
  /\b(?:morning|dawn|breakfast)\b/,
  /\b(?:low|lows|hypoglycemia)\b/,
  /\b(?:pregnancy|pregnant|gestational)\b/,
  /\b(?:steroids?|prednisone)\b/,
  /\b(?:glp|semaglutide|ozempic)\b/,
];

function relevanceTerm(value: string) {
  if (/^(?:glucose|sugar)$/.test(value)) return "glucose";
  if (/^(?:diabetes|diabetic)$/.test(value)) return "diabetes";
  if (/^(?:medicine|medicines|medication|medications|drug|drugs)$/.test(value)) {
    return "medicine";
  }
  if (/^(?:sleep|sleeping)$/.test(value)) return "sleep";
  if (/^(?:daily|weekly)$/.test(value)) return "schedule";
  if (/^(?:score|scores|number|numbers|reading|readings|result|results)$/.test(value)) {
    return "result";
  }
  return value.replace(/(?:ing|ed|es|s)$/, "");
}

function relevanceTerms(value: string) {
  return new Set(
    (normalizeAiQuery(value).match(/[a-z0-9]+/g) ?? [])
      .filter((term) => (term.length > 3 || /\d/.test(term)) && !relevanceStopWords.has(term))
      .map(relevanceTerm),
  );
}

/**
 * Fast post-generation sense check. A normal answer must name at least one
 * meaningful subject from the active question near the start of its response.
 * Short referential follow-ups inherit only the immediately preceding question.
 */
export function isAiAnswerRelevant(
  answer: string,
  { previousQuestion, question }: AiAnswerRelevanceContext,
) {
  const normalizedQuestion = normalizeAiQuery(question);
  const openingText = normalizeAiQuery(
    answer
      .split(/(?<=[.!?])\s+/)
      .slice(0, 3)
      .join(" "),
  );
  const activeTopics = topicAnchors.filter((topic) => topic.test(normalizedQuestion));
  const asksComparison = /\b(difference|compare|comparison|versus|vs)\b/.test(normalizedQuestion);
  if (
    asksComparison &&
    activeTopics.length > 1 &&
    !activeTopics.every((topic) => topic.test(openingText))
  ) {
    return false;
  }
  const asksReason =
    /\bwhy\b|\bhow (?:does|do|can|could)\b/.test(normalizedQuestion) &&
    !/\b(how (?:often|much|many)|how can (?:i|you|someone))\b/.test(normalizedQuestion);
  if (
    asksReason &&
    !/\b(?:because|by|causes?|caused|leads?|allows?|enables?|signals?|releases?|absorbs?|absorbed|slows?|reduces?|increases?|lowers?|raises?|responds?|resistance|sensitive|sensitivity|blocks?|prevents?|changes?|damages?|damaged|affects?|affecting|produces?|production|uses?|used|needs?|need|lack|insufficient)\b/.test(
      openingText,
    )
  ) {
    return false;
  }
  // A fact about another aspect of the same condition isn't an explanation.
  // Reason questions must retain a recognizable requested topic as well.
  if (asksReason && activeTopics.length && !activeTopics.some((topic) => topic.test(openingText)))
    return false;
  const subject = definitionSubjectFor(question);
  const definition = subject ? [subject, subject] : null;
  if (
    definition &&
    !/^(?:some|common|difference|role|purpose|effect|ways?|examples?)\b/.test(definition[1] ?? "")
  ) {
    const subjectTerms = [...relevanceTerms(definition[1] ?? "")];
    const firstSentence = answer.split(/(?<=[.!?])\s+/)[0]?.toLocaleLowerCase() ?? "";
    const firstWords = firstSentence.match(/[a-z0-9]+/g) ?? [];
    const predicateIndex = firstWords.findIndex((word) => /^(?:is|are|means|refers)$/.test(word));
    const openingSubject = firstWords.slice(0, predicateIndex).map(relevanceTerm);
    if (
      subjectTerms.length > 0 &&
      subjectTerms.length <= 3 &&
      (!subjectTerms.every((term) => openingSubject.includes(term)) ||
        predicateIndex < 0 ||
        /\b(?:is|are) (?:usually |often |commonly )?(?:diagnosed|tested|treated|managed|monitored|prescribed)\b/.test(
          firstSentence,
        ))
    ) {
      return false;
    }
    // Once the requested concept is defined, stylistic words such as “simple”
    // or personal framing such as “I have” need not be echoed in the answer.
    if (subjectTerms.length > 0 && subjectTerms.length <= 3) return true;
  }

  let expected = relevanceTerms(question);
  if (expected.size === 0 && previousQuestion) expected = relevanceTerms(previousQuestion);
  if (expected.size === 0) return true;

  const opening = answer
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(" ")
    .slice(0, 500);
  const actual = relevanceTerms(opening);
  const broadTerms = new Set(["diabetes", "glucose", "medicine"]);
  const focalTerms = [...expected].filter((term) => !broadTerms.has(term));
  const termsThatMustMatch = focalTerms.length ? focalTerms : [...expected];
  return termsThatMustMatch.some((term) => actual.has(term));
}

function safePublicSourceUrl(value: string): URL | null {
  if (value.length > MAX_SOURCE_URL_CHARACTERS) return null;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLocaleLowerCase();
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !hostname ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.includes(":") ||
      /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

/**
 * Hard exclusion boundary for source classes that are unsuitable for medical
 * grounding. This is deliberately a denylist rather than an allowlist: newly
 * discovered government, academic, research, guideline, and medical sources
 * remain eligible without being pre-registered in the application.
 */
export function isPermittedDynamicSource(url: URL) {
  const hostname = url.hostname.toLocaleLowerCase().replace(/^www\./, "");
  return !excludedSourceHosts.some(
    (excluded) => hostname === excluded || hostname.endsWith(`.${excluded}`),
  );
}

function cleanSourceLabel(value: string | undefined, fallback: string) {
  const cleaned = value
    ?.replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
  return cleaned || fallback;
}

function citedTextFor(
  text: string,
  annotation: z.infer<typeof citationSchema>,
): string | undefined {
  const start = annotation.startIndex ?? annotation.start_index;
  const end = annotation.endIndex ?? annotation.end_index;
  if (start === undefined || end === undefined || start >= end || end > text.length) return;

  const citedText = text
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CITED_TEXT_CHARACTERS);
  return citedText || undefined;
}

/**
 * Converts provider-controlled citation annotations into bounded, public links.
 * URLs are never read from model prose: they must arrive in Gemini's structured
 * Google Search metadata and use a public HTTPS hostname.
 */
export function parseAndValidateAiSearchGroundedOutput(
  rawInteraction: unknown,
  relevanceContext?: AiAnswerRelevanceContext,
): ValidatedAiSearchGroundedOutput | null {
  const interaction = interactionSchema.safeParse(rawInteraction);
  if (!interaction.success) return null;

  const modelSteps = interaction.data.steps
    .map((step) => modelOutputStepSchema.safeParse(step))
    .filter((step) => step.success)
    .map((step) => step.data);
  const lastModelStep = modelSteps.at(-1);
  if (!lastModelStep?.content?.length) return null;

  const textBlocks = lastModelStep.content
    .map((content) => textContentSchema.safeParse(content))
    .filter((content) => content.success)
    .map((content) => content.data);
  if (!textBlocks.length) return null;

  const answerResult = parseAiProviderText(textBlocks.map(({ text }) => text).join("\n\n"));
  if (!answerResult.ok || !assessAiOutputSafety(answerResult.text).safe) return null;
  if (relevanceContext && !isAiAnswerRelevant(answerResult.text, relevanceContext)) return null;

  const sourceByUrl = new Map<string, AiCredibleSource>();
  for (const block of textBlocks) {
    for (const annotation of block.annotations ?? []) {
      const url = safePublicSourceUrl(annotation.url);
      if (!url || !isPermittedDynamicSource(url)) continue;

      const hostname = url.hostname.replace(/^www\./, "");
      const href = url.toString();
      const citedText = citedTextFor(block.text, annotation);
      const existing = sourceByUrl.get(href);
      if (existing) {
        if (!existing.citedText && citedText) {
          sourceByUrl.set(href, { ...existing, citedText });
        }
        continue;
      }

      sourceByUrl.set(href, {
        ...(citedText ? { citedText } : {}),
        href,
        organization: hostname,
        title: cleanSourceLabel(annotation.title, hostname),
      });
    }
  }

  const sources = [...sourceByUrl.values()];
  if (sources.length === 0 || sources.length > MAX_SEARCH_SOURCES) return null;
  return { answer: answerResult.text, sources };
}

/** Normalizes the OpenAI-compatible Responses shape returned by AI Gateway. */
export function parseAndValidateAiGatewayGroundedOutput(
  rawResponse: unknown,
  relevanceContext?: AiAnswerRelevanceContext,
): ValidatedAiSearchGroundedOutput | null {
  const response = gatewayResponseSchema.safeParse(rawResponse);
  if (!response.success) return null;

  const messages = response.data.output
    .map((output) => gatewayMessageSchema.safeParse(output))
    .filter((output) => output.success)
    .map((output) => output.data);
  const latestMessage = messages.at(-1);
  if (!latestMessage) return null;

  const content = latestMessage.content
    .map((block) => gatewayOutputTextSchema.safeParse(block))
    .filter((block) => block.success)
    .map((block) => ({ ...block.data, type: "text" as const }));
  if (!content.length) return null;

  return parseAndValidateAiSearchGroundedOutput(
    { steps: [{ content, type: "model_output" }] },
    relevanceContext,
  );
}
