import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourcePaths = [
  "../features/caregiver/components/landing/caregiver-landing.tsx",
  "../features/caregiver/components/landing/caregiver-need-router.tsx",
  "../features/caregiver/components/landing/caregiver-guided-path.tsx",
  "../features/caregiver/components/landing/caregiver-returning-state.tsx",
  "../features/caregiver/content/caregiver-landing.ts",
  "../app/(app)/caregiver/page.tsx",
];

const sources = await Promise.all(
  sourcePaths.map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
const combinedSource = sources.join("\n");
const productionLandingSource = sources[0];
const returningSource = sources[3];

test("landing choices remain component state and never enter storage, URLs, AI, or analytics", () => {
  assert.match(combinedSource, /useState/);
  assert.doesNotMatch(
    combinedSource,
    /localStorage|sessionStorage|indexedDB|supabase|fetch\(|analytics|trackEvent|searchParams|router\.push|AI Tutor handoff/,
  );
  assert.doesNotMatch(
    combinedSource,
    /caregiverName|supportedPersonName|personName|glucoseReading/,
  );
});

test("production truthfully renders first visit and does not fabricate returning activity", () => {
  assert.match(productionLandingSource, /<CaregiverFirstVisit \/>/);
  assert.doesNotMatch(productionLandingSource, /CaregiverReturningState/);
  assert.doesNotMatch(productionLandingSource, /recentModuleTitle|recentToolName/);
});

test("returning-state contract accepts only privacy-safe public progress labels", () => {
  assert.match(returningSource, /CaregiverReturningStateData/);
  assert.match(returningSource, /recentModuleTitle/);
  assert.match(returningSource, /recentSectionTitle/);
  assert.match(returningSource, /nextModuleTitle/);
  assert.doesNotMatch(returningSource, /recentToolName|toolShortcutLabel/);
  assert.doesNotMatch(
    returningSource,
    /draft|planContent|selfCheck|reflection|healthInformation|medication|reading|answer/,
  );
});
