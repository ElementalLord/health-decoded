import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const registry = await readFile(
  new URL("../features/caregiver/content/caregiver-module-registry.ts", import.meta.url),
  "utf8",
);
const route = await readFile(
  new URL("../app/(app)/caregiver/modules/[module-slug]/page.tsx", import.meta.url),
  "utf8",
);
test("Module 4 uses the protected dynamic module route", () => {
  assert.match(registry, /caregiverModule4/);
  assert.match(registry, /\$\{caregiverModule4\.slug\}/);
  assert.match(route, /Module4Experience/);
  assert.match(route, /getCurrentProfile/);
  assert.match(route, /if \(!moduleEntry\) notFound\(\)/);
});
