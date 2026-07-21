# Health Decoded AI Build Pipeline

# Prompt 17A, Medication Content Contract and Review Pipeline

## Purpose

Define the structured content contract, validation rules, review metadata, and seed workflow required for the Medication Library.

This is a content-architecture milestone.

Do not build Medication Library pages.
Do not write medical guidance.
Do not present placeholder text as reviewed educational content.
Do not modify remote Supabase data.

## Prerequisites

Confirm:

- Prompts 01–16 are implemented and reviewed.
- The `medications` table exists.
- Prompt 17 stopped without modifying files.
- The working tree is clean.

## Documents to Read

Locate and read the exact repository filenames covering:

- Medication Library
- Content management and publishing
- Medical accuracy and review requirements
- Application flow
- Technical architecture
- Design system

Also read:

- `Documentation/Constitutions/ENGINEERING CONSTITUTION.md`
- `Documentation/Constitutions/Security Constitution.md`
- `Documentation/Architecture Decisions/ADR-001-prototype-architecture.md`

List every exact filename read.

## Mandatory Planning Step

Before modifying files:

1. Inspect the current `medications` migration and seed data.
2. Inspect the current structured-content conventions.
3. Identify every medication-detail section required by the specifications.
4. Identify publication and clinical-review metadata already supported.
5. Propose the smallest content contract that supports Prompt 17.
6. Present a file-by-file plan.
7. Wait for owner approval.

## Objective

Create a strict, version-controlled medication-content contract so future reviewed records can be added safely and consistently.

The contract must support educational content only.

It must not include individualized recommendations, dosage instructions, medication-selection advice, medication-change advice, treatment plans, comparative rankings, or unsupported safety claims.

## Required Medication Content Contract

Define a Zod schema and corresponding TypeScript types for:

- `generic_name`
- `brand_names`
- `medication_class`
- `short_summary`
- `why_it_is_used`
- `how_it_works`
- `common_benefits`
- `common_side_effects`
- `important_considerations`
- `questions_for_healthcare_team`
- `key_takeaway`

Also include reviewed-source metadata: `status`, `version`, `reviewed_by`, `reviewed_at`, `published_at`, `source_references`, and `updated_at`.

Use the exact database structure where it already exists. Do not add duplicate fields merely for convenience.

## Content Limits

Apply explicit bounds for names, summaries, paragraph lengths, list counts, list-item lengths, source-reference counts, and URL formats. Reject arbitrary HTML, executable content, unknown top-level fields, oversized nested objects, and malformed source references. All user-visible content must render through normal React escaping.

## Source Reference Contract

Each source reference contains only approved metadata: title, publisher or organization, publication or review date when available, URL, and date accessed or verified. Do not scrape sources, download source content, copy large copyrighted passages, or automatically claim clinical review.

## Review Workflow

1. Draft medication record is created in a version-controlled seed file.
2. Source references are attached.
3. A qualified reviewer checks the content.
4. `reviewed_by` and `reviewed_at` are completed.
5. Status changes to published only after approval.
6. Published seed data is applied deliberately.
7. Prompt 17 reads only published records.

Do not create an admin interface.

## Seed Structure

Use `supabase/seed/content/medications/` and add one schema-valid template, one clearly marked development example, and one contributor/reviewer README.

The example must say: “Development fixture only. Not medically reviewed. Must not be published.”

Do not add real medication guidance unless the owner supplies approved content or separately authorizes a researched medical-content milestone.

## Validation Tooling

Create a small validation script using existing dependencies. It loads medication seed files, validates them, rejects malformed or improperly published records, and never publishes or modifies remote data. Add `validate:medications` only if appropriate.

## Database Boundary

Do not change the database schema unless the existing `medications` table cannot store the approved contract. If a schema change is genuinely required, stop, describe the mismatch, propose the smallest migration, and wait for approval.

## Testing and Verification

Run `npm run lint`, `npm run typecheck`, `npm run build`, `npm run validate:medications`, `git diff --check`, and `git status`.

Verify the development fixture passes structural validation but cannot pass as published; published records require reviewer metadata and source references; arbitrary HTML, oversized content, and unknown fields are rejected.

## Git Rule

Do not stage, commit, push, or modify remote Supabase data automatically.

## Stop Condition

Stop after the content contract, validation workflow, and final report. Do not resume Prompt 17 until reviewed medication records are available.
