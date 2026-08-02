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

test("Module 3 remains on the authenticated dynamic route alongside Modules 4 and 5", () => {
  assert.match(registry, /\[caregiverModule3\.slug\]/);
  assert.match(route, /Module3Experience/);
  assert.match(route, /if \(!moduleEntry\) notFound\(\)/);
  assert.match(route, /getCurrentProfile/);
  assert.match(route, /CG-M3-R01/);
  assert.match(registry, /caregiverModule4/);
  assert.match(registry, /caregiverModule5/);
});
