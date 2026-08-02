import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import { caregiverLandingRoutes } from "../features/caregiver/content/caregiver-landing.ts";

const [landingSource, routerSource, guidedPathSource, registrySource] = await Promise.all([
  readFile(
    new URL("../features/caregiver/components/landing/caregiver-landing.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../features/caregiver/components/landing/caregiver-need-router.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../features/caregiver/components/landing/caregiver-guided-path.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../features/caregiver/content/caregiver-module-registry.ts", import.meta.url),
    "utf8",
  ),
]);

test("the active caregiver prototype presents five actionable modules and no tool UI", () => {
  assert.equal(caregiverLandingRoutes.length, 5);
  assert.deepEqual(
    caregiverLandingRoutes.map((route) => route.order),
    [1, 2, 3, 4, 5],
  );
  assert.doesNotMatch(landingSource, /CaregiverToolsIntroduction|caregiver-tools/);
  assert.doesNotMatch(routerSource, /CG-T\d|caregiver\/tools|tool/iu);
  assert.match(guidedPathSource, /getImplementedCaregiverModuleById/);
  assert.match(registrySource, /caregiverModule[1-5]/);
});

test("deferred tools and final caregiver completion have no prototype route files", async () => {
  for (const path of [
    "../app/(app)/caregiver/tools/what-should-i-say/page.tsx",
    "../app/(app)/caregiver/tools/know-the-plan/page.tsx",
    "../app/(app)/caregiver/tools/self-check/page.tsx",
    "../app/(app)/caregiver/tools/shared-support-plan/page.tsx",
    "../app/(app)/caregiver/complete/page.tsx",
  ]) {
    await assert.rejects(access(new URL(path, import.meta.url)));
  }
});
