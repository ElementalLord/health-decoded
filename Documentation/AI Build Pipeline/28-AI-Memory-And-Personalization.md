# Prompt 28 — AI Memory, Conversation History & Personalization

## Current storage model

The current AI tutor is deliberately session-only. Conversation messages live in React state, are sent back only as a short, bounded history for the active page session, and clear when the learner leaves or starts a new conversation. The application does not write prompts, replies, classifications, provider metadata, or system instructions to Supabase.

The legacy `ai_conversations` and `ai_messages` tables remain owner-readable and owner-deletable for compatibility. Migration `20260718000001_harden_ai_conversation_storage.sql` removes authenticated browser insert and update access so no new health-chat content can be persisted accidentally.

## Privacy boundaries

- Provider prompts, system instructions, classifications, token counts, embeddings, tool data, and provider metadata are never stored.
- Refused requests and provider responses are never stored.
- Requests containing credentials or unnecessary identifying information are refused before context lookup or provider use.
- Personal symptoms, treatment details, diagnoses, and personal test information are handled only by the deterministic refusal layer and never reach Gemini.
- Operational logs contain only coarse category, refusal type, latency/size/count buckets, a random correlation ID, security-control name, and outcome.
- The client cannot supply a conversation identifier, user identifier, provider configuration, or system prompt.

## Temporary context

The browser may return up to six recent messages within a 10 KB session-history budget. Every user-history message passes the same input guardrails as the current question. Every assistant-history message passes the output-safety gate. All roles are treated as potentially fabricated untrusted data and are encoded in a JSON data envelope beneath the server-only system instruction.

## Deferred memory work

Persistent history, archive/rename flows, embeddings, semantic search, long-term preference profiling, and a vector database are not implemented. Re-enabling memory requires a separate privacy review, explicit learner consent, server-owned write endpoints, owner checks, retention/deletion rules, and renewed RLS tests.
