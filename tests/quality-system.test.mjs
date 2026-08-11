import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  sourceIssues,
  validateGlossaryRecords,
  validateSourceReferences,
} from "../scripts/quality/check-content-integrity.mts";
import { checkImages } from "../scripts/quality/check-images.mts";
import { buildRouteManifest, isValidInternalRoute } from "../scripts/quality/check-routes.mts";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "health-decoded-quality-"));
  const put = (file, content = "") => {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), content);
  };
  return { root, put };
}

test("route manifest catches nonexistent routes and invalid lesson IDs", () => {
  const { root, put } = fixture();
  put("app/(app)/journey/page.tsx");
  put("app/(app)/lessons/[day]/page.tsx");
  put("features/lessons/components/lesson-player.tsx", "if (lesson.dayNumber === 1) return null;");
  put("features/stories/content/story.ts", 'export const story = { slug: "valid-story" };');
  put("features/caregiver/content/caregiver-module-registry.ts", "export const registry = {};");
  const manifest = buildRouteManifest(root);
  assert.equal(isValidInternalRoute("/journey", manifest), true);
  assert.equal(isValidInternalRoute("/lessons/1", manifest), true);
  assert.equal(isValidInternalRoute("/lessons/0", manifest), false);
  assert.equal(isValidInternalRoute("/lessons/999", manifest), false);
  assert.equal(isValidInternalRoute("/deleted-feature", manifest), false);
});

test("source rules catch unknown IDs and distinguish stale, invalid, and future dates", () => {
  const source = {
    id: "SRC-ONE",
    organization: "Org",
    title: "Title",
    url: "https://example.org/source",
    reviewedAt: "2024-01-01",
    file: "sources.ts",
  };
  assert.deepEqual(
    validateSourceReferences(
      [{ id: "CLAIM-1", sourceIds: ["UNKNOWN"], file: "claim.ts" }],
      [source],
    ).map(({ code }) => code),
    ["SOURCE_ID_UNKNOWN"],
  );
  assert.ok(
    sourceIssues([source], new Date("2026-01-02T00:00:00Z")).some(
      ({ code }) => code === "SOURCE_REVIEW_STALE",
    ),
  );
  assert.ok(
    sourceIssues([{ ...source, reviewedAt: "not-a-date" }], new Date("2026-01-02T00:00:00Z")).some(
      ({ code }) => code === "SOURCE_REVIEW_DATE_INVALID",
    ),
  );
  assert.ok(
    sourceIssues([{ ...source, reviewedAt: "2027-01-01" }], new Date("2026-01-02T00:00:00Z")).some(
      ({ code }) => code === "SOURCE_REVIEW_DATE_IN_FUTURE",
    ),
  );
});

test("glossary rules catch duplicate normalized slugs, aliases, missing sources, and self relationships", () => {
  const base = {
    id: "GLOSSARY-A1C",
    slug: "a1c",
    term: "A1C",
    definition: "A definition",
    sourceIds: ["SRC-ONE"],
    aliases: ["blood sugar"],
    file: "terms.ts",
  };
  const issues = validateGlossaryRecords(
    [
      base,
      {
        ...base,
        id: "GLOSSARY-A1C-2",
        term: " a1c ",
        aliases: [" Blood  Sugar "],
        sourceIds: ["UNKNOWN"],
        relatedTerm: "A1C",
      },
    ],
    [
      {
        id: "SRC-ONE",
        organization: "Org",
        title: "Title",
        url: "https://example.org",
        reviewedAt: "2026-01-01",
        file: "sources.ts",
      },
    ],
  );
  for (const code of [
    "GLOSSARY_SLUG_DUPLICATE",
    "GLOSSARY_TERM_DUPLICATE",
    "GLOSSARY_ALIAS_COLLISION",
    "SOURCE_ID_UNKNOWN",
    "GLOSSARY_RELATED_SELF",
  ])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

test("image checker catches missing files and missing alt while valid local images pass", async () => {
  const { root, put } = fixture();
  put("public/images/valid.png", "fixture");
  put(
    "features/example.tsx",
    'export const Example = () => <><Image src="/images/valid.png" alt="Useful description" /><Image src="/images/missing.png" /></>;',
  );
  put(
    "features/decode-the-label/components/decode-the-label-experience.tsx",
    'export const D = () => <><Image alt="A structured educational nutrition label" /><NutritionFacts /></>;',
  );
  const result = await checkImages({ root, now: new Date("2026-01-01T00:00:00Z") });
  assert.ok(result.issues.some(({ code }) => code === "IMAGE_FILE_MISSING"));
  assert.ok(result.issues.some(({ code }) => code === "IMAGE_ALT_MISSING"));
  assert.equal(
    result.issues.some(({ path }) => path === "/images/valid.png"),
    false,
  );
});
