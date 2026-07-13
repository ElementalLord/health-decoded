# ADR-002: Lesson Completion Rewards and Required Activities

## Status

Approved

## Decision

- A standard lesson awards 75 Confidence XP on its first successful completion.
- 200 Confidence XP is reserved for a future approved Boss Level, major checkpoint, or equivalent milestone.
- Completion UI prioritizes learning, the key takeaway, and the next helpful step. Confidence XP is secondary.
- Every published activity attached to a lesson is required in the prototype. Draft, archived, and unpublished activities do not affect completion eligibility.

## Consequences

- The server determines completion eligibility and XP; the browser supplies only a lesson-progress identifier.
- `lesson_progress.xp_awarded` remains the authoritative per-lesson reward record.
- Optional activities require a separately approved schema and content-model change.
