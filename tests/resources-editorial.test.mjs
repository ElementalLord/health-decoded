import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { type2DiabetesResources } from "../content/resources/type-2-diabetes-resources.ts";

const component = readFileSync("features/resources/components/resources.tsx", "utf8");
const styles = readFileSync("features/resources/components/resources.module.css", "utf8");

test("the reading room publishes 18 distinct reviewed guides", () => {
  assert.equal(type2DiabetesResources.length, 18);
  assert.equal(new Set(type2DiabetesResources.map(({ id }) => id)).size, 18);
  assert.equal(new Set(type2DiabetesResources.map(({ title }) => title)).size, 18);

  for (const resource of type2DiabetesResources) {
    assert.match(resource.url, /^https:\/\/(?:www\.)?(?:cdc\.gov|niddk\.nih\.gov)\//);
    assert.equal(resource.status, "reviewed");
    assert.ok(resource.reading_minutes >= 1);
    assert.ok(resource.reading_level);
    assert.ok(resource.editorial_label);
    assert.ok(resource.format);
    assert.doesNotMatch(resource.description, /^(?:Learn|Understand|Discover)\b/i);
    assert.equal(
      component.split(`pick("${resource.id}")`).length - 1,
      1,
      `${resource.id} should have exactly one editorial placement`,
    );
  }
});

test("the page uses varied editorial treatments instead of a uniform card grid", () => {
  const treatments = [
    "FeaturedLead",
    "FeaturedSide",
    "LeadArticle",
    "CompactArticle",
    "ChecklistArticle",
    "SourceNote",
    "WideFeature",
    "SupportFeature",
  ];

  for (const treatment of treatments) {
    assert.match(component, new RegExp(`function ${treatment}\\b`));
  }

  assert.doesNotMatch(component, /function ResourceCard\b/);
  assert.match(component, /This week&apos;s recommended reading/);
  assert.match(component, /Curated paths/);
  assert.match(component, /If you’re new here/);
  assert.match(component, /Long-term health/);
  assert.match(component, /Living confidently/);
});

test("the page does not include testimonial or quotation panels", () => {
  assert.doesNotMatch(component, /function Perspective\b/);
  assert.doesNotMatch(component, /<blockquote>/);
  assert.doesNotMatch(component, /Composite learner perspective/);
  assert.doesNotMatch(component, /not an individual testimonial/);
});

test("editorial imagery is purposeful and production sized", () => {
  const images = [
    "a1c-explained-editorial.jpg",
    "family-meal-editorial.jpg",
    "everyday-movement-editorial.jpg",
    "foot-check-natural.png",
    "emergency-kit-natural.png",
    "pharmacist-routine-editorial.png",
  ];

  assert.match(component, /import Image from "next\/image"/);
  for (const image of images) {
    assert.match(component, new RegExp(`/resources/${image.replace(".", "\\.")}`));
    assert.ok(statSync(`public/resources/${image}`).size > 300_000);
  }

  assert.match(styles, /object-fit: cover/);
  assert.doesNotMatch(styles, /object-fit: contain/);
  assert.match(styles, /aspect-ratio: 16 \/ 10/);
  assert.match(styles, /aspect-ratio: 3 \/ 2/);
});

test("article views persist locally and expose a clear completion record", () => {
  assert.match(component, /health-decoded:resources:viewed/);
  assert.match(component, /window\.localStorage\.getItem/);
  assert.match(component, /window\.localStorage\.setItem/);
  assert.match(component, /role="progressbar"/);
  assert.match(component, /articles viewed/);
  assert.match(component, /Viewed/);
  assert.match(component, /Clear viewed history/);
  assert.match(component, /transform: `scaleX\(\$\{percent \/ 100\}\)`/);
});

test("the reading room limits motion to short, purposeful interaction feedback", () => {
  assert.doesNotMatch(component, /EditorialMotion/);
  assert.doesNotMatch(styles, /@keyframes/);
  assert.doesNotMatch(styles, /animation:/);
  assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(styles, /:active/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("the visual hierarchy keeps articles larger and more explicit than supporting media", () => {
  assert.match(component, /Read the official guide/);
  assert.ok(component.split("<ReadGuide />").length - 1 >= 7);
  assert.doesNotMatch(component, /className=\{styles\.photoPair\}/);
  assert.match(styles, /grid-template-columns: minmax\(18rem, 0\.86fr\) minmax\(0, 1\.14fr\)/);
  assert.match(styles, /\.checklistWithPhoto \{\s+grid-column: 1 \/ -1;/);
  assert.doesNotMatch(styles, /min-height:\s*(?:1[5-9]|[2-9]\d)rem/);
  assert.doesNotMatch(styles, /@keyframes article-dashes/);
  assert.doesNotMatch(styles, /\.featuredLead::after/);
  assert.match(
    styles,
    /\.healthGrid > \.compactArticle:last-child,\s+\.confidenceGrid \.supportFeature \{\s+grid-column: 1 \/ -1;/,
  );
  assert.match(styles, /\.photoInterlude figcaption \{\s+align-self: stretch;/);
  assert.match(styles, /justify-content: center/);
  assert.doesNotMatch(styles, /\.meta \{[^}]*margin-top: auto/s);
});

test("the reading room uses restrained corners, responsive layouts, and motion-safe feedback", () => {
  assert.match(styles, /border-radius: (?:2|3)px/);
  assert.doesNotMatch(styles, /border-radius: (?:7|8|9|10)px/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /@media \(max-width: 34rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /transform: translate\(2px, -2px\)/);
});

test("article treatments avoid decorative bubble icons", () => {
  assert.doesNotMatch(component, /CircleDollarSign/);
  assert.doesNotMatch(component, /styles\.checkIcon/);
  assert.doesNotMatch(styles, /\.checkIcon/);
  assert.doesNotMatch(styles, /\.supportFeature > a > svg:first-child/);
});

test("external reading links disclose their behavior", () => {
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /opens in a new tab/);
  assert.match(component, /Every\s+link\s+opens on an official CDC or NIH website/);

  for (const destination of [
    "/myth-check",
    "/decode-the-label",
    "/explain-it-back",
    "#new-here",
    "#daily-living",
    "#staying-safe",
    "#long-term-health",
    "#living-confidently",
  ]) {
    const escapedDestination = destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(component, new RegExp(`href(?:=|: )"${escapedDestination}"`));
  }
});
