import { spawnSync } from "node:child_process";

import type { QualityCheckResult, QualityContext } from "./types.mts";

function runTests(
  root: string,
  name: string,
  label: string,
  files: readonly string[],
): QualityCheckResult {
  const result = spawnSync(
    process.execPath,
    ["--no-warnings", "--experimental-strip-types", "--test", ...files],
    { cwd: root, encoding: "utf8", env: { ...process.env, NODE_ENV: "test" } },
  );
  if (result.status === 0) return { name, label, issues: [] };
  const detail = (result.stderr || result.stdout || "Test process failed without output.")
    .trim()
    .split("\n")
    .slice(-12)
    .join("\n");
  return {
    name,
    label,
    issues: [
      {
        check: name,
        severity: "error",
        code: name === "ai" ? "AI_EVALUATION_REGRESSION" : "PROTECTED_CONTENT_REGRESSION",
        message: `${label} failed.\n${detail}`,
        suggestion: `Run: node --no-warnings --experimental-strip-types --test ${files.join(" ")}`,
      },
    ],
  };
}

export async function checkAiEvaluations(context: QualityContext) {
  return runTests(context.root, "ai", "AI evaluations", [
    "tests/ai-safety.test.mjs",
    "tests/ai-response-normalizer.test.mjs",
    "tests/explain-it-back.test.mjs",
  ]);
}

export async function checkSpacedReview(context: QualityContext) {
  return runTests(context.root, "spaced-review", "Spaced Review integrity", [
    "tests/spaced-review.test.mjs",
  ]);
}

export async function checkReliability(context: QualityContext) {
  return runTests(context.root, "reliability", "Fault-injection regressions", [
    "tests/fault-injection.test.mjs",
  ]);
}

export async function checkProtectedContent(context: QualityContext) {
  return runTests(context.root, "protected", "Protected content tests", [
    "tests/lesson-route-coverage.test.mjs",
    "tests/caregiver-content-contract.test.mjs",
    "tests/caregiver-ids.test.mjs",
    "tests/story-interaction-quality.test.mjs",
    "tests/resources-editorial.test.mjs",
  ]);
}
