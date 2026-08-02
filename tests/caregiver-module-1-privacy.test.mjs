import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = [
  "caregiver-module-1.ts",
  "../components/modules/module-1/observation-interpretation-workbench.tsx",
  "../components/modules/module-1/module-1-reflection.tsx",
];
const source = (
  await Promise.all(
    files.map((file) =>
      readFile(new URL(`../features/caregiver/content/${file}`, import.meta.url), "utf8"),
    ),
  )
).join("\n");

test("Module 1 sends no state to persistence, AI, analytics, logging, or URLs", () => {
  assert.doesNotMatch(
    source,
    /from ["'][^"']*(supabase|services\/ai|logging)|localStorage|sessionStorage|indexedDB|fetch\(|useSearchParams/,
  );
  assert.match(source, /data-storage="session-only"/);
  assert.match(source, /excluded from analytics and AI Tutor transfer/);
});
