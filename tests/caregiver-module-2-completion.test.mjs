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

test("only I03 sets the Module 2 core application gate", () => {
  for (const interactionId of ["CG-M2-I01", "CG-M2-I02", "CG-M2-I04", "CG-M2-I05"]) {
    const next = applyCaregiverInteractionSubmission(initial, interactionId);
    assert.equal(next.coreApplicationCompleted, false, `${interactionId} must stay optional`);
    assert.equal(next.state, "inProgress");
  }
  const core = applyCaregiverInteractionSubmission(initial, "CG-M2-I03");
  assert.equal(core.coreApplicationCompleted, true);
  assert.equal(core.state, "inProgress");
});

test("central idea, I03, and takeaway are all required and jointly sufficient", () => {
  const complete = {
    centralIdeaReached: true,
    coreApplicationCompleted: true,
    takeawayViewed: true,
  };
  assert.equal(isCaregiverModuleComplete(complete), true);
  for (const gate of Object.keys(complete)) {
    assert.equal(isCaregiverModuleComplete({ ...complete, [gate]: false }), false);
  }
});

test("knowledge-check and reflection state never gate completion", () => {
  const progress = {
    ...initial,
    state: "inProgress",
    centralIdeaReached: true,
    coreApplicationCompleted: true,
    takeawayViewed: true,
    keyIdeaUnderstood: false,
  };
  assert.equal(deriveCaregiverModuleState(progress), "completed");
  assert.equal("reflection" in progress, false);
  assert.equal("answers" in progress, false);
});

test("completion does not claim quiz understanding before the optional check is submitted", async () => {
  const source = await readFile(
    new URL(
      "../features/caregiver/components/modules/module-2/module-2-completion.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(source, /completed && progress\.keyIdeaUnderstood !== null/);
});

test("completion continues directly to the implemented Module 3 route", async () => {
  const source = await readFile(
    new URL(
      "../features/caregiver/components/modules/module-2/module-2-completion.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(source, /caregiverModuleRegistry\["everyday-support-that-actually-helps"\]\.route/);
  assert.doesNotMatch(source, /aria-disabled="true"/);
});

test("completion copy names only the required Module 2 work and leaves optional practice open", () => {
  assert.equal(
    caregiverModule2.completion.practiced,
    "You reached the central idea, practiced making support easier to decline, and reviewed the practical takeaway. The other activities remain available whenever you want to revisit them.",
  );
});
