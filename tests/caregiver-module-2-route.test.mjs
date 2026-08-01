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

test("the module registry exposes only the approved Module 2 destination", () => {
  assert.match(registry, /\[caregiverModule2\.slug\]/);
  assert.match(registry, /`\/caregiver\/modules\/\$\{caregiverModule2\.slug\}`/);
  assert.match(registry, /if \(slug !== caregiverModule2\.slug\) return null/);
  assert.doesNotMatch(
    registry,
    /CG-M[1345]|what-they-may|everyday-support|when-something|caregiver-matters/,
  );
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

test("landing activates M2 through the registry and leaves all other module destinations static", () => {
  for (const source of [guided, router]) {
    assert.match(source, /caregiverModuleRegistry\["support-without-taking-over"\]\.route/);
    assert.match(source, /window\.location\.assign/);
    assert.match(source, /route\.id === "CG-M2"|submittedRoute\.id === "CG-M2"/);
    assert.doesNotMatch(source, /caregiverModuleRegistry\["(?!support-without-taking-over)/);
  }
  assert.match(router, /destinationUnavailable/);
});

test("urgent help remains directly reachable from Module 2", () => {
  assert.match(route, /Module2Experience/);
  assert.match(orientation, /href="\/caregiver\/urgent-help"/);
});
