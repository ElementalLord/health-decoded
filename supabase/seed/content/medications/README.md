# Medication content review workflow

Medication content is educational only. Do not add dosage instructions, treatment plans, recommendations to start, stop, switch, or change a medication, comparative rankings, or unsupported safety claims.

## Record structure

Each JSON record is validated by `npm run validate:medications`. The record maps to the existing `medications` table as follows:

- `generic_name`, `brand_names`, and `medication_class` map to the corresponding name and `category` fields.
- The `content` object is the structured source for the existing JSON `content_blocks` column.
- `status`, `version`, `reviewed_by`, `reviewed_at`, `published_at`, and `updated_at` use existing publication metadata.
- `source_references` are version-controlled review metadata. They are not browser-visible medication content.

## Lifecycle

1. Create a draft record from `template.json`.
2. Add concise source-reference metadata.
3. Have a qualified reviewer review the educational content.
4. Record the reviewer and review timestamp.
5. Change the status to `published` only after review, then deliberately apply the reviewed seed data.

Published records must include a reviewer, review timestamp, publication timestamp, and at least one HTTPS source reference. Prompt 17 must load only published database records.

`development-fixture.json` is a structural test fixture only. It is not medical guidance and must never be published.

## Development-only draft use

Prompt 17 may expose draft medication records only through a development-only fixture adapter. That adapter must display an internal development banner and must never be enabled for a production build. Production medication queries continue to request published records only; this rule does not change database queries or Row Level Security.
