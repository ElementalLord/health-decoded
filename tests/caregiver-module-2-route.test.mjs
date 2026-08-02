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
const guided = await readFile(
  new URL("../features/caregiver/components/landing/caregiver-guided-path.tsx", import.meta.url),
  "utf8",
);
const router = await readFile(
  new URL("../features/caregiver/components/landing/caregiver-need-router.tsx", import.meta.url),
  "utf8",
);
const orientation = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-2/module-2-orientation.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("the module registry preserves Module 2 alongside all five implemented modules", () => {
  assert.match(registry, /\[caregiverModule2\.slug\]/);
  assert.match(registry, /`\/caregiver\/modules\/\$\{caregiverModule2\.slug\}`/);
  assert.match(registry, /slug in caregiverModuleRegistry/);
  assert.match(registry, /caregiverModule1/);
  assert.match(registry, /caregiverModule3/);
  assert.match(registry, /caregiverModule4/);
  assert.match(registry, /caregiverModule5/);
});

test("unknown module slugs use not-found while the implemented route retains auth checks", () => {
  assert.match(route, /getImplementedCaregiverModule\(moduleSlug\)/);
  assert.match(route, /if \(!moduleEntry\) notFound\(\)/);
  assert.match(route, /getCurrentProfile\(\)/);
  assert.match(route, /redirect\("\/journey"\)/);
  assert.match(route, /redirect\("\/onboarding"\)/);
  assert.match(route, /CaregiverSessionProvider/);
  assert.match(route, /Module2Experience/);
});

test("landing activates all five modules through the registry lookup", () => {
  for (const source of [guided, router]) {
    assert.match(source, /getImplementedCaregiverModuleById/);
    assert.match(source, /getImplementedCaregiverModuleById\([^)]*\.id\)/);
  }
});

test("urgent help remains directly reachable from Module 2", () => {
  assert.match(route, /Module2Experience/);
  assert.match(orientation, /href="\/caregiver\/urgent-help"/);
});
