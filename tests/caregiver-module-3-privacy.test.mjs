import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (
  await Promise.all([
    readFile(
      new URL("../features/caregiver/content/caregiver-module-3.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../features/caregiver/components/modules/module-3/module-3-experience.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
  ])
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
