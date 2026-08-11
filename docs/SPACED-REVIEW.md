# Spaced Review

Spaced Review is a quiet mode of Explain It Back. It never creates questions, asks a model to select content, or lets the learner browse review topics. The server selects one approved Explain It Back challenge from concepts the learner has already encountered.

Eligibility comes from the earliest completed mapped lesson or a successful normal Explain It Back result. The existing concept registry supplies lesson mappings. `serving-size` and `total-vs-added-sugars` have no confident lesson mapping and become eligible only after a successful Explain It Back attempt.

The initial interval is three days. Immediate successful reviews progress through 7, 14, 30, and 60 days. A successful retry returns in four days, Almost There in two days, Try Again in one day, and viewing the authored example in one day. These values and selection weights live in `features/spaced-review/config/spaced-review.config.ts`.

Only structured metadata is persisted: challenge ID, learning/review/due timestamps, controlled verdict, successful-review count, prompt cooldown history, snooze state, and idempotency tokens. Raw explanations are evaluated through the existing ephemeral Explain It Back boundary and are never written to Spaced Review tables.

Journey always offers the subtle manual “Review something” action. Automatic suggestions appear only on Journey, only for due concepts, after a short settling delay, at most once per 48 hours and three times in seven days. “Not now” snoozes automatic prompts for 72 hours without changing the concept’s due date; manual review remains available.

Run `npm run test:spaced-review` for focused scheduling, selection, privacy, integration, and protected-content checks. The same suite runs inside `npm run quality:check`.
