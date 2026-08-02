import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  caregiverLandingContent,
  caregiverLandingRoutes,
  caregiverLandingSource,
  caregiverUrgentHelpContent,
} from "../features/caregiver/content/caregiver-landing.ts";
import {
  caregiverStableIds,
  // @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
} from "../features/caregiver/content/caregiver-ids.ts";

const approvedContent = await readFile(
  new URL("../docs/caregiver/01-CAREGIVER-CONTENT.md", import.meta.url),
  "utf8",
);

test("landing content uses the three approved stable IDs and source trace", () => {
  assert.equal(caregiverLandingContent.id, "CG-LANDING");
  assert.deepEqual(caregiverLandingContent.interactionIds, ["CG-LANDING-I01", "CG-LANDING-I02"]);
  assert.deepEqual(caregiverLandingSource.ids, ["CG-LANDING", "CG-LANDING-I01", "CG-LANDING-I02"]);
  assert.ok(caregiverLandingSource.ids.every((id) => caregiverStableIds.includes(id)));
  assert.equal(caregiverLandingSource.heading, "LANDING PAGE");
  assert.equal(caregiverLandingContent.runtimeGeneration, false);
});

test("approved hero, safety, boundary, first-visit, and interaction copy remains exact", () => {
  const exactStrings = [
    caregiverLandingContent.hero.eyebrow,
    caregiverLandingContent.hero.title,
    caregiverLandingContent.hero.explanation,
    caregiverLandingContent.hero.audience,
    caregiverLandingContent.safety.linkLabel,
    caregiverLandingContent.safety.boundary,
    caregiverLandingContent.safety.missingRegion,
    caregiverLandingContent.needRouter.prompt,
    caregiverLandingContent.guidedPath.prompt,
    caregiverLandingContent.autonomy.heading,
    caregiverLandingContent.autonomy.copy,
    caregiverLandingContent.firstVisit.greeting,
    caregiverLandingContent.firstVisit.copy,
    caregiverUrgentHelpContent.productLimitation,
    caregiverUrgentHelpContent.doNotDelay,
  ];

  for (const copy of exactStrings) assert.ok(approvedContent.includes(copy), copy);
});

test("all five active module routes, descriptions, and feedback are present", () => {
  assert.equal(caregiverLandingRoutes.length, 5);

  for (const route of caregiverLandingRoutes) {
    assert.ok(approvedContent.includes(route.title));
    assert.ok(approvedContent.includes(route.description));
    assert.ok(approvedContent.includes(route.feedback));
  }
});
