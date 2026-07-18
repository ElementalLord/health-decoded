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

const lessonMotion = new Map([
  ["first-five-minutes-experience.tsx", ["calm-breath", "comfort-hug"]],
  ["day-two-experience.tsx", ["glucose-signal", "insulin-response"]],
  ["day-three-experience.tsx", ["reading-snapshot", "a1c-window"]],
  ["day-four-experience.tsx", ["digestion-journey", "fiber-pace"]],
  ["day-five-experience.tsx", ["muscle-fuel", "circulation-rhythm"]],
  ["day-six-experience.tsx", ["sitting-interruption", "post-meal-window"]],
]);

const variants = [...lessonMotion.values()].flat();

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
    const selectorCount = [...stylesSource.matchAll(new RegExp(`data-variant="${variant}"`, "g"))]
      .length;

    assert.ok(
      selectorCount >= 3,
      `${variant} needs at least three independently animated scene systems`,
    );
    assert.match(
      componentSource,
      new RegExp(`variant === "${variant}"`),
      `${variant} must map to a rendered scene`,
    );
  }
});

test("autoplays continuous loops and retains an explicit pause control", () => {
  const cssLoopCount = [...stylesSource.matchAll(/infinite;/g)].length;
  const svgLoopCount = [...componentSource.matchAll(/repeatCount="indefinite"/g)].length;

  assert.ok(cssLoopCount >= variants.length * 2, "CSS fallback loops must remain continuous");
  assert.ok(svgLoopCount >= variants.length * 2, "SVG scene loops must remain continuous");
  assert.match(componentSource, /useState\(true\)/, "motion must autoplay by default");
  assert.match(
    componentSource,
    /className=\{styles\.motionControl\}/,
    "motion needs a pause control",
  );
  assert.match(
    stylesSource,
    /data-motion-playing="false"[^}]+animation-play-state: paused/s,
    "the pause control must pause the CSS fallback timeline",
  );
});

test("does not introduce static image media into the lesson motion system", () => {
  assert.doesNotMatch(componentSource, /<(?:img|Image)\b/);
  assert.doesNotMatch(stylesSource, /(?:background-image|url\()/);
});
