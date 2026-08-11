import { existsSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { qualityConfig } from "./quality.config.mts";
// @ts-expect-error -- Node's built-in TypeScript runner requires explicit extensions.
import { ast, filesUnder, literalText, propertyName, read, visit } from "./source-utils.mts";
import type { QualityCheckResult, QualityContext, QualityIssue } from "./types.mts";

function jsxAttribute(node: ts.JsxOpeningLikeElement, name: string) {
  return node.attributes.properties.find(
    (attribute): attribute is ts.JsxAttribute =>
      ts.isJsxAttribute(attribute) && attribute.name.getText() === name,
  );
}

function jsxValue(attribute: ts.JsxAttribute | undefined) {
  if (!attribute?.initializer) return null;
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
  return ts.isJsxExpression(attribute.initializer)
    ? literalText(attribute.initializer.expression)
    : null;
}

export async function checkImages(context: QualityContext): Promise<QualityCheckResult> {
  const issues: QualityIssue[] = [];
  const checkedPaths = new Set<string>();
  const verifyPath = (value: string, file: string) => {
    if (!value.startsWith("/") || checkedPaths.has(`${file}:${value}`)) return;
    checkedPaths.add(`${file}:${value}`);
    if (!existsSync(join(context.root, "public", value.slice(1))))
      issues.push({
        check: "images",
        severity: "error",
        code: "IMAGE_FILE_MISSING",
        message: `Local image "${value}" does not exist under public/.`,
        file,
        path: value,
      });
  };

  for (const file of filesUnder(context.root, qualityConfig.scanRoots, [".ts", ".tsx"])) {
    const tree = ast(context.root, file);
    visit(tree, (node) => {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(tree) === "button") {
        const hasName = Boolean(
          jsxAttribute(node.openingElement, "aria-label") ||
          jsxAttribute(node.openingElement, "aria-labelledby"),
        );
        const meaningfulText =
          node.children.some((child) => ts.isJsxText(child) && child.text.trim()) ||
          node.children.some((child) => ts.isJsxExpression(child) && Boolean(child.expression));
        const iconOnly = node.children.some(
          (child) =>
            ts.isJsxSelfClosingElement(child) &&
            /^[A-Z].*(?:Icon|Search|Menu|X|Chevron|Arrow)/.test(child.tagName.getText(tree)),
        );
        if (!hasName && !meaningfulText && iconOnly)
          issues.push({
            check: "images",
            severity: "error",
            code: "ICON_ACTION_NAME_MISSING",
            message: "Icon-only button has no statically discoverable accessible name.",
            file,
          });
      }
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(tree);
        if (tag === "Image" || tag === "img") {
          const src = jsxValue(jsxAttribute(node, "src"));
          const altAttribute = jsxAttribute(node, "alt");
          const alt = jsxValue(altAttribute);
          if (src !== null) {
            if (!src.trim())
              issues.push({
                check: "images",
                severity: "error",
                code: "IMAGE_SRC_EMPTY",
                message: `${tag} has an empty src.`,
                file,
              });
            else verifyPath(src, file);
          }
          if (
            !altAttribute ||
            (altAttribute.initializer &&
              ts.isJsxExpression(altAttribute.initializer) &&
              altAttribute.initializer.expression?.kind === ts.SyntaxKind.Identifier &&
              altAttribute.initializer.expression.getText(tree) === "undefined")
          )
            issues.push({
              check: "images",
              severity: "error",
              code: "IMAGE_ALT_MISSING",
              message: `${tag} has no accessible alt text contract.`,
              file,
            });
          else if (alt === "" && jsxValue(jsxAttribute(node, "aria-hidden")) !== "true")
            issues.push({
              check: "images",
              severity: "warning",
              code: "IMAGE_ALT_EMPTY_REVIEW",
              message: `${tag} uses empty alt text; confirm the image is genuinely decorative.`,
              file,
            });
        }
      }
      if (
        ts.isPropertyAssignment(node) &&
        ["imagePath", "image", "src"].includes(propertyName(node.name) ?? "")
      ) {
        const value = literalText(node.initializer);
        if (value?.startsWith("/")) verifyPath(value, file);
      }
    });
  }

  const decodeComponent = "features/decode-the-label/components/decode-the-label-experience.tsx";
  const decodeSource = read(context.root, decodeComponent);
  if (!/alt=["'][^"']{12,}["']/.test(decodeSource) || !/NutritionFacts/.test(decodeSource))
    issues.push({
      check: "images",
      severity: "error",
      code: "INTERACTIVE_IMAGE_ALTERNATIVE_MISSING",
      message:
        "Decode the Label must retain meaningful image text and a structured nutrition-facts alternative.",
      file: decodeComponent,
    });
  return { name: "images", label: "Images / accessibility", issues };
}
