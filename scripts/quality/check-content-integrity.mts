import { existsSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { qualityAllowlist, qualityConfig } from "./quality.config.mts";
// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import * as sourceUtils from "./source-utils.mts";
import type { QualityCheckResult, QualityContext, QualityIssue } from "./types.mts";

const {
  ast,
  duplicates,
  filesUnder,
  literalText,
  normalizeKey,
  propertyName,
  read,
  slugify,
  visit,
} = sourceUtils;

export type SourceRecord = {
  id: string;
  organization: string;
  title: string;
  url: string;
  reviewedAt?: string;
  file: string;
};
export type GlossaryRecord = {
  id: string;
  slug: string;
  term: string;
  definition: string;
  sourceIds: string[];
  aliases: string[];
  abbreviation?: string;
  relatedTerm?: string;
  file: string;
};

export type EducationalSource = {
  organization: string;
  title: string;
  url: string;
};

export type ExplainChallengeRecord = {
  id: string;
  prompt: string;
  essentialConceptIds: string[];
  optionalConceptIds: string[];
  misconceptionIds: string[];
  sources: EducationalSource[];
  sourceIds: string[];
  lessonIds: string[];
  file: string;
};

export type DecodeQuestionRecord = {
  id: string;
  prompt: string;
  optionIds: string[];
  correctOptionId: string;
  sourceIds: string[];
  assetPaths: string[];
  file: string;
};

export type ResourceRecord = {
  id: string;
  title: string;
  organization: string;
  url: string;
  status: string;
  file: string;
};

export type CurriculumRecord = {
  id: string;
  kind: "journey" | "lesson" | "journey-lesson" | "activity";
  status: string;
  journeyId?: string;
  lessonId?: string;
  prerequisiteId?: string;
  activityIds?: string[];
  dayNumber?: number;
  displayOrder?: number;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
  file: string;
};

export type SearchRecord = {
  id: string;
  route: string;
  status: string;
  file: string;
};

export type ContentRelationshipRecord = {
  ownerId: string;
  field: string;
  targetIds: string[];
  file: string;
};

function arrayStrings(node: ts.Node | undefined) {
  const value = unwrap(node);
  return value && ts.isArrayLiteralExpression(value)
    ? value.elements.map(literalText).filter((item): item is string => item !== null)
    : [];
}

function unwrap(node: ts.Node | undefined): ts.Node | undefined {
  let current = node;
  while (
    current &&
    (ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isParenthesizedExpression(current))
  )
    current = current.expression;
  return current;
}

function objectValues(node: ts.ObjectLiteralExpression) {
  const result = new Map<string, ts.Expression>();
  for (const member of node.properties)
    if (ts.isPropertyAssignment(member)) {
      const name = propertyName(member.name);
      if (name) result.set(name, member.initializer);
    }
  return result;
}

function glossaryRecords(root: string): GlossaryRecord[] {
  const records: GlossaryRecord[] = [];
  for (const file of filesUnder(root, ["features/glossary/content/terms"], [".ts"]).filter(
    (value) => !value.endsWith("create-entries.ts"),
  )) {
    const tree = ast(root, file);
    visit(tree, (node) => {
      if (!ts.isCallExpression(node) || node.expression.getText(tree) !== "createEntries") return;
      const sourceIds = arrayStrings(node.arguments[1]);
      const seeds = node.arguments[2];
      if (!seeds || !ts.isArrayLiteralExpression(seeds)) return;
      for (const seed of seeds.elements) {
        if (!ts.isArrayLiteralExpression(seed)) continue;
        const term = literalText(seed.elements[0]);
        const definition = literalText(seed.elements[1]);
        if (term === null || definition === null) continue;
        const options =
          seed.elements[2] && ts.isObjectLiteralExpression(seed.elements[2])
            ? objectValues(seed.elements[2])
            : new Map<string, ts.Expression>();
        const confused = options.get("confused");
        const confusedValues =
          confused && ts.isObjectLiteralExpression(confused) ? objectValues(confused) : null;
        const slug = slugify(term);
        records.push({
          id: `GLOSSARY-${slug.toUpperCase()}`,
          slug,
          term,
          definition,
          sourceIds,
          aliases: arrayStrings(options.get("aliases")),
          ...(literalText(options.get("abbreviation"))
            ? { abbreviation: literalText(options.get("abbreviation"))! }
            : {}),
          ...(confusedValues && literalText(confusedValues.get("term"))
            ? { relatedTerm: literalText(confusedValues.get("term"))! }
            : {}),
          file,
        });
      }
    });
  }
  return records;
}

function glossarySources(root: string): SourceRecord[] {
  const file = qualityConfig.sourceFiles.glossary;
  const tree = ast(root, file);
  const records: SourceRecord[] = [];
  visit(tree, (node) => {
    if (!ts.isObjectLiteralExpression(node)) return;
    const values = objectValues(node);
    const id = literalText(values.get("id"));
    if (!id?.startsWith("SRC-")) return;
    const reviewedAt = literalText(values.get("reviewedAt"));
    records.push({
      id,
      organization: literalText(values.get("organization")) ?? "",
      title: literalText(values.get("title")) ?? "",
      url: literalText(values.get("url")) ?? "",
      ...(reviewedAt ? { reviewedAt } : {}),
      file,
    });
  });
  return records;
}

function mythSources(root: string): SourceRecord[] {
  const file = qualityConfig.sourceFiles.myths;
  const tree = ast(root, file);
  let accessedAt: string | undefined;
  const records: SourceRecord[] = [];
  visit(tree, (node) => {
    if (!ts.isVariableDeclaration(node)) return;
    if (node.name.getText(tree) === "accessedAt")
      accessedAt = literalText(node.initializer) ?? undefined;
    const initializer = unwrap(node.initializer);
    if (
      node.name.getText(tree) !== "sourceSeeds" ||
      !initializer ||
      !ts.isArrayLiteralExpression(initializer)
    )
      return;
    for (const row of initializer.elements) {
      if (!ts.isArrayLiteralExpression(row)) continue;
      const values = row.elements.map(literalText);
      if (values.length >= 4 && values.slice(0, 4).every((value) => value !== null))
        records.push({
          id: values[0]!,
          organization: values[1]!,
          title: values[2]!,
          url: values[3]!,
          ...(accessedAt ? { reviewedAt: accessedAt } : {}),
          file,
        });
    }
  });
  return records;
}

function resourceSources(root: string): SourceRecord[] {
  const file = qualityConfig.sourceFiles.resources;
  const tree = ast(root, file);
  const records: SourceRecord[] = [];
  visit(tree, (node) => {
    if (!ts.isObjectLiteralExpression(node)) return;
    const values = objectValues(node);
    const id = literalText(values.get("id"));
    if (!id || literalText(values.get("status")) !== "reviewed") return;
    const reviewedAt = literalText(values.get("verified_at"));
    records.push({
      id: `RESOURCE-${id}`,
      organization: literalText(values.get("organization")) ?? "",
      title: literalText(values.get("title")) ?? "",
      url: literalText(values.get("url")) ?? "",
      ...(reviewedAt ? { reviewedAt } : {}),
      file,
    });
  });
  return records;
}

function mythReferences(root: string) {
  const file = "features/mythbusters/content/myth-check-cards.ts";
  const tree = ast(root, file);
  const references: Array<{ id: string; sourceIds: string[]; file: string }> = [];
  visit(tree, (node) => {
    if (!ts.isCallExpression(node) || node.expression.getText(tree) !== "card") return;
    const id = literalText(node.arguments[0]);
    if (id) references.push({ id, sourceIds: arrayStrings(node.arguments[6]), file });
  });
  return references;
}

function allowed(rule: string, target: string) {
  return qualityAllowlist.some((entry) => entry.rule === rule && entry.target === target);
}

export function sourceIssues(records: readonly SourceRecord[], now: Date): QualityIssue[] {
  const issues: QualityIssue[] = [];
  for (const duplicate of duplicates(records.map(({ id, file }) => ({ value: id, file, id }))))
    issues.push({
      check: "sources",
      severity: "error",
      code: "SOURCE_ID_DUPLICATE",
      message: `Source ID "${duplicate.duplicate.id}" is duplicated.`,
      file: duplicate.duplicate.file,
      contentId: duplicate.duplicate.id,
    });
  for (const source of records) {
    const target = `source:${source.id}`;
    for (const [field, value] of [
      ["organization", source.organization],
      ["title", source.title],
    ] as const)
      if (!value.trim())
        issues.push({
          check: "sources",
          severity: "error",
          code: "SOURCE_METADATA_EMPTY",
          message: `${source.id} has an empty ${field}.`,
          file: source.file,
          contentId: source.id,
        });
    if (!source.url)
      issues.push({
        check: "sources",
        severity: "error",
        code: "SOURCE_URL_MISSING",
        message: `${source.id} has no source URL.`,
        file: source.file,
        contentId: source.id,
      });
    else if (!source.url.startsWith("internal://")) {
      try {
        const url = new URL(source.url);
        if (
          url.protocol !== "https:" ||
          !url.hostname ||
          ["example.com", "example.org", "localhost", "127.0.0.1"].includes(url.hostname) ||
          source.url.trim() !== source.url ||
          /\/\/{2,}/.test(url.pathname)
        )
          throw new Error("unsupported");
      } catch {
        issues.push({
          check: "sources",
          severity: "error",
          code: "SOURCE_URL_INVALID",
          message: `${source.id} has an invalid or unsupported URL.`,
          file: source.file,
          contentId: source.id,
        });
      }
    }
    if (!source.reviewedAt)
      issues.push({
        check: "sources",
        severity: "warning",
        code: "SOURCE_REVIEW_DATE_MISSING",
        message: `${source.id} has no repository review date.`,
        file: source.file,
        contentId: source.id,
      });
    else {
      const timestamp = Date.parse(`${source.reviewedAt}T00:00:00Z`);
      if (!Number.isFinite(timestamp))
        issues.push({
          check: "sources",
          severity: "error",
          code: "SOURCE_REVIEW_DATE_INVALID",
          message: `${source.id} has an invalid review date "${source.reviewedAt}".`,
          file: source.file,
          contentId: source.id,
        });
      else {
        const ageDays = Math.floor((now.getTime() - timestamp) / 86_400_000);
        if (ageDays < 0)
          issues.push({
            check: "sources",
            severity: "error",
            code: "SOURCE_REVIEW_DATE_IN_FUTURE",
            message: `${source.id} has a future review date (${source.reviewedAt}).`,
            file: source.file,
            contentId: source.id,
          });
        else if (
          ageDays > qualityConfig.sourceFreshnessWarningDays &&
          !allowed("SOURCE_REVIEW_STALE", target)
        )
          issues.push({
            check: "sources",
            severity: "warning",
            code: "SOURCE_REVIEW_STALE",
            message: `${source.id} was reviewed ${ageDays} days ago and needs review.`,
            file: source.file,
            contentId: source.id,
          });
      }
    }
  }
  const canonicalUrls = records
    .filter(({ url }) => url && !url.startsWith("internal://"))
    .map(({ url, file, id }) => ({ value: url.replace(/\/$/, ""), file, id }));
  for (const duplicate of duplicates(canonicalUrls))
    if (!allowed("SOURCE_CANONICAL_URL_DUPLICATE", `source:${duplicate.duplicate.id}`))
      issues.push({
        check: "sources",
        severity: "warning",
        code: "SOURCE_CANONICAL_URL_DUPLICATE",
        message: `${duplicate.duplicate.id} duplicates the canonical URL used by ${duplicate.first.id}.`,
        file: duplicate.duplicate.file,
        contentId: duplicate.duplicate.id,
      });
  return issues;
}

export function validateGlossaryRecords(
  records: readonly GlossaryRecord[],
  sources: readonly SourceRecord[],
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const sourceIds = new Set(sources.map(({ id }) => id));
  const addDuplicates = (
    code: string,
    label: string,
    values: Array<{ value: string; file: string; id?: string }>,
  ) => {
    for (const duplicate of duplicates(values))
      issues.push({
        check: "glossary",
        severity: "error",
        code,
        message: `${label} "${duplicate.duplicate.value}" is ambiguous.`,
        file: duplicate.duplicate.file,
        contentId: duplicate.duplicate.id,
      });
  };
  addDuplicates(
    "GLOSSARY_ID_DUPLICATE",
    "Glossary ID",
    records.map(({ id, file }) => ({ value: id, file, id })),
  );
  addDuplicates(
    "GLOSSARY_SLUG_DUPLICATE",
    "Glossary slug",
    records.map(({ slug, file, id }) => ({ value: slug, file, id })),
  );
  addDuplicates(
    "GLOSSARY_TERM_DUPLICATE",
    "Canonical term",
    records.map(({ term, file, id }) => ({ value: term, file, id })),
  );
  const aliases = records.flatMap((record) =>
    [...record.aliases, ...(record.abbreviation ? [record.abbreviation] : [])].map((value) => ({
      value,
      file: record.file,
      id: record.id,
    })),
  );
  const canonicalNames = records.flatMap((record) =>
    [record.term, ...(record.abbreviation ? [record.abbreviation] : [])].map((value) => ({
      value,
      file: record.file,
      id: record.id,
    })),
  );
  for (const duplicate of duplicates(aliases)) {
    const target = `glossary-alias:${normalizeKey(duplicate.duplicate.value)}`;
    if (!allowed("GLOSSARY_ALIAS_COLLISION", target))
      issues.push({
        check: "glossary",
        severity: "error",
        code: "GLOSSARY_ALIAS_COLLISION",
        message: `Alias or abbreviation "${duplicate.duplicate.value}" maps to multiple entries.`,
        file: duplicate.duplicate.file,
        contentId: duplicate.duplicate.id,
        suggestion: `Add an exact explained exception for ${target} only if the overlap is intentional.`,
      });
  }
  for (const record of records) {
    if (!record.definition.trim())
      issues.push({
        check: "glossary",
        severity: "error",
        code: "GLOSSARY_DEFINITION_EMPTY",
        message: `${record.id} has an empty definition.`,
        file: record.file,
        contentId: record.id,
      });
    if (!record.sourceIds.length)
      issues.push({
        check: "glossary",
        severity: "error",
        code: "SOURCE_REQUIRED_MISSING",
        message: `${record.id} has no approved source.`,
        file: record.file,
        contentId: record.id,
      });
    for (const id of record.sourceIds)
      if (!sourceIds.has(id))
        issues.push({
          check: "glossary",
          severity: "error",
          code: "SOURCE_ID_UNKNOWN",
          message: `${record.id} references unknown source "${id}".`,
          file: record.file,
          contentId: record.id,
        });
    if (!record.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug))
      issues.push({
        check: "glossary",
        severity: "error",
        code: "SLUG_INVALID",
        message: `${record.id} has invalid slug "${record.slug}".`,
        file: record.file,
        contentId: record.id,
      });
    if (record.relatedTerm && normalizeKey(record.relatedTerm) === normalizeKey(record.term))
      issues.push({
        check: "glossary",
        severity: "error",
        code: "GLOSSARY_RELATED_SELF",
        message: `${record.id} refers to itself.`,
        file: record.file,
        contentId: record.id,
      });
    for (const alias of record.aliases)
      for (const canonical of canonicalNames)
        if (canonical.id !== record.id && normalizeKey(alias) === normalizeKey(canonical.value))
          issues.push({
            check: "glossary",
            severity: "error",
            code: "GLOSSARY_ALIAS_CANONICAL_COLLISION",
            message: `${record.id} alias "${alias}" collides with canonical term ${canonical.id}.`,
            file: record.file,
            contentId: record.id,
          });
  }
  return issues;
}

export function validateSourceReferences(
  references: readonly { id: string; sourceIds: readonly string[]; file: string }[],
  sources: readonly SourceRecord[],
) {
  const issues: QualityIssue[] = [];
  const sourceIds = new Set(sources.map(({ id }) => id));
  for (const reference of references) {
    if (!reference.sourceIds.length)
      issues.push({
        check: "sources",
        severity: "error",
        code: "SOURCE_REQUIRED_MISSING",
        message: `${reference.id} has no approved sources.`,
        file: reference.file,
        contentId: reference.id,
      });
    for (const id of reference.sourceIds)
      if (!sourceIds.has(id))
        issues.push({
          check: "sources",
          severity: "error",
          code: "SOURCE_ID_UNKNOWN",
          message: `${reference.id} references unknown source "${id}".`,
          file: reference.file,
          contentId: reference.id,
        });
  }
  return issues;
}

function requiredTextIssue(
  check: string,
  code: string,
  label: string,
  value: string,
  file: string,
  contentId: string,
): QualityIssue | null {
  return value.trim()
    ? null
    : { check, severity: "error", code, message: `${contentId} has no ${label}.`, file, contentId };
}

function validateEducationalUrl(
  check: string,
  contentId: string,
  url: string,
  file: string,
): QualityIssue | null {
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !parsed.hostname ||
      ["example.com", "example.org", "localhost", "127.0.0.1"].includes(parsed.hostname) ||
      url.trim() !== url ||
      /\/\/{2,}/.test(parsed.pathname)
    )
      throw new Error("unsupported");
    return null;
  } catch {
    return {
      check,
      severity: "error",
      code: "SOURCE_URL_INVALID",
      message: `${contentId} has an invalid or placeholder source URL.`,
      file,
      contentId,
    };
  }
}

export function validateExplainChallenges(
  records: readonly ExplainChallengeRecord[],
  validLessonIds: ReadonlySet<string>,
  approvedSourceIds: ReadonlySet<string> = new Set(),
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  for (const duplicate of duplicates(records.map(({ id, file }) => ({ value: id, file, id }))))
    issues.push({
      check: "explain-it-back",
      severity: "error",
      code: "EXPLAIN_ID_DUPLICATE",
      message: `Explain It Back challenge ID "${duplicate.duplicate.id}" is duplicated.`,
      file: duplicate.duplicate.file,
      contentId: duplicate.duplicate.id,
    });
  for (const record of records) {
    const missingPrompt = requiredTextIssue(
      "explain-it-back",
      "EXPLAIN_PROMPT_MISSING",
      "prompt",
      record.prompt,
      record.file,
      record.id,
    );
    if (missingPrompt) issues.push(missingPrompt);
    if (!record.essentialConceptIds.length)
      issues.push({
        check: "explain-it-back",
        severity: "error",
        code: "EXPLAIN_ESSENTIAL_CONCEPT_MISSING",
        message: `${record.id} has no essential concepts.`,
        file: record.file,
        contentId: record.id,
      });
    for (const [code, label, ids] of [
      [
        "EXPLAIN_CONCEPT_ID_DUPLICATE",
        "concept",
        [...record.essentialConceptIds, ...record.optionalConceptIds],
      ],
      ["EXPLAIN_MISCONCEPTION_ID_DUPLICATE", "misconception", record.misconceptionIds],
    ] as const)
      for (const duplicate of duplicates(ids.map((id) => ({ value: id, file: record.file, id }))))
        issues.push({
          check: "explain-it-back",
          severity: "error",
          code,
          message: `${record.id} has duplicate ${label} ID "${duplicate.duplicate.id}".`,
          file: record.file,
          contentId: record.id,
        });
    if (!record.sources.length)
      issues.push({
        check: "explain-it-back",
        severity: "error",
        code: "SOURCE_REQUIRED_MISSING",
        message: `${record.id} has no approved source support.`,
        file: record.file,
        contentId: record.id,
      });
    for (const source of record.sources) {
      for (const [label, value] of [
        ["source organization", source.organization],
        ["source title", source.title],
      ] as const) {
        const issue = requiredTextIssue(
          "explain-it-back",
          "SOURCE_METADATA_EMPTY",
          label,
          value,
          record.file,
          record.id,
        );
        if (issue) issues.push(issue);
      }
      const urlIssue = validateEducationalUrl(
        "explain-it-back",
        record.id,
        source.url,
        record.file,
      );
      if (urlIssue) issues.push(urlIssue);
    }
    for (const sourceId of record.sourceIds)
      if (!approvedSourceIds.has(sourceId))
        issues.push({
          check: "explain-it-back",
          severity: "error",
          code: "SOURCE_ID_UNKNOWN",
          message: `${record.id} references unknown source "${sourceId}".`,
          file: record.file,
          contentId: record.id,
        });
    for (const lessonId of record.lessonIds)
      if (!validLessonIds.has(lessonId))
        issues.push({
          check: "explain-it-back",
          severity: "error",
          code: "EXPLAIN_LESSON_UNKNOWN",
          message: `${record.id} maps to unknown lesson "${lessonId}".`,
          file: record.file,
          contentId: record.id,
        });
  }
  return issues;
}

export function validateDecodeQuestions(
  records: readonly DecodeQuestionRecord[],
  approvedSourceIds: ReadonlySet<string>,
  assetExists: (path: string) => boolean,
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  for (const duplicate of duplicates(records.map(({ id, file }) => ({ value: id, file, id }))))
    issues.push({
      check: "decode-the-label",
      severity: "error",
      code: "DECODE_ID_DUPLICATE",
      message: `Decode the Label question ID "${duplicate.duplicate.id}" is duplicated.`,
      file: duplicate.duplicate.file,
      contentId: duplicate.duplicate.id,
    });
  for (const record of records) {
    if (!record.prompt.trim() || !record.optionIds.length || !record.correctOptionId)
      issues.push({
        check: "decode-the-label",
        severity: "error",
        code: "DECODE_QUESTION_MALFORMED",
        message: `${record.id} is missing its prompt, options, or answer key.`,
        file: record.file,
        contentId: record.id,
      });
    else if (!record.optionIds.includes(record.correctOptionId))
      issues.push({
        check: "decode-the-label",
        severity: "error",
        code: "DECODE_ANSWER_UNKNOWN",
        message: `${record.id} answer key does not match an option.`,
        file: record.file,
        contentId: record.id,
      });
    for (const sourceId of record.sourceIds)
      if (!approvedSourceIds.has(sourceId))
        issues.push({
          check: "decode-the-label",
          severity: "error",
          code: "SOURCE_ID_UNKNOWN",
          message: `${record.id} references unknown source "${sourceId}".`,
          file: record.file,
          contentId: record.id,
        });
    for (const assetPath of record.assetPaths)
      if (!assetExists(assetPath))
        issues.push({
          check: "decode-the-label",
          severity: "error",
          code: "DECODE_ASSET_MISSING",
          message: `${record.id} references missing asset "${assetPath}".`,
          file: record.file,
          contentId: record.id,
          path: assetPath,
        });
  }
  return issues;
}

export function validateResources(
  records: readonly ResourceRecord[],
  internalRouteExists: (route: string) => boolean,
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  for (const duplicate of duplicates(records.map(({ id, file }) => ({ value: id, file, id }))))
    issues.push({
      check: "resources",
      severity: "error",
      code: "RESOURCE_ID_DUPLICATE",
      message: `Resource ID "${duplicate.duplicate.id}" is duplicated.`,
      file: duplicate.duplicate.file,
      contentId: duplicate.duplicate.id,
    });
  for (const record of records) {
    if (!record.title.trim() || !record.organization.trim())
      issues.push({
        check: "resources",
        severity: "error",
        code: "RESOURCE_METADATA_EMPTY",
        message: `${record.id} has incomplete required metadata.`,
        file: record.file,
        contentId: record.id,
      });
    if (record.url.startsWith("/")) {
      if (!internalRouteExists(record.url))
        issues.push({
          check: "resources",
          severity: "error",
          code: "RESOURCE_ROUTE_MISSING",
          message: `${record.id} points to missing internal route "${record.url}".`,
          file: record.file,
          contentId: record.id,
        });
    } else {
      const issue = validateEducationalUrl("resources", record.id, record.url, record.file);
      if (issue) issues.push({ ...issue, code: "RESOURCE_URL_INVALID" });
    }
    if (
      record.status === "published" &&
      /(?:placeholder|example\.(?:com|org)|localhost)/i.test(record.url)
    )
      issues.push({
        check: "resources",
        severity: "error",
        code: "RESOURCE_PLACEHOLDER_URL",
        message: `${record.id} publishes a placeholder destination.`,
        file: record.file,
        contentId: record.id,
      });
  }
  return issues;
}

function validDate(value: string | undefined) {
  return Boolean(value && Number.isFinite(Date.parse(value)));
}

export function validateCurriculumGraph(
  records: readonly CurriculumRecord[],
  now: Date,
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const byKind = (kind: CurriculumRecord["kind"]) =>
    records.filter((record) => record.kind === kind);
  const journeys = new Set(byKind("journey").map(({ id }) => id));
  const lessons = new Set(byKind("lesson").map(({ id }) => id));
  const assignments = byKind("journey-lesson");
  const assignmentIds = new Set(assignments.map(({ id }) => id));
  const activityIds = new Set(byKind("activity").map(({ id }) => id));
  for (const kind of ["journey", "lesson", "journey-lesson", "activity"] as const)
    for (const duplicate of duplicates(
      byKind(kind).map(({ id, file }) => ({ value: id, file, id })),
    ))
      issues.push({
        check: "curriculum",
        severity: "error",
        code: "CONTENT_ID_DUPLICATE",
        message: `${kind} ID "${duplicate.duplicate.id}" is duplicated.`,
        file: duplicate.duplicate.file,
        contentId: duplicate.duplicate.id,
      });
  for (const assignment of assignments) {
    if (!assignment.journeyId || !journeys.has(assignment.journeyId))
      issues.push({
        check: "curriculum",
        severity: "error",
        code: "JOURNEY_REFERENCE_UNKNOWN",
        message: `${assignment.id} references missing journey "${assignment.journeyId ?? ""}".`,
        file: assignment.file,
        contentId: assignment.id,
      });
    if (!assignment.lessonId || !lessons.has(assignment.lessonId))
      issues.push({
        check: "curriculum",
        severity: "error",
        code: "LESSON_REFERENCE_UNKNOWN",
        message: `${assignment.id} references missing lesson "${assignment.lessonId ?? ""}".`,
        file: assignment.file,
        contentId: assignment.id,
      });
    if (assignment.prerequisiteId && !assignmentIds.has(assignment.prerequisiteId))
      issues.push({
        check: "curriculum",
        severity: "error",
        code: "PREREQUISITE_REFERENCE_UNKNOWN",
        message: `${assignment.id} references missing prerequisite "${assignment.prerequisiteId}".`,
        file: assignment.file,
        contentId: assignment.id,
      });
  }
  for (const field of ["dayNumber", "displayOrder", "lessonId"] as const) {
    const values = assignments
      .filter(({ journeyId, [field]: value }) => journeyId && value !== undefined)
      .map((record) => ({
        value: `${record.journeyId}:${record[field]}`,
        file: record.file,
        id: record.id,
      }));
    for (const duplicate of duplicates(values))
      issues.push({
        check: "curriculum",
        severity: "error",
        code:
          field === "dayNumber"
            ? "JOURNEY_DAY_DUPLICATE"
            : field === "displayOrder"
              ? "JOURNEY_ORDER_DUPLICATE"
              : "JOURNEY_LESSON_DUPLICATE",
        message: `Journey mapping "${duplicate.duplicate.value}" is duplicated.`,
        file: duplicate.duplicate.file,
        contentId: duplicate.duplicate.id,
      });
  }
  for (const activity of byKind("activity"))
    if (!activity.lessonId || !lessons.has(activity.lessonId))
      issues.push({
        check: "curriculum",
        severity: "error",
        code: "ACTIVITY_LESSON_UNKNOWN",
        message: `${activity.id} references missing lesson "${activity.lessonId ?? ""}".`,
        file: activity.file,
        contentId: activity.id,
      });
  for (const lesson of byKind("lesson"))
    for (const activityId of lesson.activityIds ?? [])
      if (!activityIds.has(activityId))
        issues.push({
          check: "curriculum",
          severity: "error",
          code: "LESSON_ACTIVITY_UNKNOWN",
          message: `${lesson.id} references missing activity "${activityId}".`,
          file: lesson.file,
          contentId: lesson.id,
        });
  for (const record of records) {
    if (record.status !== "published") continue;
    if (
      !validDate(record.reviewedAt) ||
      !validDate(record.publishedAt) ||
      !record.reviewedBy?.trim()
    )
      issues.push({
        check: "publication",
        severity: "error",
        code: "PUBLISHED_METADATA_INVALID",
        message: `${record.kind} ${record.id} is published without complete valid review/publication metadata.`,
        file: record.file,
        contentId: record.id,
      });
    if (record.reviewedAt && Date.parse(record.reviewedAt) > now.getTime())
      issues.push({
        check: "publication",
        severity: "error",
        code: "REVIEW_DATE_IN_FUTURE",
        message: `${record.kind} ${record.id} has a future reviewed_at date.`,
        file: record.file,
        contentId: record.id,
      });
    if (/\b(?:pending|unreviewed|not reviewed)\b/i.test(record.reviewedBy ?? ""))
      issues.push({
        check: "publication",
        severity: "error",
        code: "PUBLISHED_REVIEW_PENDING",
        message: `${record.kind} ${record.id} is published while review metadata says review is pending.`,
        file: record.file,
        contentId: record.id,
      });
  }
  const prerequisiteById = new Map(assignments.map((record) => [record.id, record.prerequisiteId]));
  for (const assignment of assignments) {
    const visited = new Set<string>();
    let cursor: string | undefined = assignment.id;
    while (cursor) {
      if (visited.has(cursor)) {
        issues.push({
          check: "curriculum",
          severity: "error",
          code: "PREREQUISITE_CYCLE",
          message: `${assignment.id} participates in a circular prerequisite chain.`,
          file: assignment.file,
          contentId: assignment.id,
        });
        break;
      }
      visited.add(cursor);
      cursor = prerequisiteById.get(cursor);
    }
  }
  return issues;
}

export function validateSearchRecords(
  records: readonly SearchRecord[],
  internalRouteExists: (route: string) => boolean,
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  for (const duplicate of duplicates(records.map(({ id, file }) => ({ value: id, file, id }))))
    issues.push({
      check: "search",
      severity: "error",
      code: "SEARCH_ID_DUPLICATE",
      message: `Search record ID "${duplicate.duplicate.id}" is duplicated.`,
      file: duplicate.duplicate.file,
      contentId: duplicate.duplicate.id,
    });
  for (const record of records) {
    if (["draft", "hidden", "archived"].includes(record.status))
      issues.push({
        check: "search",
        severity: "error",
        code: "DRAFT_CONTENT_INDEXED",
        message: `${record.id} is included in public search with status "${record.status}".`,
        file: record.file,
        contentId: record.id,
      });
    if (!internalRouteExists(record.route))
      issues.push({
        check: "search",
        severity: "error",
        code: "SEARCH_ROUTE_MISSING",
        message: `${record.id} points to missing route "${record.route}".`,
        file: record.file,
        contentId: record.id,
      });
  }
  return issues;
}

export function validateAllowlist(
  entries: readonly { rule: string; target: string; reason: string }[],
) {
  const issues: QualityIssue[] = [];
  for (const [index, entry] of entries.entries())
    if (
      !entry.rule.trim() ||
      !entry.target.trim() ||
      !entry.reason.trim() ||
      /[*?]/.test(entry.target) ||
      ["all", "*"].includes(entry.target.trim().toLowerCase())
    )
      issues.push({
        check: "content",
        severity: "error",
        code: "ALLOWLIST_INVALID",
        message: `Quality allowlist entry ${index + 1} is broad or incomplete.`,
        file: "scripts/quality/quality.config.mts",
      });
  return issues;
}

export function validateContentRelationships(
  records: readonly ContentRelationshipRecord[],
  targetsByField: Readonly<Record<string, ReadonlySet<string>>>,
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  for (const record of records) {
    const targets = targetsByField[record.field];
    if (!targets) continue;
    for (const duplicate of duplicates(
      record.targetIds.map((id) => ({ value: id, file: record.file, id: record.ownerId })),
    ))
      issues.push({
        check: "relationships",
        severity: "error",
        code: "RELATIONSHIP_DUPLICATE",
        message: `${record.ownerId}.${record.field} repeats "${duplicate.duplicate.value}".`,
        file: record.file,
        contentId: record.ownerId,
      });
    for (const targetId of record.targetIds)
      if (!targets.has(targetId))
        issues.push({
          check: "relationships",
          severity: "error",
          code: "RELATIONSHIP_TARGET_UNKNOWN",
          message: `${record.ownerId}.${record.field} references missing target "${targetId}".`,
          file: record.file,
          contentId: record.ownerId,
        });
  }
  return issues;
}

export function validateUserFacingText(
  records: readonly {
    id: string;
    text: string;
    file: string;
    hasClinicalReviewMetadata?: boolean;
  }[],
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const placeholderPattern =
    /\b(?:TODO|TBD|FIXME|lorem ipsum|replace me|test content)\b|https?:\/\/(?:example\.(?:com|org)|localhost)(?:[/:]|$)/i;
  const reviewClaimPattern =
    /\b(?:clinically reviewed|medically reviewed|doctor reviewed|physician reviewed|expert reviewed|clinician reviewed|reviewed by experts|verified by a clinician|medically verified|doctor approved)\b/i;
  for (const record of records) {
    const placeholder = record.text.match(placeholderPattern);
    if (placeholder)
      issues.push({
        check: "content",
        severity: "error",
        code: "USER_FACING_PLACEHOLDER",
        message: `${record.id} contains placeholder text "${placeholder[0]}".`,
        file: record.file,
        contentId: record.id,
      });
    const claim = record.text.match(reviewClaimPattern);
    if (claim && !record.hasClinicalReviewMetadata)
      issues.push({
        check: "content",
        severity: "error",
        code: "REVIEW_CLAIM_UNSUPPORTED",
        message: `${record.id} claims "${claim[0]}" without clinical review metadata.`,
        file: record.file,
        contentId: record.id,
      });
  }
  return issues;
}

export function validateOrphanedContent(
  publishedIds: readonly { id: string; file: string }[],
  reachableIds: ReadonlySet<string>,
): QualityIssue[] {
  return publishedIds
    .filter(({ id }) => !reachableIds.has(id) && !allowed("ORPHAN_CONTENT", `content:${id}`))
    .map(({ id, file }) => ({
      check: "content",
      severity: "warning" as const,
      code: "ORPHAN_CONTENT",
      message: `Published content ${id} is not reachable from an intended discovery path.`,
      file,
      contentId: id,
    }));
}

function objectArray(node: ts.Node | undefined) {
  const value = unwrap(node);
  return value && ts.isArrayLiteralExpression(value)
    ? value.elements.filter(ts.isObjectLiteralExpression)
    : [];
}

function recordIds(node: ts.Node | undefined) {
  return objectArray(node)
    .map((entry) => literalText(objectValues(entry).get("id")))
    .filter((id): id is string => id !== null);
}

function explainChallengeRecords(root: string): ExplainChallengeRecord[] {
  const file = "features/explain-it-back/content/explain-it-back-content.ts";
  const tree = ast(root, file);
  const records: ExplainChallengeRecord[] = [];
  visit(tree, (node) => {
    if (!ts.isVariableDeclaration(node) || node.name.getText(tree) !== "explainItBackChallenges")
      return;
    for (const entry of objectArray(node.initializer)) {
      const values = objectValues(entry);
      const id = literalText(values.get("id"));
      if (!id) continue;
      const sources = objectArray(values.get("sources")).map((source) => {
        const sourceValues = objectValues(source);
        return {
          organization: literalText(sourceValues.get("organization")) ?? "",
          title: literalText(sourceValues.get("title")) ?? "",
          url: literalText(sourceValues.get("url")) ?? "",
        };
      });
      records.push({
        id,
        prompt: literalText(values.get("prompt")) ?? "",
        essentialConceptIds: recordIds(values.get("essentialConcepts")),
        optionalConceptIds: recordIds(values.get("optionalConcepts")),
        misconceptionIds: recordIds(values.get("misconceptions")),
        sources,
        sourceIds: arrayStrings(values.get("sourceIds")),
        lessonIds: arrayStrings(values.get("lessonIds")),
        file,
      });
    }
  });
  return records;
}

function decodeQuestionRecords(root: string): DecodeQuestionRecord[] {
  const file = "features/decode-the-label/content/decode-the-label-content.ts";
  const tree = ast(root, file);
  const records: DecodeQuestionRecord[] = [];
  visit(tree, (node) => {
    if (!ts.isVariableDeclaration(node) || node.name.getText(tree) !== "decodeLabelQuestions")
      return;
    for (const entry of objectArray(node.initializer)) {
      const values = objectValues(entry);
      const id = literalText(values.get("id"));
      if (!id) continue;
      records.push({
        id,
        prompt: literalText(values.get("prompt")) ?? literalText(values.get("question")) ?? "",
        optionIds: recordIds(values.get("options") ?? values.get("choices")),
        correctOptionId:
          literalText(values.get("correctOptionId")) ??
          literalText(values.get("correctChoiceId")) ??
          literalText(values.get("correctAnswer")) ??
          "",
        sourceIds: arrayStrings(values.get("sourceIds")),
        assetPaths: arrayStrings(values.get("assetPaths")),
        file,
      });
    }
  });
  return records;
}

function resourceRecords(root: string): ResourceRecord[] {
  const file = qualityConfig.sourceFiles.resources;
  const tree = ast(root, file);
  const records: ResourceRecord[] = [];
  visit(tree, (node) => {
    if (!ts.isVariableDeclaration(node) || node.name.getText(tree) !== "type2DiabetesResources")
      return;
    for (const entry of objectArray(node.initializer)) {
      const values = objectValues(entry);
      const id = literalText(values.get("id"));
      if (!id) continue;
      records.push({
        id,
        title: literalText(values.get("title")) ?? "",
        organization: literalText(values.get("organization")) ?? "",
        url: literalText(values.get("url")) ?? "",
        status: literalText(values.get("status")) ?? "",
        file,
      });
    }
  });
  return records;
}

function splitSqlValues(source: string) {
  const values: string[] = [];
  let start = 0;
  let depth = 0;
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "'") {
      if (quoted && source[index + 1] === "'") index += 1;
      else quoted = !quoted;
    } else if (!quoted && char === "(") depth += 1;
    else if (!quoted && char === ")") depth -= 1;
    else if (!quoted && depth === 0 && char === ",") {
      values.push(source.slice(start, index).trim());
      start = index + 1;
    }
  }
  values.push(source.slice(start).trim());
  return values;
}

function sqlScalar(value: string): string | number | null {
  const castless = value.replace(/::[a-z0-9_]+$/i, "").trim();
  if (/^null$/i.test(castless)) return null;
  if (/^-?\d+$/.test(castless)) return Number(castless);
  const match = castless.match(/^'([\s\S]*)'$/);
  return match ? match[1]!.replace(/''/g, "'") : castless;
}

function sqlInsertRecords(root: string): CurriculumRecord[] {
  const files = [
    ...filesUnder(root, ["supabase/migrations"], [".sql"]),
    ...filesUnder(root, ["supabase/seed/content"], [".sql"]),
  ];
  const current = new Map<string, CurriculumRecord>();
  const tableKinds = {
    journeys: "journey",
    lessons: "lesson",
    journey_lessons: "journey-lesson",
    activities: "activity",
  } as const;
  for (const file of files) {
    const source = read(root, file);
    const pattern =
      /insert\s+into\s+public\.(journeys|lessons|journey_lessons|activities)\s*\(([\s\S]*?)\)\s*values\s*\(/gi;
    for (const match of source.matchAll(pattern)) {
      const table = match[1] as keyof typeof tableKinds;
      const columns = match[2]!.split(",").map((column) => column.trim());
      const valueStart = match.index! + match[0].length;
      let quoted = false;
      let depth = 1;
      let end = valueStart;
      for (; end < source.length && depth > 0; end += 1) {
        const char = source[end];
        if (char === "'") {
          if (quoted && source[end + 1] === "'") end += 1;
          else quoted = !quoted;
        } else if (!quoted && char === "(") depth += 1;
        else if (!quoted && char === ")") depth -= 1;
      }
      const rawValues = splitSqlValues(source.slice(valueStart, end - 1)).map(sqlScalar);
      if (rawValues.length !== columns.length) continue;
      const row = Object.fromEntries(columns.map((column, index) => [column, rawValues[index]]));
      if (typeof row.id !== "string") continue;
      const record: CurriculumRecord = {
        id: row.id,
        kind: tableKinds[table],
        status: typeof row.status === "string" ? row.status : "",
        ...(typeof row.journey_id === "string" ? { journeyId: row.journey_id } : {}),
        ...(typeof row.lesson_id === "string" ? { lessonId: row.lesson_id } : {}),
        ...(typeof row.prerequisite_journey_lesson_id === "string"
          ? { prerequisiteId: row.prerequisite_journey_lesson_id }
          : {}),
        ...(typeof row.day_number === "number" ? { dayNumber: row.day_number } : {}),
        ...(typeof row.display_order === "number" ? { displayOrder: row.display_order } : {}),
        ...(typeof row.reviewed_by === "string" ? { reviewedBy: row.reviewed_by } : {}),
        ...(typeof row.reviewed_at === "string" ? { reviewedAt: row.reviewed_at } : {}),
        ...(typeof row.published_at === "string" ? { publishedAt: row.published_at } : {}),
        ...(typeof row.content_blocks === "string"
          ? {
              activityIds: (() => {
                try {
                  const blocks = JSON.parse(row.content_blocks) as Array<{
                    type?: string;
                    activity_id?: string;
                  }>;
                  return blocks
                    .filter(({ type, activity_id }) => type === "activity" && activity_id)
                    .map(({ activity_id }) => activity_id!);
                } catch {
                  return [];
                }
              })(),
            }
          : {}),
        file,
      };
      current.set(`${record.kind}:${record.id}`, record);
    }
  }
  return [...current.values()];
}

function productionCopyIssues(root: string): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const files = filesUnder(
    root,
    [
      "content",
      "features/glossary/content",
      "features/mythbusters/content",
      "features/explain-it-back/content",
      "features/decode-the-label/content",
    ],
    [".ts", ".tsx", ".json"],
  );
  for (const file of files) {
    const source = read(root, file);
    issues.push(...validateUserFacingText([{ id: file, text: source, file }]));
  }
  return issues;
}

function conceptRelationships(root: string): ContentRelationshipRecord[] {
  const file = "features/cohesion/content/concept-registry.ts";
  const tree = ast(root, file);
  const records: ContentRelationshipRecord[] = [];
  const relationshipFields = [
    "lessonIds",
    "glossaryIds",
    "mythCheckIds",
    "explainItBackIds",
    "resourceIds",
    "storyIds",
    "decodeTheLabelIds",
    "approvedSourceIds",
  ];
  visit(tree, (node) => {
    if (!ts.isVariableDeclaration(node) || node.name.getText(tree) !== "conceptRegistry") return;
    for (const entry of objectArray(node.initializer)) {
      const values = objectValues(entry);
      const ownerId = literalText(values.get("id"));
      if (!ownerId) continue;
      for (const field of relationshipFields) {
        if (!values.has(field)) continue;
        records.push({ ownerId, field, targetIds: arrayStrings(values.get(field)), file });
      }
    }
  });
  return records;
}

export function contentIntegrityInventory(root: string) {
  const glossary = glossaryRecords(root);
  const glossarySourceRecords = glossarySources(root);
  const mythSourceRecords = mythSources(root);
  const resources = resourceRecords(root);
  const resourceSourceRecords = resourceSources(root);
  const myths = mythReferences(root);
  const explain = explainChallengeRecords(root);
  const decode = decodeQuestionRecords(root);
  const curriculum = sqlInsertRecords(root);
  const collections = collectionIds(root);
  const publishedLessons = curriculum.filter(
    ({ kind, status }) => kind === "lesson" && status === "published",
  ).length;
  return {
    sourceRecords:
      glossarySourceRecords.length + mythSourceRecords.length + resourceSourceRecords.length,
    glossarySourceRecords: glossarySourceRecords.length,
    mythSourceRecords: mythSourceRecords.length,
    resourceSourceRecords: resourceSourceRecords.length,
    glossaryEntries: glossary.length,
    mythItems: myths.length,
    explainChallenges: explain.length,
    decodeQuestions: decode.length,
    resources: resources.length,
    journeys: curriculum.filter(({ kind }) => kind === "journey").length,
    lessons: curriculum.filter(({ kind }) => kind === "lesson").length,
    journeyMappings: curriculum.filter(({ kind }) => kind === "journey-lesson").length,
    activities: curriculum.filter(({ kind }) => kind === "activity").length,
    stories: collections.filter(({ namespace }) => namespace === "story").length,
    caregiverModules: collections.filter(({ namespace }) => namespace === "caregiver-module")
      .length,
    searchEntries: 8 + 7 + glossary.length + 4 + resources.length + 5 + publishedLessons,
    allowlistEntries: qualityAllowlist.length,
  };
}

function collectionIds(root: string): Array<{ namespace: string; id: string; file: string }> {
  const found: Array<{ namespace: string; id: string; file: string }> = [];
  const specs = [
    ["myth", "features/mythbusters/content/myth-check-cards.ts", /\bcard\(\s*["']([^"']+)["']/g],
    [
      "decode-label-question",
      "features/decode-the-label/content/decode-the-label-content.ts",
      /\bid:\s*["'](DTL-Q\d+)["']/g,
    ],
    [
      "explain-challenge",
      "features/explain-it-back/content/explain-it-back-content.ts",
      /^\s{4}id:\s*["']([a-z0-9-]+)["']/gm,
    ],
    [
      "caregiver-module",
      "features/caregiver/content/caregiver-module-registry.ts",
      /id:\s*(caregiverModule\d+)\.id/g,
    ],
  ] as const;
  for (const [namespace, file, pattern] of specs)
    for (const match of read(root, file).matchAll(pattern))
      found.push({ namespace, id: match[1]!, file });
  for (const file of filesUnder(root, ["features/stories/content"], [".ts"])) {
    const id = read(root, file).match(/\bid:\s*["']([a-z0-9-]+)["']/)?.[1];
    if (id) found.push({ namespace: "story", id, file });
  }
  return found;
}

function checkCollections(root: string): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const ids = collectionIds(root);
  for (const namespace of new Set(ids.map(({ namespace }) => namespace))) {
    for (const duplicate of duplicates(
      ids
        .filter((item) => item.namespace === namespace)
        .map(({ id, file }) => ({ value: id, file, id })),
    ))
      issues.push({
        check: "content",
        severity: "error",
        code: "CONTENT_ID_DUPLICATE",
        message: `${namespace} ID "${duplicate.duplicate.id}" is duplicated.`,
        file: duplicate.duplicate.file,
        contentId: duplicate.duplicate.id,
      });
  }
  const searchFile = "features/universal-search/content/search-sources.ts";
  const searchSource = read(root, searchFile);
  if (/\b(?:title|description):\s*["']\s*["']/.test(searchSource))
    issues.push({
      check: "content",
      severity: "error",
      code: "SEARCH_CONTENT_EMPTY",
      message: "A search document has an empty required field.",
      file: searchFile,
    });
  const slugNamespaces = [
    filesUnder(root, ["features/stories/content"], [".ts"]),
    filesUnder(root, ["features/caregiver/content"], [".ts"]).filter((file) =>
      /caregiver-module-\d+\.ts$/.test(file),
    ),
  ];
  for (const slugFiles of slugNamespaces) {
    const slugs: Array<{ value: string; file: string }> = [];
    for (const file of slugFiles) {
      const source = read(root, file);
      for (const match of source.matchAll(/\bslug:\s*["']([^"']*)["']/g)) {
        const value = match[1]!;
        slugs.push({ value, file });
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
          issues.push({
            check: "content",
            severity: "error",
            code: "SLUG_INVALID",
            message: `Content slug "${value}" is not URL-safe.`,
            file,
            path: value,
          });
      }
    }
    for (const duplicate of duplicates(slugs))
      issues.push({
        check: "content",
        severity: "error",
        code: "SLUG_DUPLICATE",
        message: `Content slug "${duplicate.duplicate.value}" is duplicated within its routed content system.`,
        file: duplicate.duplicate.file,
        path: duplicate.duplicate.value,
      });
  }
  return issues;
}

export async function checkContentIntegrity(context: QualityContext): Promise<QualityCheckResult> {
  const glossarySourceRecords = glossarySources(context.root);
  const mythSourceRecords = mythSources(context.root);
  const resourceSourceRecords = resourceSources(context.root);
  const curriculumRecords = sqlInsertRecords(context.root);
  const lessonIds = new Set(
    curriculumRecords.filter(({ kind }) => kind === "lesson").map(({ id }) => id),
  );
  const resources = resourceRecords(context.root);
  const glossary = glossaryRecords(context.root);
  const explain = explainChallengeRecords(context.root);
  const myths = mythReferences(context.root);
  const collections = collectionIds(context.root);
  const issues = [
    ...sourceIssues(
      [...glossarySourceRecords, ...mythSourceRecords, ...resourceSourceRecords],
      context.now,
    ),
    ...validateGlossaryRecords(glossary, glossarySourceRecords),
    ...validateExplainChallenges(
      explain,
      lessonIds,
      new Set(mythSourceRecords.map(({ id }) => id)),
    ),
    ...validateDecodeQuestions(
      decodeQuestionRecords(context.root),
      new Set(mythSourceRecords.map(({ id }) => id)),
      (path) => existsSync(join(context.root, path.replace(/^\//, "public/"))),
    ),
    ...validateResources(resources, () => false),
    ...validateCurriculumGraph(curriculumRecords, context.now),
    ...validateContentRelationships(conceptRelationships(context.root), {
      lessonIds,
      glossaryIds: new Set(glossary.map(({ id }) => id)),
      mythCheckIds: new Set(myths.map(({ id }) => id)),
      explainItBackIds: new Set(explain.map(({ id }) => id)),
      resourceIds: new Set(resources.map(({ id }) => id)),
      storyIds: new Set(
        collections.filter(({ namespace }) => namespace === "story").map(({ id }) => id),
      ),
      decodeTheLabelIds: new Set(["decode-the-label"]),
      approvedSourceIds: new Set(mythSourceRecords.map(({ id }) => id)),
    }),
    ...validateOrphanedContent(
      curriculumRecords
        .filter(({ kind, status }) => kind === "lesson" && status === "published")
        .map(({ id, file }) => ({ id, file })),
      new Set(
        curriculumRecords
          .filter(({ kind }) => kind === "journey-lesson")
          .flatMap(({ lessonId }) => (lessonId ? [lessonId] : [])),
      ),
    ),
    ...validateAllowlist(qualityAllowlist),
    ...productionCopyIssues(context.root),
    ...checkCollections(context.root),
  ];
  const usedMythIds = new Set<string>();
  const mythReferenceRecords = mythReferences(context.root);
  issues.push(...validateSourceReferences(mythReferenceRecords, mythSourceRecords));
  for (const reference of mythReferenceRecords) {
    for (const id of reference.sourceIds) {
      usedMythIds.add(id);
    }
  }
  for (const source of mythSourceRecords)
    if (!usedMythIds.has(source.id) && !allowed("ORPHAN_CONTENT", `source:${source.id}`))
      issues.push({
        check: "content",
        severity: "warning",
        code: "ORPHAN_CONTENT",
        message: `Approved source ${source.id} is not referenced by Myth Check content.`,
        file: source.file,
        contentId: source.id,
      });
  return { name: "content", label: "Sources / glossary / content", issues };
}
