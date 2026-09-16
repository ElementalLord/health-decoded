# Built-in diabetes knowledge

Gemini interprets the original question and conversation, selects evidence from the
bundled source bank, and synthesizes an explanation in its own words. The normal
answer path does not use exact-question dispatch, hand-written intent classification,
or keyword-based answer rejection. Question examples are not a required wording.

The bank contains 142 diabetes topic explanations with 199 question examples and
provenance links to 74 authoritative pages, plus core reference summaries and relevant
medical glossary definitions. All topic explanations are included regardless of how
the question is phrased. Links document provenance and are not fetched at runtime.
Content was checked against the listed sources on 2026-09-15.

`diabetesSourceBank` gives the model the full topic bank and additional references in
one generation call, deduplicated by source ID. The bank is bounded to 116,000 characters
with a 128,000-character provider prompt limit to leave room for the question and
conversation. Tests confirm every current topic fits, including maximum history.

The prompt instructs Gemini to interpret informal wording and typos, resolve follow-ups,
choose supporting entries, combine their facts, and directly answer the user’s intent.
The model chooses one to three source IDs. Application validation checks JSON format,
real source IDs, plain-text output, and medical safety. It does not require the model
to echo keywords, a particular opening, or specific evidence sentences. These checks
cannot prove the clinical correctness or relevance of every generated response.

Web search is an extension only after a valid knowledge response reports insufficient
evidence. Current approvals, recalls, prices, local services, and breaking research
must not be inferred from stale content. Provider errors use the local fallback; its
legacy retrieval and question heuristics apply only during outages. Static fallbacks
have less ability to understand language than Gemini. Fallback citations deduplicate
shared source URLs and comply with the browser event schema.

When adding content, verify each claim against its source and avoid choosing personal
treatments or doses. Run `npm run test:ai`, `npm run typecheck`, and `npm run quality:ai`.
Tests cover full-bank availability, generated paraphrases without keyword overlap,
citations, safety, provider failure, fallback questions, and browser event validation.
Live semantic behavior and the percentage of questions needing search remain unmeasured.

## Regression verification, 2026-09-15

The AI suite passes 145 tests, including provider exceptions, invalid JSON, invented
and duplicate IDs, uncited answers, unsafe treatment output, timeout/configuration/quota
failures, exhausted budgets, and optional progress-write errors. Looped chat checks
cover 199 common question fallbacks, generation for all 142 topic cards, and four
short follow-ups. Emitted events are validated against the browser schema.

Provider exceptions now use the evidence fallback. The server sends completion before
waiting for optional progress recording, and the client finishes when completion is
received. Slow or failed database writes cannot hold a completed answer open.

Security passes 27 tests; Explain It Back passes 15. Deterministic evaluations report
156 passes and 10 advanced Explain It Back cases requiring live/human review, out of
166 cases. Type, lint, and AI/security quality checks pass. These are offline and
mocked-provider checks, not a live Gemini semantic assessment or browser layout test.

Gemini may return `answerKind: conversation` with no citations for personal-identity
or social responses that need no medical evidence. Factual education still requires
real source IDs. Unknown names must not be inferred from glossary entries. During
outages, personal diagnosis questions acknowledge that chat cannot determine a
diagnosis rather than returning a definition; personal-identity fallbacks omit
medical citations. Diagnosis detection distinguishes “do I have” from “do I have to”.
