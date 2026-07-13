# ADR-001: Prototype Architecture and Scope

## Status

Approved

## Authority

Explicit owner decisions approved after the repository audit.

## Context

The specifications contain differences in prototype duration, content storage, caregiver scope, payments, and document precedence.

## Decision

- Prototype scope is a complete 14-day journey. Future product scope is 90 days.
- Supabase is the runtime source of truth for published educational content.
- Version-controlled structured seed data supports development, recovery, review, and deterministic tests.
- Caregiver content is authenticated-only educational content. It has no caregiver accounts, patient monitoring, messaging, or access to private patient data.
- Stripe and payments are excluded from the prototype.
- The architecture is a Next.js App Router monolith with Server Components by default and Client Components only for browser interaction.
- Domain database logic belongs in `features/<feature>/services/*.server.ts`. Shared infrastructure belongs in `services/supabase/`; future AI-provider infrastructure belongs in `services/ai/`.

## Security and Privacy Impact

- Secrets remain server-only. The future AI provider variable is `ANTHROPIC_API_KEY`.
- Supabase content and user data require server-side authorization and Row Level Security before implementation.
- Durable AI rate limiting, quotas, and deletion controls are mandatory before the AI milestone; no provider is selected yet.
- Users must eventually be able to delete their own reflections, AI conversations, and associated account data.

## Document Authority

1. Explicit owner decisions recorded in approved architecture decisions
2. Security Constitution for security and privacy matters
3. Engineering Constitution for engineering and architecture matters
4. Master Build Prompt
5. Newest applicable specification
6. Older specifications
7. Project Playbook
8. Individual task prompt

## Consequences

- No payments, AI endpoint, database schema, migrations, RLS policies, or Supabase project connection are created during repository normalization.
- The data model must support expansion from 14 to 90 days without redesigning the lesson engine or content database.

## Review Trigger

Review before the Supabase milestone and again before the AI milestone.
