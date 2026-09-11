# AI Tutor operational outcome matrix

This matrix defines the tutor's expected path for every supported class of outcome. It does not try to enumerate every sentence a learner could type; it ensures that novel input is classified into a bounded, testable path instead of leaving the interface hanging or reusing an unrelated answer.

## Non-negotiable invariants

- The current question is read and routed before conversation history is considered.
- History is used only to resolve a genuine follow-up reference. A complete new question starts a topic shift.
- A restricted historical user turn and its paired assistant warning are excluded from future prompts.
- Provider text is never rendered until its structured search citations, length, and safety have been validated.
- Safe factual questions use live credible-source discovery. Reviewed sources are examples and an outage fallback, not an answerability allowlist.
- When reviewed evidence exists, provider, prompt, validation, circuit, and budget failures return a local source-backed answer.
- Every accepted request ends in `done`, `error`, or a completed refusal; the client clears loading in `finally`.
- Optional progress tracking happens after `done` and cannot delay or invalidate an answer.
- The viewport anchors once at the submitted question or regenerated answer. Streaming text never chases the bottom of the response.

## Input and conversation outcomes

| Condition | Context policy | User-visible outcome |
| --- | --- | --- |
| New supported question | Search current credible sources for the exact topic; reviewed sources may add background | Direct, source-backed answer to that question |
| Common misspelling | Conservatively normalize known health terms | Same path as the correctly spelled question |
| Pronoun follow-up such as “How does it work?” | Use the nearest safe prior topic only to resolve the reference | A relevant follow-up answer without repeating the prior response |
| Elliptical follow-up such as “What about side effects?” | Inherit prior evidence only when the current text has no independent topic | Answer the requested aspect of the prior topic |
| Complete topic shift | Ignore prior-topic evidence | Answer only the new topic |
| Prior restricted turn followed by a safe topic | Remove the restricted turn and its paired warning | Answer the new safe question normally |
| General medication education | Use reviewed class or product evidence | Explain purpose, mechanism, or common safety information |
| Personalized dose, start, stop, skip, or timing request | Use prior context only to identify the medicine safely | Give any known general fact, state the narrow decision boundary, and preserve the question |
| Mixed safe and restricted request | Safety rule wins for personal action; safe educational scope remains available | Focused boundary with useful general information when available |
| Personal result, diagnosis, symptom, pregnancy, or treatment-plan request | Do not send personal details to the provider | Focused safety response appropriate to that request |
| Emergency or crisis language | Skip rate limit, retrieval, and provider | Immediate urgent-help guidance |
| Prompt injection, hidden prompt, credential, or identifying data | Do not send the content to the provider | Focused refusal plus safe tutor scope |
| Unrecognized but safe wording | Send the exact question to live source discovery | Grounded answer when credible evidence is found; a clear request error if search is unavailable |
| Specialized, experimental, or current-evidence request | Prefer current primary evidence and show every cited link | Direct grounded explanation within the educational safety boundary |
| Empty, malformed, oversized, or wrong-content-type request | Reject before tutoring | Specific HTTP error; no indefinite loading |
| Authentication unavailable or unsigned user | Reject before tutoring | Sign-in or temporary session-check message |
| Duplicate or quota limit | Stop before provider use | Brief retry-later message |

## Runtime and dependency outcomes

| Condition | Recovery path | Terminal behavior |
| --- | --- | --- |
| Provider success | Validate Google Search annotations, public HTTPS links, and answer safety | Exact source context, answer, then `done` |
| Provider timeout, configuration failure, refusal, or network error | Build an answer only from retrieved reviewed summaries | Context, fallback answer, then `done` |
| Provider circuit open or budget exhausted | Skip provider | Context, fallback answer, then `done` |
| Malformed, uncited, unsafe, or oversized provider output | Discard the entire provider output | Reviewed fallback when matched evidence exists; otherwise a terminal request error |
| Prompt construction failure | Skip provider | Context, fallback answer, then `done` |
| Trusted-context dependency unavailable | Do not guess | Completed reviewed-information response |
| Unexpected generator exception | Route emits a terminal stream error | Client removes an empty placeholder and clears loading |
| Interrupted or truncated stream | Require a `done` event | Client reports an incomplete answer and clears loading |
| Malformed stream event | Cancel the reader | Client reports a request error and clears loading |
| Eight-second client deadline | Abort the request | Preserve the question, stop loading, and offer retry |
| User selects Stop | Abort immediately | Keep received text, stop loading, and keep the viewport stable |
| Progress/streak persistence fails | Log without awaiting | The completed answer remains valid |
| Browser disconnect | Stop writing and close defensively | No server crash or lingering stream |

## Release gate

The tutor is release-ready only when the AI regression suite, deterministic AI evaluation, TypeScript check, targeted lint, production build, and whitespace validation all pass. Any external-provider live evaluation remains a separate environment-dependent check; local reviewed fallbacks must work without it.
