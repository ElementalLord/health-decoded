import { resolve } from "node:path";

// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { checkContentIntegrity } from "./check-content-integrity.mts";
// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { checkImages } from "./check-images.mts";
// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import * as regressionChecks from "./check-regressions.mts";
// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { checkRoutes } from "./check-routes.mts";
// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { qualityConfig } from "./quality.config.mts";
import type { QualityChecker, QualityIssue } from "./types.mts";

const { checkAiEvaluations, checkProtectedContent, checkSpacedReview } = regressionChecks;

const checkers: Array<{ name: string; run: QualityChecker }> = [
  { name: "routes", run: checkRoutes },
  { name: "content", run: checkContentIntegrity },
  { name: "images", run: checkImages },
  { name: "ai", run: checkAiEvaluations },
  { name: "spaced-review", run: checkSpacedReview },
  { name: "protected", run: checkProtectedContent },
];

const args = process.argv.slice(2);
const json = args.includes("--json");
const selectedName = args.find((value) => value.startsWith("--check="))?.slice("--check=".length);
const selected = selectedName ? checkers.filter(({ name }) => name === selectedName) : checkers;

if (!selected.length) {
  process.stderr.write(
    `Unknown quality check "${selectedName}". Expected one of: ${checkers.map(({ name }) => name).join(", ")}\n`,
  );
  process.exitCode = 1;
} else {
  const context = { root: resolve(process.cwd()), now: new Date() };
  const results = [];
  for (const checker of selected) results.push(await checker.run(context));
  const issues: QualityIssue[] = results.flatMap((result) => result.issues);
  const errors = issues.filter(({ severity }) => severity === "error").length;
  const warnings = issues.filter(({ severity }) => severity === "warning").length;
  const infos = issues.filter(({ severity }) => severity === "info").length;
  const passed = errors === 0 && (!qualityConfig.failOnWarnings || warnings === 0);

  if (json) {
    process.stdout.write(
      `${JSON.stringify({ passed, summary: { errors, warnings, infos }, checks: results.map(({ name, label, issues: checkIssues }) => ({ name, label, status: checkIssues.some(({ severity }) => severity === "error") ? "error" : checkIssues.some(({ severity }) => severity === "warning") ? "warning" : "pass" })), issues }, null, 2)}\n`,
    );
  } else {
    process.stdout.write("Health Decoded Quality Check\n\n");
    for (const result of results) {
      const status = result.issues.some(({ severity }) => severity === "error")
        ? "FAIL"
        : result.issues.some(({ severity }) => severity === "warning")
          ? "WARN"
          : "PASS";
      process.stdout.write(`${result.label.padEnd(32, ".")} ${status}\n`);
    }
    for (const issue of issues) {
      process.stdout.write(
        `\n[${issue.check}]\n${issue.severity.toUpperCase()} ${issue.code}\n${issue.file ? `${issue.file}\n` : ""}${issue.message}\n${issue.suggestion ? `Suggestion: ${issue.suggestion}\n` : ""}`,
      );
    }
    process.stdout.write(
      `\n${warnings} warning${warnings === 1 ? "" : "s"}\n${errors} blocking error${errors === 1 ? "" : "s"}\n\nQuality check ${passed ? "passed" : "failed"}.\n`,
    );
  }
  process.exitCode = passed ? 0 : 1;
}
