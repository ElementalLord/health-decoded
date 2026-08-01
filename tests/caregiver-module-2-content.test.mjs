import assert from "node:assert/strict";
import test from "node:test";

import { caregiverModule2 } from "../features/caregiver/content/caregiver-module-2.ts";
import {
  caregiverModuleInteractionIds,
  caregiverModuleQuestionIds,
  caregiverModuleSectionIds,
  toCaregiverStableId,
} from "../features/caregiver/content/caregiver-ids.ts";
import { getCaregiverSourceTrace } from "../features/caregiver/content/caregiver-source-map.ts";

const sectionIds = Object.values(caregiverModule2.sections).map(({ id }) => id);
const interactionIds = Object.values(caregiverModule2.interactions).map(({ id }) => id);
const questionIds = caregiverModule2.questions.map(({ id }) => id);
const allIds = [
  caregiverModule2.id,
  ...sectionIds,
  ...interactionIds,
  ...questionIds,
  caregiverModule2.reflection.id,
];

test("Module 2 exposes the approved deterministic identity and exact central idea", () => {
  assert.equal(caregiverModule2.id, "CG-M2");
  assert.equal(caregiverModule2.slug, "support-without-taking-over");
  assert.equal(caregiverModule2.renderingMode, "deterministic");
  assert.equal(caregiverModule2.runtimeGeneration, false);
  assert.equal(caregiverModule2.source.runtimeGeneration, false);
  assert.equal(
    caregiverModule2.sections.opening.centralIdea,
    "Good support begins with permission and stays specific, proportional, private, easy to decline, and open to change.",
  );
});

test("Module 2 contains every approved stable section, interaction, question, and reflection ID once", () => {
  assert.deepEqual(
    sectionIds,
    caregiverModuleSectionIds.filter((id) => id.startsWith("CG-M2-")),
  );
  assert.deepEqual(
    interactionIds,
    caregiverModuleInteractionIds.filter((id) => id.startsWith("CG-M2-")),
  );
  assert.deepEqual(
    questionIds,
    caregiverModuleQuestionIds.filter((id) => id.startsWith("CG-M2-")),
  );
  assert.equal(caregiverModule2.reflection.id, "CG-M2-R01");
  assert.equal(new Set(allIds).size, allIds.length);
  allIds.forEach((id) => assert.equal(toCaregiverStableId(id), id));
});

test("every implemented Module 2 ID resolves to the authoritative Module 2 source", () => {
  for (const id of allIds) {
    const trace = getCaregiverSourceTrace(toCaregiverStableId(id));
    assert.equal(trace.document, "docs/caregiver/01-CAREGIVER-CONTENT.md");
    assert.equal(trace.heading, "MODULE 2");
    if (id.includes("-I")) assert.equal(trace.correction, "CG-TOOL-ISSUE-001");
  }
  assert.equal(caregiverModule2.source.heading, "MODULE 2: SUPPORT WITHOUT TAKING OVER");
});

test("approved scenario, permission, repair, scripts, quiz, reflection, and takeaway copy is present", () => {
  assert.equal(caregiverModule2.sections.scenario.title, "The phone on the counter");
  assert.match(caregiverModule2.sections.distinction.closing, /One yes covers one agreed action/);
  assert.deepEqual(caregiverModule2.sections.permission.questions, [
    "What action are you offering?",
    "What information, if any, is involved?",
    "When does the agreement apply?",
    "How can either person pause or change it?",
    "Can no be given without guilt, argument, or repeated asking?",
  ]);
  assert.equal(caregiverModule2.sections.repair.steps.length, 5);
  assert.equal(caregiverModule2.scripts.length, 9);
  assert.equal(caregiverModule2.questions.length, 3);
  assert.match(caregiverModule2.reflection.privacy, /stays in this session/);
  assert.equal(
    caregiverModule2.takeaway.centralIdea,
    "Caring intention does not create access or authority.",
  );
});
