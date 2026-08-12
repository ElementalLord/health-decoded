import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  sourceIssues,
  validateAllowlist,
  validateContentRelationships,
  validateCurriculumGraph,
  validateDecodeQuestions,
  validateExplainChallenges,
  validateGlossaryRecords,
  validateOrphanedContent,
  validateResources,
  validateSearchRecords,
  validateSourceReferences,
  validateUserFacingText,
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

const validSource = {
  id: "SRC-ONE",
  organization: "CDC",
  title: "Diabetes basics",
  url: "https://www.cdc.gov/diabetes/about/",
  reviewedAt: "2026-01-01",
  file: "sources.ts",
};

test("source registry rejects duplicates, malformed metadata, and placeholder URLs while valid sources pass", () => {
  assert.equal(sourceIssues([validSource], new Date("2026-02-01T00:00:00Z")).length, 0);
  const issues = sourceIssues(
    [validSource, { ...validSource, organization: "", url: "https://example.com/source" }],
    new Date("2026-02-01T00:00:00Z"),
  );
  for (const code of ["SOURCE_ID_DUPLICATE", "SOURCE_METADATA_EMPTY", "SOURCE_URL_INVALID"])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

function explain(overrides = {}) {
  return {
    id: "challenge-one",
    prompt: "Explain this.",
    essentialConceptIds: ["C-1"],
    optionalConceptIds: ["C-O1"],
    misconceptionIds: ["C-M1"],
    sources: [
      {
        organization: "CDC",
        title: "Diabetes basics",
        url: "https://www.cdc.gov/diabetes/about/",
      },
    ],
    sourceIds: [],
    lessonIds: ["LESSON-1"],
    file: "explain.ts",
    ...overrides,
  };
}

test("Explain It Back validates IDs, approved sources, concepts, and lesson mappings", () => {
  const issues = validateExplainChallenges(
    [
      explain({ sourceIds: ["UNKNOWN"], lessonIds: ["MISSING"] }),
      explain({ essentialConceptIds: ["C-1", "C-1"], misconceptionIds: ["M-1", "M-1"] }),
    ],
    new Set(["LESSON-1"]),
    new Set(["SRC-ONE"]),
  );
  for (const code of [
    "EXPLAIN_ID_DUPLICATE",
    "EXPLAIN_CONCEPT_ID_DUPLICATE",
    "EXPLAIN_MISCONCEPTION_ID_DUPLICATE",
    "SOURCE_ID_UNKNOWN",
    "EXPLAIN_LESSON_UNKNOWN",
  ])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

test("Explain It Back requires authored source coverage and structurally valid source metadata", () => {
  const issues = validateExplainChallenges(
    [
      explain({ id: "missing", sources: [] }),
      explain({
        id: "bad-url",
        sources: [{ organization: "", title: "", url: "https://example.org" }],
      }),
    ],
    new Set(["LESSON-1"]),
  );
  assert.ok(issues.some(({ code }) => code === "SOURCE_REQUIRED_MISSING"));
  assert.ok(issues.some(({ code }) => code === "SOURCE_METADATA_EMPTY"));
  assert.ok(issues.some(({ code }) => code === "SOURCE_URL_INVALID"));
});

test("Myth Check source coverage fails cleanly for empty and unknown source arrays", () => {
  const issues = validateSourceReferences(
    [
      { id: "MYTH-1", sourceIds: [], file: "myths.ts" },
      { id: "MYTH-2", sourceIds: ["UNKNOWN"], file: "myths.ts" },
    ],
    [validSource],
  );
  assert.ok(issues.some(({ code }) => code === "SOURCE_REQUIRED_MISSING"));
  assert.ok(issues.some(({ code }) => code === "SOURCE_ID_UNKNOWN"));
});

test("Decode the Label catches duplicate IDs, unknown sources, bad answer keys, and missing assets", () => {
  const question = {
    id: "DTL-Q01",
    prompt: "Question?",
    optionIds: ["a", "b"],
    correctOptionId: "missing",
    sourceIds: ["UNKNOWN"],
    assetPaths: ["/missing.png"],
    file: "decode.ts",
  };
  const issues = validateDecodeQuestions([question, question], new Set(["SRC-ONE"]), () => false);
  for (const code of [
    "DECODE_ID_DUPLICATE",
    "DECODE_ANSWER_UNKNOWN",
    "SOURCE_ID_UNKNOWN",
    "DECODE_ASSET_MISSING",
  ])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

test("Resources reject duplicate IDs, placeholder URLs, and missing internal routes", () => {
  const resource = {
    id: "resource-one",
    title: "Title",
    organization: "Org",
    url: "https://example.com/resource",
    status: "published",
    file: "resources.ts",
  };
  const issues = validateResources(
    [resource, { ...resource, url: "/removed" }],
    (route) => route === "/resources",
  );
  for (const code of ["RESOURCE_ID_DUPLICATE", "RESOURCE_URL_INVALID", "RESOURCE_ROUTE_MISSING"])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

function curriculum(overrides = {}) {
  return { id: "JOURNEY-1", kind: "journey", status: "published", file: "seed.sql", ...overrides };
}

test("curriculum graph catches missing lessons, activities, journeys, and prerequisites", () => {
  const issues = validateCurriculumGraph(
    [
      curriculum({ reviewedBy: "Team", reviewedAt: "2026-01-01", publishedAt: "2026-01-01" }),
      curriculum({ id: "LESSON-1", kind: "lesson", status: "draft", activityIds: ["ACT-MISSING"] }),
      curriculum({ id: "ACT-1", kind: "activity", status: "draft", lessonId: "LESSON-MISSING" }),
      curriculum({
        id: "MAP-1",
        kind: "journey-lesson",
        status: "draft",
        journeyId: "JOURNEY-MISSING",
        lessonId: "LESSON-MISSING",
        prerequisiteId: "MAP-MISSING",
        dayNumber: 1,
        displayOrder: 1,
      }),
    ],
    new Date("2026-02-01T00:00:00Z"),
  );
  for (const code of [
    "LESSON_ACTIVITY_UNKNOWN",
    "ACTIVITY_LESSON_UNKNOWN",
    "JOURNEY_REFERENCE_UNKNOWN",
    "LESSON_REFERENCE_UNKNOWN",
    "PREREQUISITE_REFERENCE_UNKNOWN",
  ])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

test("journey mappings reject duplicate day, order, lesson, and circular prerequisites", () => {
  const records = [
    curriculum({ id: "J", status: "draft" }),
    curriculum({ id: "L", kind: "lesson", status: "draft" }),
    curriculum({
      id: "M1",
      kind: "journey-lesson",
      status: "draft",
      journeyId: "J",
      lessonId: "L",
      dayNumber: 1,
      displayOrder: 1,
      prerequisiteId: "M2",
    }),
    curriculum({
      id: "M2",
      kind: "journey-lesson",
      status: "draft",
      journeyId: "J",
      lessonId: "L",
      dayNumber: 1,
      displayOrder: 1,
      prerequisiteId: "M1",
    }),
  ];
  const issues = validateCurriculumGraph(records, new Date("2026-02-01T00:00:00Z"));
  for (const code of [
    "JOURNEY_DAY_DUPLICATE",
    "JOURNEY_ORDER_DUPLICATE",
    "JOURNEY_LESSON_DUPLICATE",
    "PREREQUISITE_CYCLE",
  ])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

test("published records require valid dates and cannot claim pending review", () => {
  const issues = validateCurriculumGraph(
    [
      curriculum({ reviewedBy: "medical review pending", reviewedAt: "bad", publishedAt: "bad" }),
      curriculum({
        id: "JOURNEY-2",
        reviewedBy: "Team",
        reviewedAt: "2027-01-01",
        publishedAt: "2026-01-01",
      }),
    ],
    new Date("2026-02-01T00:00:00Z"),
  );
  for (const code of [
    "PUBLISHED_METADATA_INVALID",
    "PUBLISHED_REVIEW_PENDING",
    "REVIEW_DATE_IN_FUTURE",
  ])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

test("Search rejects removed routes, duplicate documents, and publicly indexed drafts", () => {
  const record = { id: "SEARCH-1", route: "/removed", status: "draft", file: "search.ts" };
  const issues = validateSearchRecords([record, record], () => false);
  for (const code of ["SEARCH_ID_DUPLICATE", "DRAFT_CONTENT_INDEXED", "SEARCH_ROUTE_MISSING"])
    assert.ok(
      issues.some((issue) => issue.code === code),
      code,
    );
});

test("production text rejects TODOs, placeholder domains, and unsupported medical review claims", () => {
  const issues = validateUserFacingText([
    { id: "one", text: "TODO replace me at https://example.com", file: "content.ts" },
    { id: "two", text: "This is clinically reviewed.", file: "content.ts" },
  ]);
  assert.ok(issues.some(({ code }) => code === "USER_FACING_PLACEHOLDER"));
  assert.ok(issues.some(({ code }) => code === "REVIEW_CLAIM_UNSUPPORTED"));
  assert.equal(
    validateUserFacingText([
      {
        id: "valid",
        text: "This is clinically reviewed.",
        file: "content.ts",
        hasClinicalReviewMetadata: true,
      },
    ]).length,
    0,
  );
});

test("cross-feature relationships reject missing and repeated targets", () => {
  const issues = validateContentRelationships(
    [
      {
        ownerId: "concept",
        field: "lessonIds",
        targetIds: ["MISSING", "MISSING"],
        file: "concept.ts",
      },
    ],
    { lessonIds: new Set(["LESSON-1"]) },
  );
  assert.ok(issues.some(({ code }) => code === "RELATIONSHIP_TARGET_UNKNOWN"));
  assert.ok(issues.some(({ code }) => code === "RELATIONSHIP_DUPLICATE"));
});

test("allowlist entries must be exact and explained", () => {
  assert.equal(
    validateAllowlist([
      { rule: "ORPHAN_CONTENT", target: "content:one", reason: "Direct-link only" },
    ]).length,
    0,
  );
  assert.ok(
    validateAllowlist([{ rule: "ORPHAN_CONTENT", target: "*", reason: "" }]).some(
      ({ code }) => code === "ALLOWLIST_INVALID",
    ),
  );
});

test("orphaned published content warns without crashing", () => {
  const issues = validateOrphanedContent([{ id: "orphan", file: "content.ts" }], new Set());
  assert.equal(issues[0]?.severity, "warning");
  assert.equal(issues[0]?.code, "ORPHAN_CONTENT");
});

test("quality engine remains deterministic and offline", () => {
  const source = readFileSync(join(process.cwd(), "scripts/quality/run-quality-check.mts"), "utf8");
  assert.doesNotMatch(source, /\bfetch\s*\(|createClient|Gemini|GoogleGenAI/i);
});
