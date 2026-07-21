import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const componentUrl = new URL(
  "../features/lessons/components/lesson-motion-figure.tsx",
  import.meta.url,
);
const stylesUrl = new URL(
  "../features/lessons/components/lesson-motion-figure.module.css",
  import.meta.url,
);

const componentSource = readFileSync(componentUrl, "utf8");
const stylesSource = readFileSync(stylesUrl, "utf8");
const daySixSource = readFileSync(
  new URL("../features/lessons/components/day-six-experience.tsx", import.meta.url),
  "utf8",
);
const daySixStylesSource = readFileSync(
  new URL("../features/lessons/components/day-six-experience.module.css", import.meta.url),
  "utf8",
);
const dayThreeSource = readFileSync(
  new URL("../features/lessons/components/day-three-experience.tsx", import.meta.url),
  "utf8",
);

const lessonMotion = new Map([
  ["first-five-minutes-experience.tsx", ["calm-breath", "comfort-hug"]],
  ["day-two-experience.tsx", ["glucose-signal", "insulin-response"]],
  ["day-three-experience.tsx", ["reading-snapshot", "a1c-window"]],
  ["day-four-experience.tsx", ["digestion-journey", "fiber-pace"]],
  ["day-five-experience.tsx", ["muscle-fuel", "circulation-rhythm"]],
  ["day-six-experience.tsx", ["sitting-interruption", "post-meal-window"]],
]);

const variants = [...lessonMotion.values()].flat();

const sceneFunctions = new Map([
  ["calm-breath", "CalmBreathScene"],
  ["comfort-hug", "ComfortHugScene"],
  ["glucose-signal", "GlucoseSignalScene"],
  ["insulin-response", "InsulinResponseScene"],
  ["reading-snapshot", "ReadingSnapshotScene"],
  ["a1c-window", "A1cWindowScene"],
  ["digestion-journey", "DigestionJourneyScene"],
  ["fiber-pace", "FiberPaceScene"],
  ["muscle-fuel", "MuscleFuelScene"],
  ["circulation-rhythm", "CirculationRhythmScene"],
  ["post-meal-window", "PostMealWindowScene"],
  ["sitting-interruption", "SittingInterruptionScene"],
]);

test("keeps two distinct purposeful motion scenes in every lesson", () => {
  for (const [filename, expectedVariants] of lessonMotion) {
    const lessonSource = readFileSync(
      new URL(`../features/lessons/components/${filename}`, import.meta.url),
      "utf8",
    );
    const placements = [...lessonSource.matchAll(/<LessonMotionFigure variant="([^"]+)"/g)].map(
      (match) => match[1],
    );

    assert.deepEqual(
      placements,
      expectedVariants,
      `${filename} must keep its two lesson-specific motion scenes`,
    );
    assert.equal(new Set(placements).size, 2, `${filename} must not repeat the same scene twice`);
  }
});

test("keeps every new lesson figure animated by multiple independent systems", () => {
  for (const variant of variants) {
    const functionName = sceneFunctions.get(variant);
    const sceneStart = componentSource.indexOf(`function ${functionName}`);
    const nextSceneStart = componentSource.indexOf("\nfunction ", sceneStart + 10);
    const sceneSource = componentSource.slice(
      sceneStart,
      nextSceneStart === -1 ? componentSource.length : nextSceneStart,
    );
    const inlineLoopCount = [...sceneSource.matchAll(/repeatCount="indefinite"/g)].length;
    const particleLoopCount = [
      ...sceneSource.matchAll(/<(?:MovingCircle|MovingPathCircle|CirculatingCell)\b/g),
    ].length;
    const loopCount = inlineLoopCount + particleLoopCount;

    assert.ok(loopCount >= 2, `${variant} needs at least two independently looping SVG systems`);
    assert.match(
      componentSource,
      new RegExp(`variant === "${variant}"`),
      `${variant} must map to a rendered scene`,
    );
  }
});

test("autoplays continuous loops without requiring user interaction", () => {
  const cssLoopCount = [...stylesSource.matchAll(/infinite;/g)].length;
  const svgLoopCount = [...componentSource.matchAll(/repeatCount="indefinite"/g)].length;

  assert.ok(cssLoopCount >= variants.length, "CSS supplemental loops must remain continuous");
  assert.ok(svgLoopCount >= variants.length * 2, "SVG scene loops must remain continuous");
  assert.match(componentSource, /data-motion-loop="continuous"/, "motion must autoplay");
  assert.doesNotMatch(componentSource, /(?:onClick|useState|useRef|pauseAnimations)/);
});

test("uses deterministic SVG timelines and explains what to watch", () => {
  const cueCount = [...componentSource.matchAll(/^ {4}cue:/gm)].length;

  assert.equal(cueCount, variants.length, "every scene needs a concise purpose cue");
  assert.match(componentSource, /<animateMotion\b/);
  assert.match(componentSource, /<animateTransform\b/);
  assert.doesNotMatch(componentSource, /--motion-[xy]/);
  assert.match(componentSource, /shapeRendering="geometricPrecision"/);
  assert.match(stylesSource, /vector-effect: non-scaling-stroke/);
});

test("does not introduce static image media into the lesson motion system", () => {
  assert.doesNotMatch(componentSource, /<(?:img|Image)\b/);
  assert.doesNotMatch(stylesSource, /(?:background-image|url\()/);
});

test("keeps the Day 6 moment lab as three compact, continuously moving widgets", () => {
  const widgetStart = daySixSource.indexOf("function MovementMomentVideo");
  const widgetEnd = daySixSource.indexOf("\nfunction ", widgetStart + 10);
  const widgetSource = daySixSource.slice(widgetStart, widgetEnd);
  const loopCount = [...widgetSource.matchAll(/repeatCount="indefinite"/g)].length;

  assert.ok(loopCount >= 12, "the three moment widgets need multiple visible loops each");
  assert.match(widgetSource, /variant === "desk"/);
  assert.match(widgetSource, /variant === "meal"/);
  assert.match(widgetSource, /widgetWindowWalker/);
  assert.match(widgetSource, /OPTIONAL WINDOW/);
  assert.match(widgetSource, /<animateMotion\b/);
  assert.match(widgetSource, /<animateTransform\b/);
  assert.match(
    daySixStylesSource,
    /\.momentLab\s*\{\s*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s,
    "desktop moment widgets must sit side by side",
  );
});

test("keeps the refined Day 2 and Day 6 scenes visually unambiguous", () => {
  assert.doesNotMatch(
    componentSource,
    /signalTrail/,
    "Day 2 must not restore the dotted guide line",
  );
  assert.match(componentSource, /segmentedTimeline/);
  assert.match(componentSource, /ONE BRIEF BREAK DIVIDES A LONG STILL PERIOD/);
});

test("keeps the Lesson 3 A1C time window animated, contextual, and non-prescriptive", () => {
  const visualStart = dayThreeSource.indexOf("function A1cTimeWindowVisual");
  const visualEnd = dayThreeSource.indexOf("\nexport function DayThreeExperience", visualStart);
  const visualSource = dayThreeSource.slice(visualStart, visualEnd);

  assert.match(visualSource, /ABOUT 12 WEEKS AGO/);
  assert.match(visualSource, /TODAY/);
  const cellConfigStart = visualSource.indexOf("const circulatingCells = [");
  const cellConfigEnd = visualSource.indexOf("] as const;", cellConfigStart);
  const cellConfig = visualSource.slice(cellConfigStart, cellConfigEnd);

  assert.ok(
    [...cellConfig.matchAll(/begin:/g)].length >= 3,
    "several red blood cells should circulate across the longer window",
  );
  assert.match(visualSource, /<animateMotion\b/);
  assert.match(visualSource, /repeatCount="indefinite"/);
  assert.match(visualSource, /not an exact week-by-week formula/i);
  assert.doesNotMatch(visualSource, /type="range"/);
});
