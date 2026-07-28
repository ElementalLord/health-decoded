import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { marcusParkingLotStory } from "../features/stories/content/marcus-parking-lot.ts";
import {
  createInitialStoryProgress,
  getStoryPreviewStatus,
  parseStoryProgress,
} from "../features/stories/lib/story-progress.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const landingStyles = readFileSync("features/stories/components/story-landing.module.css", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const interactions = readFileSync("features/stories/components/story-interactions.tsx", "utf8");
const playerStyles = readFileSync("features/stories/components/story-player.module.css", "utf8");
const landingRoute = readFileSync("app/(app)/stories/page.tsx", "utf8");
const storyRoute = readFileSync("app/(app)/stories/[slug]/page.tsx", "utf8");

test("the Stories page explains that its experiences are illustrative", () => {
  assert.match(landing, /These illustrative experiences explore emotions, decisions/);
  assert.match(landing, /without representing one specific individual/);
  assert.match(landingRoute, /<StoryLanding \/>/);
  assert.doesNotMatch(landing, /testimonial|real patient|success story/i);
});

test("topic browsing lists five situations without fake story previews", () => {
  for (const topic of [
    "Just diagnosed",
    "Food and family",
    "Starting medication",
    "A worrying reading",
    "Support and boundaries",
  ]) {
    assert.match(landing, new RegExp(topic));
  }
  assert.equal(landing.split("<article").length - 1, 1);
  assert.match(landing, /<small>Planned<\/small>/);
});

test("Marcus owns the only prototype preview and its cover comes first", () => {
  assert.match(landing, /id="just-diagnosed-story"/);
  assert.match(landing, /Why this story matters/i);
  assert.match(landing, /\/stories\/marcus-parking-lot/);
  assert.ok(landing.indexOf("styles.cover") < landing.indexOf("styles.previewBody"));
  assert.equal(marcusParkingLotStory.title, "Forty Minutes in the Parking Lot");
  assert.equal(marcusParkingLotStory.topic, "Just diagnosed");
});

test("the single generated cover is optimized, accessible, and reused", () => {
  assert.equal(marcusParkingLotStory.imagePath, "/stories/marcus-parking-lot-cover.webp");
  assert.match(marcusParkingLotStory.imageAlt, /editorial illustration/i);
  assert.doesNotMatch(marcusParkingLotStory.imageAlt, /Photo of Marcus|real patient/i);
  assert.ok(statSync("public/stories/marcus-parking-lot-cover.webp").size > 80_000);
  assert.equal(landing.split("marcusParkingLotStory.imagePath").length - 1, 1);
  assert.equal(player.split("story.imagePath").length - 1, 1);
  assert.match(landing, /height=\{900\}/);
  assert.match(landing, /width=\{1600\}/);
  assert.match(player, /height=\{900\}/);
  assert.match(player, /width=\{1600\}/);
});

test("the dedicated route selects the interactive story without changing Lesson 1", () => {
  assert.match(storyRoute, /marcusParkingLotStory\.slug/);
  assert.match(storyRoute, /<InteractiveStoryPlayer story=\{marcusParkingLotStory\} \/>/);
  assert.match(player, /href="\/lessons\/1"/);
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

test("scene navigation advances one scene, goes back, and does not gate optional interactions", () => {
  assert.match(player, /runSceneTransition\(progress\.currentScene \+ 1, "forward"\)/);
  assert.match(player, /runSceneTransition\(progress\.currentScene - 1, "backward"\)/);
  assert.match(player, /scene\.continueLabel/);
  assert.doesNotMatch(player, /disabled=\{[^}]*interaction/i);
  assert.match(player, /focus\(\{ preventScroll: true \}\)/);
  assert.match(player, /behavior: prefersReducedMotion\(\) \? "auto" : "smooth"/);
});

test("every optional scene interaction is keyboard-operable and selected from story data", () => {
  for (const interactionType of [
    "term-focus",
    "phone-drafts",
    "fact-vs-story",
    "phone-dialogue",
    "meaningful-choice",
    "question-cards",
  ]) {
    assert.match(interactions, new RegExp(`"${interactionType}"`));
  }
  assert.match(interactions, /renderers\[scene\.interactionType\]/);
  assert.ok((interactions.match(/type="button"/g) ?? []).length >= 7);
  assert.ok((interactions.match(/type="radio"/g) ?? []).length >= 2);
  assert.match(interactions, /aria-pressed/);
  assert.match(interactions, /aria-expanded/);
});

test("Scene 5 contains the meaningful decision without adding it to quiz scoring", () => {
  assert.equal(marcusParkingLotStory.scenes[4]?.interactionType, "meaningful-choice");
  assert.match(interactions, /Marcus feels more overwhelmed with every tab he opens/);
  assert.match(interactions, /Marcus chose to close the tabs and write down his questions/);
  assert.doesNotMatch(interactions, /quizScore|correctChoiceId/);
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
  assert.match(player, /That’s it\./);
  assert.match(player, /Not quite\. Here is the idea to carry forward\./);
  assert.match(player, /aria-live="polite"/);
  assert.match(player, /current\.quizScore \+ \(alreadySubmitted \|\| !correct \? 0 : 1\)/);
});

test("story completion and key-idea understanding are distinct persistent outcomes", () => {
  const initial = createInitialStoryProgress();
  assert.equal(initial.storyCompleted, false);
  assert.equal(initial.keyIdeaUnderstood, false);
  assert.match(player, /storyCompleted: true/);
  assert.match(player, /keyIdeaUnderstood: current\.quizScore >= 2/);
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
    assert.match(player, new RegExp(label));
  }
});

test("the disclosure and editorial-governance metadata make the scenario honest", () => {
  assert.match(marcusParkingLotStory.disclosure, /placeholder name/);
  assert.match(marcusParkingLotStory.disclosure, /does not describe one specific individual/);
  assert.equal(marcusParkingLotStory.reviewStatus, "not-reviewed");
  assert.equal(marcusParkingLotStory.medicalRiskLevel, "low");
  assert.equal(marcusParkingLotStory.version, "1.0");
  assert.equal("contentWarning" in marcusParkingLotStory, false);
  assert.match(player, /story\.contentWarning \?/);
  assert.match(player, /story\.reviewStatus === "reviewed"/);
  assert.match(player, /story\.reviewerName/);
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
  assert.match(playerStyles, /scene-leave-forward 150ms/);
  assert.match(playerStyles, /scene-enter-forward 230ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.doesNotMatch(playerStyles, /rotateY|perspective\(|scale\(/);
});
