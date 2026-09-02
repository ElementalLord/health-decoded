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

    const escapedId = resource.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      component,
      new RegExp(`"${escapedId}": \\{`),
      `${resource.id} should have a visual treatment`,
    );
  }
});

test("the page is a searchable, filterable editorial resource library", () => {
  for (const treatment of [
    "ResourceGridItem",
    "ResourceFilters",
    "ReadingProgressPanel",
    "FloatingTools",
    "SourceNote",
  ]) {
    assert.match(component, new RegExp(`function ${treatment}\\b`));
  }

  assert.match(component, /Browse all resources/);
  assert.match(component, /Search resources/);
  assert.match(component, /Resource topics/);
  assert.match(component, /filteredResources\.map/);
  assert.doesNotMatch(component, /This week(?:&apos;|')s recommended reading/i);
  assert.doesNotMatch(component, /Two places worth starting/i);
});

test("the page does not include testimonial or quotation panels", () => {
  assert.doesNotMatch(component, /function Perspective\b/);
  assert.doesNotMatch(component, /<blockquote>/);
  assert.doesNotMatch(component, /Composite learner perspective/);
  assert.doesNotMatch(component, /not an individual testimonial/);
});

test("editorial imagery is purposeful and production sized", () => {
  const images = [
    "type-2-diabetes-basics-watercolor.jpg",
    "a1c-explained-watercolor.jpg",
    "monitoring-blood-sugar-watercolor.jpg",
    "family-meal-watercolor.jpg",
    "cultural-foods-watercolor.jpg",
    "everyday-movement-watercolor.jpg",
    "diabetes-treatments-watercolor.jpg",
    "low-blood-sugar-watercolor.jpg",
    "managing-sick-days-watercolor.jpg",
    "heart-health-watercolor.jpg",
    "kidney-health-watercolor.jpg",
    "eye-health-watercolor.jpg",
    "foot-check-watercolor.jpg",
    "oral-health-watercolor.jpg",
    "mental-health-watercolor.jpg",
    "community-education-watercolor.jpg",
    "financial-help-watercolor.jpg",
    "emergency-kit-watercolor.jpg",
  ];

  assert.match(component, /import Image from "next\/image"/);
  for (const image of images) {
    assert.match(component, new RegExp(`/resources/${image.replace(".", "\\.")}`));
    assert.ok(statSync(`public/resources/${image}`).size > 300_000);
  }
  assert.equal((component.match(/image: "\/resources\//g) ?? []).length, 18);

  assert.match(styles, /object-fit: cover/);
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

test("the practice rail glides smoothly within the resources section", () => {
  assert.match(component, /useScroll\(\{/);
  assert.match(component, /target: boundaryRef/);
  assert.match(component, /offset: \["start 14%", "end 86%"\]/);
  assert.match(component, /useSpring\(scrollTravel/);
  assert.match(component, /damping: 18/);
  assert.match(component, /mass: 0\.95/);
  assert.match(component, /stiffness: 48/);
  assert.match(component, /boundary\.clientHeight - tools\.offsetHeight/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /reduceMotion \? "none" : smoothTransform/);
  assert.doesNotMatch(styles, /@keyframes/);
  assert.doesNotMatch(styles, /animation:/);
});

test("the practice rail is centered in the right margin and section-bound", () => {
  assert.match(component, /<section[^>]+className=\{styles\.browseSection\}/);
  assert.match(component, /<FloatingTools \/>[\s\S]*Browse all resources/);
  assert.match(styles, /\.browseSection \{[\s\S]*position: relative;/);
  assert.match(
    styles,
    /\.toolRailBoundary \{[\s\S]*left: 100%;[\s\S]*position: absolute;[\s\S]*width: calc\(\(100vw - 72rem\) \/ 2\);/,
  );
  assert.match(
    styles,
    /\.floatingTools \{[\s\S]*left: 50%;[\s\S]*position: absolute;[\s\S]*translate: -50% 0;/,
  );
  assert.doesNotMatch(styles, /position: fixed/);
});

test("practice tools are descriptive and link to all three activities", () => {
  assert.match(component, /Turn reading into practice/);
  assert.match(component, /Use a quick activity when a source leaves you with a question/);
  assert.match(component, /Test common claims against the evidence/);
  assert.match(component, /Find the useful details on a nutrition label/);
  assert.match(component, /Put a diabetes concept into your own words/);

  for (const destination of ["/myth-check", "/decode-the-label", "/explain-it-back"]) {
    assert.match(component, new RegExp(`href="${destination}"`));
  }
});

test("reading progress and source rationale appear directly below the masthead", () => {
  const mastheadIndex = component.indexOf("className={styles.masthead}");
  const informationIndex = component.indexOf("className={styles.informationSection}");
  const browseIndex = component.indexOf("className={styles.browseSection}");

  assert.ok(mastheadIndex >= 0);
  assert.ok(informationIndex > mastheadIndex);
  assert.ok(browseIndex > informationIndex);
  assert.match(component, /Reading progress and source information/);
  assert.match(component, /Why these sources\?/);
});

test("the resource hierarchy remains editorial rather than card-heavy", () => {
  assert.match(component, /Read guide/);
  assert.match(
    styles,
    /\.resourceGrid \{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);/,
  );
  assert.match(styles, /\.resourceArtwork \{[\s\S]*aspect-ratio: 3 \/ 2;/);
  assert.match(styles, /\.resourceGrid > article \{[\s\S]*border-bottom:/);
  assert.doesNotMatch(component, /function ResourceCard\b/);
});

test("controls and panels use restrained corner radii", () => {
  assert.match(styles, /\.resourceArtwork \{[\s\S]*border-radius: 0\.25rem;/);
  assert.match(styles, /\.searchField \{[\s\S]*border-radius: 0\.3rem;/);
  assert.match(styles, /\.filterList button \{[\s\S]*border-radius: 0\.25rem;/);
  assert.match(styles, /\.floatingTools \{[\s\S]*border-radius: 0\.4rem;/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px|100vw)/);
});

test("the reading room is responsive, accessible, and motion-aware", () => {
  assert.match(styles, /@media \(min-width: 88rem\)/);
  assert.match(styles, /@media \(max-width: 68rem\)/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /focus-visible/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-pressed=/);
});

test("trusted-source guidance stays explicit", () => {
  assert.match(component, /Practical public-health guidance/);
  assert.match(component, /NIH health explainers with deeper detail/);
  assert.match(
    component,
    /Every destination is an official \.gov page and was rechecked in July 2026/,
  );
  assert.match(
    component,
    /These readings support, but do not replace, advice from your health care team/,
  );
});

test("external reading links disclose their behavior", () => {
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /opens in a new tab/);
  assert.match(component, /Every\s+link\s+opens on an official CDC or NIH website/);
});
