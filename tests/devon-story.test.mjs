import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { devonNumberScreenStory } from "../features/stories/content/devon-number-screen.ts";
import {
  createInitialStoryProgress,
  DEVON_STORY_STORAGE_KEY,
  getStoryPreviewStatus,
  getStoryStorageKey,
  parseStoryProgress,
} from "../features/stories/lib/story-progress.ts";
import { validateStoryInteractions } from "../features/stories/lib/validate-story-interactions.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const devonPlayer = readFileSync("features/stories/components/devon-story-experience.tsx", "utf8");
const devonStyles = readFileSync(
  "features/stories/components/devon-story-experience.module.css",
  "utf8",
);
const route = readFileSync("app/(app)/stories/[slug]/page.tsx", "utf8");

test("Story 4 remains available with state-aware progress", () => {
  assert.match(landing, /devonNumberScreenStory/);
  assert.match(landing, /remainingStories\.map/);
  assert.match(landing, /loadPreviewState\(devonNumberScreenStory\.slug\)/);
  for (const action of ["Start", "Continue", "Read again"]) {
    assert.match(landing, new RegExp(action));
  }
});

test("Devon's existing artwork remains optimized and honestly described", () => {
  assert.equal(devonNumberScreenStory.imagePath, "/stories/devon-number-screen-cover.webp");
  assert.match(devonNumberScreenStory.imageAlt, /editorial illustration/i);
  const asset = statSync("public/stories/devon-number-screen-cover.webp");
  assert.ok(asset.size > 40_000);
  assert.ok(asset.size < 500_000);
  assert.match(landing, /devon-number-screen-illustration\.png/);
  assert.doesNotMatch(devonNumberScreenStory.imageAlt, /real patient|testimonial/i);
});

test("the dedicated route opens Devon's redesigned reader", () => {
  assert.equal(devonNumberScreenStory.slug, "devon-number-screen");
  assert.match(route, /devonNumberScreenStory\.slug/);
  assert.match(route, /<DevonStoryExperience \/>/);
  assert.match(devonPlayer, /const STORY_SLUG = "devon-number-screen"/);
  assert.doesNotMatch(devonPlayer, /InteractiveStoryPlayer|completeLessonAction|lessonProgress/);
});

test("Devon's dedicated reader adds a care-plan decision and two-moment comparison", () => {
  assert.match(devonPlayer, /const SCENE_COUNT = 8/);
  assert.match(devonPlayer, /function NextStepDecision/);
  assert.match(devonPlayer, /function TwoMoments/);
  assert.match(devonPlayer, /What is the useful next move/);
  assert.match(devonPlayer, /Compare two moments/);
  assert.match(devonStyles, /grid-template-columns: repeat\(8, 1fr\)/);
});

test("the story contains six short, concrete moments in order", () => {
  assert.deepEqual(
    devonNumberScreenStory.scenes.map((scene) => scene.title),
    [
      "After dinner",
      "On the sofa",
      "Checking the steps",
      "What matters now",
      "A useful note",
      "The follow-up",
    ],
  );
  assert.deepEqual(
    devonNumberScreenStory.scenes.map((scene) => scene.interactionType),
    [
      "reading-boundary",
      "thought-chain",
      "measurement-context",
      "urgency-context",
      "communication-builder",
      "pattern-comparison",
    ],
  );
  assert.ok(devonNumberScreenStory.scenes.every((scene) => scene.paragraphs.length === 2));
  assert.ok(
    devonNumberScreenStory.scenes.every((scene) => scene.interaction.requiredForProgress === false),
  );
  assert.deepEqual(validateStoryInteractions(devonNumberScreenStory), []);
});

test("each moment uses a distinct interaction tied to the event", () => {
  for (const interaction of [
    "function MeterReading",
    "function ThoughtPath",
    "function MeasurementCheck",
    "function SafetyContext",
    "function MessageNote",
    "function PatternView",
  ]) {
    assert.match(devonPlayer, new RegExp(interaction));
  }
  assert.match(devonPlayer, /The reading/);
  assert.match(devonPlayer, /Follow Devon's thought path/);
  assert.match(devonPlayer, /Check the technique, not for reassurance/);
  assert.match(devonPlayer, /Symptoms/);
  assert.match(devonPlayer, /Add context, not an apology/);
  assert.match(devonPlayer, /Results with context/);
});

test("the first two moments separate observation from judgment and prediction", () => {
  assert.match(devonPlayer, /One result at one moment/);
  assert.match(devonPlayer, /I messed up/);
  assert.match(devonPlayer, /This is the last point supported directly by the meter/);
  assert.match(devonPlayer, /one reading doesn't establish it/);
  assert.doesNotMatch(
    devonPlayer,
    /The number had become something larger|His first thought was not a question/,
  );
});

test("measurement context rejects reassurance chasing", () => {
  assert.match(devonPlayer, /Wash and dry his hands/);
  assert.match(devonPlayer, /Follow the meter instructions/);
  assert.match(devonPlayer, /Keep testing until a preferred number appears/);
  assert.match(devonPlayer, /That chases reassurance/);
  assert.match(devonPlayer, /follow device instructions and Devon's care plan/);
  assert.doesNotMatch(devonPlayer, /normal result|back in range|safe now/i);
});

test("medical safety stays contextual and avoids universal thresholds", () => {
  const text = `${JSON.stringify(devonNumberScreenStory)} ${devonPlayer}`;
  assert.match(text, /personal plan|established care plan/i);
  assert.match(text, /urgent help/i);
  assert.match(text, /qualified healthcare professional/i);
  assert.match(text, /trouble breathing, confusion, fainting, or persistent vomiting/i);
  assert.doesNotMatch(text, /\b(?:180|200|250|300|400)\b/);
  assert.doesNotMatch(text, /take extra insulin|double (?:the )?dose|skip (?:the )?dose/i);
  assert.doesNotMatch(
    text,
    /avoid (?:all )?(?:carbohydrates|rice|bread)|go for a walk to lower|exercise immediately/i,
  );
  assert.equal(devonNumberScreenStory.medicalRiskLevel, "moderate");
  assert.equal(devonNumberScreenStory.reviewStatus, "not-reviewed");
  assert.equal(devonNumberScreenStory.version, "2.1");
  assert.equal(devonNumberScreenStory.readerPartCount, 8);
});

test("the note builder requests context without collecting personal data", () => {
  for (const detail of [
    "The result and time",
    "When it was checked in relation to eating",
    "How he felt and any symptoms",
    "Relevant changes in sleep, stress, illness, or routine",
    "The meter and care-plan instructions he followed",
  ]) {
    assert.match(devonPlayer, new RegExp(detail));
  }
  assert.doesNotMatch(devonPlayer, /type="(?:text|number)"/);
  assert.match(devonPlayer, /aria-pressed/);
  assert.match(devonPlayer, /without Devon guessing at a cause/);
});

test("the reader removes the old classroom sequence", () => {
  assert.doesNotMatch(
    devonPlayer,
    /predictionPrompt|predictionChoices|quiz|Submit Answer|privateReflection|lessonHeading|Pause and Think/,
  );
  assert.doesNotMatch(devonPlayer, /requiredForProgress|interactionComplete|disabled=/);
  assert.match(devonPlayer, /Finish story/);
  assert.match(devonPlayer, />\s*Finished\s*</);
});

test("progress remains story-specific and completion persists", () => {
  assert.equal(DEVON_STORY_STORAGE_KEY, getStoryStorageKey(devonNumberScreenStory.slug));
  assert.match(devonPlayer, /getStoryStorageKey\(STORY_SLUG\)/);
  assert.match(devonPlayer, /parseStoryProgress/);
  assert.match(devonPlayer, /versionCompleted: storyCompleted \? "2\.1" : null/);
  assert.match(devonPlayer, /interactive_story_completed/);
  assert.equal(
    getStoryPreviewStatus(
      parseStoryProgress(JSON.stringify({ ...createInitialStoryProgress(), storyCompleted: true })),
    ),
    "completed",
  );
});

test("Story 4 remains linked to Lesson 8 without changing lesson progress", () => {
  assert.equal(devonNumberScreenStory.relatedLessonId, "20000000-0000-0000-0000-000000000008");
  assert.equal(devonNumberScreenStory.relatedLessonTitle, "Lesson 8, Making Sense of Your Glucose");
  assert.equal(devonNumberScreenStory.relatedLessonHref, "/lessons/8");
  assert.doesNotMatch(devonPlayer, /completeLessonAction|saveLessonPositionAction/);
});

test("the Devon reader is accessible, responsive, and motion-reduced", () => {
  assert.match(devonStyles, /max-width: 52rem/);
  assert.match(devonStyles, /@media \(max-width: 42rem\)/);
  assert.match(devonStyles, /@media \(max-width: 38rem\)/);
  assert.match(devonStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(devonStyles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.doesNotMatch(devonStyles, /transition:\s*all/);
  assert.match(devonPlayer, /role="progressbar"/);
  assert.match(devonPlayer, /role="tablist"/);
  assert.match(devonPlayer, /role="radiogroup"/);
  assert.match(devonPlayer, /aria-live="polite"/);
  assert.match(devonPlayer, /headingRef\.current\?\.focus/);
  assert.match(devonPlayer, /story-reader-active/);
});

test("Devon's disclosure remains clear about the scenario and its limits", () => {
  assert.match(devonNumberScreenStory.disclosure, /Devon is a placeholder name/);
  assert.match(devonNumberScreenStory.disclosure, /does not describe one specific individual/);
  assert.match(devonNumberScreenStory.disclosure, /does not.*personal instructions/i);
  assert.doesNotMatch(devonPlayer, /Medically reviewed|real patient|testimonial/i);
});
