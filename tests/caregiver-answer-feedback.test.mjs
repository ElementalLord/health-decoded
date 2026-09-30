import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { caregiverModule4 } from "../features/caregiver/content/caregiver-module-4.ts";
import { caregiverModule5 } from "../features/caregiver/content/caregiver-module-5.ts";
import { orderCaregiverChoices } from "../features/caregiver/lib/caregiver-choice-order.ts";

const moduleFiles = [1, 2, 3, 4, 5].map((moduleNumber) =>
  readFileSync(
    new URL(
      `../features/caregiver/components/modules/module-${moduleNumber}/module-${moduleNumber}-experience.tsx`,
      import.meta.url,
    ),
    "utf8",
  ),
);
const styles = readFileSync(
  new URL("../features/caregiver/styles/caregiver-module-1-story.module.css", import.meta.url),
  "utf8",
);

test("every caregiver module gives direct correct and incorrect feedback", () => {
  for (const source of moduleFiles) {
    assert.match(source, /"Correct\."/);
    assert.match(source, /"Incorrect\."/);
    assert.match(source, /data-result=/);
  }
});

test("correct answers receive a restrained green state while incorrect choices keep the base palette", () => {
  assert.match(styles, /button\[data-result="correct"\][\s\S]*background: #edf5ed/);
  assert.match(styles, /\[data-result="correct"\][\s\S]*background: #f4f8f3/);
  assert.doesNotMatch(styles, /button\[data-result="incorrect"\][\s\S]*background:/);
});

test("choice ordering is stable without predictable answer-position streaks", () => {
  const choices = ["A", "B", "C", "D"];
  const firstPass = Array.from({ length: 12 }, (_, step) =>
    orderCaregiverChoices(choices, "caregiver-test", step, 0),
  );
  const secondPass = Array.from({ length: 12 }, (_, step) =>
    orderCaregiverChoices(choices, "caregiver-test", step, 0),
  );

  assert.deepEqual(firstPass, secondPass);

  const positions = firstPass.map((ordered) =>
    ordered.findIndex((choice) => choice.originalIndex === 0),
  );
  for (let index = 1; index < positions.length; index += 1) {
    assert.notEqual(positions[index], positions[index - 1]);
  }

  for (const ordered of firstPass) {
    assert.deepEqual([...ordered].map((choice) => choice.value).sort(), [...choices].sort());
  }

  const binaryPositions = Array.from({ length: 20 }, (_, step) =>
    orderCaregiverChoices(["Yes", "No"], "caregiver-binary-test", step, 0).findIndex(
      (choice) => choice.originalIndex === 0,
    ),
  );
  assert.ok(
    binaryPositions.some((position, index) => index > 0 && position === binaryPositions[index - 1]),
  );
  for (let index = 2; index < binaryPositions.length; index += 1) {
    assert.ok(
      binaryPositions[index] !== binaryPositions[index - 1] ||
        binaryPositions[index] !== binaryPositions[index - 2],
    );
  }
});

test("binary caregiver practices no longer make yes the dominant answer", () => {
  const groups = [
    caregiverModule4.interactions.context.choices.map((choice) => choice.preferred),
    caregiverModule4.interactions.handoff.items.map((item) => item.include),
    caregiverModule4.interactions.improvisation.actions.map((action) => action.unsafe),
    caregiverModule5.interactions.sustainability.choices.map((choice) => choice.preferred),
    caregiverModule5.interactions.load.patterns.map((pattern) => pattern.preferred),
  ];

  for (const answers of groups) {
    const yes = answers.filter(Boolean).length;
    const no = answers.length - yes;
    assert.ok(Math.abs(yes - no) <= 1);
  }
});
