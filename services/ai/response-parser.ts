import "server-only";

type AiProviderFailureCategory =
  "configuration" | "rate_limited" | "refused" | "timeout" | "unexpected";

export type NormalizedAiProviderResult =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly category: AiProviderFailureCategory };

function isPlainText(value: string) {
  return value.trim().length > 0 && !/<\/?[a-z][^>]*>/i.test(value);
}

/**
 * Converts future provider output into the application's narrow plain-text
 * contract. Raw provider payloads must never leave services/ai.
 */
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
