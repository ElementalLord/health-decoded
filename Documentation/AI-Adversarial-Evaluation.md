# AI Tutor and Explain It Back adversarial evaluation

## Audited architecture

AI Tutor uses the authenticated `POST /api/ai/chat` route, trusted-origin and JSON checks, a 16 KB body limit, strict request schemas, per-user/network rate limits, provider budget/circuit controls, server-side reviewed-context loading, and Gemini `gemini-3.1-flash-lite`. Context loading reads only the active published lesson plus the static glossary/reference registry; it does not read Appointment Prep, caregiver reflections, profile fields, Spaced Review history, or Explain It Back answers. Telemetry records only categorical metadata, size/count/duration buckets, and a correlation ID. Conversation text is visit-local in the client and is not persisted.

AI Tutor generation now uses schema-constrained JSON with `answer` and `sourceIds`. The server owns the retrieved source set and rejects the whole provider response for unknown, unretrieved, duplicate, missing, URL-shaped, or mixed forged source IDs, unsafe HTML/URL content, medication direction, diagnosis, personal-result interpretation, instruction leakage, or sensitive data. Only cited retrieved sources are sent to the existing source UI. When retrieval has no approved evidence, the provider is not called and the application returns a fixed evidence-insufficient response.

Explain It Back uses authenticated `POST /api/explain-it-back/evaluate`, the authoritative ten-challenge registry, strict challenge/mode/request schemas, a bounded body, the shared safety boundary, and Gemini structured output. The browser cannot submit a rubric. The model may return only covered/missing/contradiction IDs and flags plus its declared verdict; the application validates all IDs and independently derives the verdict. Duplicate or internally contradictory output is rejected rather than normalized. Feedback and sources are authored by the application.

Practice-mode mastery is recorded only after a validated `got_it`. Spaced Review is recorded only after a validated evaluated result with the required result token. Provider failure, malformed output, or a personal-medical classification cannot schedule or count a review. Raw learner explanations are sent ephemerally to the evaluator, fingerprinted for rate limiting, and are absent from database writes, analytics, logs, and review state.

## Evaluation architecture

`npm run ai:eval` runs offline with no Gemini, network, or production Supabase. The bank contains 105 AI Tutor cases and 60 Explain It Back cases (165 total). Of the Explain It Back cases, 50 use deterministic structured fixtures across all ten challenges; 10 semantic edge cases are explicitly marked for live/human review rather than being falsely “graded” by keyword logic.

The deterministic report lists ID, system, category, expected behavior, actual structural result, status, and criticality. Fast integrity tests are also included in the existing AI portion of `quality:check`. `npm run ai:eval:live` is separate, requires `GEMINI_API_KEY`, uses 20 synthetic calls at concurrency two, reports the model and timestamp, and never reads user or Supabase data.

## Findings and fixes

P0 findings fixed:

- The Tutor previously allowed stable model knowledge and returned unstructured prose, so source use could not be proven. Generation is now source-ID constrained and evidence insufficiency bypasses the model.
- Personal-result, medication-change, and urgent-symptom phrasings in the adversarial bank bypassed request classification. Generalized boundary regressions now cover those classes and recent user context.
- Source-policy injection variants bypassed the injection classifier. Source/citation override and forged-ID instructions are now blocked before generation; the output validator remains the final authority.
- `javascript:` output was not rejected by the provider text contract. Executable URL schemes are now rejected.
- A model-classified personal-medical Explain It Back response could previously reach normal grading/scheduling if request regexes missed it. It now returns the safety state before persistence.

P1 findings fixed:

- Explain It Back silently deduplicated IDs and normalized contradictory verdict/missing fields. Duplicate, inconsistent, unknown, off-topic/covered, and verdict-conflict structures now fail closed.

Remaining P2 / review items:

- Natural-language usefulness, analogy fairness, spelling tolerance, and whether every generated claim is semantically entailed by the retrieved summary remain live/human-review questions. They are not represented as deterministic passes.
- Retrieval is deliberately conservative. Specialized or current questions may receive an evidence-insufficient response until reviewed sources are added through the normal content process.

## Protected-scope confirmation

UI changed: NO. Animations changed: NO. Routes/navigation changed: NO. Lesson, caregiver, story, resource, glossary, Myth Check, Decode the Label, curriculum, and approved medical wording changed: NO. Raw learner responses newly persisted: NO.
