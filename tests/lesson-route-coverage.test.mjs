import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");

const customLessons = [
  [
    1,
    "first-five-minutes-experience.tsx",
    "FirstFiveMinutesExperience",
    /const screenCount = (\d+)/,
  ],
  [2, "day-two-experience.tsx", "DayTwoExperience", /const stageCount = (\d+)/],
  [3, "day-three-experience.tsx", "DayThreeExperience", /const stageCount = (\d+)/],
  [4, "day-four-experience.tsx", "DayFourExperience", /const stageCount = (\d+)/],
  [5, "day-five-experience.tsx", "DayFiveExperience", /const stageCount = (\d+)/],
  [6, "day-six-experience.tsx", "DaySixExperience", /const stageCount = (\d+)/],
  [7, "day-seven-experience.tsx", "DaySevenExperience", /const stageCount = (\d+)/],
  [8, "day-eight-experience.tsx", "DayEightExperience", /const stageCount = (\d+)/],
  [9, "day-nine-experience.tsx", "DayNineExperience", /const stageCount = (\d+)/],
  [10, "day-ten-experience.tsx", "DayTenExperience", /const stageCount = (\d+)/],
  [11, "day-eleven-experience.tsx", "DayElevenExperience", /const stageCount = (\d+)/],
  [12, "day-twelve-experience.tsx", "DayTwelveExperience", /const stageCount = (\d+)/],
  [13, "day-thirteen-experience.tsx", "DayThirteenExperience", /const stageCount = (\d+)/],
];

test("the player dispatches all thirteen custom lesson days", () => {
  for (const [day, file, exportName] of customLessons) {
    assert.match(player, new RegExp(`components/${file.replace(".tsx", "")}`));
    assert.match(player, new RegExp(`lesson\\.dayNumber === ${day}\\) return <${exportName}`));
  }

  assert.equal((player.match(/lesson\.dayNumber === \d+/g) ?? []).length, 13);
});

test("every custom lesson has a navigable multi-chapter experience and completion path", () => {
  for (const [day, file, exportName, countPattern] of customLessons) {
    const source = readFileSync(`features/lessons/components/${file}`, "utf8");
    const count = Number(source.match(countPattern)?.[1]);

    assert.ok(count > 1, `Day ${day} should have more than one chapter`);
    assert.match(source, new RegExp(`export function ${exportName}`));
    assert.match(source, /saveLessonPositionAction/);
    assert.match(source, /completeLessonAction/);
    assert.match(source, /router\.push\(`\/journey\?completed=\$\{experience\.dayNumber\}`\)/);
  }
});

test("the lesson route validates input and renders the shared player", () => {
  const route = readFileSync("app/(app)/lessons/[day]/page.tsx", "utf8");
  const schema = readFileSync("features/lessons/schemas/lesson-route.schema.ts", "utf8");

  assert.match(route, /lessonDaySchema\.safeParse/);
  assert.match(route, /getAuthorizedLesson\(parsedDay\.data\)/);
  assert.match(route, /<LessonPlayer lesson=\{lesson\.data\}/);
  assert.match(schema, /\.int\(\)\.min\(1\)/);
});
