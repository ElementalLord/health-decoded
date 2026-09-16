import type { AiCredibleSourceContext } from "../data/credible-sources";
import type { GlossarySource, MedicalGlossaryEntry } from "../../glossary/types/medical-glossary";

const ignoredWords = new Set([
  "what",
  "does",
  "that",
  "this",
  "with",
  "have",
  "about",
  "explain",
  "please",
  "there",
  "work",
  "works",
]);
const words = (text: string) => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

/** Retrieve from the complete static glossary, never learner records. Keep
 * relevant definitions and comparisons alongside the core reference library. */
export function glossaryKnowledgeFor(
  question: string,
  entries: readonly MedicalGlossaryEntry[],
  sources: readonly GlossarySource[],
  previousQuestion?: string,
): readonly AiCredibleSourceContext[] {
  function rank(query: string) {
    const queryWords = new Set(words(query).filter((word) => !ignoredWords.has(word)));
    const normalized = ` ${words(query).join(" ")} `;
    return entries
      .map((entry) => {
        const names = [
          entry.term,
          entry.abbreviation ?? "",
          ...(entry.aliases ?? []),
          ...(entry.misspellings ?? []),
        ].filter(Boolean);
        const exact = names.some((name) => normalized.includes(` ${words(name).join(" ")} `));
        const overlap = words(entry.term).filter((word) => queryWords.has(word)).length;
        return { entry, score: exact ? 100 + words(entry.term).length : overlap };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
  }
  const current = rank(question);
  const matches = current.length || !previousQuestion ? current : rank(previousQuestion);
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  return matches.slice(0, 24).flatMap(({ entry }) => {
    const source = entry.sourceIds
      .map((id) => sourcesById.get(id))
      .find((candidate) => candidate?.url.startsWith("https://"));
    if (!source) return [];
    return [
      {
        id: entry.id,
        href: source.url,
        organization: source.organization,
        title: `${entry.term} — ${source.title}`,
        summary: `${entry.abbreviation ? `${entry.abbreviation} (${entry.term})` : entry.term} refers to ${entry.definition.charAt(0).toLowerCase()}${entry.definition.slice(1)}${entry.commonlyConfusedWith ? ` Compared with ${entry.commonlyConfusedWith.term}: ${entry.commonlyConfusedWith.explanation}` : ""}`,
      },
    ];
  });
}
