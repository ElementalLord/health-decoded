import { existsSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { qualityConfig } from "./quality.config.mts";
// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { ast, filesUnder, literalText, propertyName, read, visit } from "./source-utils.mts";
import type { QualityCheckResult, QualityContext, QualityIssue } from "./types.mts";

export type RouteManifest = {
  staticRoutes: Set<string>;
  lessonDays: Set<number>;
  storySlugs: Set<string>;
  caregiverModuleSlugs: Set<string>;
};

export function buildRouteManifest(root: string): RouteManifest {
  const staticRoutes = new Set<string>();
  for (const file of filesUnder(root, ["app"], ["page.tsx", "page.ts"])) {
    const pieces = file
      .split("/")
      .slice(0, -1)
      .filter((piece) => !/^\(.+\)$/.test(piece));
    const route = `/${pieces.slice(1).join("/")}`.replace(/\/$/, "") || "/";
    if (!route.includes("[")) staticRoutes.add(route);
  }

  const player = read(root, "features/lessons/components/lesson-player.tsx");
  const lessonDays = new Set(
    [...player.matchAll(/lesson\.dayNumber === (\d+)/g)].map((match) => Number(match[1])),
  );
  const storySlugs = new Set<string>();
  for (const file of filesUnder(root, ["features/stories/content"], [".ts"])) {
    const source = read(root, file);
    for (const match of source.matchAll(/\bslug:\s*["']([a-z0-9-]+)["']/g))
      storySlugs.add(match[1]!);
  }
  const registry = read(root, "features/caregiver/content/caregiver-module-registry.ts");
  const caregiverModuleSlugs = new Set(
    [...registry.matchAll(/\/caregiver\/modules\/\$\{(caregiverModule\d+)\.slug\}/g)]
      .map((match) => {
        const moduleFile = `features/caregiver/content/${match[1]!.replace(/^caregiverModule(\d+)$/, "caregiver-module-$1")}.ts`;
        const slug = read(root, moduleFile).match(/\bslug:\s*["']([a-z0-9-]+)["']/)?.[1];
        return slug ?? "";
      })
      .filter(Boolean),
  );
  return { staticRoutes, lessonDays, storySlugs, caregiverModuleSlugs };
}

export function isValidInternalRoute(value: string, manifest: RouteManifest) {
  const path = value.split(/[?#]/, 1)[0] || "/";
  if (manifest.staticRoutes.has(path)) return true;
  const lesson = path.match(/^\/lessons\/([^/]+)$/);
  if (lesson) return /^\d+$/.test(lesson[1]!) && manifest.lessonDays.has(Number(lesson[1]));
  const story = path.match(/^\/stories\/([^/]+)$/);
  if (story) return manifest.storySlugs.has(story[1]!);
  const caregiverModule = path.match(/^\/caregiver\/modules\/([^/]+)$/);
  if (caregiverModule) return manifest.caregiverModuleSlugs.has(caregiverModule[1]!);
  return false;
}

type LinkCandidate = { value: string; file: string };

export function collectInternalLinks(root: string): LinkCandidate[] {
  const candidates: LinkCandidate[] = [];
  for (const file of filesUnder(root, qualityConfig.scanRoots, [".ts", ".tsx", ".mts"])) {
    const tree = ast(root, file);
    visit(tree, (node) => {
      if (ts.isJsxAttribute(node) && node.name.getText(tree) === "href") {
        const initializer = node.initializer;
        const value =
          initializer && ts.isStringLiteral(initializer)
            ? initializer.text
            : initializer && ts.isJsxExpression(initializer)
              ? literalText(initializer.expression)
              : null;
        if (value?.startsWith("/")) candidates.push({ value, file });
      }
      if (
        ts.isPropertyAssignment(node) &&
        ["href", "route", "destination"].includes(propertyName(node.name) ?? "")
      ) {
        const value = literalText(node.initializer);
        if (value?.startsWith("/")) candidates.push({ value, file });
      }
      if (
        ts.isCallExpression(node) &&
        ["push", "replace", "redirect"].includes(
          node.expression.getText(tree).split(".").at(-1) ?? "",
        )
      ) {
        const value = literalText(node.arguments[0]);
        if (value?.startsWith("/")) candidates.push({ value, file });
      }
    });
  }
  return candidates;
}

export async function checkRoutes(context: QualityContext): Promise<QualityCheckResult> {
  const manifest = buildRouteManifest(context.root);
  const issues: QualityIssue[] = [];
  if (!manifest.staticRoutes.size)
    issues.push({
      check: "routes",
      severity: "error",
      code: "ROUTE_MANIFEST_EMPTY",
      message: "No App Router pages were discovered.",
    });
  for (const { value, file } of collectInternalLinks(context.root)) {
    if (!isValidInternalRoute(value, manifest))
      issues.push({
        check: "routes",
        severity: "error",
        code: value.startsWith("/lessons/") ? "LESSON_LINK_INVALID" : "INTERNAL_LINK_NOT_FOUND",
        message: `Internal destination "${value}" does not resolve to a repository-backed route.`,
        file,
        path: value,
        suggestion: "Update the destination or restore the matching route/content record.",
      });
  }
  for (const day of manifest.lessonDays) {
    if (!Number.isInteger(day) || day < 1)
      issues.push({
        check: "routes",
        severity: "error",
        code: "LESSON_ID_INVALID",
        message: `Lesson day "${day}" is invalid.`,
        contentId: String(day),
      });
  }
  const ordered = [...manifest.lessonDays].sort((a, b) => a - b);
  for (let index = 0; index < ordered.length; index += 1) {
    if (ordered[index] !== index + 1)
      issues.push({
        check: "routes",
        severity: "error",
        code: "LESSON_ORDER_GAP",
        message: `Expected lesson day ${index + 1}, found ${ordered[index] ?? "none"}.`,
      });
  }
  if (!existsSync(join(context.root, "lib/routes.ts")))
    issues.push({
      check: "routes",
      severity: "warning",
      code: "NAVIGATION_REGISTRY_MISSING",
      message: "The application navigation registry was not found.",
    });
  return { name: "routes", label: "Routes / internal links", issues };
}
