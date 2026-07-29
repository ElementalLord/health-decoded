import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ashaRiceOnTheTableStory } from "../features/stories/content/asha-rice-on-the-table.ts";
import { marcusParkingLotStory } from "../features/stories/content/marcus-parking-lot.ts";
import {
  calculateStoryQuizScore,
  CURRENT_STORY_INTERACTION_VERSION,
  createInitialStoryProgress,
  createStoryReviewProgress,
  parseStoryProgress,
} from "../features/stories/lib/story-progress.ts";
import { validateStoryInteractions } from "../features/stories/lib/validate-story-interactions.ts";

const interactions = readFileSync("features/stories/components/story-interactions.tsx", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const styles = readFileSync("features/stories/components/story-player.module.css", "utf8");

test("the development guard accepts both stories without duplication issues", () => {
  assert.deepEqual(validateStoryInteractions(marcusParkingLotStory), []);
  assert.deepEqual(validateStoryInteractions(ashaRiceOnTheTableStory), []);
});

test("the development guard flags passive reveals, missing learning metadata, and overlap", () => {
  const broken = structuredClone(marcusParkingLotStory);
  broken.scenes = [structuredClone(broken.scenes[0])];
  broken.scenes[0].interaction.purpose = "";
  broken.scenes[0].interaction.learningPoint = "";
  broken.scenes[0].interaction.prompt = broken.scenes[0].paragraphs[3];
  broken.scenes[0].interaction.options = [
    { id: "open", label: "Open the story" },
    { id: "show", label: "Show the answer" },
  ];

  const codes = validateStoryInteractions(broken).map((issue) => issue.code);
  assert.ok(codes.includes("missing-purpose"));
  assert.ok(codes.includes("missing-learning-point"));
  assert.ok(codes.includes("passive-reveal-control"));
  assert.ok(codes.includes("narrative-overlap"));
});

test("Story 1 uses the six requested non-replay mechanics in order", () => {
  assert.deepEqual(
    marcusParkingLotStory.scenes.map((scene) => scene.interactionType),
    [
      "attention-overload",
      "emotional-interpretation",
      "thought-sort",
      "response-prediction",
      "information-filter",
      "question-prioritization",
    ],
  );
  assert.deepEqual(
    marcusParkingLotStory.scenes.map((scene) => scene.interaction.purpose),
    ["interpret", "interpret", "sort", "predict", "apply", "prioritize"],
  );
});

test("Story 1 interaction copy does not replay deleted drafts or revealed dialogue", () => {
  for (const narrativeOnlyLine of [
    "Everything is fine.",
    "I have diabetes.",
    "What did the doctor tell you to do tonight?",
    "Then come home",
  ]) {
    assert.doesNotMatch(interactions, new RegExp(narrativeOnlyLine.replace(/[.?]/g, "\\$&")));
  }
});

test("Marcus predicts before the actual response is revealed", () => {
  const scene = marcusParkingLotStory.scenes[3];
  assert.equal(scene.interaction.purpose, "predict");
  assert.equal(scene.interaction.requiredForProgress, true);
  assert.equal(
    scene.paragraphs.some((line) => line.includes("What did the doctor")),
    false,
  );
  assert.equal(
    scene.paragraphsAfterInteraction?.some((line) => line.includes("What did the doctor")),
    true,
  );
  assert.match(player, /scene\.paragraphsAfterInteraction && interactionComplete/);
});

test("Marcus sees all three appointment questions and prioritizes rather than reveals them", () => {
  const scene = marcusParkingLotStory.scenes[5];
  assert.equal(scene.interaction.options?.length, 3);
  assert.equal(scene.interaction.purpose, "prioritize");
  assert.doesNotMatch(interactions, /aria-expanded/);
  for (const label of ["Ask first", "Discuss during follow-up", "Keep exploring over time"]) {
    assert.match(interactions, new RegExp(label));
  }
});

test("only meaningful decisions are required for progression", () => {
  assert.deepEqual(
    marcusParkingLotStory.scenes
      .filter((scene) => scene.interaction.requiredForProgress)
      .map((scene) => scene.number),
    [4, 5],
  );
  assert.deepEqual(
    ashaRiceOnTheTableStory.scenes
      .filter((scene) => scene.interaction.requiredForProgress)
      .map((scene) => scene.number),
    [5],
  );
  assert.match(player, /if \(!currentInteractionComplete\) return/);
  assert.match(player, /disabled=\{!interactionComplete\}/);
});

test("required choices provide consequence feedback and never auto-advance", () => {
  const requiredScenes = [
    ...marcusParkingLotStory.scenes,
    ...ashaRiceOnTheTableStory.scenes,
  ].filter((scene) => scene.interaction.requiredForProgress);
  assert.ok(
    requiredScenes.every((scene) => scene.interaction.feedbackMode === "choice-consequence"),
  );
  assert.ok(
    requiredScenes.every((scene) => scene.interaction.options.every((option) => option.feedback)),
  );
  const interactionSource = interactions.slice(
    interactions.indexOf("function ResponsePrediction"),
    interactions.indexOf("function SharedMealSupportSelector"),
  );
  assert.doesNotMatch(interactionSource, /runSceneTransition|onContinue/);
});

test("Story 2 mechanics remain food-and-family specific and structurally distinct", () => {
  const ashaTypes = ashaRiceOnTheTableStory.scenes.map((scene) => scene.interactionType);
  const marcusTypes = marcusParkingLotStory.scenes.map((scene) => scene.interactionType);
  assert.equal(
    ashaTypes.some((type) => marcusTypes.includes(type)),
    false,
  );
  for (const type of [
    "grocery-fear",
    "separate-plate",
    "family-dialogue",
    "meal-builder",
    "meaningful-food-choice",
    "shared-table",
  ]) {
    assert.ok(ashaTypes.includes(type));
  }
});

test("all scenes declare purpose, learning point, engagement, and feedback mode", () => {
  for (const scene of [...marcusParkingLotStory.scenes, ...ashaRiceOnTheTableStory.scenes]) {
    assert.ok(scene.interaction.id);
    assert.ok(scene.interaction.purpose);
    assert.ok(scene.interaction.engagement);
    assert.ok(scene.interaction.prompt);
    assert.ok(scene.interaction.feedbackMode);
    assert.ok(scene.interaction.learningPoint);
    assert.equal(typeof scene.interaction.requiredForProgress, "boolean");
  }
});

test("interaction state migration preserves story outcomes and resets obsolete mechanics", () => {
  const initial = createInitialStoryProgress();
  const migrated = parseStoryProgress(
    JSON.stringify({
      ...initial,
      interactionVersion: 1,
      interactionStates: { obsolete: "value" },
      meaningfulChoice: "obsolete-choice",
      storyCompleted: true,
      keyIdeaUnderstood: true,
      privateReflection: "A saved reflection",
      quizAnswers: { q1: "b" },
      submittedQuizQuestions: ["q1"],
      quizScore: 1,
      completionDate: "2026-07-28T00:00:00.000Z",
      versionCompleted: "1.0",
    }),
  );

  assert.equal(migrated.interactionVersion, CURRENT_STORY_INTERACTION_VERSION);
  assert.deepEqual(migrated.interactionStates, {});
  assert.equal(migrated.meaningfulChoice, null);
  assert.equal(migrated.storyCompleted, true);
  assert.equal(migrated.keyIdeaUnderstood, true);
  assert.equal(migrated.privateReflection, "A saved reflection");
  assert.deepEqual(migrated.quizAnswers, { q1: "b" });
  assert.deepEqual(migrated.submittedQuizQuestions, ["q1"]);
  assert.equal(migrated.quizScore, 1);
});

test("knowledge-check results are derived from recorded answers instead of stale counters", () => {
  const correctMarcusAnswers = Object.fromEntries(
    marcusParkingLotStory.quiz.map((question) => [question.id, question.correctChoiceId]),
  );
  const correctAshaAnswers = Object.fromEntries(
    ashaRiceOnTheTableStory.quiz.map((question) => [question.id, question.correctChoiceId]),
  );

  assert.equal(
    calculateStoryQuizScore(marcusParkingLotStory.quiz, correctMarcusAnswers),
    marcusParkingLotStory.quiz.length,
  );
  assert.equal(
    calculateStoryQuizScore(ashaRiceOnTheTableStory.quiz, correctAshaAnswers),
    ashaRiceOnTheTableStory.quiz.length,
  );
  assert.equal(calculateStoryQuizScore(marcusParkingLotStory.quiz, {}), 0);
  assert.equal(calculateStoryQuizScore(ashaRiceOnTheTableStory.quiz, {}), 0);
});

test("rereading clears previous choices and scoring while preserving a private reflection", () => {
  const reread = createStoryReviewProgress({
    ...createInitialStoryProgress(),
    currentScene: 5,
    furthestSceneReached: 5,
    interactionStates: { old: "complete" },
    meaningfulChoice: "old-choice",
    prediction: "old-prediction",
    quizAnswers: { q1: "b" },
    submittedQuizQuestions: ["q1"],
    quizScore: 1,
    storyCompleted: true,
    keyIdeaUnderstood: true,
    completionDate: "2026-07-29T00:00:00.000Z",
    privateReflection: "A note worth keeping",
    versionCompleted: "1.0",
    stage: "complete",
  });

  assert.equal(reread.stage, "story");
  assert.equal(reread.currentScene, 0);
  assert.equal(reread.furthestSceneReached, 0);
  assert.deepEqual(reread.interactionStates, {});
  assert.equal(reread.prediction, null);
  assert.deepEqual(reread.quizAnswers, {});
  assert.deepEqual(reread.submittedQuizQuestions, []);
  assert.equal(reread.quizScore, 0);
  assert.equal(reread.storyCompleted, false);
  assert.equal(reread.keyIdeaUnderstood, false);
  assert.equal(reread.privateReflection, "A note worth keeping");
});

test("controls are semantic, keyboard-operable, and provide accessible feedback", () => {
  assert.ok((interactions.match(/type="button"/g) ?? []).length >= 10);
  assert.ok((interactions.match(/type="radio"/g) ?? []).length >= 7);
  assert.ok((interactions.match(/type="checkbox"/g) ?? []).length >= 2);
  assert.match(interactions, /aria-live="polite"/);
  assert.match(interactions, /aria-pressed/);
  assert.match(interactions, /role="group"/);
  assert.match(interactions, /type="range"/);
  assert.match(interactions, /Choose comparison view/);
});

test("motion is brief, state-related, and respects reduced-motion preferences", () => {
  assert.match(styles, /scene-enter-forward 230ms/);
  assert.match(styles, /scene-leave-forward 160ms/);
  assert.match(styles, /draft-change 180ms/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /animation: none/);
  assert.match(styles, /transition: none/);
});

test("routes, covers, narratives, reflection, and final quizzes remain intact", () => {
  assert.equal(marcusParkingLotStory.slug, "marcus-parking-lot");
  assert.equal(ashaRiceOnTheTableStory.slug, "asha-rice-on-the-table");
  assert.equal(marcusParkingLotStory.imagePath, "/stories/marcus-parking-lot-cover.webp");
  assert.equal(ashaRiceOnTheTableStory.imagePath, "/stories/asha-rice-on-the-table-cover.webp");
  assert.equal(marcusParkingLotStory.scenes.length, 6);
  assert.equal(ashaRiceOnTheTableStory.scenes.length, 6);
  assert.equal(marcusParkingLotStory.quiz.length, 3);
  assert.equal(ashaRiceOnTheTableStory.quiz.length, 3);
  assert.ok(marcusParkingLotStory.privateReflectionPrompt);
  assert.ok(ashaRiceOnTheTableStory.privateReflectionPrompt);
});
