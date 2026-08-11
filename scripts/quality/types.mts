export type QualitySeverity = "error" | "warning" | "info";

export type QualityIssue = {
  check: string;
  severity: QualitySeverity;
  code: string;
  message: string;
  file?: string | undefined;
  path?: string | undefined;
  contentId?: string | undefined;
  suggestion?: string | undefined;
};

export type QualityCheckResult = {
  name: string;
  label: string;
  issues: QualityIssue[];
};

export type QualityContext = {
  root: string;
  now: Date;
};

export type QualityChecker = (context: QualityContext) => Promise<QualityCheckResult>;
