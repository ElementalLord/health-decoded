import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

import {
  filterGlossaryByLetter,
  normalizeGlossaryQuery,
  searchGlossary,
} from "../features/glossary/lib/search-glossary.ts";

const termFiles = [
  "foundations",
  "tests-monitoring",
  "medicines",
  "nutrition-activity",
  "urgent-long-term",
  "care-emotional",
  "insurance-appointments",
];
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

function extractSeeds(source, fileName) {
  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const seeds = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(file) === "createEntries") {
      const list = node.arguments[2];
      if (list && ts.isArrayLiteralExpression(list)) {
        for (const item of list.elements) {
          if (!ts.isArrayLiteralExpression(item)) continue;
          const [term, definition] = item.elements;
          if (
            term &&
            definition &&
            ts.isStringLiteralLike(term) &&
            ts.isStringLiteralLike(definition)
          )
            seeds.push({ term: term.text, definition: definition.text });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return seeds;
}

const topicSources = await Promise.all(
  termFiles.map((name) => read(`features/glossary/content/terms/${name}.ts`)),
);
const seeds = topicSources.flatMap((source, index) => extractSeeds(source, termFiles[index]));
const [page, registry, sources, helper, resources, styles, routes, bottomNav] = await Promise.all([
  read("features/glossary/components/medical-glossary-page.tsx"),
  read("features/glossary/content/medical-glossary.ts"),
  read("features/glossary/content/glossary-sources.ts"),
  read("features/glossary/content/terms/create-entries.ts"),
  read("features/resources/components/resources.tsx"),
  read("features/glossary/styles/medical-glossary.module.css"),
  read("lib/routes.ts"),
  read("components/layout/bottom-navigation.tsx"),
]);

const slugify = (term) =>
  term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const synthetic = [
  {
    id: "1",
    slug: "a1c",
    term: "A1C",
    definition: "Average glucose over two to three months.",
    aliases: ["HbA1c", "Hemoglobin A1C"],
    sourceIds: ["s"],
    contentStatus: "source-backed",
    topic: "Tests",
  },
  {
    id: "2",
    slug: "blood-glucose",
    term: "Blood glucose",
    definition: "Glucose in the blood at a particular time.",
    aliases: ["Blood sugar"],
    sourceIds: ["s"],
    contentStatus: "source-backed",
    topic: "Foundations",
  },
  {
    id: "3",
    slug: "continuous-glucose-monitor",
    term: "Continuous glucose monitor",
    abbreviation: "CGM",
    definition: "A sensor system that estimates glucose repeatedly.",
    sourceIds: ["s"],
    contentStatus: "source-backed",
    topic: "Tests",
  },
  {
    id: "4",
    slug: "metformin",
    term: "Metformin",
    definition: "A medicine used in Type 2 diabetes.",
    misspellings: ["metphormin"],
    sourceIds: ["s"],
    contentStatus: "source-backed",
    topic: "Medicines",
  },
];

test("registry contains a substantial focused glossary with unique stable identities", () => {
  assert.ok(
    seeds.length >= 120 && seeds.length <= 220,
    `expected 120–220 useful terms, found ${seeds.length}`,
  );
  const terms = seeds.map(({ term }) => term.toLowerCase());
  const slugs = seeds.map(({ term }) => slugify(term));
  assert.equal(new Set(terms).size, terms.length);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.match(helper, /id: `GLOSSARY-\$\{slug\.toUpperCase\(\)\}`/);
});

test("glossary content stays diabetes-focused and includes searchable care terms", () => {
  assert.equal(seeds.length, 220);
  const terms = new Set(seeds.map(({ term }) => term));
  for (const term of [
    "Post-meal blood glucose",
    "Glycemic variability",
    "Time below range",
    "Dawn phenomenon",
    "Insulin pen",
    "Insulin pump",
    "CGM alert",
    "Diabetic foot exam",
    "Albuminuria",
    "Carbohydrate consistency",
    "Glycemic load",
    "Fasting blood glucose",
    "Continuous glucose monitor sensor",
    "Sick-day management",
  ])
    assert.ok(terms.has(term), `missing diabetes-focused term: ${term}`);

  const combined = topicSources.join("\n");
  for (const removedTerm of [
    "Health insurance",
    "Insurance claim",
    "Clinical note",
    "Medical record",
    "Informed consent",
    "Telehealth",
    "Second opinion",
    "Emotional well-being",
  ])
    assert.doesNotMatch(combined, new RegExp(`\\"${removedTerm}\\"`));

  const focused = [
    { ...synthetic[0], term: "Fasting blood glucose", aliases: ["Fasting plasma glucose"] },
    { ...synthetic[1], term: "Continuous glucose monitor sensor", aliases: ["CGM sensor"] },
  ];
  assert.equal(searchGlossary(focused, "fasting plasma glucose")[0].term, "Fasting blood glucose");
  assert.equal(searchGlossary(focused, "CGM sensor")[0].term, "Continuous glucose monitor sensor");
});

test("every definition is present and public entries are source-backed", () => {
  assert.ok(seeds.every(({ definition }) => definition.trim().length > 15));
  assert.match(helper, /contentStatus: "source-backed"/);
  assert.doesNotMatch(registry, /drafted|archived/);
  for (const source of topicSources) assert.match(source, /SRC-/);
  assert.match(sources, /American Diabetes Association/);
  assert.match(sources, /National Institute of Diabetes/);
  assert.match(sources, /Centers for Medicare/);
});

test("search normalizes input and ranks exact, abbreviation, alias, prefix, and definition matches deterministically", () => {
  assert.equal(normalizeGlossaryQuery("  BLOOD   Sugar "), "blood sugar");
  assert.equal(searchGlossary(synthetic, "a1c")[0].term, "A1C");
  assert.equal(searchGlossary(synthetic, "CGM")[0].term, "Continuous glucose monitor");
  assert.equal(searchGlossary(synthetic, "blood sugar")[0].term, "Blood glucose");
  assert.equal(searchGlossary(synthetic, "contin")[0].term, "Continuous glucose monitor");
  assert.equal(searchGlossary(synthetic, "sensor")[0].term, "Continuous glucose monitor");
  assert.deepEqual(searchGlossary(synthetic, ""), synthetic);
});

test("conservative misspelling support is explicit rather than fuzzy", () => {
  assert.equal(searchGlossary(synthetic, "metphormin")[0].term, "Metformin");
  assert.deepEqual(searchGlossary(synthetic, "metfornin"), []);
  assert.ok(topicSources.some((source) => source.includes('misspellings: ["diabtes"]')));
});

test("A-to-Z browsing filters predictably and unavailable letters are disabled", () => {
  assert.deepEqual(
    filterGlossaryByLetter(synthetic, "A").map(({ term }) => term),
    ["A1C"],
  );
  assert.deepEqual(filterGlossaryByLetter(synthetic, "All"), synthetic);
  assert.match(page, /disabled=!available|disabled=\{!available\}/);
  assert.match(page, /aria-disabled=\{!available\}/);
  assert.match(page, /aria-pressed=\{selectedLetter === letter\}/);
});

test("visible entries remain simple and comparisons render only when present", () => {
  assert.match(page, /<dt>/);
  assert.match(page, /<dd>/);
  assert.match(page, /entry\.commonlyConfusedWith \?/);
  assert.doesNotMatch(page, /pronunciation|quiz|score|badge|progress|personal notes/i);
});

test("no-results state uses exact wording and a deliberate query-free AI link", () => {
  assert.match(page, /Can’t find the word you’re looking for\? Ask Health Decoded AI\./);
  assert.match(page, /href="\/ai"/);
  assert.match(page, /Your search will not be sent\s+to the AI guide/);
  assert.doesNotMatch(page, /href=\{`\/ai\?|searchParams|URLSearchParams/);
});

test("search remains memory-only with no persistence, network, analytics, AI, or logging path", () => {
  const combined = `${page}\n${registry}`;
  assert.doesNotMatch(
    combined,
    /localStorage|sessionStorage|indexedDB|supabase|fetch\(|analytics|logging|services\/ai|useSearchParams|router\.push/iu,
  );
  assert.match(page, /useState\(""\)/);
});

test("page exposes accessible search, concise announcements, semantic lists, focus, and responsive contracts", () => {
  assert.match(page, /htmlFor="glossary-search"/);
  assert.match(page, /aria-label="Clear glossary search"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /headingRef\.current\?\.focus/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(max-width: 24rem\)/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.doesNotMatch(styles, /overflow-x:\s*auto/);
});

test("Resources and primary navigation provide glossary access", () => {
  assert.match(resources, /href="\/glossary"/);
  assert.match(resources, /Medical Glossary/);
  assert.match(routes, /href: "\/glossary"/);
  assert.match(routes, /label: "Glossary"/);
  assert.match(bottomNav, /glossary: BookOpen/);
});
