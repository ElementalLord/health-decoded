import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { marcusParkingLotStory } from "../features/stories/content/marcus-parking-lot.ts";
import {
  calculateStoryQuizScore,
  createInitialStoryProgress,
  createStoryReviewProgress,
  getStoryPreviewStatus,
  parseStoryProgress,
} from "../features/stories/lib/story-progress.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const landingStyles = readFileSync("features/stories/components/story-landing.module.css", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const opening = readFileSync("features/stories/components/story-opening.tsx", "utf8");
const interactions = readFileSync("features/stories/components/story-interactions.tsx", "utf8");
const playerStyles = readFileSync("features/stories/components/story-player.module.css", "utf8");
const landingRoute = readFileSync("app/(app)/stories/page.tsx", "utf8");
const storyRoute = readFileSync("app/(app)/stories/[slug]/page.tsx", "utf8");

test("the Stories page explains that its experiences are illustrative", () => {
  assert.match(landing, /Illustrative experiences that explore the emotions, decisions/);
  assert.match(landing, /It does not describe one specific person/);
  assert.match(landingRoute, /<StoryLanding \/>/);
  assert.doesNotMatch(landing, /testimonial|real patient|success story/i);
});

test("topic browsing lists five situations and only marks the unbuilt topic as planned", () => {
  for (const topic of [
    "Just diagnosed",
    "Food and family",
    "Starting medication",
    "A worrying reading",
    "Support and boundaries",
  ]) {
    assert.match(landing, new RegExp(topic));
  }
  assert.equal(landing.split("story={").length - 1, 4);
  assert.match(landing, /<small>Planned<\/small>/);
});

test("Marcus remains the Just diagnosed preview and its cover comes first", () => {
  assert.match(landing, /id="just-diagnosed-story"/);
  assert.match(landing, /Why it may stay with you/i);
  assert.match(landing, /story=\{marcusParkingLotStory\}/);
  assert.match(landing, /href=\{storyHref\}/);
  assert.ok(landing.indexOf("styles.cover") < landing.indexOf("styles.previewBody"));
  assert.equal(marcusParkingLotStory.title, "Forty Minutes in the Parking Lot");
  assert.equal(marcusParkingLotStory.topic, "Just diagnosed");
});

test("Marcus’s generated cover remains optimized and is reused without duplicate assets", () => {
  assert.equal(marcusParkingLotStory.imagePath, "/stories/marcus-parking-lot-cover.webp");
  assert.match(marcusParkingLotStory.imageAlt, /editorial illustration/i);
  assert.doesNotMatch(marcusParkingLotStory.imageAlt, /Photo of Marcus|real patient/i);
  assert.ok(statSync("public/stories/marcus-parking-lot-cover.webp").size > 80_000);
  assert.equal(landing.split("story.imagePath").length - 1, 1);
  assert.match(landing, /height=\{900\}/);
  assert.match(landing, /width=\{1600\}/);
  assert.match(opening, /src=\{story\.imagePath\}/);
});

test("a new story can begin directly from the landing without repeating its cover", () => {
  assert.match(player, /progress\.stage !== "intro"/);
  assert.match(opening, /Begin Story/);
  assert.match(landing, /Resume Story/);
  assert.match(landing, /Read Again/);
  assert.match(landing, /\?begin=1/);
  assert.match(player, /resolveStoryEntryProgress/);
  assert.match(player, /progress\.stage === "intro" \?/);
  assert.match(player, /hydrated && progress\.stage !== "intro"/);
  assert.match(landing, /progress\.status === "completed"/);
  assert.doesNotMatch(landing, /\?restart=1/);
  assert.match(player, /createStoryReviewProgress/);
});

test("the dedicated route selects the interactive story without changing Lesson 1", () => {
  assert.match(storyRoute, /marcusParkingLotStory\.slug/);
  assert.match(storyRoute, /<InteractiveStoryPlayer story=\{marcusParkingLotStory\} \/>/);
  assert.match(player, /story\.relatedLessonHref \?\? "\/lessons\/1"/);
  assert.doesNotMatch(player, /completeLessonAction|saveLessonPositionAction/);
});

test("the story data contains exactly six governed progressive scenes", () => {
  assert.deepEqual(
    marcusParkingLotStory.scenes.map(({ title }) => title),
    [
      "The Word He Heard",
      "Forty Minutes",
      "The Promise He Thought He Broke",
      "Then Come Home",
      "Too Much Information",
      "Three Questions",
    ],
  );
  assert.equal(marcusParkingLotStory.scenes.length, 6);
  assert.equal(
    new Set(marcusParkingLotStory.scenes.map(({ interactionType }) => interactionType)).size,
    6,
  );
  assert.match(player, /story\.scenes\[progress\.currentScene\]/);
  assert.doesNotMatch(player, /story\.scenes\.map\(\(scene\).*<StorySceneView/s);
});

test("scene navigation advances one scene, goes back, and gates only declared decisions", () => {
  assert.match(player, /runSceneTransition\(progress\.currentScene \+ 1, "forward"\)/);
  assert.match(player, /runSceneTransition\(progress\.currentScene - 1, "backward"\)/);
  assert.match(player, /scene\.continueLabel/);
  assert.match(player, /!scene\.interaction\.requiredForProgress/);
  assert.match(player, /disabled=\{!interactionComplete\}/);
  assert.deepEqual(
    marcusParkingLotStory.scenes
      .filter((scene) => scene.interaction.requiredForProgress)
      .map((scene) => scene.number),
    [4, 5],
  );
  assert.match(player, /focus\(\{ preventScroll: true \}\)/);
  assert.match(player, /behavior: prefersReducedMotion\(\) \? "auto" : "smooth"/);
});

test("every scene interaction is keyboard-operable and selected from story data", () => {
  for (const interactionType of [
    "attention-overload",
    "emotional-interpretation",
    "thought-sort",
    "response-prediction",
    "information-filter",
    "question-prioritization",
  ]) {
    assert.match(interactions, new RegExp(`"${interactionType}"`));
  }
  assert.match(interactions, /renderers\[scene\.interactionType\]/);
  assert.ok((interactions.match(/type="button"/g) ?? []).length >= 7);
  assert.ok((interactions.match(/type="radio"/g) ?? []).length >= 2);
  assert.match(interactions, /aria-pressed/);
  assert.match(interactions, /type="checkbox"/);
});

test("Scene 5 teaches information filtering without replaying Marcus's action", () => {
  assert.equal(marcusParkingLotStory.scenes[4]?.interactionType, "information-filter");
  assert.match(interactions, /Turn the broad search into a question Marcus can use/);
  assert.match(interactions, /actual context/);
  assert.doesNotMatch(interactions, /quizScore|correctChoiceId/);
});

test("all six Marcus interactions add a skill instead of replaying the adjacent narrative", () => {
  for (const newSkill of [
    "Stress can narrow attention",
    "Interpret the pause",
    "What Marcus knows",
    "Prediction point",
    "actual context",
    "Ask first",
  ]) {
    assert.match(interactions, new RegExp(newSkill, "i"));
  }

  for (const repeatedStoryLine of [
    "This was the only word that stayed with him",
    "Everything is fine.",
    "I have diabetes.",
    "What did the doctor tell you to do tonight?",
    "Then come home. We’ll start there.",
    "Marcus chose to close the tabs and write down his questions",
    "What does this diagnosis mean for me?",
    "Can I still live a normal life?",
  ]) {
    assert.doesNotMatch(interactions, new RegExp(repeatedStoryLine.replace(/[.?]/g, "\\$&")));
  }
});

test("prediction appears after Scene 6 and never changes quiz score", () => {
  assert.match(player, /stage: "prediction"/);
  assert.match(player, /stage: "quiz"/);
  assert.ok(
    player.indexOf('progress.stage === "prediction"') < player.indexOf('progress.stage === "quiz"'),
  );
  assert.match(player, /prediction: choice\.id/);
  assert.doesNotMatch(
    player.slice(
      player.indexOf('progress.stage === "prediction"'),
      player.indexOf('progress.stage === "quiz"'),
    ),
    /quizScore/,
  );
});

test("the three-question quiz teaches immediately and scores only submitted answers", () => {
  assert.equal(marcusParkingLotStory.quiz.length, 3);
  assert.match(player, /Submit Answer/);
  assert.match(player, /Correct answer/);
  assert.match(player, /Worth reviewing/);
  assert.match(player, /aria-live="polite"/);
  assert.match(player, /calculateStoryQuizScore\(story\.quiz, quizAnswers\)/);
  assert.match(player, /Your answer/);
  assert.match(player, /Best answer/);
  assert.match(player, /resultsBreakdown/);

  assert.equal(
    calculateStoryQuizScore(marcusParkingLotStory.quiz, {
      "manageable-next-step": "c",
      "information-overload": "b",
      "helpful-response": "c",
    }),
    3,
  );
  assert.equal(
    calculateStoryQuizScore(marcusParkingLotStory.quiz, {
      "manageable-next-step": "a",
      "information-overload": "b",
      "helpful-response": "d",
    }),
    1,
  );
});

test("story completion and key-idea understanding are distinct persistent outcomes", () => {
  const initial = createInitialStoryProgress();
  assert.equal(initial.storyCompleted, false);
  assert.equal(initial.keyIdeaUnderstood, false);
  assert.match(player, /storyCompleted: true/);
  assert.match(player, /keyIdeaUnderstood: score >= 2/);
  assert.match(player, /A few ideas may be worth reviewing\./);
  assert.doesNotMatch(player, /\bFailed\b|Poor score|Did not master/);

  const completed = parseStoryProgress(
    JSON.stringify({ ...initial, storyCompleted: true, quizScore: 1 }),
  );
  assert.equal(getStoryPreviewStatus(completed), "completed");
  assert.equal(completed.keyIdeaUnderstood, false);
});

test("private reflection can be saved locally or skipped", () => {
  assert.match(player, /Save Privately/);
  assert.match(player, /Skip for Now/);
  assert.match(player, /privateReflection: save && trimmed/);
  assert.match(player, /Saved only in this browser/);
  assert.match(player, /not shared with caregivers/);
  assert.match(player, /disabled=\{!reflectionDraft\.trim\(\)\}/);
});

test("story progress persists and exposes Begin, Resume, and Read Again states", () => {
  assert.match(player, /window\.localStorage\.getItem/);
  assert.match(player, /window\.localStorage\.setItem/);
  assert.match(player, /currentScene/);
  assert.match(player, /furthestSceneReached/);
  assert.match(player, /meaningfulChoice/);
  assert.match(player, /completionDate/);
  assert.match(player, /versionCompleted/);
  for (const label of ["Begin Story", "Resume Story", "Read Again"]) {
    assert.match(landing, new RegExp(label));
  }

  const reread = createStoryReviewProgress({
    ...createInitialStoryProgress(),
    currentScene: 5,
    furthestSceneReached: 5,
    quizAnswers: { "manageable-next-step": "c" },
    submittedQuizQuestions: ["manageable-next-step"],
    quizScore: 1,
    storyCompleted: true,
    privateReflection: "Keep this note",
    stage: "complete",
  });
  assert.equal(reread.stage, "story");
  assert.equal(reread.currentScene, 0);
  assert.deepEqual(reread.quizAnswers, {});
  assert.deepEqual(reread.submittedQuizQuestions, []);
  assert.equal(reread.quizScore, 0);
  assert.equal(reread.storyCompleted, false);
  assert.equal(reread.privateReflection, "Keep this note");
});

test("the disclosure and editorial-governance metadata make the scenario honest", () => {
  assert.match(marcusParkingLotStory.disclosure, /placeholder name/);
  assert.match(marcusParkingLotStory.disclosure, /does not describe one specific individual/);
  assert.equal(marcusParkingLotStory.reviewStatus, "not-reviewed");
  assert.equal(marcusParkingLotStory.medicalRiskLevel, "low");
  assert.equal(marcusParkingLotStory.version, "1.0");
  assert.equal("contentWarning" in marcusParkingLotStory, false);
  assert.match(player, /story\.disclosure/);
  assert.equal(marcusParkingLotStory.showDetailCover, undefined);
  assert.doesNotMatch(player, /Medically reviewed|Not medically reviewed/);
});

test("the completion screen preserves context without rewards or medical claims", () => {
  assert.match(player, /Story complete/i);
  assert.match(player, /Knowledge check/);
  assert.match(player, /Lesson 1, The First Five Minutes/);
  assert.match(player, /Return to Stories/);
  assert.match(player, /Review This Story/);
  assert.match(player, /Go to Related Lesson/);
  assert.doesNotMatch(player, /confetti|troph|points|medically prepared/i);
});

test("responsive and reduced-motion styles protect reading and interaction", () => {
  assert.match(landingStyles, /aspect-ratio: 16 \/ 9/);
  assert.match(playerStyles, /grid-template-columns: minmax\(0, 58fr\) minmax\(20rem, 42fr\)/);
  assert.match(playerStyles, /font-size: 1\.0625rem/);
  assert.match(playerStyles, /min-height: 44px/);
  assert.match(playerStyles, /@media \(max-width: 48rem\)/);
  assert.match(playerStyles, /@media \(max-width: 30rem\)/);
  assert.match(playerStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(playerStyles, /animation: none/);
  assert.match(playerStyles, /scene-leave-forward 160ms/);
  assert.match(playerStyles, /scene-enter-forward 230ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.doesNotMatch(playerStyles, /rotateY|perspective\(|scale\(/);
});
