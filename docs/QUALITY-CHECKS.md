# Internal quality checks

Run `npm run quality:check` for the deterministic Health Decoded integrity suite. It inspects repository content only: it does not query Supabase, read user data, call an AI provider, or crawl external websites.

The suite derives App Router pages from `app/`, dynamic lesson values from the lesson player, and story/caregiver destinations from their repository registries. It validates static internal destinations used by links, navigation, onboarding, search, and recommendation configuration. It also checks lesson ordering, source IDs and HTTPS URL syntax, source freshness, glossary uniqueness and relationships, content IDs, local image files and accessible alt contracts. Existing deterministic AI, Explain It Back, lesson, caregiver, story, and resource regression tests are composed into the gate.

An **ERROR** is a confident structural defect and makes the command exit 1. A **WARNING** identifies review work, such as stale source metadata or intentional orphan content, and does not fail by default. Source metadata older than 365 days is labeled `SOURCE_REVIEW_STALE`; this means “needs review,” not “medically invalid.” Missing, invalid, and future dates are reported separately.

Use `npm run quality:check -- --json` for machine-readable CI output. Smaller local entry points are `quality:routes`, `quality:sources`, `quality:images`, and `quality:ai`. Run `npm run test:quality` when changing the checkers.

To add a checker, return the shared `QualityCheckResult` shape and register it in `scripts/quality/run-quality-check.mts`. Keep checks deterministic, actionable, and independent of production services. Exact legitimate exceptions belong in `scripts/quality/quality.config.mts` with a rule, exact target, and reason; broad suppressions are unsupported.

The primary command intentionally does not check live external-link availability, make live model calls, launch a browser, run a production build, or inspect production/user data. Those operations are slower, nondeterministic, or outside an internal repository integrity check.
