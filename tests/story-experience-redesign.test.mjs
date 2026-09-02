import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import sharp from "sharp";

import { ashaRiceOnTheTableStory } from "../features/stories/content/asha-rice-on-the-table.ts";
import { devonNumberScreenStory } from "../features/stories/content/devon-number-screen.ts";
import { marcusParkingLotStory } from "../features/stories/content/marcus-parking-lot.ts";
import { noraPrescriptionBagStory } from "../features/stories/content/nora-prescription-bag.ts";

const landing = readFileSync("features/stories/components/story-landing.tsx", "utf8");
const journeyPath = readFileSync("features/stories/components/story-journey-path.tsx", "utf8");
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

test("the landing hierarchy has one feature and a continuous editorial story journey", () => {
  assert.match(landing, /variant="featured"/);
  assert.match(landing, /"row" : "row-reverse"/);
  assert.match(landing, /getRecommendedStorySlug/);
  assert.match(landing, /recommendedProgress\.status === "in-progress"/);
  assert.match(landing, /StoryJourneyPath/);
  assert.match(landing, /markerClassName=\{styles\.journeyMarker\}/);
  assert.match(journeyPath, /getPointAtLength/);
  assert.match(journeyPath, /requestAnimationFrame/);
  assert.match(journeyPath, /ResizeObserver/);
  assert.match(journeyPath, /addEventListener\("scroll"/);
  assert.match(journeyPath, /document\.documentElement\.scrollHeight - window\.innerHeight/);
  assert.doesNotMatch(journeyPath, /data-journey-obstacle|intersectsContent/);
  assert.doesNotMatch(landing, /data-journey-obstacle/);
  assert.match(landingStyles, /\.journeyMarker \{[\s\S]*z-index: 0/);
  assert.match(journeyPath, /M500 15C470 155/);
  assert.match(journeyPath, /s55 245 30 443-55 250-30 469/);
  assert.match(
    landingStyles,
    /\.featured \{[\s\S]*grid-template-areas: "art \. copy"[\s\S]*clamp\(10rem, 16vw, 12rem\)/,
  );
  assert.match(landingStyles, /\.row \{[\s\S]*grid-template-areas: "art \. copy"/);
  assert.match(landingStyles, /\.row-reverse \{[\s\S]*grid-template-areas: "copy \. art"/);
  assert.doesNotMatch(landingStyles, /\.previewBody \{[^}]*box-shadow:/);
  assert.doesNotMatch(landingStyles, /\.illustration \{[^}]*box-shadow:/);
  assert.match(landingStyles, /\.journey \{[\s\S]*padding-bottom: clamp\(4rem, 7vw, 6rem\)/);
  assert.match(landingStyles, /\.featured[\s\S]*grid-template-columns/);
  assert.match(
    landingStyles,
    /\.row \.previewBody \{[\s\S]*padding-left: clamp\(1\.5rem, 2\.5vw, 2\.25rem\)/,
  );
  assert.match(
    landingStyles,
    /\.row-reverse \.previewBody \{[\s\S]*padding-right: clamp\(1\.5rem, 2\.5vw, 2\.25rem\)/,
  );
  assert.match(landingStyles, /\.storyImage \{[\s\S]*max-height: 27rem/);
  assert.match(landingStyles, /\.featured \{[\s\S]*min-height: clamp\(23rem, 40vw, 27rem\)/);
  assert.match(landingStyles, /\.featured \.previewBody \{[\s\S]*align-self: center/);
  assert.match(landing, /data-story=\{story\.slug\}/);
  assert.match(landingStyles, /\.storyRows \{[\s\S]*gap: clamp\(4\.5rem, 8vw, 7rem\)/);
  assert.match(landingStyles, /\.moreStories \{[\s\S]*margin-top: clamp\(1\.75rem, 3vw, 2\.5rem\)/);
  assert.doesNotMatch(landingStyles, /\.storyRows > div \{[\s\S]*border-top/);
});

test("generated raster artwork replaces code-drawn landing illustrations", async () => {
  for (const asset of [
    "stories-hero-illustration.webp",
    "marcus-parking-lot-illustration.png",
    "asha-rice-table-illustration.webp",
    "nora-prescription-bag-illustration.webp",
    "devon-number-screen-illustration.png",
  ]) {
    assert.match(landing, new RegExp(asset.replace(".", "\\.")));
    assert.ok(statSync(`public/stories/landing/${asset}`).size > 80_000);
    assert.equal((await sharp(`public/stories/landing/${asset}`).metadata()).hasAlpha, true);
  }
  assert.match(landing, /import Image from "next\/image"/);
  assert.match(landing, /alt=""/);
  assert.doesNotMatch(landing, /StorySketch|StoriesHeroSketch/);
  assert.match(journeyPath, /aria-hidden="true"/);
  assert.match(journeyPath, /strokeDasharray="2 12"/);
  assert.match(landingStyles, /\.journeyPath \{[\s\S]*pointer-events: none/);
  assert.match(landingStyles, /\.storyImage \{[\s\S]*object-fit: contain/);
  assert.match(landingStyles, /\.row-reverse \{[\s\S]*grid-template-areas: "copy \. art"/);
  assert.doesNotMatch(landing, /story\.imagePath/);
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
  assert.match(
    landingStyles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.journeyMarker[\s\S]*display: none/,
  );
  assert.match(playerStyles, /\.completionStage[\s\S]*radial-gradient/);
});
