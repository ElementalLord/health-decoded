# Prompt 25 — AI Tutor Experience & Chat Interface

## Objective

Build the complete user-facing AI Tutor experience for Health Decoded.

Prompt 24 established a secure Gemini backend. This milestone creates the frontend experience.

Do not redesign unrelated parts of the application. Do not change authentication, database schema, lesson progression, XP, or navigation architecture.

## Before Implementation

Read:

- Engineering Constitution
- Security Constitution
- ADR-001
- SPEC 06 — Personal Diabetes Educator
- SPEC 14 — AI Tutor System
- SPEC 12 — Design System & Visual Language
- SPEC 15 — Application Flow & Screen Specifications
- SPEC 17 — Technical Architecture

Inspect the implementation from Prompt 24 before writing code.

## Goal

The AI Tutor should feel like a calm educational companion integrated into Health Decoded: trustworthy, focused, and unlike ChatGPT, Claude, Discord, or Slack.

## Navigation

Add protected route `/ai` with the navigation label `Ask AI`. Use the existing navigation system. Do not add floating FABs or chat bubbles.

## Layout

Desktop conversation layout has a maximum reading width of `720px`; it must never be full width. Large margins improve readability.

On mobile, conversation fills the available height and the input remains anchored. The keyboard must not cover the send button or text input. Support safe areas.

## Conversation

Messages appear chronologically.

- User messages align right with a subtle neutral background and restrained radius.
- AI messages align left on a white surface with a slightly larger reading width.
- Do not imitate ChatGPT colors or use speech bubbles, gradients, or glass effects.

## Streaming

Implement streaming responses with incremental rendering, smooth scrolling, route-change cancellation, and no flickering. Do not wait for the entire response.

## Typing Indicator

While waiting, show `Health Decoded is thinking…` with a subtle animated indicator that respects reduced motion.

## Empty State

Before the first question, display:

```text
How can I help today?

You can ask about:

• today's lesson
• medications
• Type 2 diabetes concepts
• healthy habits
• terms you don't understand
```

Do not use generic AI marketing copy.

## Suggested Prompts

Show four contextual suggestions that disappear after the first message:

- What is insulin resistance?
- Can you explain today's lesson more simply?
- Why does exercise help blood sugar?
- What does metformin do?

## Input

Use a textarea that auto-expands to a maximum height of `160px`.

- Enter sends.
- Shift+Enter adds a new line.
- Disable send while streaming.

## AI Responses

Render only paragraphs, numbered lists, bullet lists, and emphasis. Do not support HTML, code blocks, Markdown tables, images, or embedded iframes. Sanitize all output.

## Citations

If actual lesson context is used, show:

```text
Related lesson:
Day 4 • Understanding Blood Sugar
```

Do not fabricate citations.

## Response Actions

Each AI response may include Copy, Ask follow-up, and Regenerate. Do not add reactions, sharing, or exporting.

## Error States

Handle network error, provider unavailable, timeout, authentication expiry, and rate limit with calm recovery copy and Retry. Never expose Gemini errors.

## Session

Conversation exists in memory only. Do not save messages. Closing the page clears the session; persistence comes later.

## Accessibility and Verification

Verify keyboard navigation, screen readers, focus order, live regions, reduced motion, visible focus, large text, high contrast, and responsive widths at `320px`, `375px`, `430px`, `768px`, `1024px`, and `1440px`.

Run lint, type checking, production build, diff check, and status inspection. Inspect streaming, mobile keyboard behavior, long conversations, scrolling, accessibility, hydration, console, and network.

## Final Report

Include conversation architecture, streaming implementation, UI screenshots, accessibility verification, responsive verification, files created and modified, security verification, known limitations, and suggested commit:

```text
feat: implement ai tutor experience
```

## Git

Leave changes unstaged. Do not commit. Do not push. Stop after the AI Tutor experience is complete.
