# Prompt 28 — AI Memory, Conversation History & Personalization

## Storage model

`ai_conversations` stores only an owner, local title, lifecycle timestamps, and archive timestamp. `ai_messages` stores a conversation reference, plain-text user or assistant role, content, and timestamp. Database cascades permanently remove messages when their conversation is deleted.

## Privacy boundaries

- Provider prompts, system instructions, classifications, token counts, embeddings, tool data, and provider metadata are not stored.
- Refused requests are not stored.
- Requests that appear to include personal symptoms, treatment details, diagnoses, or personal test information are handled only for the active request and are not added to persistent history.
- RLS limits conversation and message access to their authenticated owner.

## Context and recovery

The server verifies the optional conversation identifier against the authenticated owner, loads only the latest eight stored messages for the provider context, then stores a successful plain-text assistant reply. The client loads up to twenty active conversation summaries and restores the most recently updated conversation after refresh.

## Limits

This milestone does not implement embeddings, semantic search, RAG, long-term preference profiling, or a vector database. Conversation archive, rename, delete, and message retrieval endpoints are server-side and owner-checked.
