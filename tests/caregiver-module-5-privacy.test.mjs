import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const source = (
  await Promise.all(
    [
      "content/caregiver-module-5.ts",
      "components/modules/module-5/module-5-experience.tsx",
      "components/modules/module-5/module-5-reflection.tsx",
    ].map((name) => readFile(new URL(name, directory), "utf8")),
  )
).join("\n");
test("Module 5 has no persistence, AI, analytics, logging, or real contact collection", () => {
  assert.doesNotMatch(
    source,
    /supabase|services\/ai|localStorage|sessionStorage|indexedDB|fetch\(|useSearchParams|analytics/i,
  );
  assert.match(source, /data-storage="session-only"/);
  assert.doesNotMatch(source, /type="email"|type="tel"/);
});
