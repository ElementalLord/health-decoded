import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { devonNumberScreenStory } from "../features/stories/content/devon-number-screen.ts";
import {
  calculateStoryQuizScore,
  createInitialStoryProgress,
  DEVON_STORY_STORAGE_KEY,
  getStoryStorageKey,
  resolveStoryEntryProgress,
} from "../features/stories/lib/story-progress.ts";
import { validateStoryInteractions } from "../features/stories/lib/validate-story-interactions.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const interactions = readFileSync("features/stories/components/story-interactions.tsx", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const route = readFileSync("app/(app)/stories/[slug]/page.tsx", "utf8");
const styles = readFileSync("features/stories/components/story-player.module.css", "utf8");

test("Story 4 is available under A worrying reading with state-aware progress", () => {
  assert.match(landing, /A worrying reading/);
  assert.match(landing, /id="worrying-reading-story"/);
  assert.match(landing, /story=\{devonNumberScreenStory\}/);
  assert.match(landing, /loadPreviewState\(devonNumberScreenStory\.slug\)/);
  assert.match(landing, /Begin Story/);
  assert.match(landing, /Resume Story/);
  assert.match(landing, /Read Again/);
});

test("Story 4 Begin enters Scene 1 instead of leaving Devon on the repeated cover", () => {
  const entered = resolveStoryEntryProgress(createInitialStoryProgress(), { begin: true });
  assert.equal(entered.stage, "story");
  assert.equal(entered.currentScene, 0);
  assert.match(landing, /\?begin=1/);
  assert.match(player, /resolveStoryEntryProgress/);
});

test("Devon has one optimized cover reused by preview and story opening", () => {
  assert.equal(devonNumberScreenStory.imagePath, "/stories/devon-number-screen-cover.webp");
  assert.match(devonNumberScreenStory.imageAlt, /editorial illustration/i);
  const asset = statSync("public/stories/devon-number-screen-cover.webp");
  assert.ok(asset.size > 40_000);
  assert.ok(asset.size < 500_000);
  assert.match(landing, /src=\{story\.imagePath\}/);
});

test("the dedicated route opens Devon directly in the shared story player", () => {
  assert.equal(devonNumberScreenStory.slug, "devon-number-screen");
  assert.match(route, /devonNumberScreenStory\.slug/);
  assert.match(route, /<InteractiveStoryPlayer story=\{devonNumberScreenStory\} \/>/);
});

test("the story contains exactly six scenes and six new mechanics in the required order", () => {
  assert.deepEqual(
    devonNumberScreenStory.scenes.map((scene) => scene.title),
    [
      "The Number",
      "What the Number Became",
      "Before He Trusted It",
      "What Mattered Now",
      "The Note Beside the Meter",
      "One Point on a Longer Line",
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
  assert.equal(
    new Set(devonNumberScreenStory.scenes.map((scene) => scene.interactionType)).size,
    6,
  );
  assert.ok(devonNumberScreenStory.scenes.every((scene) => scene.interaction.requiredForProgress));
  assert.match(player, /const currentScene = story\.scenes\[progress\.currentScene\]/);
  assert.doesNotMatch(player, /story\.scenes\.map\(\(scene\) => <StorySceneView/);
});

test("each interaction adds a distinct learning task and passes the overlap guard", () => {
  assert.deepEqual(validateStoryInteractions(devonNumberScreenStory), []);
  assert.match(interactions, /function ReadingBoundary/);
  assert.match(interactions, /function ThoughtChain/);
  assert.match(interactions, /function MeasurementContext/);
  assert.match(interactions, /function UrgencyContext/);
  assert.match(interactions, /function CommunicationBuilder/);
  assert.match(interactions, /function PatternComparison/);
  assert.match(interactions, /onStateChange\(`\$\{scene\.id\}:complete`, "complete"\)/);
  assert.equal(
    new Set(devonNumberScreenStory.scenes.map((scene) => scene.interaction.purpose)).size,
    6,
  );
});

test("medical safety stays contextual and never invents a threshold or treatment change", () => {
  const text = JSON.stringify(devonNumberScreenStory);
  assert.match(text, /personal plan|established care plan/i);
  assert.match(text, /urgent help/i);
  assert.match(text, /qualified healthcare professional/i);
  assert.doesNotMatch(text, /\b(?:180|200|250|300|400)\b/);
  assert.doesNotMatch(text, /take extra insulin|double (?:the )?dose|skip (?:the )?dose/i);
  assert.doesNotMatch(
    text,
    /avoid (?:all )?(?:carbohydrates|rice|bread)|go for a walk to lower|exercise immediately/i,
  );
  assert.equal(devonNumberScreenStory.medicalRiskLevel, "moderate");
  assert.equal(devonNumberScreenStory.reviewStatus, "not-reviewed");
});

test("the first two scenes separate measurement from judgment and stop evidence at observation", () => {
  const [boundary, chain] = devonNumberScreenStory.scenes;
  assert.equal(boundary.interactionType, "reading-boundary");
  assert.deepEqual(
    boundary.interaction.options.slice(3).map((option) => option.id),
    ["failed", "permanent-change", "exact-cause"],
  );
  assert.equal(chain.interactionType, "thought-chain");
  assert.deepEqual(
    chain.interaction.options.map((option) => option.id),
    ["observation", "interpretation", "prediction", "verdict"],
  );
  assert.match(interactions, /boundary === "observation"/);
});

test("measurement context rejects reassurance chasing and never promises a normal repeat", () => {
  const scene = devonNumberScreenStory.scenes[2];
  assert.equal(scene.interactionType, "measurement-context");
  assert.match(
    JSON.stringify(scene.interaction.options),
    /Repeat until he gets a preferred number/,
  );
  assert.match(JSON.stringify(scene.paragraphsAfterInteraction), /still above his personal range/i);
  assert.doesNotMatch(JSON.stringify(scene), /normal result|back in range|safe now/i);
  assert.match(interactions, /measurementUseful/);
});

test("urgency uses symptoms, the personal plan, and pattern without a universal value", () => {
  const scene = devonNumberScreenStory.scenes[3];
  assert.deepEqual(
    scene.interaction.options.map((option) => option.id),
    ["symptoms", "personal-plan", "pattern"],
  );
  assert.match(interactions, /Trouble breathing, confusion, fainting, persistent vomiting/);
  assert.match(interactions, /do not delay for an app or retesting/);
  assert.doesNotMatch(JSON.stringify(scene), /\b(?:180|200|250|300|400)\b/);
});

test("the message builder requests generic context rather than personal health data or apology", () => {
  const scene = devonNumberScreenStory.scenes[4];
  assert.equal(scene.interactionType, "communication-builder");
  assert.match(JSON.stringify(scene.interaction.options), /An apology for having the result/);
  assert.match(interactions, /Message draft/);
  const builder = interactions.slice(
    interactions.indexOf("function CommunicationBuilder"),
    interactions.indexOf("function PatternComparison"),
  );
  assert.doesNotMatch(builder, /type="(?:text|number)"/);
  assert.match(interactions, /const communicationUseful/);
});

test("the final comparison selects contextual pattern without prescribing more checks", () => {
  const scene = devonNumberScreenStory.scenes[5];
  assert.equal(scene.interactionType, "pattern-comparison");
  assert.deepEqual(
    scene.interaction.options.map((option) => option.id),
    ["isolated", "contextual"],
  );
  assert.match(
    scene.interaction.learningPoint,
    /care plan—not this story—determines when monitoring/i,
  );
  assert.doesNotMatch(JSON.stringify(scene), /test more|check more|increase.*testing|every hour/i);
});

test("Story 4 connects to the real Lesson 8 without changing lesson progress", () => {
  assert.equal(devonNumberScreenStory.relatedLessonId, "20000000-0000-0000-0000-000000000008");
  assert.equal(devonNumberScreenStory.relatedLessonTitle, "Lesson 8, Making Sense of Your Glucose");
  assert.equal(devonNumberScreenStory.relatedLessonHref, "/lessons/8");
  assert.doesNotMatch(route, /completeLesson|lessonProgress/);
});

test("prediction is unscored and all three knowledge answers are C", () => {
  assert.equal(devonNumberScreenStory.predictionChoices?.[2]?.id, "c");
  assert.deepEqual(
    devonNumberScreenStory.quiz.map((question) => question.correctChoiceId),
    ["c", "c", "c"],
  );
  assert.equal(
    calculateStoryQuizScore(devonNumberScreenStory.quiz, {
      "devon-reading-meaning": "c",
      "devon-unexpected-result": "c",
      "devon-useful-message": "c",
    }),
    3,
  );
  assert.match(player, /prediction: choice\.id/);
  assert.doesNotMatch(
    player.slice(
      player.indexOf('progress.stage === "prediction"'),
      player.indexOf('progress.stage === "quiz"'),
    ),
    /calculateStoryQuizScore/,
  );
  assert.ok(
    player.indexOf('progress.stage === "prediction"') < player.indexOf('progress.stage === "quiz"'),
  );
});

test("progress remains story-specific and all responsive layouts are styled", () => {
  assert.equal(DEVON_STORY_STORAGE_KEY, getStoryStorageKey(devonNumberScreenStory.slug));
  assert.match(styles, /\[data-layout="thought-chain"\]/);
  assert.match(styles, /\[data-layout="process-path"\]/);
  assert.match(styles, /\[data-layout="communication-builder"\]/);
  assert.match(styles, /@media \(max-width: 38rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(player, /storyCompleted: true/);
  assert.match(player, /keyIdeaUnderstood: score >= 2/);
  assert.match(player, /window\.localStorage\.setItem\(storageKey/);
  assert.match(player, /disabled=\{!interactionComplete\}/);
  assert.match(interactions, /aria-live="polite"/);
  assert.match(interactions, /type="button"/);
  assert.match(interactions, /type="radio"/);
});

test("optional context and private reflection do not block completion or claim clinical storage", () => {
  const patternSource = interactions.slice(
    interactions.indexOf("function PatternComparison"),
    interactions.indexOf("export function StoryInteraction"),
  );
  assert.match(patternSource, /optional-context/);
  assert.match(patternSource, /submitEvaluatedInteraction/);
  assert.match(patternSource, /correct: true/);
  assert.ok(devonNumberScreenStory.privateReflectionPrompt);
  assert.match(player, /save && trimmed \? trimmed : current\.privateReflection/);
  assert.match(player, /finishReflection\(false\)/);
});

test("every evaluated Story 4 interaction unlocks with teaching feedback after two misses", () => {
  assert.match(interactions, /const MAX_UNSUCCESSFUL_ATTEMPTS = 2/);
  assert.match(interactions, /nextAttempts >= MAX_UNSUCCESSFUL_ATTEMPTS/);
  assert.match(interactions, /The intended side is labeled above, and you can continue/);
  assert.match(interactions, /The corrected chain is labeled above/);
  assert.match(interactions, /The useful process steps are identified below/);
  assert.match(interactions, /The intended response for each missed situation is shown above/);
  assert.match(interactions, /The concrete details are identified below/);
  assert.match(interactions, /View B is the more useful comparison, and you can continue/);
});

test("Story 4 correction labels sit inside their cards and away from the process line", () => {
  assert.match(interactions, /className=\{styles\.boundaryStatementLabel\}/);
  assert.match(interactions, /className=\{styles\.chainStepLabel\}/);
  assert.match(styles, /\.boundaryStatementLabel[\s\S]*grid-column: 1 \/ -1/);
  assert.match(styles, /\.chainStepLabel[\s\S]*position: absolute[\s\S]*top: 0/);
  assert.match(styles, /\.chainStep::after[\s\S]*top: 2rem/);
});
