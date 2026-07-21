# Prompt 11, Onboarding and First-Run Experience

Implements a minimal authenticated onboarding flow: welcome, preferred display name, reading and motion preferences, and review. It stores only `display_name`, `onboarding_completed_at`, `reduced_motion`, `preferred_text_scale`, `locale`, and `timezone`; it collects no medical data.

The flow uses a single `/onboarding` route, server-side Zod validation, authenticated service-layer ownership, and redirects completed users to `/account`.
