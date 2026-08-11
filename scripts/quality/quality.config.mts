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
export const qualityAllowlist: readonly QualityException[] = [];
