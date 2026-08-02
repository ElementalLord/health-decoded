import assert from "node:assert/strict";
import test from "node:test";

import {
  assertCaregiverPersistentProgressField,
  caregiverAccountPersistenceDenylist,
  caregiverFutureLocalDocumentAllowlist,
  caregiverPersistentProgressAllowlist,
  caregiverPhaseOnePersistenceCapabilities,
  caregiverSessionOnlyDataKinds,
  isCaregiverPersistentProgressField,
} from "../features/caregiver/lib/caregiver-persistence-boundaries.ts";
import { caregiverSessionBoundary } from "../features/caregiver/types/caregiver-session.ts";

test("persistent progress is a narrow explicit allowlist", () => {
  assert.ok(caregiverPersistentProgressAllowlist.includes("modules[].keyIdeaUnderstood"));
  assert.ok(caregiverPersistentProgressAllowlist.includes("modules[].coreApplicationCompleted"));
  assert.equal(isCaregiverPersistentProgressField("reflectionText"), false);
  assert.equal(isCaregiverPersistentProgressField("modules[].answers"), false);
  assert.doesNotThrow(() => assertCaregiverPersistentProgressField("modules[].takeawayViewed"));
  assert.throws(
    () => assertCaregiverPersistentProgressField("selfCheckAnswers"),
    /may not persist field/,
  );
});

test("sensitive and session-only data cannot enter account progress", () => {
  for (const deniedField of [
    "reflectionText",
    "dialogueDraft",
    "selfCheckAnswers",
    "knowThePlanContent",
    "sharedSupportPlanContent",
    "customNextStepDetail",
    "glucoseReadings",
    "medicationLogs",
    "clinicianMessages",
  ]) {
    assert.ok(caregiverAccountPersistenceDenylist.includes(deniedField));
  }

  assert.deepEqual(caregiverSessionOnlyDataKinds, [
    "module-reflection",
    "what-should-i-say-draft",
    "caregiver-self-check",
    "custom-next-step-detail",
  ]);
  assert.equal(
    Object.values(caregiverSessionBoundary).every((value) => value === false),
    true,
  );
});

test("Phase 1 implements no browser persistence while preserving the future tool allowlist", () => {
  assert.deepEqual(caregiverFutureLocalDocumentAllowlist, ["CG-T2", "CG-T4"]);
  assert.equal(caregiverPhaseOnePersistenceCapabilities.localStorage, false);
  assert.equal(caregiverPhaseOnePersistenceCapabilities.indexedDb, false);
  assert.equal(caregiverPhaseOnePersistenceCapabilities.accountSensitiveContent, false);
  assert.equal(caregiverPhaseOnePersistenceCapabilities.analyticsSensitiveContent, false);
  assert.equal(caregiverPhaseOnePersistenceCapabilities.aiTutorSensitiveContent, false);
});
