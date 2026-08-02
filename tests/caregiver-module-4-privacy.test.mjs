import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = [
  "content/caregiver-module-4.ts",
  "components/modules/module-4/module-4-experience.tsx",
  "components/modules/module-4/module-4-reflection.tsx",
];
const source = (
  await Promise.all(
    files.map((file) =>
      readFile(new URL(`../features/caregiver/${file}`, import.meta.url), "utf8"),
    ),
  )
).join("\n");

test("Module 4 has no persistence, AI, analytics, or network dependency", () => {
  assert.doesNotMatch(
    source,
    /supabase|services\/ai|localStorage|sessionStorage|indexedDB|fetch\(|useSearchParams|analytics/i,
  );
  assert.match(source, /data-storage="session-only"/);
});

test("Module 4 never collects real medical values", () => {
  assert.doesNotMatch(source, /type="number"|name="glucose|name="symptom|name="dose/i);
});
