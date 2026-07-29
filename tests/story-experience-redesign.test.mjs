import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ashaRiceOnTheTableStory } from "../features/stories/content/asha-rice-on-the-table.ts";
import { marcusParkingLotStory } from "../features/stories/content/marcus-parking-lot.ts";
import { noraPrescriptionBagStory } from "../features/stories/content/nora-prescription-bag.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const opening = readFileSync("features/stories/components/story-opening.tsx", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const landingStyles = readFileSync("features/stories/components/story-landing.module.css", "utf8");
const playerStyles = readFileSync("features/stories/components/story-player.module.css", "utf8");

const stories = [marcusParkingLotStory, ashaRiceOnTheTableStory, noraPrescriptionBagStory];

test("the landing hierarchy has one feature and two deliberately varied rows", () => {
  assert.match(landing, /variant="featured"/);
  assert.match(landing, /variant="row"/);
  assert.match(landing, /variant="row-reverse"/);
  assert.match(landing, /Recommended place to begin/);
  assert.match(landingStyles, /\.featured[\s\S]*grid-template-columns/);
  assert.match(landingStyles, /\.row-reverse \.cover[\s\S]*grid-column: 2/);
});

test("every dedicated story begins with the same complete cover sequence", () => {
  for (const phrase of [
    "Back to Stories",
    "Illustrative story",
    "placeholder name",
    "Related lesson",
    "Begin Story",
    "Resume Story",
    "Read Again",
  ]) {
    assert.match(`${player}\n${opening}`, new RegExp(phrase));
  }
  assert.match(opening, /src=\{story\.imagePath\}/);
  assert.match(player, /progress\.stage !== "intro"/);
});

test("story metadata controls distinct themes, arcs, and scene rhythm", () => {
  assert.deepEqual(
    stories.map((story) => story.visualTheme),
    ["quiet-dusk", "family-warmth", "hesitation"],
  );
  for (const story of stories) {
    assert.ok(story.emotionalArc);
    assert.ok(story.dominantInteractionType);
    assert.ok(story.primaryAccent);
    assert.ok(story.closingTone);
    assert.equal(story.scenes.length, 6);
    for (const scene of story.scenes) {
      assert.ok(scene.layout);
      assert.match(scene.tone, /^(tension|pause|clarity)$/);
    }
  }
  assert.ok(
    new Set(stories.flatMap((story) => story.scenes.map((scene) => scene.layout))).size >= 6,
  );
  assert.match(player, /data-layout=\{scene\.layout\}/);
  assert.match(player, /data-tone=\{scene\.tone\}/);
  assert.match(playerStyles, /\[data-layout="narrative-right"\]/);
  assert.match(playerStyles, /\[data-layout="closing-wide"\]/);
});

test("visible all-sided bordered containers are reduced by more than forty percent", () => {
  const baseline = 33;
  const current = `${landingStyles}\n${playerStyles}`.match(/border: 1px solid/g)?.length ?? 0;
  assert.ok(current <= Math.floor(baseline * 0.6), `expected at most 19, found ${current}`);
});

test("motion, progress, quiz language, and reduced motion form one calm system", () => {
  assert.match(player, /mobileProgressTrack/);
  assert.match(player, /Correct answer/);
  assert.match(player, /Worth reviewing/);
  assert.match(playerStyles, /@keyframes scene-enter-pause/);
  assert.match(playerStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(playerStyles, /\.completionStage[\s\S]*radial-gradient/);
});
