# Prompt 24 — Gemini AI Infrastructure & Integration

## Objective

Implement the first production-ready version of the Health Decoded AI Tutor using Google Gemini.

The application already contains an AI foundation. This milestone replaces the placeholder implementation with a real Gemini integration while preserving the existing architecture, security model, and server boundaries.

The AI should function as an educational Type 2 diabetes tutor. It is not a medical diagnosis system.

## Before Writing Code

Read:

- Engineering Constitution
- Security Constitution
- ADR-001
- SPEC 06 — Personal Diabetes Educator
- SPEC 14 — AI Tutor System
- SPEC 17 — Technical Architecture

Confirm they are consistent before implementation. If a conflict exists, stop and report it.

## Existing Foundation

Inspect every existing AI-related file before modifying anything. Search for:

- `features/ai`
- `services/ai`
- `app/api/ai`
- AI environment validation
- prompt builder
- parser
- placeholder providers
- Anthropic references
- Claude references

Do not duplicate functionality. Refactor instead.

## Provider

The official provider is Google Gemini.

Remove every Anthropic-specific implementation. Replace `ANTHROPIC_API_KEY` with `GEMINI_API_KEY` throughout the repository. Do not leave unused provider code behind.

## Environment

Update `.env.example` to include:

```text
GEMINI_API_KEY=
```

Server validation must require it. Never expose it to client code. Never import server environment modules into client components.

## Provider Layer

Create or update `services/ai/provider.ts`.

Responsibilities:

- initialize Gemini client
- send request
- normalize response
- normalize provider errors
- timeout handling
- retry handling (single retry only)

No prompt building. No business logic.

## Prompt Builder

The prompt builder owns all context assembly. It should include:

- Current journey
- Current lesson
- Current activity
- Medication context when applicable
- Caregiver context when applicable
- Current progress
- Educational instructions
- Medical safety instructions

Never allow the browser to supply system prompts.

## API Route

Replace the placeholder endpoint.

`POST /api/ai/chat`

Pipeline:

```text
Authenticate user
↓
Validate request with Zod
↓
Retrieve lesson context
↓
Build server prompt
↓
Call Gemini
↓
Normalize response
↓
Return plain text
```

## Request Validation

Reject:

- Unknown fields
- Oversized messages
- Too many messages
- Invalid roles
- Browser-supplied system prompts
- Invalid conversation identifiers

Enforce strict schemas.

## Response Rules

Return only:

- Plain text
- Paragraphs
- Simple bullet lists

Never return:

- HTML
- Markdown tables
- Scripts
- CSS
- Images
- Code blocks
- Embedded URLs unless explicitly required

## Educational Scope

The tutor may explain concepts, summarize lessons, clarify medications, explain activities, provide encouragement, explain terminology, review previous lessons, and answer educational questions.

It must never diagnose, interpret symptoms, adjust medications, recommend dosages, replace a clinician, claim certainty, or interpret emergencies.

## Error Handling

Handle provider unavailable, timeout, invalid response, rate limit, authentication failure, validation failure, missing lesson, and missing context. Return generic user-safe messages. Never expose provider internals.

## Logging

Operational logging only. Never log conversation content, prompts, medical questions, responses, keys, tokens, or personal reflections.

Log only timestamp, latency, success or failure, and failure category.

## Rate Limits

Keep the existing abstraction. Do not implement Redis, Upstash, database quotas, or a durable rate limiter. Only expose interfaces.

## Security

Maintain server-only API keys, authentication, ownership checks, lesson ownership, prompt secrecy, response sanitization, and no client-side AI calls.

## UI

Do not redesign chat. Do not redesign Journey. Do not add navigation. Only replace the backend placeholder.

## Testing

Verify authenticated request, unauthenticated request, oversized request, invalid schema, missing key, provider timeout, provider failure, successful response, long response, and medical refusal.

## Verification

Run:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
git status
```

## Final Report

Include files modified, provider architecture, environment changes, security verification, validation verification, testing performed, known limitations, and the suggested commit:

```text
feat: integrate google gemini ai tutor
```

## Git

Leave everything unstaged. Do not commit. Do not push.

Stop after Gemini is functioning.
