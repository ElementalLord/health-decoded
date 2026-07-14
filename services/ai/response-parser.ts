import "server-only";

import { AI_MAX_OUTPUT_CHARACTERS } from "@/features/ai/constants/ai-limits";

export type AiProviderFailureCategory =
  "configuration" | "rate_limited" | "refused" | "timeout" | "unexpected";

export type NormalizedAiProviderResult =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly category: AiProviderFailureCategory };

function isPlainText(value: string) {
  const text = value.trim();
  return (
    text.length > 0 && text.length <= AI_MAX_OUTPUT_CHARACTERS && !/<\/?[a-z][^>]*>/i.test(text)
  );
}

export function parseAiProviderText(value: unknown): NormalizedAiProviderResult {
  if (typeof value !== "string" || !isPlainText(value)) {
    return { ok: false, category: "unexpected" };
  }

  return { ok: true, text: value.trim() };
}

export function normalizeAiProviderFailure(category: string): NormalizedAiProviderResult {
  const knownCategories = new Set<AiProviderFailureCategory>([
    "configuration",
    "rate_limited",
    "refused",
    "timeout",
  ]);

  return knownCategories.has(category as AiProviderFailureCategory)
    ? { ok: false, category: category as AiProviderFailureCategory }
    : { ok: false, category: "unexpected" };
}
