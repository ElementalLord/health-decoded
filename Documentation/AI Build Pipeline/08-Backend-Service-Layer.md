# Health Decoded AI Build Pipeline

# Prompt 08, Backend Service Layer

## Purpose

Implement the server-side service layer used by future feature modules. React components must not communicate directly with Supabase.

## Scope

Create reusable database, error, result, and server-logging helpers, plus typed read-only services for journeys, lessons, activities, medications, caregiver content, and profiles.

Do not implement authentication UI, routes, product screens, migrations, RLS changes, API routes, AI, or payments.

## Architecture

```text
React Component
        ↓
Feature Server Action
        ↓
Feature Service
        ↓
Supabase Client
        ↓
Database
```

Feature services are server-only modules and access Supabase through `lib/database/server.ts`.

## Security Requirements

- No direct browser database access.
- No raw SQL execution.
- No service-role credential in client code.
- No secrets, reflections, AI prompts, or medical data in logs.
- Expected failures return typed results rather than raw Supabase errors.

## Verification

Run linting, type checking, production build, `git status`, and `git diff --check`. Database integration checks remain blocked until a local Supabase environment is available.
