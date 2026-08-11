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
          ["localhost", "127.0.0.1"].includes(url.hostname)
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
          severity: "warning",
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
            severity: "warning",
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
  const issues = [
    ...sourceIssues(
      [...glossarySourceRecords, ...mythSourceRecords, ...resourceSourceRecords],
      context.now,
    ),
    ...validateGlossaryRecords(glossaryRecords(context.root), glossarySourceRecords),
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
