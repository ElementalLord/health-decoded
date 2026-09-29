import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-1/module-1-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("the rebuilt Module 1 stores no answers or personal reflections", () => {
  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|indexedDB|fetch\(|useSearchParams|services\/ai|logging/,
  );
  assert.doesNotMatch(source, /textarea|text entry|reflection/i);
  assert.match(source, /useState<Record<string, ObservationGroup>>/);
  assert.match(source, /useState<Record<string, number>>/);
});
