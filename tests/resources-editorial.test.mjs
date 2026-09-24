import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { type2DiabetesResources } from "../content/resources/type-2-diabetes-resources.ts";

const component = readFileSync("features/resources/components/resources.tsx", "utf8");
const page = readFileSync("app/(app)/resources/page.tsx", "utf8");
const styles = readFileSync("features/resources/components/resources.module.css", "utf8");

test("the reading room background stays decorative and clear of the text column", () => {
  assert.ok(
    statSync("public/resources/resources-whimsical-shapes-v3-transparent.png").size < 5_000_000,
    "The generated background should stay reasonably sized for delivery",
  );

  assert.match(page, /className=\{styles\.resourcesPage\}/);
  assert.match(page, /className=\{styles\.resourcesContent\}/);
  assert.match(
    styles,
    /\.resourcesPage \{[\s\S]*padding-block: calc\(var\(--resources-shell-top\) \+ 1rem\)\s+calc\(0\.75rem \+ var\(--shell-bottom-inset, 0rem\)\);/,
  );
  assert.match(
    styles,
    /\.resourcesPage::before \{[\s\S]*resources-whimsical-shapes-v3-transparent\.png[\s\S]*background-position: center top;[\s\S]*background-repeat: repeat-y;[\s\S]*background-size: max\(100%, 96rem\) auto;/,
  );
  assert.doesNotMatch(styles, /resources-reading-room-continuous-v29/);
  assert.match(styles, /opacity: 0\.68;/);
  assert.doesNotMatch(styles, /resources-reading-room-segment-/);
  assert.doesNotMatch(styles, /background-size: 100% 100%/);
  assert.doesNotMatch(styles, /resources-reading-room-background-v10\.png/);
  assert.doesNotMatch(styles, /resources-reading-room-middle-v11\.png/);
  assert.doesNotMatch(styles, /\.resourcesPage::after/);
  assert.doesNotMatch(styles, /\.resourcesContent::before/);
  assert.doesNotMatch(styles, /linear-gradient/);
  assert.match(
    styles,
    /@media \(max-width: 68rem\) \{[\s\S]*\.resourcesPage::before \{[\s\S]*background-size: 100% auto;/,
  );
});

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
  assert.match(component, /visibleResources\.map/);
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

test("the practice rail keeps velocity while tracking real scroll pixels", () => {
  assert.match(component, /const targetTravel = useMotionValue\(0\)/);
  assert.match(component, /const \{ scrollY \} = useScroll\(\)/);
  assert.match(component, /useSpring\(targetTravel/);
  assert.match(component, /damping: 18/);
  assert.match(component, /mass: 0\.95/);
  assert.match(component, /stiffness: 48/);
  assert.match(component, /currentScroll - startScroll/);
  assert.match(component, /Math\.min\(maxTravel, Math\.max\(0,/);
  assert.match(component, /scrollY\.on\("change", updateTravel\)/);
  assert.match(component, /ResizeObserver\(updateMetrics\)/);
  assert.match(
    component,
    /const viewportAnchor = Math\.max\(0, \(window\.innerHeight - tools\.offsetHeight\) \/ 2\)/,
  );
  assert.doesNotMatch(component, /scrollYProgress|\[0, 1\], \[0, scrollRange\]/);
  assert.match(component, /targetTravel\.get\(\) > maxTravel/);
  assert.match(component, /reduceMotion \? "none" : smoothTransform/);
  assert.match(styles, /\.floatingTools \{[\s\S]*display: grid/);
  assert.match(styles, /@media \(max-width: 87\.99rem\)/);
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

test("the resource library is compact until the learner expands it", () => {
  assert.match(component, /const COLLAPSED_RESOURCE_COUNT = 6/);
  assert.match(component, /useState\(false\)/);
  assert.match(component, /filteredResources\.slice\(0, COLLAPSED_RESOURCE_COUNT\)/);
  assert.match(component, /aria-controls="resource-grid"/);
  assert.match(component, /aria-expanded=\{resourcesExpanded\}/);
  assert.match(component, /Show all \{filteredResources\.length\} guides/);
  assert.match(component, /Show fewer guides/);
  assert.match(component, /setResourcesExpanded\(false\)/);
  assert.match(styles, /\.resourceExpansion\s*\{[^}]*justify-content:\s*flex-start;/);
  assert.match(styles, /\.expandResources\s*\{[^}]*text-transform:\s*uppercase;/);
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

test("reading progress, source rationale, and the disclaimer stay behind footer buttons", () => {
  const mastheadIndex = component.indexOf("className={styles.masthead}");
  const browseIndex = component.indexOf("className={styles.browseSection}");
  const informationIndex = component.indexOf("className={styles.informationActions}");

  assert.ok(mastheadIndex >= 0);
  assert.ok(browseIndex > mastheadIndex);
  assert.ok(informationIndex > browseIndex);
  assert.doesNotMatch(component, /className=\{styles\.informationSection\}/);
  assert.doesNotMatch(component, /className=\{styles\.disclaimer\}/);
  assert.match(component, />\s*Reading record\s*</);
  assert.match(component, /Why these sources\?/);
  assert.match(component, />\s*About these readings\s*</);
  assert.match(component, /open=\{informationDialog === "progress"\}/);
  assert.match(component, /open=\{informationDialog === "sources"\}/);
  assert.match(component, /open=\{informationDialog === "disclaimer"\}/);
  assert.match(styles, /\.browseSection\s*\{[^}]*padding:[^;]*0 1rem;/);
  assert.match(styles, /\.informationActions\s*\{[^}]*padding:\s*0\.25rem 0;/);
  assert.match(styles, /\.informationActionGroup\s*\{[^}]*grid-column:\s*2;/);
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
    /These readings support, but do not replace, advice from your health care team/,
  );
});

test("external reading links disclose their behavior", () => {
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /opens in a new tab/);
  assert.match(component, /Every\s+link\s+opens on an official CDC or NIH website/);
});
