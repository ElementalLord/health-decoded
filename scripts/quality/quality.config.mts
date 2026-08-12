export const qualityConfig = {
  sourceFreshnessWarningDays: 365,
  failOnWarnings: false,
  scanRoots: ["app", "components", "content", "features", "lib"],
  sourceFiles: {
    glossary: "features/glossary/content/glossary-sources.ts",
    myths: "features/mythbusters/content/myth-check-sources.ts",
    resources: "content/resources/type-2-diabetes-resources.ts",
  },
} as const;

export type QualityException = {
  rule: string;
  target: string;
  reason: string;
  reviewAfter?: string;
};

// Exceptions must be exact and explained. Broad rule suppression is intentionally unsupported.
export const qualityAllowlist: readonly QualityException[] = [
  {
    rule: "SOURCE_CANONICAL_URL_DUPLICATE",
    target: "source:NIDDK_TESTING",
    reason: "The glossary and Myth Check registries intentionally use feature-local source IDs.",
  },
  {
    rule: "SOURCE_CANONICAL_URL_DUPLICATE",
    target: "source:RESOURCE-type-2-diabetes-basics",
    reason:
      "The Resources and Myth Check registries intentionally reuse the same approved CDC page.",
  },
  {
    rule: "SOURCE_CANONICAL_URL_DUPLICATE",
    target: "source:RESOURCE-understanding-a1c",
    reason:
      "The Resources and Myth Check registries intentionally reuse the same approved NIDDK page.",
  },
  {
    rule: "SOURCE_CANONICAL_URL_DUPLICATE",
    target: "source:RESOURCE-monitoring-blood-sugar",
    reason:
      "The Resources and Myth Check registries intentionally reuse the same approved CDC page.",
  },
  {
    rule: "SOURCE_CANONICAL_URL_DUPLICATE",
    target: "source:RESOURCE-kidney-health",
    reason:
      "The Resources and glossary registries intentionally reuse the same approved NIDDK page.",
  },
  {
    rule: "SOURCE_CANONICAL_URL_DUPLICATE",
    target: "source:RESOURCE-diabetes-and-mental-health",
    reason: "The Resources and glossary registries intentionally reuse the same approved CDC page.",
  },
  {
    rule: "SOURCE_CANONICAL_URL_DUPLICATE",
    target: "source:RESOURCE-diabetes-education-and-support",
    reason: "The Resources and glossary registries intentionally reuse the same approved CDC page.",
  },
  {
    rule: "ORPHAN_CONTENT",
    target: "source:FDA_SERVING_SIZE",
    reason:
      "This approved source supports the cross-feature Serving Size concept and Explain It Back challenge, not a Myth Check card.",
  },
];
