import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const lessonExperiences = [
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
];

test("returns every completed custom lesson to a calm journey acknowledgement", () => {
  for (const filename of lessonExperiences) {
    const lessonSource = source(`features/lessons/components/${filename}`);

    assert.match(
      lessonSource,
      /router\.push\(`\/journey\?completed=\$\{experience\.dayNumber\}`\)/,
      `${filename} should return through the shared completion arrival`,
    );
    assert.match(
      lessonSource,
      /Saving your progress…/,
      `${filename} should immediately acknowledge the completion save`,
    );
  }
});

test("keeps the completion arrival truthful and non-pressuring", () => {
  const arrivalSource = source("features/journeys/components/lesson-completion-arrival.tsx");
  const journeySource = source("app/(app)/journey/page.tsx");

  assert.match(arrivalSource, /A step worth noticing/);
  assert.match(arrivalSource, /with no rush to begin it/);
  assert.match(arrivalSource, /role="status"/);
  assert.match(journeySource, /completedDay <= journey\.data\.progress\.completedLessons/);
});

test("gives the AI guide transparent context and user control", () => {
  const aiSource = source("features/ai/components/ai-chat.tsx");
  const aiPageSource = source("app/(app)/ai/page.tsx");

  assert.match(aiSource, /Connected to today&apos;s lesson/);
  assert.match(aiSource, /Stop response/);
  assert.match(aiSource, /Start fresh\?/);
  assert.match(aiSource, /messages in this private session will be cleared/);
  assert.match(aiSource, /aria-busy=\{isStreaming\}/);
  assert.match(aiPageSource, /Ask Health Decoded chat workspace/);
  assert.match(aiPageSource, /Your private learning conversation/);
  assert.match(aiPageSource, /rounded-\[28px\].*border.*bg-\[#fffaf3\].*shadow/);
});

test("keeps completed lesson review in Progress instead of duplicating it on Journey", () => {
  const journeySource = source("app/(app)/journey/page.tsx");
  const progressSource = source("features/progress/components/learning-record.tsx");

  assert.doesNotMatch(journeySource, /CompletedLessonReview|Your lesson library/);
  assert.match(journeySource, /Open your learning record/);
  assert.match(progressSource, /href=\{`\/lessons\/\$\{milestone\.dayNumber\}`\}/);
});

test("acknowledges reflection without grading it", () => {
  const confidenceActionSource = source("features/journeys/actions/confidence.actions.ts");

  assert.match(confidenceActionSource, /Thank you for checking in/);
  assert.match(confidenceActionSource, /There is no right answer/);
});
