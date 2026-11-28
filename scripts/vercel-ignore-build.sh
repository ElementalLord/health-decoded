#!/usr/bin/env bash
# Vercel "Ignored Build Step" (wired up via `ignoreCommand` in vercel.json).
# Exit 0 = skip this build, exit 1 = build it.
#
# Production (main) always builds. Preview builds are skipped when:
#   - the commit message is marked WIP, e.g. "wip:", "[wip]", "[skip preview]", "[skip vercel]"
#   - the commit changes only docs/tests/CI files, which cannot change the deployed app
set -u

if [ "${VERCEL_ENV:-}" = "production" ]; then
  echo "Production build: always build."
  exit 1
fi

# Only the subject line counts, so a body that merely mentions a marker doesn't skip.
msg="$(printf '%s\n' "${VERCEL_GIT_COMMIT_MESSAGE:-}" | head -n 1)"
if printf '%s' "$msg" | grep -Eiq '^wip([:( ]|$)|\[(wip|skip preview|skip vercel)\]'; then
  echo "Preview skipped: commit is marked WIP / skip preview."
  exit 0
fi

base="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$base" ] || ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  # No previous build to diff against (first push of a branch, or shallow clone).
  echo "No previous SHA to compare: building."
  exit 1
fi

if git diff --quiet "$base" HEAD -- . \
  ':(exclude)Documentation/**' ':(exclude)docs/**' ':(exclude)**/*.md' \
  ':(exclude)tests/**' ':(exclude).github/**' ':(exclude).agents/**'; then
  echo "Preview skipped: only docs/tests/CI files changed since $base."
  exit 0
fi

echo "App files changed: building preview."
exit 1
