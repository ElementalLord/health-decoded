# Health Decoded AI Build Pipeline

# Prompt 09, Authentication

## Purpose

Implement the secure Supabase Auth foundation: account creation, login, logout,
password recovery and reset, email-verification guidance, session persistence,
authenticated-user retrieval, and safe profile-trigger handling.

Do not implement onboarding, journey, lessons, caregiver content, medication
pages, AI, or other product features.

## Prerequisites

Confirm Prompts 01–08 are complete and reviewed, the working tree has no
unexplained changes, and local Supabase environment values are configured. If
Docker still prevents database migration verification, authentication UI may be
implemented but database-trigger and RLS behavior must not be reported as tested.

## Required Reading

- `Documentation/Constitutions/ENGINEERING CONSTITUTION.md`
- `Documentation/Constitutions/Security Constitution.md`
- `Documentation/Architecture Decisions/ADR-001-prototype-architecture.md`
- Specs 13, 15, and 17
- The Prompt 08 implementation summary, Supabase clients, service layer, and
  environment configuration

## Mandatory Planning Gate

Before editing files, inspect routes, shared UI, Supabase browser/server clients,
the profile-creation trigger, and existing authentication code. Present a concise
file-by-file plan and wait for owner approval.

## Approved Routes

```text
app/(auth)/login/page.tsx
app/(auth)/signup/page.tsx
app/(auth)/forgot-password/page.tsx
app/(auth)/reset-password/page.tsx
app/(auth)/verify-email/page.tsx
app/(auth)/auth-error/page.tsx
app/auth/callback/route.ts
app/(app)/account/page.tsx
```

The account route is an authenticated placeholder only, not a Profile, Journey,
or Dashboard implementation.

## Architecture

```text
Authentication form
  → validated server action or route handler
  → Supabase Auth
  → safe typed result
  → redirect or user-facing error
```

Use Supabase Auth exclusively. Use server actions or framework-native server
handlers for sensitive operations. Presentational components must not call
Supabase directly or expose raw provider errors.

## Required Flows

### Sign up

- Email, password, confirmation, loading state, validation errors, login link.
- Validate email, password length, confirmation, and maximum lengths; trim email
  but never alter passwords.
- Redirect to verification guidance when confirmation is required; otherwise use
  the protected placeholder.
- Do not collect onboarding or medical information.

### Login and logout

- Generic credential-failure wording only.
- Preserve only validated local destinations; never accept external or
  protocol-relative redirect targets.
- Sign out through Supabase Auth and redirect to a public route.
- Do not expose logout as an unsafe GET action.

### Password recovery and reset

- Forgot-password always returns the same generic success response.
- Use the approved recovery redirect, with durable rate limiting documented as a
  production requirement.
- Reset flow validates a new password and confirmation, handles missing/expired
  recovery state safely, and never logs passwords or tokens.

### Verification and callback

- Verification guidance is calm, explains email/spam timing, and links to login.
- No polling loops or unlimited automatic resend behavior.
- Callback exchanges an authorization code through the installed Supabase SSR
  pattern, validates the destination, and routes invalid requests to auth error.

## Profile, Session, and Service Boundaries

Use the Prompt 07 Auth trigger; do not duplicate profile creation or copy email
into `profiles`. The app must tolerate a temporarily missing profile when the
trigger remains unverified locally.

Use the approved Supabase SSR session approach. Server-rendered protected pages
resolve the user securely. Do not manually parse JWTs, create custom token
storage, or use custom localStorage authentication values.

Place authentication logic within `features/auth/` using only subfolders that
receive actual implementation. Use Zod schemas for signup, login,
forgot-password, and reset-password inputs. Server validation is authoritative.

## Security and UX Requirements

- Supabase Auth only; no custom password handling or database.
- No service-role key in browser code, no raw errors, no token logging, and no
  `dangerouslySetInnerHTML`.
- Do not weaken RLS or suggest wildcard redirects.
- All pages are calm, clear, accessible, keyboard-operable, and use generic,
  non-enumerating failure messages.
- Document durable rate limiting for signup, login, resend, and recovery before
  public production launch; do not add an in-memory limiter.

## Forbidden Work

Do not add onboarding, diagnosis collection, product screens, lessons,
activities, confidence tracking, medications, caregiver content, stories,
reflections, AI, payments, social login, MFA, roles, analytics, notifications,
or profile editing. Do not change the database schema without a separately
approved blocking migration.

## Testing and Verification

Add tests for Zod validation, safe local redirects, and safely mocked auth-result
mapping when the repository’s test setup permits. Do not install a test runner
automatically. Separate static/UI verification from live Supabase integration.

Run lint, type checking, build, `git diff --check`, and `git status`. Do not
claim authentication integration success without an available local or remote
Supabase environment.

## Final Report

Use the Prompt 09 report structure: status, flows, routes, services/actions,
schemas, security controls, tests, manual verification, environment limits,
files, database changes, remote actions, blockers, and suggested commit:

```text
feat: implement secure authentication flows
```

Do not stage, commit, push, or modify remote Supabase configuration
automatically. Stop after Prompt 09; do not begin Prompt 10.
