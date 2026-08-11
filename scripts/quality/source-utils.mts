import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

export function read(root: string, file: string) {
  return readFileSync(join(root, file), "utf8");
}

export function filesUnder(
  root: string,
  directories: readonly string[],
  extensions: readonly string[],
) {
  const files: string[] = [];
  const visit = (absolute: string) => {
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
      const child = join(absolute, entry.name);
      if (entry.isDirectory()) visit(child);
      else if (extensions.some((extension) => entry.name.endsWith(extension))) {
        files.push(relative(root, child));
      }
    }
  };
  for (const directory of directories) {
    const absolute = join(root, directory);
    if (existsSync(absolute)) visit(absolute);
  }
  return files.sort();
}

export function ast(root: string, file: string) {
  const source = read(root, file);
  return ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

export function visit(node: ts.Node, callback: (node: ts.Node) => void) {
  callback(node);
  node.forEachChild((child) => visit(child, callback));
}

export function literalText(node: ts.Node | undefined): string | null {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

export function propertyName(node: ts.PropertyName | undefined) {
  return node && (ts.isIdentifier(node) || ts.isStringLiteral(node)) ? node.text : null;
}

export function normalizeKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
}

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function duplicates(values: readonly { value: string; file: string; id?: string }[]) {
  const seen = new Map<string, (typeof values)[number]>();
  const found: Array<{ first: (typeof values)[number]; duplicate: (typeof values)[number] }> = [];
  for (const item of values) {
    const key = normalizeKey(item.value);
    const first = seen.get(key);
    if (first) found.push({ first, duplicate: item });
    else seen.set(key, item);
  }
  return found;
}
