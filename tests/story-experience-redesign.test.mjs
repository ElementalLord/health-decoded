import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ashaRiceOnTheTableStory } from "../features/stories/content/asha-rice-on-the-table.ts";
import { devonNumberScreenStory } from "../features/stories/content/devon-number-screen.ts";
import { marcusParkingLotStory } from "../features/stories/content/marcus-parking-lot.ts";
import { noraPrescriptionBagStory } from "../features/stories/content/nora-prescription-bag.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const opening = readFileSync("features/stories/components/story-opening.tsx", "utf8");
const player = readFileSync("features/stories/components/interactive-story-player.tsx", "utf8");
const landingStyles = readFileSync("features/stories/components/story-landing.module.css", "utf8");
const playerStyles = readFileSync("features/stories/components/story-player.module.css", "utf8");

const stories = [
  marcusParkingLotStory,
  ashaRiceOnTheTableStory,
  noraPrescriptionBagStory,
  devonNumberScreenStory,
];

test("the landing hierarchy has one feature and a compact editorial story index", () => {
  assert.match(landing, /variant="featured"/);
  assert.match(landing, /"row" : "row-reverse"/);
  assert.match(landing, /getRecommendedStorySlug/);
  assert.match(landing, /recommendedProgress\.status === "in-progress"/);
  assert.match(landingStyles, /\.featured[\s\S]*grid-template-columns/);
  assert.match(landingStyles, /\.storyRows \{[\s\S]*border-bottom/);
  assert.match(landingStyles, /\.storyRows \.preview[\s\S]*background: transparent/);
});

test("story preview images preserve their ratio beside copy and can never cover the action", () => {
  assert.match(landingStyles, /\.preview \{[\s\S]*contain: paint/);
  assert.match(landingStyles, /\.preview \{[\s\S]*overflow: clip/);
  assert.match(landingStyles, /\.featured \{[\s\S]*minmax\(16rem, 0\.78fr\)/);
  assert.match(
    landingStyles,
    /\.row,[\s\S]*grid-template-columns: minmax\(13rem, 0\.42fr\) minmax\(0, 1\.58fr\)/,
  );
  assert.match(landingStyles, /\.featured \.cover \{[\s\S]*aspect-ratio: 16 \/ 9/);
  assert.match(landingStyles, /\.row \.cover,[\s\S]*aspect-ratio: 16 \/ 9/);
  assert.match(landingStyles, /\.cover img \{[\s\S]*aspect-ratio: 16 \/ 9[\s\S]*object-fit: cover/);
  assert.match(landingStyles, /\.previewFooter \{[\s\S]*flex-wrap: wrap/);
  assert.match(landingStyles, /\.storyAction \{[\s\S]*z-index: 3/);
});

test("every dedicated story begins with the same complete cover sequence", () => {
  for (const phrase of [
    "Back to Stories",
    "Illustrative story",
    "placeholder name",
    "Related lesson",
    "Start",
    "Continue",
    "Read again",
  ]) {
    assert.match(`${landing}\n${player}\n${opening}`, new RegExp(phrase));
  }
  assert.match(opening, /src=\{story\.imagePath\}/);
  assert.match(player, /progress\.stage !== "intro"/);
});

test("story metadata controls distinct themes, arcs, and scene rhythm", () => {
  assert.deepEqual(
    stories.map((story) => story.visualTheme),
    ["quiet-dusk", "family-warmth", "hesitation", "urgent-calm"],
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

test("visible all-sided bordered containers remain intentionally limited", () => {
  const current = `${landingStyles}\n${playerStyles}`.match(/border: 1px solid/g)?.length ?? 0;
  assert.ok(current <= 20, `expected at most 20, found ${current}`);
});

test("motion, progress, quiz language, and reduced motion form one calm system", () => {
  assert.match(player, /mobileProgressTrack/);
  assert.match(player, /Correct answer/);
  assert.match(player, /Worth reviewing/);
  assert.match(playerStyles, /@keyframes scene-enter-pause/);
  assert.match(playerStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(playerStyles, /\.completionStage[\s\S]*radial-gradient/);
});
