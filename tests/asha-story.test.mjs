import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { ashaRiceOnTheTableStory } from "../features/stories/content/asha-rice-on-the-table.ts";
import {
  ASHA_STORY_STORAGE_KEY,
  createInitialStoryProgress,
  getStoryPreviewStatus,
  getStoryStorageKey,
  parseStoryProgress,
} from "../features/stories/lib/story-progress.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const landingStyles = readFileSync("features/stories/components/story-landing.module.css", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const interactions = readFileSync("features/stories/components/story-interactions.tsx", "utf8");
const playerStyles = readFileSync("features/stories/components/story-player.module.css", "utf8");
const storyRoute = readFileSync("app/(app)/stories/[slug]/page.tsx", "utf8");
const storyTypes = readFileSync("features/stories/types/interactive-story.ts", "utf8");

test("Asha appears as the second available situation without creating future stories", () => {
  assert.match(landing, /id="food-and-family-story"/);
  assert.match(landing, /story=\{ashaRiceOnTheTableStory\}/);
  assert.match(landing, /story=\{marcusParkingLotStory\}/);
  assert.match(landing, /Two stories are available/);
  assert.equal(landing.split("story={").length - 1, 2);
  assert.equal(ashaRiceOnTheTableStory.topic, "Food and family");
  assert.doesNotMatch(landing, /starting-medication|worrying-reading|support-boundaries/);
});

test("Asha’s preview preserves the requested editorial order and copy", () => {
  for (const phrase of [
    "Illustrative story",
    "Why this story matters",
    "Connected to",
    "Begin Story",
    "Resume Story",
    "Read Again",
  ]) {
    assert.match(landing, new RegExp(phrase));
  }
  assert.ok(landing.indexOf("styles.cover") < landing.indexOf("styles.labels"));
  assert.ok(landing.indexOf("styles.labels") < landing.indexOf("styles.previewIntroduction"));
  assert.ok(landing.indexOf("styles.previewIntroduction") < landing.indexOf("styles.whyItMatters"));
  assert.ok(landing.indexOf("styles.whyItMatters") < landing.indexOf("styles.previewFooter"));
  assert.equal(
    ashaRiceOnTheTableStory.introduction,
    "After her diagnosis, Asha began removing familiar foods from her plate and eating separately from her family. One Sunday dinner helped her see that caring for her health did not require leaving her culture or the table behind.",
  );
  assert.equal(ashaRiceOnTheTableStory.estimatedTimeLabel, "6 to 8 minutes");
  assert.equal(ashaRiceOnTheTableStory.relatedLessonLabel, "Lesson 4");
});

test("the one Asha cover is local, optimized, accessible, and limited to the preview", () => {
  assert.equal(ashaRiceOnTheTableStory.imagePath, "/stories/asha-rice-on-the-table-cover.webp");
  assert.match(ashaRiceOnTheTableStory.imageAlt, /editorial illustration/i);
  assert.match(ashaRiceOnTheTableStory.imageAlt, /South Asian woman/i);
  assert.doesNotMatch(ashaRiceOnTheTableStory.imageAlt, /Photo of Asha|real patient|wrong food/i);
  assert.ok(statSync("public/stories/asha-rice-on-the-table-cover.webp").size > 80_000);
  assert.match(landing, /height=\{900\}/);
  assert.match(landing, /width=\{1600\}/);
  assert.equal(landing.split("story.imagePath").length - 1, 1);
  assert.equal(player.split("story.imagePath").length - 1, 0);
  assert.doesNotMatch(player, /styles\.hero|styles\.cover|<Image/);
});

test("the dedicated route selects Asha’s story and does not complete Lesson 4", () => {
  assert.match(storyRoute, /ashaRiceOnTheTableStory\.slug/);
  assert.match(storyRoute, /<InteractiveStoryPlayer story=\{ashaRiceOnTheTableStory\} \/>/);
  assert.equal(ashaRiceOnTheTableStory.relatedLessonHref, "/lessons/4");
  assert.doesNotMatch(player, /completeLessonAction|saveLessonPositionAction/);
});

test("the story contains exactly six progressive scenes in the required order", () => {
  assert.deepEqual(
    ashaRiceOnTheTableStory.scenes.map(({ title }) => title),
    [
      "Everything Looked Different",
      "The Separate Plate",
      "“Are You Not Eating With Us?”",
      "Learning What the Meal Was Doing",
      "The Choice at Sunday Dinner",
      "The Same Table",
    ],
  );
  assert.equal(ashaRiceOnTheTableStory.scenes.length, 6);
  assert.deepEqual(
    ashaRiceOnTheTableStory.scenes.map(({ interactionType }) => interactionType),
    [
      "grocery-fear",
      "separate-plate",
      "family-dialogue",
      "meal-builder",
      "meaningful-food-choice",
      "shared-table",
    ],
  );
  assert.match(player, /story\.scenes\[progress\.currentScene\]/);
  assert.doesNotMatch(player, /story\.scenes\.map\(\(scene\).*<StorySceneView/s);
});

test("story navigation advances one scene and gates only Asha’s meaningful experiment", () => {
  assert.match(player, /runSceneTransition\(progress\.currentScene \+ 1, "forward"\)/);
  assert.match(player, /runSceneTransition\(progress\.currentScene - 1, "backward"\)/);
  assert.match(player, /disabled=\{!isReached \|\| isCurrent\}/);
  assert.match(player, /disabled=\{!interactionComplete\}/);
  assert.deepEqual(
    ashaRiceOnTheTableStory.scenes
      .filter((scene) => scene.interaction.requiredForProgress)
      .map((scene) => scene.number),
    [5],
  );
  assert.match(player, /headingRef\.current\?\.focus/);
});

test("label exploration adds a reusable reading skill without repeating Asha's cart", () => {
  for (const clue of [
    "Serving size",
    "Total carbohydrate",
    "Fiber and protein",
    "Your usual amount",
    "The rest of the meal",
  ]) {
    assert.match(interactions, new RegExp(`label: "${clue}"`));
  }
  assert.match(interactions, /aria-label="Explore nutrition label clues"/);
  assert.match(interactions, /aria-pressed=\{selected === option\.id\}/);
  assert.match(interactions, /A package label is a tool for comparison/);
  assert.doesNotMatch(interactions, /calories|good food|bad food|safe food classification/i);
});

test("the shared-meal comparison adds an agency concept with drag and button controls", () => {
  assert.match(interactions, /type="range"/);
  assert.match(interactions, /Shared meal, individual choices/);
  assert.match(interactions, /Everyone needs the same plate/);
  assert.match(interactions, /role="group"/);
  assert.match(interactions, /participation with agency/);
});

test("family dialogue offers reusable consent and boundary language", () => {
  assert.equal(familyDialogueChoiceCount(), 4);
  assert.match(ashaRiceOnTheTableStory.scenes[2].interaction.prompt, /boundary could Asha borrow/);
  assert.match(interactions, /Please let me decide what goes on my plate/);
  assert.match(interactions, /protect connection and independence/);
  assert.match(interactions, /aria-live="polite"/);
});

function familyDialogueChoiceCount() {
  const start = interactions.indexOf("const familyDialogueChoices");
  const end = interactions.indexOf("const mealComponents", start);
  return (interactions.slice(start, end).match(/id: "/g) ?? []).length;
}

test("the meal builder has tap controls, broad portions, contextual feedback, and no scoring", () => {
  for (const food of [
    "Rice",
    "Dal",
    "Vegetables",
    "Chicken",
    "Flatbread",
    "Plain yogurt",
    "Water",
    "Dessert",
  ]) {
    assert.match(interactions, new RegExp(`label: "${food}"`));
  }
  assert.match(interactions, /Add \$\{food\.label\}/);
  assert.match(interactions, /\["small", "moderate", "large"\]/);
  assert.match(interactions, /There is no single universally perfect plate/);
  assert.match(interactions, /not a personalized meal plan/);
  assert.match(interactions, /Individual\s+needs\s+can vary/);
  assert.match(
    ashaRiceOnTheTableStory.scenes[3].interaction.prompt,
    /familiar, filling, and feasible/i,
  );
  const builder = interactions.slice(
    interactions.indexOf("function CulturalMealBuilder"),
    interactions.indexOf("function FoodChoicePath"),
  );
  assert.doesNotMatch(builder, /quizScore|correctChoiceId|calorie|grams|predict blood glucose/i);
});

test("Scene 5 contains a meaningful non-quiz learner decision", () => {
  assert.equal(ashaRiceOnTheTableStory.scenes[4]?.interactionType, "meaningful-food-choice");
  assert.match(
    ashaRiceOnTheTableStory.scenes[4]?.interaction.prompt ?? "",
    /Which small experiment could Asha choose/,
  );
  assert.match(interactions, /One experiment, not a verdict/);
  assert.match(interactions, /what Asha learns about\s+familiarity, satisfaction/);
  assert.match(interactions, /onStateChange\(`\$\{scene\.id\}:complete`, "complete"\)/);
  const decision = interactions.slice(
    interactions.indexOf("function FoodChoicePath"),
    interactions.indexOf("function SharedMealSupportSelector"),
  );
  assert.doesNotMatch(decision, /quizScore|correctChoiceId/);
});

test("Scene 6 contains a multiple-selection shared-support agreement", () => {
  assert.equal(ashaRiceOnTheTableStory.scenes[5]?.interactionType, "shared-table");
  assert.match(
    ashaRiceOnTheTableStory.scenes[5].interaction.prompt,
    /Which agreements could make future meals calmer/,
  );
  assert.match(interactions, /type="checkbox"/);
  assert.match(
    interactions,
    /A family agreement can reduce pressure before anyone needs to correct a plate/,
  );
  assert.match(interactions, /selected\.length/);
});

test("all six Asha interactions add original tools instead of replaying the scene", () => {
  for (const newTool of [
    "calmer label-reading order",
    "What can stay shared",
    "three-F check",
    "family agreement",
  ]) {
    assert.match(interactions, new RegExp(newTool, "i"));
  }
  assert.match(ashaRiceOnTheTableStory.scenes[2].interaction.prompt, /future family meal/i);
  assert.match(ashaRiceOnTheTableStory.scenes[4].interaction.prompt, /small experiment/i);

  for (const repeatedStoryDetail of [
    "Asha’s grocery shelf",
    "Asha’s separate plate",
    "Removing food without Asha’s input may increase isolation",
    "Asha chose rice, dal, vegetables, and chicken",
    "Include vegetables and protein in shared meals",
    "Avoid commenting on every portion",
  ]) {
    assert.doesNotMatch(interactions, new RegExp(repeatedStoryDetail));
  }
});

test("prediction follows Scene 6 and does not affect quiz scoring", () => {
  assert.equal(ashaRiceOnTheTableStory.predictionChoices?.length, 4);
  assert.equal(ashaRiceOnTheTableStory.predictionChoices?.[2]?.id, "whole-meal");
  assert.ok(
    player.indexOf('progress.stage === "prediction"') < player.indexOf('progress.stage === "quiz"'),
  );
  const predictionStage = player.slice(
    player.indexOf('progress.stage === "prediction"'),
    player.indexOf('progress.stage === "quiz"'),
  );
  assert.match(predictionStage, /prediction: choice\.id/);
  assert.doesNotMatch(predictionStage, /quizScore/);
});

test("the three-question quiz uses immediate teaching feedback and separate outcomes", () => {
  assert.equal(ashaRiceOnTheTableStory.quiz.length, 3);
  assert.deepEqual(
    ashaRiceOnTheTableStory.quiz.map(({ correctChoiceId }) => correctChoiceId),
    ["b", "c", "c"],
  );
  assert.match(player, /Submit Answer/);
  assert.match(player, /That’s it\./);
  assert.match(player, /Not quite\. Here is the idea to carry forward\./);
  assert.match(player, /storyCompleted: true/);
  assert.match(player, /keyIdeaUnderstood: score >= 2/);
  assert.match(player, /Your answer/);
  assert.match(player, /Best answer/);
  assert.match(player, /resultsBreakdown/);

  const completedWithoutUnderstanding = parseStoryProgress(
    JSON.stringify({ ...createInitialStoryProgress(), storyCompleted: true, quizScore: 1 }),
  );
  assert.equal(getStoryPreviewStatus(completedWithoutUnderstanding), "completed");
  assert.equal(completedWithoutUnderstanding.keyIdeaUnderstood, false);
});

test("reflection is private, optional, and never saves an empty response", () => {
  assert.match(player, /Save Privately/);
  assert.match(player, /Skip for Now/);
  assert.match(player, /save && trimmed \? trimmed/);
  assert.match(player, /disabled=\{!reflectionDraft\.trim\(\)\}/);
  assert.match(player, /not shared with caregivers/);
  assert.match(player, /used for AI\s+personalization/);
  assert.doesNotMatch(player, /sendToTutor|dietary risk/);
});

test("progress is story-specific and persists every requested state container", () => {
  assert.equal(ASHA_STORY_STORAGE_KEY, "health-decoded:story:asha-rice-on-the-table:progress");
  assert.equal(
    getStoryStorageKey("marcus-parking-lot"),
    "health-decoded:story:marcus-parking-lot:progress",
  );
  for (const field of [
    "currentScene",
    "furthestSceneReached",
    "interactionStates",
    "meaningfulChoice",
    "prediction",
    "quizAnswers",
    "quizScore",
    "storyCompleted",
    "keyIdeaUnderstood",
    "completionDate",
    "privateReflection",
    "versionCompleted",
  ]) {
    assert.match(player + JSON.stringify(createInitialStoryProgress()), new RegExp(field));
  }
  assert.match(player, /getStoryStorageKey\(story\.slug\)/);
  assert.match(player, /window\.localStorage\.setItem/);
});

test("editorial governance labels Asha honestly without review or warning claims", () => {
  assert.equal(ashaRiceOnTheTableStory.id, "asha-rice-on-the-table");
  assert.equal(ashaRiceOnTheTableStory.reviewStatus, "not-reviewed");
  assert.equal(ashaRiceOnTheTableStory.medicalRiskLevel, "low");
  assert.equal(ashaRiceOnTheTableStory.version, "1.0");
  assert.equal("contentWarning" in ashaRiceOnTheTableStory, false);
  assert.match(ashaRiceOnTheTableStory.disclosure, /placeholder name/);
  assert.match(ashaRiceOnTheTableStory.disclosure, /does not describe one specific individual/);
  assert.match(ashaRiceOnTheTableStory.sourceThemeNote, /No single person’s wording/);
  assert.match(player, /story\.disclosure/);
  assert.doesNotMatch(
    player,
    /Dietitian approved|Clinician approved|ADA approved|Not reviewed badge/i,
  );
});

test("completion remains intentional, calm, and related to—but separate from—Lesson 4", () => {
  assert.match(player, /Story complete/i);
  assert.match(player, /Knowledge check/);
  assert.match(player, /relatedLessonTitle/);
  assert.match(player, /Return to Stories/);
  assert.match(player, /Review This Story/);
  assert.match(player, /Go to Related Lesson/);
  assert.doesNotMatch(player, /confetti|troph|plate score|food badge/i);
});

test("responsive, accessible, and reduced-motion rules cover the story-specific UI", () => {
  assert.match(landingStyles, /aspect-ratio: 16 \/ 9/);
  assert.match(playerStyles, /grid-template-columns: minmax\(0, 52fr\) minmax\(22rem, 48fr\)/);
  assert.match(playerStyles, /font-size: 1\.0625rem/);
  assert.match(playerStyles, /min-height: 44px/);
  assert.match(playerStyles, /@media \(max-width: 48rem\)/);
  assert.match(playerStyles, /@media \(max-width: 30rem\)/);
  assert.match(playerStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(
    playerStyles,
    /\.foodFamilyPlayer \.sceneSurface\s*\{\s*grid-template-columns: 1fr/s,
  );
  assert.match(playerStyles, /\.foodTray[\s\S]*grid-template-columns: 1fr/);
  assert.match(playerStyles, /transition: none/);
  assert.match(player, /aria-label="Story scene progress"/);
  assert.match(player, /aria-live="polite"/);
  assert.match(player, /tabIndex=\{-1\}/);
  assert.match(storyTypes, /\| "grocery-fear"/);
  assert.match(storyTypes, /\| "shared-table"/);
});

test("Asha is emotionally distinct and the meal is not framed as a prescription", () => {
  assert.match(ashaRiceOnTheTableStory.learningObjective, /culturally meaningful foods/);
  assert.match(
    ashaRiceOnTheTableStory.takeaway,
    /does not require treating familiar foods as enemies/,
  );
  assert.doesNotMatch(
    JSON.stringify(ashaRiceOnTheTableStory),
    /diabetic diet|guilt-free|cheat meal|bad food|clean eating|perfect plate/i,
  );
  assert.doesNotMatch(
    JSON.stringify(ashaRiceOnTheTableStory),
    /real patient|verified patient|testimonial|Health Decoded user/i,
  );
});
