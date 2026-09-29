import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";

import { noraPrescriptionBagStory } from "../features/stories/content/nora-prescription-bag.ts";
import {
  createInitialStoryProgress,
  getStoryPreviewStatus,
  NORA_STORY_STORAGE_KEY,
  parseStoryProgress,
} from "../features/stories/lib/story-progress.ts";
import { validateStoryInteractions } from "../features/stories/lib/validate-story-interactions.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const noraPlayer = readFileSync("features/stories/components/nora-story-experience.tsx", "utf8");
const noraStyles = readFileSync(
  "features/stories/components/nora-story-experience.module.css",
  "utf8",
);
const storyRoute = readFileSync("app/(app)/stories/[slug]/page.tsx", "utf8");

test("Story 3 remains available with its state-aware preview", () => {
  assert.match(landing, /noraPrescriptionBagStory/);
  assert.match(landing, /remainingStories\.map/);
  assert.match(landing, /getRecommendedStorySlug/);
  for (const action of ["Start", "Continue", "Read again"]) {
    assert.match(landing, new RegExp(action));
  }
});

test("the existing Nora artwork remains optimized and honestly described", async () => {
  assert.equal(noraPrescriptionBagStory.imagePath, "/stories/nora-prescription-bag-cover.webp");
  assert.match(noraPrescriptionBagStory.imageAlt, /editorial illustration/i);
  assert.doesNotMatch(noraPrescriptionBagStory.imageAlt, /real patient|Nora taking|photograph/i);
  assert.ok(statSync("public/stories/nora-prescription-bag-cover.webp").size > 80_000);
  const metadata = await sharp("public/stories/nora-prescription-bag-cover.webp").metadata();
  assert.equal(metadata.width, 1600);
  assert.equal(metadata.height, 900);
  assert.match(landing, /nora-prescription-bag-illustration\.webp/);
});

test("the dedicated route opens Nora's redesigned reader", () => {
  assert.match(storyRoute, /noraPrescriptionBagStory\.slug/);
  assert.match(storyRoute, /<NoraStoryExperience \/>/);
  assert.match(noraPlayer, /const STORY_SLUG = "nora-prescription-bag"/);
  assert.doesNotMatch(
    noraPlayer,
    /InteractiveStoryPlayer|completeLessonAction|saveLessonPositionAction/,
  );
});

test("Nora's dedicated reader adds usable paperwork and check-in moments", () => {
  assert.match(noraPlayer, /const SCENE_COUNT = 8/);
  assert.match(noraPlayer, /function WrittenDirections/);
  assert.match(noraPlayer, /function FirstWeekCheckIn/);
  assert.match(noraPlayer, /Read the pharmacy paperwork/);
  assert.match(noraPlayer, /Review Nora's check-in/);
  assert.match(noraStyles, /grid-template-columns: repeat\(8, 1fr\)/);
});

test("Nora has six short, concrete moments in order", () => {
  assert.deepEqual(
    noraPrescriptionBagStory.scenes.map((scene) => scene.title),
    [
      "At the pharmacy",
      "Still on the counter",
      "Her sister noticed",
      "The pharmacy call",
      "A reminder that fits",
      "Part of the plan",
    ],
  );
  assert.deepEqual(
    noraPrescriptionBagStory.scenes.map((scene) => scene.interactionType),
    [
      "belief-mapping",
      "source-pathway",
      "perspective-switch",
      "question-builder",
      "routine-anchor",
      "care-toolbox",
    ],
  );
  assert.deepEqual(validateStoryInteractions(noraPrescriptionBagStory), []);
  assert.ok(noraPrescriptionBagStory.scenes.every((scene) => scene.paragraphs.length === 2));
  assert.ok(
    noraPrescriptionBagStory.scenes.every(
      (scene) => scene.interaction.requiredForProgress === false,
    ),
  );
});

test("each moment uses a distinct interaction tied to Nora's situation", () => {
  for (const interaction of [
    "function PrescriptionBag",
    "function InformationSources",
    "function SisterConversation",
    "function PharmacyCall",
    "function RoutineAnchor",
    "function CarePlan",
  ]) {
    assert.match(noraPlayer, new RegExp(interaction));
  }
  assert.match(noraPlayer, /What the bag says/);
  assert.match(noraPlayer, /Other people's posts/);
  assert.match(noraPlayer, /What could her sister ask instead\?/);
  assert.match(noraPlayer, /Questions for the pharmacy/);
  assert.match(noraPlayer, /Check the prescription directions/);
  assert.match(noraPlayer, /How it fits with the rest of her care/);
});

test("dialogue is presented with speech bubbles and a consent-based response", () => {
  assert.match(noraPlayer, /styles\.speechSister/);
  assert.match(noraPlayer, /styles\.speechNora/);
  assert.match(noraStyles, /\.speechSister p,[\s\S]*border-radius:/);
  assert.match(noraStyles, /\.speechNora p::after/);
  assert.match(noraPlayer, /How are you feeling about the new prescription\?/);
  assert.match(noraPlayer, /Nora can say as much or as little as she wants/);
});

test("the reader removes the old classroom sequence", () => {
  assert.doesNotMatch(
    noraPlayer,
    /predictionPrompt|predictionChoices|quiz|Submit Answer|privateReflection|lessonHeading|Pause and Think/,
  );
  assert.doesNotMatch(noraPlayer, /requiredForProgress|interactionComplete|disabled=/);
  assert.match(noraPlayer, /Finish story/);
  assert.match(noraPlayer, />\s*Finished\s*</);
});

test("medication copy stays specific, safe, and non-prescriptive", () => {
  const storyText = `${JSON.stringify(noraPrescriptionBagStory)} ${noraPlayer}`;
  assert.match(storyText, /pharmacist or prescribing professional/i);
  assert.match(storyText, /follow the directions/i);
  assert.match(storyText, /Medication can be part of care without being a judgment/);
  assert.doesNotMatch(
    storyText,
    /you should (start|stop|double|change)|take \d+|milligram|\bmg\b/i,
  );
  assert.doesNotMatch(storyText, /sealed decision|verdict|The bag felt heavier than it was/i);
  assert.equal(noraPrescriptionBagStory.medicalRiskLevel, "moderate");
  assert.equal(noraPrescriptionBagStory.version, "2.1");
  assert.equal(noraPrescriptionBagStory.readerPartCount, 8);
});

test("progress stays story-specific and completion persists without lesson progress", () => {
  assert.equal(NORA_STORY_STORAGE_KEY, "health-decoded:story:nora-prescription-bag:progress");
  assert.match(noraPlayer, /getStoryStorageKey\(STORY_SLUG\)/);
  assert.match(noraPlayer, /parseStoryProgress/);
  assert.match(noraPlayer, /versionCompleted: storyCompleted \? "2\.1" : null/);
  assert.match(noraPlayer, /interactive_story_completed/);
  assert.equal(
    getStoryPreviewStatus(
      parseStoryProgress(JSON.stringify({ ...createInitialStoryProgress(), storyCompleted: true })),
    ),
    "completed",
  );
  assert.doesNotMatch(noraPlayer, /completeLessonAction|saveLessonPositionAction/);
});

test("the Nora reader is accessible, responsive, and motion-reduced", () => {
  assert.match(noraStyles, /max-width: 52rem/);
  assert.match(noraStyles, /@media \(max-width: 42rem\)/);
  assert.match(noraStyles, /@media \(max-width: 38rem\)/);
  assert.match(noraStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(noraStyles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.doesNotMatch(noraStyles, /transition:\s*all/);
  assert.match(noraPlayer, /role="progressbar"/);
  assert.match(noraPlayer, /role="tablist"/);
  assert.match(noraPlayer, /role="radiogroup"/);
  assert.match(noraPlayer, /aria-live="polite"/);
  assert.match(noraPlayer, /headingRef\.current\?\.focus/);
  assert.match(noraPlayer, /story-reader-active/);
});

test("Nora's disclosure remains honest about the illustrative scenario", () => {
  assert.match(noraPrescriptionBagStory.disclosure, /Nora is a placeholder name/);
  assert.match(noraPrescriptionBagStory.disclosure, /does not describe one specific individual/);
  assert.equal(noraPrescriptionBagStory.reviewStatus, "not-reviewed");
  assert.doesNotMatch(noraPlayer, /Medically reviewed|real patient|testimonial/i);
});
