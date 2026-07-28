import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { type2DiabetesResources } from "../content/resources/type-2-diabetes-resources.ts";

const component = readFileSync("features/resources/components/resources.tsx", "utf8");
const styles = readFileSync("features/resources/components/resources.module.css", "utf8");

test("the resource center publishes 18 distinct reviewed guides", () => {
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
    assert.match(component, new RegExp(`"${resource.id}"`));
  }
});

test("all 18 guides have one topic home across five concise sections", () => {
  const expectedTopics = [
    "If you’re new here",
    "Food & daily living",
    "Medicines & staying safe",
    "Long-term health",
    "Living confidently",
  ];

  for (const topic of expectedTopics)
    assert.match(component, new RegExp(topic.replace("&", "\\&")));

  const topicBlock = component.slice(
    component.indexOf("const topics"),
    component.indexOf("const thumbnails"),
  );
  for (const { id } of type2DiabetesResources) {
    assert.equal(
      topicBlock.split(`"${id}"`).length - 1,
      1,
      `${id} should have exactly one topic placement`,
    );
  }

  assert.match(component, /Three useful places to begin/);
  assert.match(component, /Browse by topic/);
  assert.doesNotMatch(component, /FeaturedLead|FeaturedSide|Perspective|pathCard/);
});

test("viewed guides persist locally and expose a semantic progress meter", () => {
  assert.match(component, /health-decoded:resources:viewed/);
  assert.match(component, /window\.localStorage\.getItem/);
  assert.match(component, /window\.localStorage\.setItem/);
  assert.match(component, /role="progressbar"/);
  assert.match(component, /aria-valuenow=\{viewedCount\}/);
  assert.match(component, /A guide is marked viewed when you open it/);
  assert.match(component, /Clear viewed history/);
});

test("only three purposeful thumbnails appear and every image remains fully visible", () => {
  const images = [
    "family-meal-editorial.jpg",
    "foot-check-natural.png",
    "emergency-kit-natural.png",
  ];

  assert.match(component, /import Image from "next\/image"/);
  assert.equal(component.split('src: "/resources/').length - 1, 3);
  for (const image of images) {
    assert.match(component, new RegExp(`/resources/${image.replace(".", "\\.")}`));
    assert.ok(statSync(`public/resources/${image}`).size > 300_000);
  }
  assert.match(styles, /\.thumbnail img\s*\{\s*object-fit: contain;/);
});

test("the resource center is lightly rounded, responsive, focused, and motion-safe", () => {
  assert.match(styles, /border-radius: (?:7|8)px/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px|50%)/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /@media \(max-width: 34rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /focus-visible/);
  assert.doesNotMatch(styles, /object-fit: cover/);
});

test("external reading links disclose their behavior and preserve official metadata", () => {
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /opens in a new tab/);
  assert.match(component, /Every link\s+opens on an official CDC or NIH website/);
  assert.match(component, /resource\.reading_level/);
  assert.match(component, /resource\.reading_minutes/);
  assert.match(component, /reviewedLabel\(resource\.verified_at\)/);
});
