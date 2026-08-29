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
  "day-twelve-experience.tsx",
  "day-thirteen-experience.tsx",
  "day-fourteen-experience.tsx",
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
  assert.match(aiPageSource, /AI Tutor/);
  assert.match(aiPageSource, /Ask about diabetes or something you&apos;re learning/);
  assert.match(aiSource, /Private to this visit/);
  assert.match(aiSource, /General diabetes education only/);
  assert.match(aiSource, /A place to begin/);
  assert.match(aiSource, /Continue learning/);
  assert.match(aiSource, /rounded-\[18px\] rounded-tr-\[6px\]/);
  assert.match(aiSource, /Ask follow-up/);
  assert.doesNotMatch(aiPageSource, /border-t-4|shadow-\[/);
  assert.match(aiSource, /min-h-24/);
});

test("keeps completed lesson review in Progress instead of duplicating it on Journey", () => {
  const journeySource = source("app/(app)/journey/page.tsx");
  const progressSource = source("features/progress/components/learning-record.tsx");

  assert.doesNotMatch(journeySource, /CompletedLessonReview|Your lesson library/);
  assert.match(journeySource, /Open your learning record/);
  assert.match(progressSource, /href=\{`\/lessons\/\$\{milestone\.dayNumber\}`\}/);
  assert.match(progressSource, /Days 1–5/);
  assert.match(progressSource, /Days 6–10/);
  assert.match(progressSource, /Days 11–14/);
  assert.match(progressSource, /<details\s+className="group\/learning-section/);
  assert.match(progressSource, /tracking-tight text-success/);
  assert.match(progressSource, /text-4xl.*text-success\/85/);
});
