import { runAllEvaluations } from "../../tests/ai-evals/eval-engine.mjs";

const results = runAllEvaluations();
const totals = results.reduce<Record<string, number>>((summary, result) => {
  summary[result.status] = (summary[result.status] ?? 0) + 1;
  return summary;
}, {});

process.stdout.write("Health Decoded AI Integrity Evaluation\n\n");
process.stdout.write("ID | SYSTEM | CATEGORY | EXPECTED | ACTUAL | STATUS | CRITICAL\n");
process.stdout.write("--- | --- | --- | --- | --- | --- | ---\n");
for (const result of results) {
  process.stdout.write(
    `${result.id} | ${result.system} | ${result.category} | ${result.expected} | ${result.actual.replaceAll("|", "/")} | ${result.status} | ${result.critical ? "YES" : "NO"}\n`,
  );
}
process.stdout.write(
  `\nTotal: ${results.length}; ${Object.entries(totals)
    .map(([status, count]) => `${status}=${count}`)
    .join(", ")}\n`,
);
process.exitCode = results.some(({ status }) => status.startsWith("FAIL")) ? 1 : 0;
