import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const lessonFiles = [
  "first-five-minutes-experience.tsx",
  "day-two-experience.tsx",
  "day-three-experience.tsx",
  "day-four-experience.tsx",
  "day-five-experience.tsx",
  "day-six-experience.tsx",
  "day-seven-experience.tsx",
  "day-eight-experience.tsx",
  "day-nine-experience.tsx",
  "day-ten-experience.tsx",
  "day-eleven-experience.tsx",
  "day-twelve-experience.tsx",
  "day-thirteen-experience.tsx",
];

const lessons = Object.fromEntries(
  lessonFiles.map((file) => [file, readFileSync(`features/lessons/components/${file}`, "utf8")]),
);

test("each lesson has a distinct instructional owner", () => {
  const ownershipMarkers = [
    ["first-five-minutes-experience.tsx", /The first follow-up/],
    ["day-two-experience.tsx", /insulin resistance/i],
    ["day-three-experience.tsx", /Read the label before the value/],
    ["day-four-experience.tsx", /Carbohydrates live in more places than dessert/],
    ["day-five-experience.tsx", /The muscle fuel room/],
    ["day-six-experience.tsx", /Two fit checks/],
    ["day-seven-experience.tsx", /Medication literacy/],
    ["day-eight-experience.tsx", /Question before device/],
    ["day-nine-experience.tsx", /Highs, lows, and knowing when to act/i],
    ["day-ten-experience.tsx", /Close the loop/],
    ["day-eleven-experience.tsx", /quiet changes/i],
    ["day-twelve-experience.tsx", /Pause · Understand · Choose · Adjust/],
    ["day-thirteen-experience.tsx", /Stigma writes social rules/],
  ];

  for (const [file, marker] of ownershipMarkers) {
    assert.match(lessons[file], marker, `${file} is missing its owned teaching concept`);
  }
});

test("movement lessons expose separate mechanism and application journeys", () => {
  assert.match(
    lessons["day-five-experience.tsx"],
    /const contentStage = \[0, 1, 2, 3, 5, 6, 8, 11, 13, 14, 15\]/,
  );
  assert.match(
    lessons["day-six-experience.tsx"],
    /const contentStage = \[0, 1, 2, 3, 4, 7, 8, 9, 10, 12, 13, 14\]/,
  );
  assert.match(lessons["day-five-experience.tsx"], /Movement mechanisms/);
  assert.match(lessons["day-six-experience.tsx"], /Your movement design/);
});

test("lab literacy and home monitoring expose separate journeys", () => {
  assert.match(
    lessons["day-three-experience.tsx"],
    /const contentStage = \[0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14\]/,
  );
  assert.match(lessons["day-three-experience.tsx"], /The limit of an average/);
  assert.match(lessons["day-eight-experience.tsx"], /Pattern detective/);
  assert.match(
    lessons["day-eight-experience.tsx"],
    /More data is\s+not\s+automatically more useful data/,
  );
});

test("later lessons do not reteach earlier lesson exercises", () => {
  assert.doesNotMatch(lessons["day-seven-experience.tsx"], /Consistency without surveillance/);
  assert.doesNotMatch(lessons["day-ten-experience.tsx"], /When life interrupts/);
  assert.doesNotMatch(lessons["day-thirteen-experience.tsx"], /Needing medicine means you failed/);
  assert.doesNotMatch(lessons["day-thirteen-experience.tsx"], /You caused your diabetes/);
  assert.match(lessons["day-twelve-experience.tsx"], /Make the call usable/);
});

test("lesson recaps have topic-specific labels", () => {
  const labels = [
    "First-day essentials",
    "Body-story recap",
    "Your lab-reading key",
    "Four permissions",
    "Movement mechanisms",
    "Your movement design",
    "Medicine literacy card",
    "Monitoring field notes",
    "Action cues",
    "Routine recipe",
    "Prevention calendar",
    "Problem-solving sequence",
    "Relationship agreements",
  ];
  const curriculum = Object.values(lessons).join("\n");

  for (const label of labels) {
    assert.equal(
      curriculum.split(label).length - 1,
      1,
      `expected one topic-specific recap label: ${label}`,
    );
  }
});
