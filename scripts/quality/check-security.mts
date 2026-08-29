import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

import type { QualityChecker, QualityIssue } from "./types.mts";

async function filesUnder(root: string, directory: string): Promise<string[]> {
  const base = join(root, directory);
  const entries = await readdir(base, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function issue(code: string, message: string, file?: string): QualityIssue {
  return { check: "security", code, message, severity: "error", ...(file ? { file } : {}) };
}

export const checkSecurity: QualityChecker = async ({ root }) => {
  const issues: QualityIssue[] = [];
  const sourceFiles = (
    await Promise.all(
      ["app", "components", "features", "lib", "services"].map((directory) =>
        filesUnder(root, directory),
      ),
    )
  )
    .flat()
    .filter((file) => /\.(?:ts|tsx|js|jsx|mts|mjs)$/.test(file));
  const migrations = (await filesUnder(root, "supabase/migrations")).filter((file) =>
    file.endsWith(".sql"),
  );

  for (const file of sourceFiles) {
    const source = await readFile(file, "utf8");
    const name = relative(root, file);
    if (/SUPABASE_(?:SERVICE_ROLE|SECRET)|service_role/i.test(source))
      issues.push(
        issue(
          "PRIVILEGED_SUPABASE_IN_SOURCE",
          "Privileged Supabase credentials are forbidden in application source.",
          name,
        ),
      );
    if (/NEXT_PUBLIC_(?:GEMINI|GOOGLE|DATABASE|SUPABASE_(?:SERVICE|SECRET))/i.test(source))
      issues.push(
        issue(
          "SERVER_SECRET_PUBLIC_PREFIX",
          "A server credential uses a browser-exposed NEXT_PUBLIC_ name.",
          name,
        ),
      );
    if (/dangerouslySetInnerHTML|\.innerHTML\s*=|document\.write\s*\(/.test(source))
      issues.push(
        issue(
          "RAW_HTML_RENDERING",
          "Raw HTML rendering requires a dedicated security review.",
          name,
        ),
      );
  }

  const combinedMigrations = (await Promise.all(migrations.map((file) => readFile(file, "utf8"))))
    .join("\n")
    .toLocaleLowerCase();
  const privateTables = [
    "profiles",
    "user_settings",
    "user_journeys",
    "lesson_progress",
    "activity_progress",
    "reflection_entries",
    "ai_conversations",
    "ai_messages",
    "user_milestones",
    "user_learning_streaks",
    "user_learning_activity_days",
    "user_next_step_preferences",
    "user_spaced_review_state",
  ];
  for (const table of privateTables) {
    if (!combinedMigrations.includes(`alter table public.${table} enable row level security`))
      issues.push(
        issue("RLS_MISSING", `Expected RLS enablement for private table public.${table}.`),
      );
  }

  const definerBlocks = combinedMigrations.split(/create(?: or replace)? function /).slice(1);
  for (const block of definerBlocks.filter((value) => value.includes("security definer"))) {
    const signature = block.slice(0, block.indexOf("\n")).trim();
    if (!/set search_path\s*=\s*''/.test(block))
      issues.push(
        issue(
          "UNSAFE_DEFINER_SEARCH_PATH",
          `SECURITY DEFINER ${signature} lacks an empty search_path.`,
        ),
      );
  }

  const redirects = await readFile(join(root, "lib/auth/redirects.ts"), "utf8");
  if (
    !redirects.includes('value.startsWith("//")') ||
    !redirects.includes("destination.origin ===")
  )
    issues.push(
      issue(
        "REDIRECT_GUARD_MISSING",
        "Authentication redirects must reject external origins.",
        "lib/auth/redirects.ts",
      ),
    );

  return { name: "security", label: "Security regression guard", issues };
};
