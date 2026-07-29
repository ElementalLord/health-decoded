import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";

import { noraPrescriptionBagStory } from "../features/stories/content/nora-prescription-bag.ts";
import {
  calculateStoryQuizScore,
  createInitialStoryProgress,
  getStoryPreviewStatus,
  NORA_STORY_STORAGE_KEY,
  parseStoryProgress,
} from "../features/stories/lib/story-progress.ts";
import { validateStoryInteractions } from "../features/stories/lib/validate-story-interactions.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const opening = readFileSync("features/stories/components/story-opening.tsx", "utf8");
const interactions = readFileSync("features/stories/components/story-interactions.tsx", "utf8");
const styles = readFileSync("features/stories/components/story-player.module.css", "utf8");
const storyRoute = readFileSync("app/(app)/stories/[slug]/page.tsx", "utf8");

test("Story 3 appears under Starting medication with its state-aware preview", () => {
  assert.match(landing, /id="starting-medication-story"/);
  assert.match(landing, /story=\{noraPrescriptionBagStory\}/);
  assert.match(landing, /Starting medication/);
  assert.match(landing, /Different moments, different questions/);
  for (const action of ["Begin Story", "Resume Story", "Read Again"]) {
    assert.match(landing, new RegExp(action));
  }
  assert.doesNotMatch(landing, /quizScore/);
});

test("the single local Nora cover is optimized and appears in both required locations", async () => {
  assert.equal(noraPrescriptionBagStory.imagePath, "/stories/nora-prescription-bag-cover.webp");
  assert.match(noraPrescriptionBagStory.imageAlt, /editorial illustration/i);
  assert.doesNotMatch(noraPrescriptionBagStory.imageAlt, /real patient|Nora taking|photograph/i);
  assert.ok(statSync("public/stories/nora-prescription-bag-cover.webp").size > 80_000);
  const metadata = await sharp("public/stories/nora-prescription-bag-cover.webp").metadata();
  assert.equal(metadata.width, 1600);
  assert.equal(metadata.height, 900);
  assert.match(landing, /src=\{story\.imagePath\}/);
  assert.match(opening, /src=\{story\.imagePath\}/);
  assert.match(opening, /height=\{900\}/);
});

test("the route and disclosure identify an illustrative placeholder story", () => {
  assert.match(storyRoute, /noraPrescriptionBagStory\.slug/);
  assert.match(storyRoute, /<InteractiveStoryPlayer story=\{noraPrescriptionBagStory\} \/>/);
  assert.equal(noraPrescriptionBagStory.slug, "nora-prescription-bag");
  assert.match(noraPrescriptionBagStory.disclosure, /Nora is a placeholder name/);
  assert.match(opening, /story\.disclosure/);
  assert.doesNotMatch(player, /Medically reviewed/);
  assert.equal(noraPrescriptionBagStory.reviewStatus, "not-reviewed");
});

test("Nora has exactly six scenes with a distinct seven-purpose interaction identity", () => {
  assert.deepEqual(
    noraPrescriptionBagStory.scenes.map((scene) => scene.title),
    [
      "The Pharmacy Bag",
      "Still on the Counter",
      "“Already?”",
      "The Question She Avoided",
      "Making It Fit",
      "One Tool, Not a Verdict",
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
  const purposes = noraPrescriptionBagStory.scenes.flatMap((scene) => [
    scene.interaction.purpose,
    ...(scene.interaction.secondaryPurpose ? [scene.interaction.secondaryPurpose] : []),
  ]);
  assert.deepEqual(purposes, [
    "belief-mapping",
    "source-evaluation",
    "perspective-switch",
    "rewrite-response",
    "question-building",
    "routine-planning",
    "concept-integration",
  ]);
  assert.deepEqual(validateStoryInteractions(noraPrescriptionBagStory), []);
});

test("each scene requires an actual learner task without automatic advancement", () => {
  assert.ok(
    noraPrescriptionBagStory.scenes.every(
      (scene) => scene.interaction.requiredForProgress === true,
    ),
  );
  assert.match(player, /disabled=\{!interactionComplete\}/);
  assert.match(player, /if \(!currentInteractionComplete\) return/);
  const noraRenderers = interactions.slice(
    interactions.indexOf("function BeliefMapping"),
    interactions.indexOf("export function StoryInteraction"),
  );
  assert.doesNotMatch(noraRenderers, /runSceneTransition|onContinue/);
});

test("Scene 1 maps beliefs with keyboard-friendly category buttons", () => {
  const scene = noraPrescriptionBagStory.scenes[0];
  assert.equal(scene.interaction.purpose, "belief-mapping");
  assert.equal(scene.interaction.options.length, 4);
  assert.match(interactions, /Fear or assumption/);
  assert.match(interactions, /More useful understanding/);
  assert.match(
    scene.interaction.instructions,
    /Buttons provide a keyboard-friendly alternative to dragging/,
  );
  assert.match(interactions, /aria-pressed=\{current === "fear"\}/);
});

test("Scene 2 evaluates prescription-connected sources without dismissing community", () => {
  const scene = noraPrescriptionBagStory.scenes[1];
  assert.equal(scene.interaction.purpose, "source-evaluation");
  assert.match(interactions, /Connected to Nora’s prescription/);
  assert.match(interactions, /General or unverified experience/);
  assert.match(interactions, /type="checkbox"/);
  assert.match(scene.interaction.learningPoint, /may feel relatable/);
  assert.doesNotMatch(scene.interaction.learningPoint, /online communities have no value/i);
});

test("Scene 3 distinguishes intention from impact before selecting supportive language", () => {
  const scene = noraPrescriptionBagStory.scenes[2];
  assert.equal(scene.interaction.purpose, "perspective-switch");
  assert.equal(scene.interaction.secondaryPurpose, "rewrite-response");
  assert.match(interactions, /Nora may have heard/);
  assert.match(interactions, /Her sister may have intended/);
  assert.match(interactions, /seen\.length < 2/);
  assert.equal(scene.interaction.options[2].id, "c");
  assert.match(interactions, /centers Nora’s experience/);
});

test("Scene 4 builds four professional questions and supplies no replacement dosing rule", () => {
  const scene = noraPrescriptionBagStory.scenes[3];
  assert.equal(scene.interaction.purpose, "question-building");
  assert.equal(scene.interaction.options.length, 6);
  assert.match(interactions, /selected\.length < 4/);
  assert.match(scene.interaction.learningPoint, /should not be made independently/);
  assert.doesNotMatch(interactions, /take \d|milligram|mg\b|double the dose/i);
});

test("Scene 5 connects a chosen routine to label instructions without universal timing", () => {
  const scene = noraPrescriptionBagStory.scenes[4];
  assert.equal(scene.interaction.purpose, "routine-planning");
  assert.match(interactions, /Check and follow the prescription instructions/);
  assert.match(interactions, /A more manageable reminder/);
  assert.match(scene.interaction.learningPoint, /does not replace the instructions/);
  assert.doesNotMatch(scene.interaction.learningPoint, /with food|at breakfast|at bedtime/i);
});

test("Scene 6 integrates all seven tools and keeps the help topic optional and unscored", () => {
  const scene = noraPrescriptionBagStory.scenes[5];
  assert.equal(scene.interaction.purpose, "concept-integration");
  assert.equal(scene.interaction.options.length, 7);
  assert.match(interactions, /tools\.length === scene\.interaction\.options\.length/);
  assert.match(interactions, /optional-help/);
  assert.match(interactions, /This unscored choice stays only with your story progress/);
  assert.doesNotMatch(interactions, /clinical data/);
});

test("prediction is unscored and the three knowledge answers are B, C, C", () => {
  assert.equal(noraPrescriptionBagStory.predictionChoices[2].id, "c");
  const predictionStage = player.slice(
    player.indexOf('progress.stage === "prediction"'),
    player.indexOf('progress.stage === "quiz"'),
  );
  assert.match(predictionStage, /prediction: choice\.id/);
  assert.doesNotMatch(predictionStage, /quizScore/);
  assert.deepEqual(
    noraPrescriptionBagStory.quiz.map((question) => question.correctChoiceId),
    ["b", "c", "c"],
  );
  const correct = Object.fromEntries(
    noraPrescriptionBagStory.quiz.map((question) => [question.id, question.correctChoiceId]),
  );
  assert.equal(calculateStoryQuizScore(noraPrescriptionBagStory.quiz, correct), 3);
});

test("completion and understanding remain separate and the real Lesson 7 is linked only", () => {
  const completedWithoutUnderstanding = parseStoryProgress(
    JSON.stringify({
      ...createInitialStoryProgress(),
      storyCompleted: true,
      keyIdeaUnderstood: false,
      quizScore: 1,
    }),
  );
  assert.equal(getStoryPreviewStatus(completedWithoutUnderstanding), "completed");
  assert.equal(completedWithoutUnderstanding.keyIdeaUnderstood, false);
  assert.match(player, /keyIdeaUnderstood: score >= 2/);
  assert.equal(noraPrescriptionBagStory.relatedLessonHref, "/lessons/7");
  assert.equal(
    noraPrescriptionBagStory.relatedLessonTitle,
    "Lesson 7, Medicines Are Tools, Not Judgments",
  );
  assert.doesNotMatch(player, /completeLessonAction|saveLessonPositionAction/);
});

test("Nora’s requested state uses the existing story-specific persistence container", () => {
  assert.equal(NORA_STORY_STORAGE_KEY, "health-decoded:story:nora-prescription-bag:progress");
  for (const field of [
    "currentScene",
    "furthestSceneReached",
    "interactionStates",
    "prediction",
    "quizAnswers",
    "quizScore",
    "storyCompleted",
    "keyIdeaUnderstood",
    "completionDate",
    "privateReflection",
    "versionCompleted",
  ]) {
    assert.ok(field in createInitialStoryProgress());
  }
});

test("medical copy never instructs a user to independently change medication", () => {
  const storyText = JSON.stringify(noraPrescriptionBagStory);
  assert.match(storyText, /qualified healthcare professional/);
  assert.match(storyText, /Medication is a healthcare tool, not a verdict/);
  assert.doesNotMatch(storyText, /you should (start|stop|double|change)|take \d+|mg\b/i);
  assert.equal(noraPrescriptionBagStory.medicalRiskLevel, "moderate");
});

test("Nora’s player is accessible, responsive, and motion-reduced", () => {
  assert.match(styles, /grid-template-columns: minmax\(0, 54fr\) minmax\(20rem, 46fr\)/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /\.medicationPlayer \.sceneSurface/);
  assert.match(styles, /grid-template-columns: 1fr/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.noraFeedback/);
  assert.match(styles, /animation: none/);
  assert.match(interactions, /aria-live="polite"/);
  assert.match(interactions, /role="tablist"/);
  assert.ok((styles.match(/min-height: 44px/g) ?? []).length >= 1);
});
