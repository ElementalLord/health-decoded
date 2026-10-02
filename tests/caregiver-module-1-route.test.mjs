import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { caregiverSessionConfiguration } from "../features/caregiver/content/caregiver-ids.ts";

const registry = await readFile(
  new URL("../features/caregiver/content/caregiver-module-registry.ts", import.meta.url),
  "utf8",
);
const route = await readFile(
  new URL("../app/(app)/caregiver/modules/[module-slug]/page.tsx", import.meta.url),
  "utf8",
);

test("Module 1 uses the authenticated dynamic route and unknown slugs still not-found", () => {
  assert.match(registry, /\[caregiverModule1\.slug\]/);
  assert.match(route, /Module1Experience/);
  assert.match(route, /if \(!moduleEntry\) notFound\(\)/);
  assert.match(route, /getCurrentProfile/);
  assert.equal(caregiverSessionConfiguration["CG-M1"].reflectionId, "CG-M1-R01");
});
