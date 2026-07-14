# Prompt 26 — Context-Aware AI Tutor

## Objective

Make the AI Tutor a context-aware educational companion without adding durable conversation storage.

## Delivery Boundaries

- Retrieve authenticated user context only on the server for each request.
- Use reviewed, published Health Decoded content before Gemini general education.
- Prioritize current lesson, activity, medication, caregiver guidance, learning stories, and completed lessons in that order.
- Normalize database values into an intentionally small prompt context. Never send raw rows, internal metadata, IDs, hidden activity answers, drafts, or review information to Gemini or the browser.
- Keep conversation history in the current browser session only.
- Preserve the existing Gemini provider, authentication, validation, streaming, safety checks, and response sanitization.

## Related Content and Suggestions

The server returns contextual suggestions and links only for published records actually loaded for that request. The chat UI displays related lessons, medication resources, caregiver guides, or learning stories after a response when available.

## Out of Scope

- Conversation persistence
- Database schema changes
- AI-generated medical advice, diagnosis, treatment decisions, or dose changes
- Draft content, reviewer data, analytics, or global user-data caching
