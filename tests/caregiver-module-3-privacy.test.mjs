import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = [
  "caregiver-module-3.ts",
  "../components/modules/module-3/shared-planning-workspace.tsx",
  "../components/modules/module-3/request-matching.tsx",
  "../components/modules/module-3/module-3-reflection.tsx",
];
const source = (
  await Promise.all(
    files.map((file) =>
      readFile(new URL(`../features/caregiver/content/${file}`, import.meta.url), "utf8"),
    ),
  )
).join("\n");

test("Module 3 sends no state to persistence, AI, analytics, logging, or URLs", () => {
  assert.doesNotMatch(
    source,
    /from ["'][^"']*(supabase|services\/ai|logging)|localStorage|sessionStorage|indexedDB|fetch\(|useSearchParams/,
  );
  assert.match(source, /data-storage="session-only"/);
});

test("Module 3 contains no individualized medical recommendation or surveillance system", () => {
  assert.doesNotMatch(
    source,
    /carbohydrate target|step goal|glucose chart|calorie counter|adherence score/i,
  );
  assert.match(source, /not a treatment for a reading or symptom/);
});
