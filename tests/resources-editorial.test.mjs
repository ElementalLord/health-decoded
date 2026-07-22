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
    "Perspective",
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

test("patient perspectives are transparent composites, not fabricated testimonials", () => {
  assert.equal(component.split("<Perspective>").length - 1, 2);
  assert.match(component, /Composite learner perspective/);
  assert.match(component, /not an individual testimonial/);
});

test("editorial imagery is purposeful and production sized", () => {
  const images = [
    "a1c-explained-editorial.jpg",
    "family-meal-editorial.jpg",
    "everyday-movement-editorial.jpg",
  ];

  assert.match(component, /import Image from "next\/image"/);
  for (const image of images) {
    assert.match(component, new RegExp(`/resources/${image.replace(".", "\\.")}`));
    assert.ok(statSync(`public/resources/${image}`).size > 300_000);
  }
});

test("the reading room stays slightly rounded, responsive, and motion-safe", () => {
  assert.match(styles, /border-radius: (?:7|8|9|10)px/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px|50%)/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /@media \(max-width: 34rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /transform: scale\(1\.025\)/);
  assert.match(styles, /transform: translate\(3px, -3px\)/);
});

test("external reading links disclose their behavior", () => {
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /opens in a new tab/);
  assert.match(component, /Every link\s+opens on an official CDC or NIH website/);
});
