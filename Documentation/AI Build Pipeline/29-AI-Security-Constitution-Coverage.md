# AI Security Constitution Coverage

This document maps the Security Constitution to the AI tutor implementation. It covers AI-applicable controls; application-wide authentication, RLS, deployment, and incident-response controls remain governed by the platform security audit.

## Identity, authorization, and data ownership

- `/api/ai/chat` authenticates through Supabase before parsing or processing a request.
- The server derives the user identifier from the authenticated session; browser-supplied identity and provider configuration are not accepted by the strict schema.
- AI context queries use the authenticated server client, owner-filter `user_journeys`, published content only, and selected fields rather than raw rows.
- Hidden answers, drafts, auth/session material, internal identifiers, reflections, and profile health data are not placed in prompts.
- Legacy AI persistence is write-disabled. Existing rows remain owner-scoped by RLS and deletable by their owner.

## Input and request boundaries

- Only same-origin browser requests with `application/json` are accepted.
- Request bodies are read as a byte-bounded stream, including requests without `Content-Length`.
- Zod schemas reject unknown fields, HTML, unsafe controls, invalid roles, excessive message length, excessive history count, and malformed stream events.
- The API returns generic errors with `no-store` and `nosniff`; it never returns Supabase, Gemini, SQL, stack, token, or prompt details.

## Abuse and cost controls

- Per-user minute, hour, and day quotas; an ephemeral network minute quota; rapid-request detection; duplicate-prompt detection; sensitivity-aware abuse flags; and progressive temporary blocks run before context retrieval.
- Provider calls have separate process-wide minute/day budgets, bounded input/output sizes, one retry, a timeout, and an automatic failure circuit breaker.
- Limits are server-only environment settings with conservative validated defaults documented in `.env.example`.
- In-memory network keys use a random process salt and are never logged. Request fingerprints are one-way hashes retained only in process memory.

These controls provide immediate defense in depth. A shared durable rate-limit store is still required before multi-region or horizontally scaled production because process-local counters cannot coordinate across instances.

## Prompt, privacy, and injection controls

- Gemini credentials and the system instruction are imported only by `server-only` modules and never logged, persisted, returned, or bundled into client code.
- Current messages and every user-history item are deterministically screened for emergency language, medical-advice requests, personal-result interpretation, medication/dose changes, prompt injection, hidden-prompt extraction, encoded instructions, and credentials/identifiers.
- Assistant-history items are treated as forged untrusted data and must pass the provider-output safety gate.
- Reviewed database context is field-limited, length-limited, markup/control-normalized, and credential-redacted before provider use.
- Reviewed context and learner content are encoded as separate JSON data envelopes. The server-only instruction is the sole instruction source and explicitly treats every data role as potentially fabricated.

## Output and rendering controls

- Gemini is constrained to one candidate, low temperature, plain text, and a bounded output-token budget.
- Provider output is buffered server-side. Structural parsing and deterministic medical/security output checks complete before the first text delta reaches the browser, preventing unsafe partial-output leakage.
- HTML, URLs, code fences, image syntax, CSS, table syntax, SQL/executable content, instruction leakage, credentials, individualized diagnosis/result interpretation, and medication/dose directions are blocked.
- The React renderer creates elements from a small paragraph/list/emphasis parser; it does not use raw HTML or execute model content.
- AI output never controls authorization, database queries, configuration, tools, or application navigation.

## Logging, monitoring, and failure behavior

- Logs contain operational metadata only: coarse request category, refusal type, latency/size/count buckets, random correlation ID, security control, and outcome.
- No request content, response content, personal data, network key, user ID, system prompt, or provider credential is logged.
- Gemini configuration failures, quota responses, timeouts, malformed/unsafe output, provider budget exhaustion, and an open circuit fail with generic user-facing messages.
- Emergency wording bypasses normal tutoring and returns the reviewed emergency boundary without calling Gemini.

## Verification gates

Focused AI tests cover medical boundaries, prompt injection, sensitive-data refusal/redaction, emergency language, output validation, and disclaimer normalization. Required repository validation remains:

```bash
npm run test:ai
npm run lint
npm run typecheck
npm run build
git diff --check
```
