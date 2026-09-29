import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  applyCaregiverInteractionSubmission,
  deriveCaregiverModuleState,
  isCaregiverModuleComplete,
} from "../features/caregiver/lib/caregiver-completion.ts";
import { caregiverModule2 } from "../features/caregiver/content/caregiver-module-2.ts";

const initial = {
  moduleId: "CG-M2",
  state: "notStarted",
  centralIdeaReached: false,
  coreApplicationCompleted: false,
  takeawayViewed: false,
  keyIdeaUnderstood: null,
  lastSectionId: null,
};

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-2/module-2-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("only I03 sets the Module 2 core application gate", () => {
  for (const interactionId of ["CG-M2-I01", "CG-M2-I02", "CG-M2-I04", "CG-M2-I05"]) {
    const next = applyCaregiverInteractionSubmission(initial, interactionId);
    assert.equal(next.coreApplicationCompleted, false);
  }
  assert.equal(
    applyCaregiverInteractionSubmission(initial, "CG-M2-I03").coreApplicationCompleted,
    true,
  );
});

test("central idea, I03, and takeaway remain the only completion gates", () => {
  const complete = {
    centralIdeaReached: true,
    coreApplicationCompleted: true,
    takeawayViewed: true,
  };
  assert.equal(isCaregiverModuleComplete(complete), true);
  for (const gate of Object.keys(complete)) {
    assert.equal(isCaregiverModuleComplete({ ...complete, [gate]: false }), false);
  }
  assert.equal(deriveCaregiverModuleState({ ...initial, ...complete }), "completed");
});

test("the story flow gates the permission builder and offers implemented exits", () => {
  assert.match(source, /data-core-application="true"/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
  assert.match(source, /current === 6 && !coreComplete/);
  assert.match(source, /caregiverModuleRegistry\["everyday-support-that-actually-helps"\]\.route/);
  assert.match(source, /Review the offer/);
  assert.match(source, /function restart\(\)/);
  assert.doesNotMatch(source, /aria-disabled="true"/);
  assert.equal(
    caregiverModule2.completion.practiced,
    "You reached the central idea, practiced making support easier to decline, and reviewed the practical takeaway. The other activities remain available whenever you want to revisit them.",
  );
});
