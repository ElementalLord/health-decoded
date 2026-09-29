import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [registry, route, guided, router, experience] = await Promise.all([
  readFile(new URL("features/caregiver/content/caregiver-module-registry.ts", root), "utf8"),
  readFile(new URL("app/(app)/caregiver/modules/[module-slug]/page.tsx", root), "utf8"),
  readFile(
    new URL("features/caregiver/components/landing/caregiver-guided-path.tsx", root),
    "utf8",
  ),
  readFile(
    new URL("features/caregiver/components/landing/caregiver-need-router.tsx", root),
    "utf8",
  ),
  readFile(
    new URL("features/caregiver/components/modules/module-2/module-2-experience.tsx", root),
    "utf8",
  ),
]);

test("the registry preserves Module 2 alongside all five implemented modules", () => {
  assert.match(registry, /\[caregiverModule2\.slug\]/);
  assert.match(registry, /`\/caregiver\/modules\/\$\{caregiverModule2\.slug\}`/);
  for (const moduleName of [
    "caregiverModule1",
    "caregiverModule3",
    "caregiverModule4",
    "caregiverModule5",
  ]) {
    assert.match(registry, new RegExp(moduleName));
  }
});

test("the protected dynamic route still selects the rebuilt Module 2", () => {
  assert.match(route, /getImplementedCaregiverModule\(moduleSlug\)/);
  assert.match(route, /if \(!moduleEntry\) notFound\(\)/);
  assert.match(route, /getCurrentProfile\(\)/);
  assert.match(route, /redirect\("\/journey"\)/);
  assert.match(route, /CaregiverSessionProvider/);
  assert.match(route, /Module2Experience/);
});

test("landing and module navigation remain focused on the caregiver journey", () => {
  for (const source of [guided, router]) assert.match(source, /getImplementedCaregiverModuleById/);
  assert.match(experience, /href="\/caregiver"/);
  assert.doesNotMatch(experience, /urgent-help|immediate danger/iu);
});
