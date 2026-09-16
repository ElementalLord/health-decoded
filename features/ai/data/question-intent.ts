// @ts-expect-error -- Node's TypeScript test runner needs explicit extensions.
import { normalizeAiQuery } from "./query-normalizer.ts";

/** Identify concept explanations from intent, including personal phrasing.
 * This selects evidence and checks relevance, never a canned answer. */
export function definitionSubjectFor(question: string): string | null {
  const text = normalizeAiQuery(question)
    .replace(/[.!?]+$/g, "")
    .trim();
  const match = text.match(
    /^(?:what (?:is|are)|define|(?:can (?:you|u) )?explain|what does it mean (?:when|if|that) (?:i|someone|you) (?:have|has)|what does (?:having|being diagnosed with)|i (?:have|was diagnosed with))\s+(.+?)(?:\s+mean|\s+simply|\s+in (?:simple|plain) (?:words|language))?$/,
  );
  if (!match) return null;
  const subject = (match[1] ?? "")
    .replace(/^(?:a|an|the)\s+/, "")
    .replace(/\btype two\b|\bt2d\b/g, "type 2 diabetes")
    .replace(/diabetes diabetes/g, "diabetes")
    .trim();
  if (!subject || /\b(how|why|difference|compare|versus|and|or|when|if)\b/.test(subject))
    return null;
  return subject;
}
