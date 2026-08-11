# Health Decoded adversarial security audit — 2026-08-11

## Scope and standard

This was a prototype-focused adversarial review using the relevant authentication, access-control,
validation, output-encoding, session, secrets, logging, HTTP, and abuse-resistance objectives from
OWASP ASVS 5.0. It is not a compliance certification or a penetration-test attestation.

No production or unidentified remote Supabase project was queried. The configured `.env.local`
target was deliberately not used because it could not be proven to be disposable. After Docker
became available, a completely fresh local Supabase database was reconstructed from all 60
migrations and eight seed files. Real PostgreSQL-role and publishable-client/PostgREST A-to-B
attacks then passed against synthetic accounts. SQL fixtures roll back; Auth/PostgREST fixtures are
deleted after trusted state verification.

## Inventory

- Tables (22): `profiles`, `user_settings`, `journeys`, `lessons`, `journey_lessons`, `activities`,
  `activity_answer_keys`, `medications`, `patient_stories`, `caregiver_content`, `user_journeys`,
  `lesson_progress`, `activity_progress`, `confidence_check_ins`, `reflection_entries`,
  `ai_conversations`, `ai_messages`, `user_milestones`, `user_learning_streaks`,
  `user_learning_activity_days`, `user_next_step_preferences`, `user_spaced_review_state`.
- Private/user-owned tables (14): `profiles`, `user_settings`, `user_journeys`, `lesson_progress`,
  `activity_progress`, `confidence_check_ins`, `reflection_entries`, `ai_conversations`,
  `ai_messages`, `user_milestones`, `user_learning_streaks`, `user_learning_activity_days`,
  `user_next_step_preferences`, `user_spaced_review_state`.
- Reviewed educational content tables (7): `journeys`, `lessons`, `journey_lessons`, `activities`,
  `medications`, `patient_stories`, `caregiver_content`. They are intentionally readable only to
  authenticated users when published. `activity_answer_keys` is neither public nor user-readable.
- Views: none.
- Current Postgres functions (19): `set_updated_at`, `handle_new_user`,
  `initialize_current_user_journey`, `upsert_confidence_check_in`,
  `begin_or_resume_current_lesson`, `save_lesson_block_position`,
  `evaluate_match_pair_activity`, `complete_current_lesson`, `complete_onboarding`,
  `initialize_learning_streak`, `record_learning_activity`, `dismiss_next_step`,
  `acknowledge_learning_streak_notice`, `initialize_spaced_review_from_lessons`,
  `record_explain_it_back_learning`, `record_spaced_review_result`,
  `record_spaced_review_example`, `record_spaced_review_prompt`, and
  `snooze_spaced_review_prompts`.
- SECURITY DEFINER functions: 18 current functions; every historical definition in migrations was
  checked and uses `set search_path = ''`. The only non-definer function is the trigger helper
  `set_updated_at`.
- Server Actions: 33 exported actions in 24 files. Mutations derive the user via `auth.getUser()`
  or call owner-derived RPCs; lesson evaluators authenticate and validate strict controlled input.
- Route Handlers: `/api/ai/chat`, `/api/explain-it-back/evaluate`, `/api/search`, and
  `/auth/callback`.
- Active dynamic page parameters: lesson day, story slug, caregiver slug, and caregiver module
  slug. One unused dynamic API directory exists without a Route Handler.
- Browser Supabase paths: one browser-client factory using the publishable credential; no Client
  Component directly calls `.from()` or `.rpc()`. A malicious user can still instantiate an
  equivalent browser client, which is why the database attack suite targets that boundary.
- Privileged Supabase clients/service-role uses: none.
- Raw HTML/Markdown: no `dangerouslySetInnerHTML`, `innerHTML` assignment, `document.write`, raw
  HTML plugin, or general Markdown renderer. AI output is parsed into React text nodes with limited
  list/emphasis syntax. Citation URLs come only from the checked-in source registry.
- Environment variables: publishable Supabase URL/key are public by design. Gemini and AI-abuse
  configuration are server-only. No `NEXT_PUBLIC_` server secret was found.
- Logging: the server logger emits operational metadata and redacts keys matching tokens, cookies,
  authorization, messages, prompts, reflections, health, medical, email, passwords, and secrets.
- Appointment Prep: React mounted-session state only; no Supabase, AI, analytics, logging, or
  browser-storage path was found.

## Security matrix

| Resource | Read path | Write path | Final boundary | A→A | A→B / anon | Verification |
|---|---|---|---|---|---|---|
| Profile/settings | Server query/actions | explicit field updates/onboarding RPC | RLS + `auth.uid()` + column grant | allow | deny | live SQL + PostgREST pass |
| Journey/progress | Server query | owner-derived SECURITY DEFINER RPCs | RLS; no direct progress writes | allow | deny | live SQL + PostgREST pass |
| Reflections | server action | explicit insert/update/delete | transitive owner RLS | allow | deny | live metadata/RLS gate pass |
| Spaced Review | server query | controlled RPCs | RLS + `auth.uid()` + due-state transition | allow | deny | live SQL + PostgREST pass |
| Milestones/streak | server query/actions | own-row insert or RPC | RLS + `auth.uid()` | allow | deny | live SQL pass |
| AI legacy tables | no active product path | no browser writes | RLS + revoked writes | deny/unused | deny | live metadata gate pass |
| Published content | authenticated server query | no browser writes | published-only RLS | allow published | anon deny | live metadata gate pass |
| Answer keys | evaluator RPC only | seed/admin only | all user grants revoked | evaluator only | deny | live grant gate pass |
| AI/evaluator APIs | authenticated no-store POST | ephemeral provider request | `auth.getUser`, origin, JSON, bounded schema, limiter | allow | deny | deterministic tests |
| Search API | authenticated no-store POST | none | auth, same-origin, JSON, 1 KiB bound | allow | deny | deterministic tests |

## Findings and fixes

### Fresh-database reconstruction

Supabase executes all migrations before seed files. The Day 1 journey, lesson
`20000000-0000-0000-0000-000000000001`, and journey assignment existed only in seed files, but
`20260715000003_day_one_activity_and_day_two.sql` inserted activity
`40000000-0000-0000-0000-000000000002` for that lesson during the migration phase. The same absent
baseline would then have broken Day 2's journey assignment and prerequisite. Migration
`20260712000009_baseline_curriculum_dependencies.sql` now creates the three exact idempotent seed
parents before dependent data migrations. All remaining lesson/activity/journey foreign-key paths
were traced; Days 2–14 create their parents before children. A fresh 60-migration reset and all
eight seeds passed without changing or weakening content or constraints.

### P0

No P0 was demonstrated by the live local RLS or PostgREST attacks.

### P1 fixed

1. **Spaced Review fresh-token replay.** An authenticated browser could call
   `record_spaced_review_result` repeatedly with new UUIDs and `got_it`, incrementing its own
   successful-review count before the database-controlled due date. The RPC now locks the
   owner-derived row, validates controlled IDs/enums/nulls, accepts only a currently due review,
   and returns `false` for duplicate or early replay. It still cannot accept or target a user ID.
2. **Known vulnerable Next.js/runtime dependencies.** The installed Next 15.5.20 was covered by
   high-severity Server Action, SSRF, cache-confusion, and endpoint-disclosure advisories. A
   reviewed non-force update moved Next to 15.5.23 and patched Hono, Undici, YAML, URI parsing,
   Nano ID, brace expansion, and related transitive packages. PostCSS was explicitly moved to
   8.5.26.

### Remaining P2

1. **Session-only achievement evidence is caller-asserted.** A user cannot affect another account,
   but can invoke milestone/streak events for its own account because several product events are
   intentionally local-only and have no durable server evidence. These records confer no role,
   content access, or authorization. A future trusted event-ingestion design is needed if integrity
   of self-awarded prototype recognition becomes security-sensitive.
2. **Remaining Sharp advisory.** `npm audit` reports two high advisories through Next's
   `sharp@0.34.5`. The automatic fix requires a breaking Next 16.3 upgrade, and Next 15 declares
   only Sharp `^0.34.3`. Reachability is reduced because the app has no upload or remote-image
   source and serves checked-in assets only. Upgrade Next/Sharp in a dedicated compatibility pass.
3. **Auth callback origin deployment assumption.** Redirect paths are strictly internal and the
   Supabase redirect allowlist provides another boundary, but callback URL construction relies on
   deployment-proxy sanitization of forwarded host/protocol headers. Confirm production proxy and
   Supabase allowlist configuration before testing.

### Remaining P3

- CSP is enforced only in production and retains `unsafe-inline` for Next hydration/current UI
  styles. No raw HTML rendering path was found. A nonce-based CSP can be evaluated later without
  destabilizing the prototype.

## Attack results

- A/B fixtures: synthetic names and unmistakable progress/Spaced Review values are created by the
  SQL and browser harnesses. SQL rolls back, while local Auth fixtures cascade-delete after checks.
- A→B profile read/write: attack implemented, including broad/explicit read, update, owner change,
  publishable-client/PostgREST access, and trusted post-attack value verification; **PASS**.
- A→B lesson-progress read/write: broad/explicit reads, update, delete, forged insert, and trusted
  post-attack verification; **PASS**.
- A→B Spaced Review read/write: explicit and broad reads, direct writes, valid A mutation,
  duplicate/early replay, bad challenge, bad verdict, PostgREST access, and trusted B-state
  verification; **PASS**.
- A→B milestone/streak: cross-owner reads denied in real SQL role context; **PASS**.
- Anonymous access/RPC: grant denials/RLS-empty results and protected RPC rejection; **PASS**.
- Expired/invalid JWT: direct PostgREST request rejected with HTTP 401; **PASS**.
- Server-action impersonation/mass assignment: strict schemas, explicit mutation objects, and
  session-derived IDs were deterministically tested. No action accepting an ownership user ID was
  found.
- Direct browser access: a real local Auth Account A session and publishable Supabase client attacked
  B through PostgREST; explicit and broad reads/writes plus RPC impersonation were denied; **PASS**.
- Forged Explain It Back content: unknown challenge and extra rubric fields rejected by strict
  server schema; authoritative challenge data is server-selected.
- XSS: AI markup input rejection and inert text rendering were tested; no raw HTML sink found.
- Redirects: internal path accepted; absolute, protocol-relative, slash/backslash, encoded-scheme,
  and JavaScript variants rejected.
- Rate limits: existing deterministic AI safety/reliability tests passed; endpoint authentication,
  origin, body bounds, validation, and limiter occur before provider invocation. No live provider
  load was generated.
- Session/cache: private API responses use `no-store`; server reads use verified sessions. Browser
  Back/account-switch behavior remains manual browser verification.
- Error leakage: routes return controlled codes/messages; raw database/provider errors are not
  returned. Existing fault-injection tests passed.
- Secrets: current tracked source and all Git blobs were scanned for high-confidence Gemini,
  Supabase secret/service-role, and JWT-like service-role patterns without printing values. No
  high-confidence credential was found; no rotation is indicated.

## Verification summary

- `npm run security:check`: PASS — 26/26 security tests plus deterministic security quality gate.
- `npm run security:db`: PASS — two pgTAP files plus the real local Auth/publishable-client
  PostgREST harness. B state was verified unchanged after mutation attacks.
- `npm run quality:check`: PASS — 8/8 quality categories.
- `npm test`: PASS — 559/559 existing tests.
- `npm run typecheck`: PASS.
- `npm run build`: PASS on Next 15.5.23 after allowing the configured Google font fetch. The build
  emitted non-blocking webpack cache-size warnings and logged controlled auth unavailability while
  prerendering without a request session.
- `git diff --check`: PASS.
- Dependency audit: reduced from 12 findings (9 high) to 2 high Sharp findings; no force/major
  upgrade applied.

## Remaining release actions

1. Manually verify A sign-in → sign-out → B sign-in → Back/refresh does not reveal A data.
2. Confirm deployed Supabase Auth redirect allowlist, proxy host sanitization, HTTPS cookie flags,
   HSTS, and production CSP response.
3. Deploy migrations `20260712000009_baseline_curriculum_dependencies.sql` and
   `20260811000001_security_hardening.sql` before external testing.

Protected UI/content changed: **NO**. Animation behavior changed: **NO**.
