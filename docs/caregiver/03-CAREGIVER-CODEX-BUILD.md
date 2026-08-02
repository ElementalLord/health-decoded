# 03-CAREGIVER-CODEX-BUILD.md

## Document Metadata

| Field | Value |
| --- | --- |
| Project | Health Decoded Caregiver |
| Public section name | Support Someone You Care About |
| Central promise | Help without taking over. |
| Document role | Final consolidation, correction, repository-audit plan, implementation architecture, phased Codex handoff, and release-gate specification |
| Status | Binding implementation specification, subject to the unresolved review and governance gates in this document |
| Date | 2026-07-29 |
| Binding inputs | `00-CAREGIVER-SYSTEM.md`, `01-CAREGIVER-CONTENT.md`, `02-CAREGIVER-TOOLS.md` |
| Intended implementer | Codex working inside the existing Health Decoded repository |
| Prototype audience | People supporting an adult with Type 2 diabetes who generally retains decision-making capacity |
| Prototype market | United States, with regional safety content withheld until governance and verification exist |
| Implementation boundary | This document specifies implementation. It contains no application code and grants no authority to invent educational or medical content. |

This is the fourth and final caregiver specification. It resolves the approved completion conflict, defines the four-document authority model, translates approved behavior into a repository-aware implementation plan, and supplies standalone prompts for controlled Codex phases.

Codex must treat approved content as deterministic product content. It may decide technical details only where this document explicitly permits repository-informed judgment. It must report unknowns instead of filling them with invented copy, medical guidance, regional contacts, review credentials, privacy claims, or patient-data features.

The repository must contain exactly these authoritative caregiver documents:

```text
docs/caregiver/
  00-CAREGIVER-SYSTEM.md
  01-CAREGIVER-CONTENT.md
  02-CAREGIVER-TOOLS.md
  03-CAREGIVER-CODEX-BUILD.md
```

No separate module specification files are required. Generated content data files may exist as implementation artifacts if their visible content is traceable to these four documents, but they do not become a fifth authority.

## Final Four-Document Source Model

### Final source hierarchy

When two requirements appear to conflict, use this order:

1. Verified medical, emergency, consent, autonomy, privacy, and accessibility requirements
2. Approved learner-facing copy in `01-CAREGIVER-CONTENT.md`
3. Approved learner-facing tool copy in `02-CAREGIVER-TOOLS.md`
4. Global system rules in `00-CAREGIVER-SYSTEM.md`
5. The Binding Correction Register in this document
6. Section-specific implementation instructions in this document
7. Existing repository conventions
8. Codex technical assumptions

The first item means requirements that have actually completed the named review with verifiable reviewer identity, qualification, scope, and date. Until that evidence exists, the current `not-reviewed` content may support an internal interface prototype but must not be described as reviewed, clinically approved, expert verified, or publicly ready.

The Binding Correction Register has authority only over the named conflicts it records. It cannot alter learner-facing copy, interaction logic, feedback, medical boundaries, privacy behavior, autonomy, consent, emergency behavior, accessibility, visual intent, source claims, or review requirements except where a narrow product-approved register entry explicitly does so.

### Conflict process

For any conflict not already resolved in the Binding Correction Register, Codex must:

1. Stop work on the affected implementation only.
2. Identify the exact files, headings, rule IDs, content IDs, and competing requirements.
3. Preserve the safer medical, emergency, privacy, autonomy, consent, and accessibility behavior.
4. Report the conflict and its practical impact.
5. Request product approval if the intended correction is not already authorized here.
6. Avoid inventing a compromise.
7. Avoid silently changing approved content.
8. Resume only after the conflict is resolved or the affected feature is explicitly deferred.

An unrelated conflict must not be used as permission to change unrelated application areas. A repository convention never overrides a higher safety or content source.

### Content ownership

`00-CAREGIVER-SYSTEM.md` owns global audience, autonomy, consent, support-versus-control, voice, scenario, interaction, feedback, knowledge-check, reflection, medical, emergency, regional, privacy, storage, visual, motion, responsive, accessibility, print, review, and Codex rules.

`01-CAREGIVER-CONTENT.md` owns the exact caregiver landing page and five module experiences, including narrative, dialogue, prompts, choices, logic, feedback, quizzes, reflections, takeaways, completion copy, medical notes, source claims, and visual intent.

`02-CAREGIVER-TOOLS.md` owns the four independently accessible tools and the final completion experience, including exact tool copy, scenarios, logic, local-save truth, printing, export, urgent routes, plan authority, Self-Check boundaries, and final next-step behavior.

This document owns only the named correction, context strategy, implementation boundaries, conceptual architecture, repository audit, phased build order, paste-ready Codex prompts, evidence requirements, and release gates.

## Binding Correction Register

### `CG-TOOL-ISSUE-001`

**Status:** Resolved by product decision.

**Affected source:** Conflicting Required or Optional labels in `01-CAREGIVER-CONTENT.md` for module interactions and module completion sections.

**Approved global rule:** A module becomes Completed only after the learner reaches the central educational idea, completes the single designated core application, and views the practical takeaway. Quiz accuracy and reflection participation do not affect completion.

**Binding corrections:**

A. Each designated core application is required for module completion.

B. Every other module interaction is optional practice.

C. If an optional interaction contains several internal steps, those steps may be required only to finish that selected interaction sequence. They do not gate the module.

D. Urgent direction never counts as completion and never requires the user to return to finish an interaction.

E. Knowledge checks do not gate completion.

F. Reflections do not gate completion.

G. The practical takeaway must be viewed before completion.

H. All existing learner-facing content, interaction mechanics, choices, feedback, revision behavior, medical boundaries, privacy behavior, accessibility intent, visual intent, source claims, and review requirements are preserved exactly.

### `CG-M2-SOURCE-002`

**Status:** Resolved by product decision.

**Affected source:** Missing approved fallback feedback for unsupported Module 2 interaction arrangements and completion copy that implied optional practice was completed.

**Binding corrections:**

A. For unsupported `CG-M2-I01` arrangements, nonpreferred `CG-M2-I04` second-stage selections, and unsupported `CG-M2-I05` arrangements, use only this exact neutral fallback after deliberate submission: “Review what the action asks of the other person, what choice remains available, and what is still unknown. You can revise your response before continuing.” Specific authored feedback always takes priority.

B. Replace the Module 2 completion practice sentence with: “You reached the central idea, practiced making support easier to decline, and reviewed the practical takeaway. The other activities remain available whenever you want to revisit them.”

C. `CG-M2-I03` remains the sole Module 2 core application. The existing completion-status correction remains unchanged.

D. No other module or tool content is changed.

### `PROTOTYPE-SCOPE-001`

**Status:** Resolved by product decision.

**Affected source:** Current prototype integration and the future tool and final-completion scope in `02-CAREGIVER-TOOLS.md`.

**Binding corrections:**

A. The current caregiver prototype includes the caregiver landing page, public urgent-help route, and Modules 1 through 5. The caregiver tools remain approved future scope but are deferred from this prototype.

B. Tool IDs, specifications, and future routes remain reserved. This correction does not retire or alter the future purpose of any approved tool.

C. The prototype must not display tool links, placeholder tool controls, coming-soon tool content, unfinished tool routes, tool-specific landing destinations, or tool-related first-visit or returning-state actions. Tool-specific landing destinations are hidden rather than remapped.

D. No tool route exists in the current prototype. No substitute assessment, planner, questionnaire, or tool is created.

E. Final caregiver section completion remains deferred. Module completion remains session-only.

F. The signed-in application landing screen must contain a direct route to `/caregiver`.

### Exact interaction patch matrix

| Interaction ID | Corrected completion status | Core application | May be skipped | Behavior when skipped | Accessible after module completion |
| --- | --- | --- | --- | --- | --- |
| `CG-M1-I01` | Required for module completion | Yes | No, unless the learner leaves without completing the module | Module remains In progress; no penalty, score, or guilt language | Yes |
| `CG-M1-I02` | Optional practice | No | Yes | Mark `optionalSkipped` only if the learner deliberately skips; module completion is unchanged | Yes |
| `CG-M1-I03` | Optional practice | No | Yes | Same optional behavior; any internal builder steps apply only while completing this interaction | Yes |
| `CG-M2-I01` | Optional practice | No | Yes | Module completion is unchanged; content and feedback remain available | Yes |
| `CG-M2-I02` | Optional practice | No | Yes | Module completion is unchanged; content and feedback remain available | Yes |
| `CG-M2-I03` | Required for module completion | Yes | No, unless the learner leaves without completing the module | Module remains In progress; no penalty, score, or forced return | Yes |
| `CG-M2-I04` | Optional practice | No | Yes | Module completion is unchanged; the full selected branch remains internally coherent | Yes |
| `CG-M2-I05` | Optional practice | No | Yes | Module completion is unchanged; all repair content remains intact | Yes |
| `CG-M3-I01` | Optional practice | No | Yes | Module completion is unchanged; selected workspace steps may be completed or abandoned | Yes |
| `CG-M3-I02` | Required for module completion | Yes | No, unless the learner leaves without completing the module | Module remains In progress; no penalty or forced repetition | Yes |
| `CG-M3-I03` | Optional practice | No | Yes | Module completion is unchanged; the menu remains revisable | Yes |
| `CG-M3-I04` | Optional practice | No | Yes | Module completion is unchanged; paired comparison remains available | Yes |
| `CG-M4-I01` | Optional practice in ordinary learning flow | No | Yes | Module completion is unchanged. Any urgent interruption immediately supersedes the activity. | Yes, unless an urgent route has taken the user away |
| `CG-M4-I02` | Required for module completion in ordinary learning flow | Yes | No for completion; an urgent interruption may bypass it without penalty | Without submission, module remains In progress. Urgent direction does not complete or fail it and never requires return. | Yes |
| `CG-M4-I03` | Safety interruption, never a completion activity | No | Not applicable | Urgent direction replaces learning, creates no correctness state, and may end the visit | Remains available as safety behavior, not optional practice |
| `CG-M4-I04` | Optional practice in ordinary learning flow | No | Yes | Module completion is unchanged. Urgent direction supersedes the activity. | Yes |
| `CG-M4-I05` | Optional practice in ordinary learning flow | No | Yes | Module completion is unchanged. Urgent direction supersedes the activity. | Yes |
| `CG-M5-I01` | Required for module completion | Yes | No, unless the learner leaves without completing the module | Module remains In progress; no penalty, score, or guilt language | Yes |
| `CG-M5-I02` | Optional practice | No | Yes | Module completion is unchanged; comparison remains available | Yes |
| `CG-M5-I03` | Optional practice | No | Yes | Module completion is unchanged; each selected rehearsal may finish independently | Yes |
| `CG-M5-I04` | Optional practice | No | Yes | Module completion is unchanged; network map remains available | Yes |
| `CG-M5-I05` | Optional practice | No | Yes | Module completion is unchanged; no score or diagnosis is created | Yes |

### Core application summary

| Module | Core application | Exact learner-facing title |
| --- | --- | --- |
| Module 1 | `CG-M1-I01` | What happened, and what are you adding? |
| Module 2 | `CG-M2-I03` | Make the offer clear enough to decline |
| Module 3 | `CG-M3-I02` | Match the offer to the request |
| Module 4 | `CG-M4-I02` | Which source belongs here? |
| Module 5 | `CG-M5-I01` | Who owns what? |

No other source conflict is corrected by this register.

## Context-Limit Strategy

### Binding reading rule

Codex must not load all four long documents for every implementation task. For each phase, it reads:

1. Only the relevant rule categories or headings from `00-CAREGIVER-SYSTEM.md`.
2. Only the named landing, module, tool, or completion headings from `01-CAREGIVER-CONTENT.md` or `02-CAREGIVER-TOOLS.md`.
3. Only the relevant correction, architecture, state, phase, test, and prompt headings from this document.

Codex must not implement content outside the named section. If an implementation dependency appears to require another content section, Codex must identify the dependency and request permission to widen the phase. Reading a narrow global dependency to verify a rule is allowed; implementing adjacent content is not.

### Exact context map

| Phase or area | `00-CAREGIVER-SYSTEM.md` headings and IDs | Content or tool headings and IDs | This document headings |
| --- | --- | --- | --- |
| Repository audit | `1. Purpose and authority`; `2. Product scope and audience`; `3. Approved experience architecture`; `24. Codex handoff system`; `25. Source-of-truth hierarchy`; `CODEX-01` to `CODEX-06` | Metadata, Table of Contents, ID Index, Interaction Inventory, unresolved decisions, issue register only. Do not load all learner copy. | Final Four-Document Source Model; Context-Limit Strategy; Repository Audit Requirements; Proposed Conceptual Architecture; Master Codex Audit Prompt |
| Caregiver foundation | `3`; `4`; `10`; `11`; `12`; `13`; `14`; `15`; `16`; `19` to `24`; relevant `PROGRESS`, `INTERACTION`, `FEEDBACK`, `QUIZ`, `REFLECTION`, `MEDICAL`, `EMERGENCY`, `REGION`, `PRIVACY`, `VISUAL`, `MOTION`, `RESPONSIVE`, `ACCESSIBILITY`, `CODEX` IDs | `01` and `02` ID indexes and interaction inventories only | Binding Correction Register; Content Implementation Model; Component Principles; Progress and Completion Model; Privacy and Analytics Model; Regional Configuration Contract; Accessibility Requirements |
| Landing page | `3.1`; `3.2`; `4`; `8`; `14.2`; `19` to `21`; `CONTENT-03`, `CONTENT-04`, `PROGRESS-01` to `08`, relevant visual/accessibility rules | `01`: `LANDING PAGE`, `CG-LANDING`, Visual Identity, Complete Experience Flow and Learner-Facing Content, `CG-LANDING-I01`, `CG-LANDING-I02`, acceptance criteria | Routing and Navigation Requirements; Visual Implementation Requirements; relevant Phase 2 and landing prompt |
| Module 2 prototype | `6`; `7`; `8` to `13`; `16`; `19` to `21`; `28. Risks to test`; relevant consent, autonomy, support, interaction, feedback, reflection, progress, accessibility rules | `01`: entire `MODULE 2: SUPPORT WITHOUT TAKING OVER`, `CG-M2-S01` to `S08`, `I01` to `I05`, `Q01` to `Q03`, `R01`, takeaway and completion | Binding Correction Register; Interaction Implementation Requirements; Progress and Completion Model; Phase 3 |
| Prototype revision | Same rules as Module 2 plus `24. Codex handoff system` and `28. Risks to test` | Module 2 acceptance, visual, responsive, accessibility, medical/privacy, and source headings. Read exact copy only where integrity comparison is needed. | Prototype-First Rule; testing and audit requirements; Phase 4 |
| Module 1 | `8` to `13`; `16`; `19` to `21`; relevant scenario, interaction, feedback, quiz, reflection, progress rules | `01`: entire `MODULE 1`, `CG-M1-S01` to `S07`, `I01` to `I03`, `Q01` to `Q03`, `R01`, takeaway and completion | Correction Register; state and interaction rules; Phase 5 |
| Module 3 | `6`; `7`; `8` to `13`; `16`; `19` to `21` | `01`: entire `MODULE 3`, `CG-M3-S01` to `S07`, `I01` to `I04`, `Q01` to `Q03`, `R01`, takeaway and completion | Correction Register; state and interaction rules; Phase 5 |
| Module 4 | `5`; `14`; `15`; `16`; `21`; relevant `MEDICAL-01` to `15`, `EMERGENCY-01` to `10`, `REGION-01` to `08`, privacy and accessibility rules | `01`: entire `MODULE 4`, especially Required Final Safety Language, `CG-M4-S01` to `S08`, `I01` to `I05`, `Q01` to `Q03`, `R01`, medical/privacy notes, sources, clinical-review list | Correction Register; Regional Configuration Contract; safety, release, accessibility, privacy, and Phase 6 |
| Module 5 | `6`; `7`; `8` to `13`; `16`; `18`; `19` to `21` | `01`: entire `MODULE 5`, `CG-M5-S01` to `S07`, `I01` to `I05`, `Q01` to `Q03`, `R01`, takeaway and completion | Correction Register; state and interaction rules; Phase 7 |
| What Should I Say? | `6` to `13`; `16`; `19` to `21`; session-only privacy rules | `02`: Shared Tool Behavior; entire `TOOL 1`, `CG-T1-SC01` to `SC12`, `CG-T1-I01` to `I07` | Privacy and Analytics Model; Component and Interaction Principles; Phase 8 |
| Know the Plan | `5`; `6`; `14` to `17`; `21`; `22`; storage, print, medical, emergency, consent rules | `02`: Shared Tool Behavior; entire `TOOL 2`, `CG-T2-I01` to `I06`; tool review items `CG-TOOL-REV-003` to `005` | Product Decisions; Local Storage Model; Print and HTML Export Model; Regional Contract; Phase 10 |
| Caregiver Self-Check | `8`; `13`; `15`; `16`; `18`; `21`; relevant content, reflection, region, privacy, accessibility rules | `02`: Shared Tool Behavior; entire `TOOL 3`, questions, `CG-T3-R01` to `R06`, `CG-T3-I01` to `I03`; `CG-TOOL-REV-006` to `009` | Product Decisions for urgent routes; Privacy Model; Regional Contract; Phase 9 |
| Shared Support Plan | `6`; `7`; `16`; `17`; `21`; `22`; consent, autonomy, privacy, storage, print rules | `02`: Shared Tool Behavior; entire `TOOL 4`, `CG-T4-A01` to `A12`, `CG-T4-I01` to `I06`; `CG-TOOL-REV-010` to `013` | Local Storage; Print and Export; authority limits; Phase 11 |
| Final completion | `4`; `8`; `13`; `16`; `19` to `21`; progress and noncredentialing rules | `02`: entire `FINAL CAREGIVER COMPLETION EXPERIENCE`, `CG-COMPLETE-I01`, completion states | Section Completion Logic; Phase 12 |
| Final integration | `3`; `4`; `14.2`; `15`; `16`; `21`; `24`; all rule categories only as necessary | Control indexes and acceptance criteria from both content documents, not all copy | Phases 13 to 18; Final Review Gates; Final Report Format |
| Final audits | Read the rule categories named by each audit | Read acceptance, source, review, unresolved-decision, consistency-audit, and issue-register headings. Read exact copy only for sampled or failed integrity checks. | Testing Strategy; audit prompts; release gates; consistency audit |

## Product Decisions and Open Release Gates

### Local storage

Know the Plan and Shared Support Plan may use deliberate browser-local storage. The technical mechanism is not predetermined.

Target behavior:

- browser-local only
- no cloud persistence or cross-account sync
- no automatic save or hidden background persistence
- no encryption or security claim without implementation evidence
- one active document per tool
- one conflict-recovery copy per tool when necessary
- visible save state
- explicit deletion
- schema version and last-updated timestamp
- safe failure when storage is unavailable
- no silent overwrite
- no sensitive input in logs, analytics, URLs, error reports, notifications, or page titles

After the read-only audit, Codex may recommend an existing repository abstraction, IndexedDB, or `localStorage`. The recommendation must consider architecture, data size, browser support, migrations, error accessibility, quota behavior, testability, and privacy review. Codex must stop for approval before implementing the storage mechanism. If no suitable mechanism is approved, saving remains disabled.

Exact permissible visible states:

- Not saved
- Unsaved changes
- Saved on this device
- Save failed
- Deleted from this device

Prohibited claims include Securely saved, Encrypted, Protected, Backed up, and Synced.

`CG-TOOL-ISSUE-002` is resolved at product-behavior level. The technical mechanism remains pending repository audit and privacy review.

### Print and export

Approved for Know the Plan and Shared Support Plan:

1. Accessible print preview
2. Browser printing with a dedicated print stylesheet
3. Semantic standalone HTML export containing real text and headings

A custom PDF library is not required. Browser printing may allow a user to create a PDF, but the product must not call that output fully accessible without verification. Direct PDF export requires a preexisting, tested, accessible repository capability and separate approval.

Not approved: image-only export, screenshot export, CSV, cloud export, email, direct messaging, automatic download, or hidden copy generation.

HTML export must have no scripts, hidden application data, analytics, progress, quiz results, reflections, Self-Check responses, AI Tutor history, authentication data, or application route history. It must use semantic headings, approved privacy and authority notices, the approved privacy-preserving filename, and explicit confirmation before creation.

The export portion of `CG-TOOL-ISSUE-003` is resolved.

### Regional configuration

Regional emergency and crisis data remain release-blocked until a named owner, review cadence, expiry interval, and translation-review workflow exist.

Internal prototypes use `[REGION_DISPLAY_NAME]`, controlled placeholder keys, and the exact approved safe fallback. They must not use guessed phone numbers, distribute agency details through modules, present placeholders as current, or imply verification.

One centralized regional configuration interface must represent region ID, display name, emergency label and contact, crisis label and contact, professional-support resources, source, verified date, expiry date, reviewer, language, localized fallback, and status.

Allowed statuses:

- `unavailable`: show the approved safe fallback
- `draft`: never present publicly as verified
- `verified`: display only after required reviews
- `expired`: withhold the expired contact and show the safe fallback

The prototype ships with configuration architecture and safe fallback behavior, but no unverified real phone number.

The governance portion of `CG-TOOL-ISSUE-003` remains open and release-blocking.

### Self-Check urgent routes

The Self-Check keeps these voluntary routes distinct:

1. I need urgent emotional support right now
2. Someone may be in immediate danger

Neither route is triggered automatically by ordinary answers. Neither claims to assess crisis or danger. Both use controlled regional configuration. Until verified resources exist, both show the exact safe fallback, infer no location, display no guessed contact, and never block leaving.

`CG-TOOL-ISSUE-005` is resolved for prototype interaction behavior and remains open and release-blocking for real regional resources.

### Multiple documents

The prototype supports one active Know the Plan document, one active Shared Support Plan document, and one conflict-recovery copy per tool when needed.

It does not support multiple patient or supporter profiles, account switching, shared workspaces, cloud history, automatic merging, or cross-account collaboration. Any future multiple-document system requires separate product, privacy, security, and consent review.

### Review status and release levels

All medical, privacy, accessibility, cultural, and emotional-safety content remains `not-reviewed` unless verified reviewer evidence is added.

Internal interface development may proceed with visible internal review metadata. Ordinary users must not see technical review metadata unless a later reviewed design requires it. They must not see Medically reviewed, Clinically approved, or Expert verified without evidence.

Module 4 and Know the Plan cannot receive public medical or emergency-use release before qualified clinical review.

## Repository Audit Requirements

Phase 0 is read-only. Codex must inspect at least:

- framework and version
- routing architecture and navigation
- caregiver routes, content, or placeholders
- design tokens, typography, color, spacing, radii, shadows, responsive utilities
- animation and reduced-motion handling
- accessibility utilities
- form, dialog, status, alert, feedback, and progress components
- authentication, account storage, progress persistence, and local browser storage patterns
- print and export support
- testing framework, linting, TypeScript configuration, and production build
- analytics and error reporting
- content-loading patterns
- mobile navigation
- patient-facing Lessons and Stories architecture

It must identify:

1. Components safe to reuse unchanged
2. Components safe only after modification
3. Components that would make Caregiver too similar to Lessons, Stories, Resources, Profile, or Dashboard
4. Patterns that conflict with the anti-card system
5. False affordances
6. Hover behavior on noninteractive elements
7. Accessibility risks
8. Storage risks
9. Analytics and error-reporting risks
10. Existing routes or specifications conflicting with approved caregiver documents

No file may be modified during this audit.

### Required audit output

**A. Repository facts:** framework, major libraries, route structure, content structure, state systems, styling systems, testing systems.

**B. Caregiver findings:** existing files, route behavior, navigation placement, reusable and avoidable components, content conflicts, visual conflicts, persistence conflicts.

**C. Proposed architecture:** routes, component boundaries, content loading, state, storage choice, regional configuration, print and export, testing, accessibility.

**D. File-change manifest:** expected new files, modified files, and unchanged protected areas.

**E. Ranked risks:** blocker, high, moderate, low.

**F. Approval decisions:** only genuine product decisions, including the storage mechanism and any route deviation.

Codex stops after delivering this report.

## Proposed Conceptual Architecture

The following architecture is conceptual. Codex must reconcile it with repository evidence before naming exact paths or libraries.

### Layers

1. **Route shell:** caregiver landmarks, local navigation, immediate-help access, return paths, route-level metadata, and private-progress-safe returning state.
2. **Typed content layer:** deterministic content objects derived exactly from stable IDs in the approved documents.
3. **Experience components:** module-specific compositions and tool-specific workspaces that consume typed content without generative rewriting.
4. **Interaction logic:** accessible state machines for choice, sorting, sequencing, building, branching, revision, feedback, and urgent interruption.
5. **Progress adapter:** minimal private progress needed for section and module state, separate from sensitive interaction responses.
6. **Session privacy layer:** ephemeral reflection, dialogue draft, Self-Check, and unsaved form state.
7. **Approved local-document adapter:** versioned deliberate storage for T2 and T4 only, implemented only after storage approval.
8. **Regional provider:** centralized controlled status, fallback, verified-data withholding, and print/export metadata.
9. **Output layer:** print preview, print stylesheet, and confirmed semantic HTML export for T2 and T4.
10. **Evidence layer:** content-integrity checks, completion tests, accessibility verification, privacy checks, responsive screenshots, and build results.

### Architectural separation

- Content data must not import storage, analytics, or account logic.
- Progress must not retain sensitive answers.
- Session-only inputs must not be serialized into progress.
- Regional content must not be hardcoded in module or tool components.
- Tool documents must not be inserted into URLs, logs, page titles, notifications, or analytics.
- Immediate safety surfaces must be available independent of educational progress.
- Module-specific layout must remain separable from reusable interaction logic.
- The AI Tutor must not automatically receive caregiver reflections, drafts, Self-Check answers, plans, or detailed next steps.

## Routing and Navigation Requirements

Codex must inspect current routes before finalizing paths. Preferred conceptual routes:

- `/caregiver`
- `/caregiver/modules/[moduleId-or-slug]`
- `/caregiver/tools/what-should-i-say`
- `/caregiver/tools/know-the-plan`
- `/caregiver/tools/self-check`
- `/caregiver/tools/shared-support-plan`
- `/caregiver/complete`

Sound existing architecture may justify different paths. Any deviation must be explained and approved before implementation.

The final route system needs one landing page, one stable route per module, one stable route per tool, and one completion route or stable completion state. It must support direct tool access, module-to-tool deep links, reliable return paths, and immediate-help access within two intentional actions.

Prohibited URL content includes patient data, drafts, reflections, Self-Check data, plan fields, private next-step details, or storage payloads.

The caregiver section must be reachable through the approved primary navigation or another approved prominent entry point. Codex must inspect current navigation before recommending placement.

Do not add an AI destination, medical-dashboard destination, patient-data destination, duplicate caregiver links, or a submenu that exposes private tool contents.

Returning-state surfaces may show a recent module, next recommended module, or recent tool name. They must never preview a tool draft, plan content, Self-Check result, reflection, conversation draft, or health information.

## Content Implementation Model

Codex should propose a typed content model after the audit. It should support:

- stable content, section, interaction, question, reflection, claim, and review IDs
- exact narrative, scenario, prompt, choice, feedback, and takeaway copy
- interaction logic and revision behavior
- knowledge checks
- reflection metadata
- privacy, authority, safety, and regional notices
- corrected completion status
- source and review metadata
- accessibility text
- visual intent metadata where useful

Long approved content should not be scattered across many components when a structured content layer fits the repository. The model must preserve deterministic wording and must not permit runtime generative rewriting, personalization, or generated feedback.

Permitted normalization is limited to whitespace, typographic apostrophes, and safe data serialization when visible wording is unchanged.

Content-integrity tests must connect each implemented ID to its approved source. If a visible string needs to change for accessibility, grammar, or platform fit, Codex reports the exact change and waits for content approval unless the change is purely nonvisible accessible labeling that preserves meaning.

## Component Principles

Reusable infrastructure may include:

- caregiver route shell and navigation
- progress adapter and module metadata
- safety interruption
- privacy and authority notice
- knowledge-check and reflection foundations
- completion foundation
- accessible feedback announcements
- regional provider
- approved local-document adapter
- print and export foundation
- focus-management utilities

Module-specific components must preserve distinct composition, visual metaphor, interaction mechanics, rhythm, and emotional pacing.

Do not create a single `CaregiverModuleCard` or `CaregiverInteractionCard` that renders every experience as stacked rounded rectangles. Reusable logic is encouraged. Identical visual composition is not.

Every reusable component must expose semantic structure, keyboard behavior, focus behavior, reduced-motion behavior, error behavior, and mobile alternatives. Static surfaces must not inherit button hover or cursor behavior.

## Visual Implementation Requirements

Caregiver should feel warm, relational, calm, adult, practical, editorial, and medically trustworthy. It must be recognizably part of Health Decoded while remaining distinct from Dashboard, Journey, Lessons, Stories, Resources, and Profile.

Global direction:

- warm ivory canvas
- deep forest or warm charcoal text
- restrained terracotta
- soft sage
- muted blue-green
- editorial serif for major headings
- readable sans-serif for body and controls
- fine dividers
- open layouts
- meaningful asymmetry
- relational or environmental motifs
- restrained state-based motion
- soft edges without universal rounding

Repository tokens should be reused when compatible. Codex must propose new scoped caregiver tokens when existing ones would create visual conflict or accessibility failure.

Avoid walls of cards, nested cards, elevated static surfaces, hover on noninteractive content, repeated three-column grids, excessive pills, giant rounded rectangles, heavy shadows, generic wellness gradients, sparkle icons, generic heart icons, stock smiling-family imagery, repeated module shells, false affordances, small type, incorrect mobile icons, and decorative motion without state meaning.

## Interaction Implementation Requirements

Every interaction must preserve the exact approved prompt, choices, feedback, logic, revision behavior, corrected completion status, keyboard path, screen-reader path, mobile behavior, reduced-motion behavior, and data behavior.

Maps, continuums, builders, workspaces, branching, sequencing, pattern review, and agreement areas must not be flattened into generic multiple-choice cards, accordions, or tap-to-reveal panels for convenience.

When a spatial mechanic needs a mobile or assistive alternative, the alternative must preserve the same cognitive task. It must not become passive reading. Keyboard and screen-reader users receive the same choices, submission logic, feedback, and revision capability.

Feedback announcements occur after deliberate submission, not during every selection. Focus moves only when movement improves comprehension and remains predictable. Revision must restore access to prior selections without erasing unrelated state.

Module 4 urgent direction always outranks learning state. No correctness state, completion credit, failure, or forced return is created by the urgent route.

## Progress and Completion Model

### Conceptual state

Caregiver section:

- `notStarted`
- `inProgress`
- `completed`
- `currentNextStepCategory`
- `lastVisitedRoute`

Per module:

- `notStarted`
- `inProgress`
- `completed`
- `revisit`
- `centralIdeaReached`
- `coreApplicationCompleted`
- `takeawayViewed`
- `keyIdeaUnderstood`
- `lastSectionId`

Per interaction:

- `untouched`
- `started`
- `submitted`
- `revisited`
- `optionalSkipped`

Per knowledge check:

- `notStarted`
- `answered`
- `reviewed`
- contribution to `keyIdeaUnderstood`

Per reflection:

- `unavailable`
- `untouched`
- `entered`
- `skipped`
- `cleared`

Reflections remain session-only.

Per tool:

- `neverOpened`
- `open`
- `localDraftExists` when applicable
- `savedOnDevice` when applicable
- `unsavedChanges`
- `saveFailed`
- `planUpdated` when applicable

Sensitive interaction answers must not be persisted solely to calculate completion. Persist the minimum state required.

### Module completion

```text
moduleCompleted =
  centralIdeaReached
  AND coreApplicationCompleted
  AND takeawayViewed
```

Core completion sources:

- M1 only from submitted `CG-M1-I01`
- M2 only from submitted `CG-M2-I03`
- M3 only from submitted `CG-M3-I02`
- M4 only from submitted `CG-M4-I02`
- M5 only from submitted `CG-M5-I01`

Quiz result, reflection state, and optional interactions do not change completion. Optional practice remains available before and after completion. Revisit never erases completion.

For Module 4, urgent interruption does not complete the application, fail the module, or require a return. Safety direction overrides progress.

### Section completion

The caregiver section becomes completed only when:

- M1 through M5 are completed
- one current next-step category is successfully saved to private progress

Tools remain optional. Completion does not require quiz score, reflection, tool use, plan saving, print, export, patient participation, learner medical review, or certification.

If the next-step category cannot be saved, preserve all module completions, do not claim section completion, show the approved failure state, and allow retry or a changed choice. Persist only the category. Custom detail remains session-only.

## Privacy and Analytics Model

Before implementation, Codex must inventory analytics and error-reporting systems.

Never send or persist through analytics:

- free text
- dialogue drafts
- reflections
- Self-Check answers or patterns
- Know the Plan or Shared Support Plan content
- names, contacts, medical-information pointers
- participation-gate choices
- custom next-step detail
- clipboard, print, or export content

Permissible nonsensitive events may include section, module, or tool opened; module completed; tool reset; local save attempted or succeeded; print preview opened; export cancelled. Properties are limited to stable caregiver page or tool ID, event name, and nonprivate technical result.

Every new event must be reported. Error reports must scrub sensitive payloads, form values, storage records, exported content, and DOM breadcrumbs containing private text.

Session-only means no account persistence, browser-local persistence after the intended session boundary, analytics, server submission, AI Tutor handoff, or hidden recovery copy.

## Local Storage Model

Codex must propose a versioned schema after the audit. The conceptual envelope includes:

- `schemaVersion`
- `toolId`
- a nonidentifying random local `documentId`
- `createdAt`
- `updatedAt`
- `regionId`
- `regionVerifiedAt` when applicable
- `content`
- `unresolvedAreas` when applicable
- `reviewDate` when applicable

Do not add diagnosis, full name, medication dose, glucose reading, symptoms, clinician messages, hidden consent score, legal authority, or account ID unless separately approved.

The adapter supports one active document and one conflict-recovery copy per local-save tool. It must not silently merge or overwrite. Storage unavailable, invalid schema, migration failure, quota failure, and write conflict must produce accessible, truthful failure states while preserving the in-memory draft when possible.

Delete removes the active saved document and its recovery copy for that tool from the selected browser storage. The product must not claim deletion from backups, synced browser services, downloaded exports, printouts, screenshots, or another device.

Reset and delete remain distinct. Reset clears the current working form only after confirmation. Delete removes the deliberately saved local document after confirmation. Neither silently affects the other.

## Print and HTML Export Model

Shared print infrastructure applies only to T2 and T4.

Print output must use semantic headings, real text, logical order, sufficient contrast, a document title, page numbers and repeated title where supported, controlled page breaks, privacy reminder, purpose statement, review date, region and verification status, authority limitation, and no navigation-only controls or background-color dependence.

Print and export exclude private learning data, progress, quiz results, reflections, Self-Check, AI history, analytics identifiers, route history, account identifiers, hidden fields, and unsaved content not explicitly included by the user.

Standalone HTML export must use UTF-8, semantic HTML, no JavaScript, no external resources or tracking, no hidden inputs, no token, no storage key, and no application history. It uses the approved privacy-preserving filename and includes visible privacy, authority, region-status, review-date, and outdated-copy notices.

Creation begins only after explicit confirmation. No automatic download or hidden copy generation is allowed.

## Regional Configuration Contract

Conceptual fields:

- `regionId`
- `displayName`
- `language`
- `status`
- `emergencyServiceLabel`
- `emergencyContact`
- `crisisServiceLabel`
- `crisisContact`
- `professionalResources`
- `sourceName`
- `sourceReference`
- `verifiedAt`
- `expiresAt`
- `reviewerName`
- `reviewerRole`
- `fallbackHeading`
- `fallbackCopy`

Required behavior:

- no inferred region without visible confirmation
- no guessed or stale contact
- no expired contact shown as verified
- no hardcoded contact spread across features
- one provider for all urgent surfaces
- exact safe fallback for missing, draft, or expired public data
- print and export receive region status and verification date
- ordinary users never see draft configuration as verified

The internal prototype contains no real unverified contact number.

## Accessibility Requirements

Codex must implement and verify semantic landmarks and headings, full keyboard operation, visible focus, focus restoration, deliberate post-submission focus movement, live announcements, no auto-advance, no time limits, no unexpected audio, compliant target sizes, text contrast, color-independent states, labels, associated help, error summaries, field recovery, reduced motion, 200 percent zoom, responsive layouts at 320, 375, 768, 1024, and 1440 pixels, accessible print structure, export order, urgent focus, clipboard announcements, local-save announcements, and conflict-recovery access.

Automated checks do not establish full WCAG 2.2 AA conformance. Manual keyboard, screen-reader, zoom, responsive, print, and reduced-motion checks are required. Unperformed assistive-technology tests must be reported as not tested, never inferred.

## Testing Strategy

### Content integrity

- all stable IDs are unique
- all required copy and feedback exist
- visible approved copy has not been accidentally rewritten
- corrected completion labels match this document
- no unresolved placeholder appears outside approved regional placeholders
- no runtime generative rewriting exists

### Completion

- each module uses only its named core interaction
- optional interactions do not gate
- quiz and reflection do not gate
- takeaway does gate
- Revisit preserves completion
- urgent interruption produces no completion or failure
- section completion requires five completed modules and one saved next-step category
- tool use never gates section completion

### Privacy

- session content is not persisted
- sensitive content is excluded from analytics, error reports, URLs, titles, and notifications
- local save is deliberate
- delete and reset behave distinctly
- no cross-account access
- recovery copy is limited to one and never silently replaces active content

### Tools

- T1 never automatically saves or sends
- T2 participation checkpoint and medical-value exclusion work
- T3 creates no score, diagnosis, or account persistence
- T3 urgent routes are voluntary
- T4 participation gate works
- T4 agreement areas confirm independently and unresolved stays unresolved
- no global consent checkbox

### Safety

- urgent direction appears before interaction
- no regional hardcoding
- unavailable, draft, verified, and expired statuses behave correctly
- no treatment improvisation, medication changes, reading interpretation, or invented thresholds
- Know the Plan organizes existing instruction locations rather than creating a plan

### Accessibility and responsive quality

- keyboard, focus, announcements, zoom, reduced motion, semantic groups, error recovery, print order
- 320, 375, 768, 1024, and 1440 pixel layouts
- long labels and translated-text expansion
- virtual keyboard behavior
- no horizontal scrolling for core tasks

### Build quality

- TypeScript check
- lint
- unit tests
- integration tests
- available automated accessibility checks
- production build

## Implementation Phases

### Prototype-first rule

Module 2 is the first full module implementation. Codex must not implement all five modules before Module 2 has been built, inspected, tested, and approved.

The Module 2 review must examine emotional pacing, dialogue naturalness, permission clarity, intention versus impact, support versus surveillance, interaction value, repetition, card overuse, mobile stacking, keyboard operation, screen-reader operation, reduced motion, progress meaning, and visual distinction from Lessons and Stories.

Shared module infrastructure may change after that review. Known design problems must not be copied into later modules.

### Phase table

| Phase | Scope | Exact primary IDs | Change boundary | Stop gate |
| --- | --- | --- | --- | --- |
| 0 | Read-only repository audit | Four document indexes and audit headings | No files changed | Product approves architecture, routes, storage proposal, and manifest |
| 1 | Caregiver foundation and content architecture | Global rule IDs; caregiver ID indexes | Foundation, typed models, scoped tokens, no page content beyond test fixtures | Foundation evidence reviewed |
| 2 | Landing page shell and navigation | `CG-LANDING`, `CG-LANDING-I01`, `CG-LANDING-I02` | Landing, navigation entry, safe returning state | Landing reviewed |
| 3 | Module 2 prototype only | `CG-M2-S01` to `S08`, `I01` to `I05`, `Q01` to `Q03`, `R01` | Module 2 plus necessary shared foundation | Prototype implementation complete |
| 4 | Prototype audit and approved revision | Same Module 2 IDs | Only Module 2 and explicitly approved shared infrastructure | Product approves scaling |
| 5 | Modules 1 and 3 | M1 and M3 stable IDs | Modules 1 and 3, approved shared fixes only | Both modules reviewed |
| 6 | Module 4 with heightened safety | M4 stable IDs and safety language | Module 4, centralized region surfaces, approved shared safety | Qualified-review status and product decision recorded |
| 7 | Module 5 | M5 stable IDs | Module 5 and approved shared fixes | Module reviewed |
| 8 | What Should I Say? | `CG-T1-SC01` to `SC12`, `CG-T1-I01` to `I07` | T1 only plus approved shared tool shell | T1 reviewed |
| 9 | Caregiver Self-Check | `CG-T3-Q01` to `Q15`, `R01` to `R06`, `I01` to `I03` | T3 and voluntary urgent surfaces | T3 reviewed |
| 10 | Know the Plan | `CG-T2-I01` to `I06`, finalized fields | T2 plus approved local-save, print, export foundation | Storage mechanism approved before persistence code; output reviewed |
| 11 | Shared Support Plan | `CG-T4-A01` to `A12`, `CG-T4-I01` to `I06` | T4, reuse only approved T2 foundations | T4 reviewed |
| 12 | Final completion | `CG-COMPLETE-I01` and completion states | Completion route or state only | Completion logic reviewed |
| 13 | Final integration | All caregiver route and progress IDs | Caregiver integration only | Integrity, progress, and navigation pass |
| 14 | Accessibility audit | All implemented caregiver IDs | Fix only verified caregiver accessibility defects | Manual and automated evidence reviewed |
| 15 | Privacy and security audit | T1 to T4, progress, analytics, errors, output | Fix only verified caregiver privacy/security defects | Privacy evidence reviewed |
| 16 | Medical and regional implementation audit | M4, T2, T3 urgent, T4-A11, region provider | Fix only approved medical/regional defects | Release blockers explicitly classified |
| 17 | Anti-AI visual and content audit | All visible caregiver experiences | Caregiver visual and copy-preservation fixes only | Screenshot evidence reviewed |
| 18 | Final test and production-build audit | Entire caregiver implementation | Test or narrowly repair caregiver defects | Final evidence report; no public-readiness claim without gates |

### Rules for every phase

Every implementation phase must name the exact document headings and IDs read, exact allowed files after repository paths are known, protected unrelated areas, acceptance criteria, tests, and stopping condition.

Each phase changes only its named scope. It must not prebuild later content, refactor unrelated application areas, add features, alter approved copy, or broaden data collection.

Every phase ends with the Final Codex Report Format in this document and waits for approval.

### Phase acceptance and protection matrix

This matrix supplements the standalone prompts. Repository paths remain unknown until Phase 0, so the approved audit manifest must replace conceptual areas with exact files before a build phase begins.

| Phase | Minimum acceptance evidence | Protected areas |
| --- | --- | --- |
| 0 | Exact framework and route facts; component reuse classification; storage comparison; proposed file manifest; ranked risks; no worktree changes | Entire repository |
| 1 | Unique ID tests; typed content contracts; privacy-safe state boundaries; unavailable regional fallback; TypeScript, lint, unit tests, build | All visible patient content, all caregiver learner pages, authentication and storage implementations |
| 2 | Exact landing copy; two interactions; direct tool access; private returning state; five-width screenshots; keyboard path | Module and tool bodies, Dashboard, Lessons, Stories, Resources, Profile |
| 3 | Exact Module 2 content; five distinct mechanics; corrected completion; session-only reflection; accessibility and mobile evidence | Other modules and all tools |
| 4 | Findings against every prototype risk; before-and-after evidence; content-integrity confirmation; explicit safe-to-scale conclusion | New caregiver content and unrelated application areas |
| 5 | Exact M1 and M3 content; distinct mechanics; each named core; optional behavior; no medical expansion | M4, M5, tools, completion |
| 6 | Exact safety language; urgent focus and exit; four regional status tests; no hardcoded contacts; qualified-review status | Other modules, unrelated regional or medical features |
| 7 | Responsibility ownership and sustainable-boundary logic; no score or diagnosis; corrected core | Tools, completion, patient-facing wellbeing features |
| 8 | Twelve exact scenarios; seven interaction steps; no sending, generation, or automatic save; clipboard evidence | Messaging, contacts, AI systems, storage |
| 9 | Fifteen optional questions; exact descriptive patterns; no score; no auto urgent trigger; session erasure evidence | Clinical assessments, account data, outreach |
| 10 | Participation gate; prohibited medical-field tests; approved deliberate save or disabled state; print and sanitized HTML evidence | Cloud storage, messaging, T4 |
| 11 | Direct participation gate; twelve independent areas; unresolved states; no global consent; output authority notices | Legal consent, signatures, profiles, shared workspaces |
| 12 | Five-module and category gate permutations; persistence-failure behavior; session-only custom detail | Module completion records, tool requirements, certification |
| 13 | Complete route graph; deep links; return paths; no private route data; full content and completion regression | Unrelated navigation behavior and patient content |
| 14 | Automated results plus manual keyboard, focus, zoom, responsive, reduced-motion, print, and available screen-reader evidence | Approved meaning and mechanics |
| 15 | Complete caregiver data-flow inventory; analytics and error event inventory; sensitive-channel tests; deletion and export truth | Broader account or security architecture unless separately approved |
| 16 | Prohibited-medical-behavior checks; centralized region evidence; urgent behavior; release-level classification | Medical copy and real contacts without review authority |
| 17 | Route-complete screenshot set; anti-card findings; false-affordance review; preserved semantic and content integrity | Unrelated design system and patient-facing aesthetics |
| 18 | Exact test commands and outcomes; production build; manual checks; remaining blocker table; readiness separated by level | New features, broad refactors, unresolved content |

### File-scope finalization rule

After Phase 0, product approval must convert every bracketed conceptual file scope in the standalone prompts into an exact allowlist. A phase may also touch lockfiles or generated artifacts only when the approved dependency or build system requires them, and it must report why.

If a needed file is outside the allowlist, Codex must:

1. Stop before editing that file.
2. Explain the dependency and why a scoped alternative is insufficient.
3. State the smallest proposed allowlist expansion.
4. Identify affected consumers and regression tests.
5. Wait for approval.

Protected areas include all unrelated patient-facing content, medical records or data integrations, authentication semantics, account sharing, global analytics policy, and production regional configuration. A caregiver task does not authorize cleanup, modernization, package upgrades, route reorganization, or design-system replacement outside its direct needs.

### Content traceability requirement

Each structured content object must retain its stable approved ID. Tests should be able to answer:

- which source document and heading owns the content
- whether the copy is exact
- which interaction controls its feedback
- whether the interaction is core, optional, or an urgent interruption
- which claim and review metadata apply
- whether any value is safe to persist

Traceability metadata is for implementation and review. It must not be exposed to ordinary users unless an approved product design uses it. Source metadata must not be mistaken for review status.

### Test-fixture restraint

Tests must use fictional, nonidentifying values. Fixtures must not resemble a real user record, contain a genuine phone number, reproduce an actual clinician message, or enter medication doses or glucose readings merely to test rejection. Use clearly synthetic invalid tokens where field-boundary testing requires an excluded-value category.

Regional tests may use unmistakable controlled fixtures such as a test-only region label and noncallable placeholder value. Test configuration must be impossible to ship as verified production data. Screenshots must not display a plausible but unverified emergency or crisis contact.

### Approval checkpoints

Approval after a phase means only that its documented scope may become the dependency for the next approved phase. It does not:

- approve public release
- convert `not-reviewed` content to reviewed
- approve a new storage or analytics purpose
- authorize changes to exact learner copy
- authorize real patient or supporter data
- waive later accessibility, privacy, clinical, cultural, emotional-safety, or regional gates

If a later audit discovers a defect in an approved earlier phase, the affected area may be reopened through the relevant audit prompt. The correction must remain narrow, evidence-backed, and fully reported.

## Master Codex Audit Prompt

### MASTER CODEX PROMPT: CAREGIVER REPOSITORY AUDIT

```text
You are auditing the existing Health Decoded repository before implementing its caregiver experience, publicly titled “Support Someone You Care About.”

Objective

Perform a read-only repository audit. Propose a repository-specific implementation architecture for the approved caregiver specifications. Do not modify code yet.

Authoritative files

The repository must contain:

docs/caregiver/00-CAREGIVER-SYSTEM.md
docs/caregiver/01-CAREGIVER-CONTENT.md
docs/caregiver/02-CAREGIVER-TOOLS.md
docs/caregiver/03-CAREGIVER-CODEX-BUILD.md

Use the source hierarchy in 03-CAREGIVER-CODEX-BUILD.md. The Binding Correction Register resolves CG-TOOL-ISSUE-001 only. Do not invent any other correction.

Context limit

Do not load every learner-facing section. Read:

1. From 00-CAREGIVER-SYSTEM.md: Purpose and authority; Product scope and audience; Approved experience architecture; Completion and progress; Product responsibility boundaries; Privacy and storage system; Visual design system; Responsive and accessibility system; Codex handoff system; Source-of-truth hierarchy; Remaining unresolved decisions.
2. From 01-CAREGIVER-CONTENT.md: Document Metadata; Table of Contents; Content ID Index; Interaction Inventory; Content-Wide Review Requirements; Unresolved Decisions; End-of-Document Control Register.
3. From 02-CAREGIVER-TOOLS.md: Document Metadata; Table of Contents; Tool ID Index; Cross-Tool Interaction Inventory; Shared Tool Behavior; Cross-Document Issue Register; Final Tool Consistency Audit; Remaining unresolved tool decisions.
4. From 03-CAREGIVER-CODEX-BUILD.md: Document Metadata through Repository Audit Requirements; Proposed Conceptual Architecture; Routing and Navigation Requirements; Content Implementation Model; Component Principles; Progress and Completion Model; Privacy and Analytics Model; Local Storage Model; Print and HTML Export Model; Regional Configuration Contract; Accessibility Requirements; Testing Strategy; Implementation Phases.

Repository inspection

Inspect framework and version, routing, navigation, existing caregiver routes and content, design tokens, typography, colors, spacing, radii, shadows, responsive utilities, animation, reduced motion, accessibility utilities, forms, dialogs, status and alerts, feedback, progress persistence, authentication, account storage, browser-local storage, print, export, tests, lint, TypeScript, analytics, error reporting, content loading, mobile navigation, Lessons, and Stories.

Identify:

- components safe to reuse
- components safe only after modification
- components that would make Caregiver too similar to Dashboard, Journey, Lessons, Stories, Resources, or Profile
- anti-card conflicts
- false affordances and hover on static elements
- accessibility risks
- storage, analytics, and error-reporting risks
- route or content conflicts

Required proposals

Propose:

- routes and navigation placement
- route shell and component boundaries
- deterministic typed content loading
- minimal progress state
- session-only state boundaries
- local storage mechanism for Know the Plan and Shared Support Plan
- versioned local document schema and conflict recovery
- centralized regional configuration
- print preview, browser print, and semantic HTML export
- testing and accessibility approach
- expected file-change manifest

Storage decision

Compare any existing repository abstraction, IndexedDB, and localStorage against data size, browser support, migrations, quota behavior, error accessibility, privacy, and testability. Recommend one mechanism or recommend disabling saving. Do not implement it. It requires approval.

Routing decision

Preferred conceptual routes are /caregiver, stable module routes, four stable tool routes, and /caregiver/complete. Explain any deviation before implementation.

Content constraints

Do not rewrite approved copy. Do not create missing copy. Do not connect caregiver content to runtime generative rewriting. Do not create patient-data access, linked caregiver oversight, cloud save, cross-account sync, medical interpretation, treatment advice, regional phone numbers, or review claims.

Audit report

Return:

A. Repository facts
B. Caregiver-related findings
C. Proposed implementation architecture
D. Proposed file-change manifest, including protected unchanged areas
E. Risks ranked blocker, high, moderate, or low
F. Genuine approval decisions

For each claim, label it verified, inferred, not tested, or blocked. Include exact repository paths and evidence. Report conflicts with exact document headings and IDs.

Stopping condition

Stop after the audit and proposal. Do not modify code, content, configuration, dependencies, tests, or documentation. Wait for product approval.
```

## Phased Codex Prompts

Each prompt below is standalone after the four authoritative documents and the approved Phase 0 report are present in the repository. Before using a prompt, replace bracketed repository-specific file scopes with the approved audit manifest. If repository paths differ, preserve the same scope rather than guessing.

### 1. CODEX PROMPT: CAREGIVER FOUNDATION

```text
Objective

Implement only the approved caregiver foundation and deterministic content architecture in the existing Health Decoded repository. Do not build the landing page, modules, tools, or completion page.

Read

- 00-CAREGIVER-SYSTEM.md: Approved experience architecture; Completion and progress; Interaction system; Feedback system; Knowledge-check system; Reflection system; Medical-safety system; Region and localization system; Privacy and storage system; Visual design system; Motion system; Responsive and accessibility system; Print and export system; Codex handoff system.
- 01-CAREGIVER-CONTENT.md: Content ID Index and Interaction Inventory only.
- 02-CAREGIVER-TOOLS.md: Tool ID Index, Cross-Tool Interaction Inventory, and Shared Tool Behavior only.
- 03-CAREGIVER-CODEX-BUILD.md: Binding Correction Register; Context-Limit Strategy; Proposed Conceptual Architecture; Content Implementation Model; Component Principles; Progress and Completion Model; Privacy and Analytics Model; Regional Configuration Contract; Accessibility Requirements; Phase 1.
- Approved Phase 0 repository report.

Scope and allowed changes

Change only [approved caregiver foundation files], [approved scoped design-token files], and tests directly required for this foundation. Preserve all unrelated routes and features.

Implement

- typed stable caregiver IDs and content contracts
- corrected completion metadata for all module interactions, without loading full copy
- caregiver route-shell foundation without visible unfinished destinations
- minimal progress interfaces, separating keyIdeaUnderstood from completion
- session-only reflection and private-input contracts
- centralized regional configuration interface with unavailable, draft, verified, and expired states
- exact safe-fallback plumbing without real regional phone numbers
- accessible feedback, focus, and safety-interruption primitives
- scoped caregiver visual tokens reconciled with repository tokens
- test helpers for content integrity and state

Do not implement local persistence for T2 or T4 until the separately approved storage mechanism exists. Do not add analytics events unless included in the approved audit plan. Do not include learner-facing placeholder prose.

Acceptance and tests

- stable IDs are unique
- type system prevents unapproved runtime generated content
- progress formula can represent each corrected core interaction
- reflections and sensitive interaction answers are excluded from persistent interfaces
- regional statuses withhold draft and expired contacts
- shared foundations are keyboard, focus, reduced-motion, and screen-reader ready
- TypeScript, lint, relevant unit tests, and production build pass

Report using the Final Codex Report Format. Include exact deviations and any repository conflict.

Stop after foundation and tests. Do not implement the landing page or a module. Wait for approval.
```

### 2. CODEX PROMPT: CAREGIVER LANDING PAGE

```text
Objective

Implement only the caregiver landing page, its navigation entry, and its safe first-visit and returning-user states.

Read

- 00-CAREGIVER-SYSTEM.md: Approved experience architecture; Completion and progress; Voice and tone; Emergency interruption; Visual design system; Motion system; Responsive and accessibility system.
- 01-CAREGIVER-CONTENT.md: LANDING PAGE in full, including CG-LANDING, Visual Identity, Complete Experience Flow and Learner-Facing Content, CG-LANDING-I01, CG-LANDING-I02, and acceptance criteria.
- 03-CAREGIVER-CODEX-BUILD.md: Routing and Navigation Requirements; Visual Implementation Requirements; Progress and Completion Model; Accessibility Requirements; Phase 2.
- Approved Phase 0 and Phase 1 reports.

IDs

Implement CG-LANDING, CG-LANDING-I01, and CG-LANDING-I02 exactly.

Scope

Change only [landing route], [approved navigation file], [caregiver landing components/content], and direct tests. Do not implement module or tool pages. Links may point only to routes approved to exist; unfinished routes require a nondeceptive approved handling.

Requirements

Preserve exact visible copy, route logic, first-visit state, returning state, immediate-safety access, direct tool access, and recommended but unenforced module order. Returning state may show recent module, next module, or recent tool name, never private content.

Use an open editorial composition, not a course grid or wall of cards. Static areas must not appear clickable. Keep immediate help within two intentional actions. Provide complete keyboard, screen-reader, reduced-motion, 200 percent zoom, and mobile behavior.

Tests and evidence

Test route chooser logic, keyboard order, returning-state privacy, safe missing progress, no sensitive URLs, and responsive layouts. Capture visual evidence at 320, 375, 768, 1024, and 1440 pixels. Run TypeScript, lint, relevant tests, accessibility checks, and build.

Report using the Final Codex Report Format. Stop after the landing page. Wait for approval.
```

### 3. CODEX PROMPT: MODULE 2 PROTOTYPE

```text
Objective

Implement Module 2, Support Without Taking Over, as the first full caregiver module prototype. Do not build any other module.

Read

- 00-CAREGIVER-SYSTEM.md: Autonomy and consent system; Support versus control framework; Voice and tone; Scenario, interaction, feedback, knowledge-check, reflection, privacy, visual, motion, responsive, and accessibility systems; Risks to test in the Module 2 prototype.
- 01-CAREGIVER-CONTENT.md: MODULE 2 in full, CG-M2-S01 to S08, CG-M2-I01 to I05, CG-M2-Q01 to Q03, CG-M2-R01, practical scripts, takeaway, completion, responsive/accessibility intent, medical/privacy notes, sources, acceptance criteria.
- 03-CAREGIVER-CODEX-BUILD.md: Binding Correction Register; Interaction Implementation Requirements; Progress and Completion Model; Accessibility Requirements; Prototype-first rule; Phase 3.

Completion correction

CG-M2-I03 is the only core application required for completion. CG-M2-I01, I02, I04, and I05 are optional practice. Knowledge checks and reflection do not gate. Takeaway viewing does gate.

Scope

Change only [Module 2 route and content], [approved shared module primitives], and direct tests. Do not implement M1, M3, M4, M5, or tools.

Implementation

Preserve exact narrative, dialogue, choices, logic, feedback, revision, and natural imperfections. Implement the consequence map, relational continuum, permission sentence builder, branching refusal conversation, and repair sequence as distinct mechanics. Do not collapse them into generic cards or multiple choice.

Support full keyboard and screen-reader equivalents, predictable focus, deliberate announcements, no auto-advance, reduced motion, and mobile reflow that preserves cognitive work.

Acceptance

- exact content integrity passes
- I03 alone supplies coreApplicationCompleted after valid submission
- optional interactions never gate
- central idea and takeaway gates work
- quiz updates keyIdeaUnderstood only
- reflection remains session-only
- dialogue or answers never enter analytics or persistent progress
- Module 2 remains visually distinct from Lessons and Stories
- all required responsive, accessibility, type, lint, test, and build checks pass

Provide screenshots at the five required widths and document manual keyboard and screen-reader checks. Report with the Final Codex Report Format.

Stop after Module 2. Wait for prototype review before scaling.
```

### 4. CODEX PROMPT: MODULE 2 PROTOTYPE AUDIT AND REVISION

```text
Objective

Audit the implemented Module 2 prototype, then apply only evidence-backed caregiver fixes approved within this prompt’s scope. Do not build new content.

Read

- 00-CAREGIVER-SYSTEM.md: Risks to test in the Module 2 prototype; visual, motion, responsive, accessibility, privacy, interaction, and feedback systems.
- 01-CAREGIVER-CONTENT.md: Module 2 visual identity, interaction specifications, responsive/accessibility intent, medical/privacy notes, and acceptance criteria. Read exact copy only to compare integrity.
- 03-CAREGIVER-CODEX-BUILD.md: Prototype-first rule; Visual and Interaction Implementation Requirements; Testing Strategy; Phase 4.
- Prior Phase 3 report and product feedback.

Audit

Inspect emotional pacing, spoken dialogue naturalness, permission clarity, intention versus impact, support versus surveillance, interaction value, repetition, card overuse, mobile stacking, keyboard and screen-reader behavior, reduced motion, completion meaning, and distinction from Lessons and Stories.

Scope

Modify only [Module 2 files] and [shared primitives explicitly approved for prototype correction]. Never rewrite learner copy or alter logic without reporting a source conflict. Do not build another module.

Evidence

Run content-integrity diff, completion tests, manual keyboard path, selected screen-reader path, reduced-motion review, 200 percent zoom, and layouts at 320, 375, 768, 1024, and 1440 pixels. Provide before-and-after evidence for material visual changes.

Acceptance

No interaction merely repeats narrative. No static element appears clickable. The module is not a wall of cards. Every interaction retains its cognitive task on mobile and assistive paths. Completion remains participation, not mastery.

Report fixes, unchanged findings, unresolved risks, and whether shared infrastructure is safe to scale. Stop and wait for explicit approval before Modules 1 or 3.
```

### 5. CODEX PROMPT: MODULE 1

```text
Objective

Implement only Module 1, What They May Be Feeling, using the approved post-prototype infrastructure.

Read

- 00-CAREGIVER-SYSTEM.md: Voice and tone; Scenario; Interaction; Feedback; Knowledge-check; Reflection; Privacy; Visual; Motion; Responsive and accessibility systems.
- 01-CAREGIVER-CONTENT.md: MODULE 1 in full, CG-M1-S01 to S07, CG-M1-I01 to I03, CG-M1-Q01 to Q03, CG-M1-R01, scripts, takeaway, completion, intent, notes, sources, and acceptance.
- 03-CAREGIVER-CODEX-BUILD.md: Binding Correction Register; Component Principles; Interaction Requirements; Progress and Completion; Phase 5.

Completion

Only submitted CG-M1-I01 is the core application. I02 and I03 are optional practice. Quiz and reflection do not gate. Takeaway does.

Scope

Change only [Module 1 files], approved shared primitives, and direct tests. Do not build Module 3 in this run unless the user separately invokes its prompt.

Implementation

Preserve the two-column evidence workbench, timing task, and response mixer as distinct mechanics. Keep observation separate from interpretation. Do not diagnose feelings or score free text for emotional correctness. Reflection stays session-only.

Test exact copy, sorting logic, open text privacy, completion, keyboard and screen-reader equivalents, focus, revision, reduced motion, responsive widths, TypeScript, lint, tests, and build.

Report using the required format. Stop after Module 1 and wait.
```

### 6. CODEX PROMPT: MODULE 3

```text
Objective

Implement only Module 3, Everyday Support That Actually Helps.

Read

- 00-CAREGIVER-SYSTEM.md: Autonomy and consent; Support versus control; interaction, feedback, reflection, privacy, visual, responsive, and accessibility rules.
- 01-CAREGIVER-CONTENT.md: MODULE 3 in full, CG-M3-S01 to S07, CG-M3-I01 to I04, CG-M3-Q01 to Q03, CG-M3-R01, scripts, takeaway, completion, notes, sources, and acceptance.
- 03-CAREGIVER-CODEX-BUILD.md: Binding Correction Register; Interaction Requirements; Progress and Completion; Phase 5.

Completion

Only submitted CG-M3-I02 is the core application. I01, I03, and I04 are optional. Quiz and reflection do not gate. Takeaway does.

Scope

Change only [Module 3 files], approved shared primitives, and direct tests.

Implementation

Preserve the shared-table planning workspace, request matching, support menu, and paired routine comparison. Do not turn household planning into food, medication, reading, or exercise advice. Do not infer that medically related help outranks requested practical help. Preserve ordinary-life pacing and the distinction between organization and monitoring.

Test exact copy, matching, optional skipping, completion, privacy, keyboard and screen-reader paths, responsive reflow without loss of spatial task, reduced motion, TypeScript, lint, tests, and build.

Report using the required format. Stop after Module 3 and wait.
```

### 7. CODEX PROMPT: MODULE 4

```text
Objective

Implement only Module 4, When Something Feels Wrong, under heightened medical, emergency, regional, privacy, and accessibility controls.

Read

- 00-CAREGIVER-SYSTEM.md: Product responsibility boundaries; Medical-safety system; Emergency interruption; Region and localization; Privacy; Responsive and accessibility; source and review requirements. Apply MEDICAL-01 to MEDICAL-15, EMERGENCY-01 to EMERGENCY-10, REGION-01 to REGION-08, and relevant accessibility rules.
- 01-CAREGIVER-CONTENT.md: MODULE 4 in full, especially Required Final Safety Language, CG-M4-S01 to S08, CG-M4-I01 to I05, CG-M4-Q01 to Q03, CG-M4-R01, takeaway, completion, medical/privacy notes, claims, clinical-review list, and acceptance.
- 03-CAREGIVER-CODEX-BUILD.md: Binding Correction Register; Product Decisions and Open Release Gates; Regional Configuration Contract; Interaction and Accessibility Requirements; Testing Strategy; Phase 6.

Completion

CG-M4-I02 is the only core application in ordinary flow. I01, I04, and I05 are optional. I03 is an urgent interruption, never completion or optional practice. Quiz and reflection do not gate. Takeaway does.

Urgent behavior

Urgent direction replaces learning immediately. Do not ask a screening question, require input, diagnose severity, award completion, mark failure, or require return. Use the centralized regional provider. For unavailable, draft, or expired data, show the exact approved safe fallback. Do not hardcode or guess real contacts.

Scope

Change only [Module 4 files], [approved regional provider surfaces], [approved safety primitive], and direct tests. Do not add medical content or real regional data.

Implementation

Preserve the context organizer, source-layer match, urgent interruption, concise handoff sequence, and unsafe-improvisation recognition. Never interpret readings, diagnose, recommend doses, repeat medication, prescribe food or exercise, invent device operation, or delay professional help.

Acceptance and evidence

- exact safety copy and all feedback are intact
- urgent direction precedes educational interaction and has correct focus
- core completion comes only from I02
- no urgent route changes progress
- unavailable, draft, verified test fixture, and expired configuration states pass
- verified test fixtures remain clearly nonproduction
- keyboard, screen-reader, reduced-motion, zoom, responsive, type, lint, test, and build evidence passes
- internal prototype status and not-reviewed metadata are reported

State whether qualified clinical, crisis, regional, accessibility, and privacy reviews were verified. If not, label public and medical/emergency testing blocked. Stop after Module 4 and wait.
```

### 8. CODEX PROMPT: MODULE 5

```text
Objective

Implement only Module 5, The Caregiver Matters Too.

Read

- 00-CAREGIVER-SYSTEM.md: Autonomy and consent; healthy boundary rules; Self-Check system boundaries; voice, interaction, feedback, reflection, privacy, visual, responsive, and accessibility systems.
- 01-CAREGIVER-CONTENT.md: MODULE 5 in full, CG-M5-S01 to S07, CG-M5-I01 to I05, CG-M5-Q01 to Q03, CG-M5-R01, scripts, takeaway, completion, notes, sources, and acceptance.
- 03-CAREGIVER-CODEX-BUILD.md: Binding Correction Register; Interaction Requirements; Progress and Completion; Privacy; Phase 7.

Completion

Only submitted CG-M5-I01 is the core application. I02 to I05 are optional. Quiz and reflection do not gate. Takeaway does.

Scope

Change only [Module 5 files], approved shared primitives, and direct tests.

Implementation

Preserve the responsibility map, sustainability comparison, boundary rehearsal, network map, and nonclinical load review. Do not diagnose burnout, score strain, transfer medical authority, frame boundaries as punishment, or broaden disclosure to recruit backup. Supporter capacity and patient autonomy remain separate.

Maintain the widening-network visual metaphor without producing a dashboard, clinical assessment, or guilt-based completion. Session-only text must remain ephemeral.

Test content integrity, responsibility assignments, optional practice, core completion, privacy, no diagnostic state, keyboard and screen-reader operation, responsive equivalents, reduced motion, TypeScript, lint, tests, and build.

Report using the required format. Stop after Module 5 and wait.
```

### 9. CODEX PROMPT: WHAT SHOULD I SAY?

```text
Objective

Implement only What Should I Say?, a bounded conversation-preparation tool. It is not a chatbot and does not send messages.

Read

- 00-CAREGIVER-SYSTEM.md: Autonomy, consent, support versus control, voice, scenario, interaction, feedback, privacy, responsive, and accessibility systems.
- 02-CAREGIVER-TOOLS.md: Shared Tool Behavior and TOOL 1 in full, including CG-T1-SC01 to SC12, CG-T1-I01 to I07, storage, states, print, and error copy; relevant tool review requirements.
- 03-CAREGIVER-CODEX-BUILD.md: Content and Component Principles; Interaction Requirements; Privacy and Analytics; Accessibility; Phase 8.

IDs

Implement exactly CG-T1-SC01 to CG-T1-SC12 and CG-T1-I01 to CG-T1-I07.

Scope

Change only [T1 route/content/components], approved shared tool shell, and direct tests. Do not implement an LLM, freeform chatbot, sending, contact lookup, automatic save, print, or export.

Implementation

Preserve situation selection, goal selection, opening comparison, intention/impact review, language adaptation, follow-up or pause, and preparation review. Use the exact scenario library. Keep drafts session-only. Clipboard use is deliberate and must announce success or failure. No message is sent and no contact is accessed.

Do not generate new scripts or “improve” learner text. Do not save drafts to progress, local storage, account data, analytics, errors, URLs, or AI Tutor.

Acceptance

- all scenarios and interaction logic are exact
- selected scenarios do not expose hidden private data
- no network send or automatic persistence exists
- clipboard requires explicit action
- reset and leave behavior match approved copy
- keyboard, screen-reader, mobile, reduced-motion, zoom, and error behavior pass
- content integrity, privacy tests, TypeScript, lint, tests, and build pass

Report all analytics events, including none. Stop after T1 and wait.
```

### 10. CODEX PROMPT: CAREGIVER SELF-CHECK

```text
Objective

Implement only Caregiver Self-Check as an unscored, nonclinical, session-only noticing tool.

Read

- 00-CAREGIVER-SYSTEM.md: Reflection system; Region and localization; Privacy and storage; Caregiver Self-Check system; Responsive and accessibility.
- 02-CAREGIVER-TOOLS.md: Shared Tool Behavior and TOOL 3 in full, including entry copy, Q01 to Q15, descriptive pattern logic CG-T3-R01 to R06, no-dominant-pattern behavior, CG-T3-I01 to I03, storage/states, and acceptance; CG-TOOL-REV-006 to REV-009.
- 03-CAREGIVER-CODEX-BUILD.md: Product Decisions for Self-Check urgent routes; Privacy and Analytics; Regional Contract; Accessibility; Phase 9.

Scope

Change only [T3 route/content/components], approved shared tool shell, voluntary urgent surfaces, and direct tests. Do not implement scoring, diagnosis, severity, account persistence, outreach, copy, print, export, or sharing.

Implementation

Keep all questions optional. Implement descriptive pattern logic exactly, including tie and no-dominant-pattern behavior. Do not create a numeric total, hidden risk score, diagnosis, or claim of validation. Results identify at most the approved descriptive patterns and do not infer crisis.

Keep voluntary routes distinct:

1. I need urgent emotional support right now
2. Someone may be in immediate danger

Ordinary answers never trigger either route. Both use the centralized regional provider. With unavailable, draft, or expired data, show the exact fallback, no guessed number, no inferred location, and an unobstructed exit.

Privacy

Answers, patterns, and routes remain session-only and are excluded from progress, analytics, errors, URLs, AI Tutor, clipboard, print, and export.

Tests

Test optional questions, pattern logic, ties, no dominant pattern, session reset, no score in DOM or state, no auto-trigger, regional statuses, keyboard, screen reader, reduced motion, zoom, all required widths, TypeScript, lint, tests, and build.

Report review status honestly. Without required methodology, emotional-safety, crisis, regional, and accessibility review, external urgent-route testing and public release remain blocked. Stop after T3.
```

### 11. CODEX PROMPT: KNOW THE PLAN

```text
Objective

Implement only Know the Plan, including its approved deliberate local-save, print-preview, browser-print, and semantic HTML-export behavior. It organizes where clinician-provided instructions are located and clarifies an agreed supporter role. It does not create medical instructions.

Prerequisite

Use only the storage mechanism explicitly approved after Phase 0. If no mechanism was approved, implement the tool with saving disabled and truthful unavailable behavior. Do not choose or silently substitute a mechanism now.

Read

- 00-CAREGIVER-SYSTEM.md: Product responsibility; Autonomy and consent; Medical-safety; Emergency interruption; Region; Privacy and storage; Shared Support Plan authority only for contrast; Responsive/accessibility; Print/export.
- 02-CAREGIVER-TOOLS.md: Shared Tool Behavior and TOOL 2 in full, CG-T2-I01 to I06, preparation checklist, finalized fields, exact notices and states, local persistence, print/export, medical/safety, acceptance; CG-TOOL-REV-003 to REV-005.
- 03-CAREGIVER-CODEX-BUILD.md: Product Decisions; Local Storage Model; Print and HTML Export; Regional Contract; Privacy; Accessibility; Phase 10.

Scope

Change only [T2 route/content/components], [approved local-document adapter], [shared print/HTML export foundation], [regional integration], and direct tests. Do not implement T4.

Implementation

Preserve the participation checkpoint, question preparation, location/contact organizer, agreed-role boundaries, currency review, and output choices. Prohibit entry of doses, readings, symptom interpretation, treatment directions, copied clinician messages, or invented instructions as specified by the source.

Saving must be deliberate, browser-local, one active document plus one conflict-recovery copy, versioned, timestamped, visibly stateful, and safe on failure. No automatic save, cloud sync, hidden persistence, silent merge, or security claim.

Print and export require explicit confirmation and approved notices. HTML contains semantic real text, no scripts, hidden data, analytics, progress, reflections, Self-Check, AI history, tokens, storage keys, or route history. No direct PDF export unless separately approved.

Tests

Test participation gate, field exclusions, save states, unavailable storage, quota or write failure, schema migration, conflict recovery, reset versus delete, shared-device warning, regional statuses, print structure, HTML sanitization, filename, explicit confirmation, keyboard, screen reader, zoom, widths, TypeScript, lint, tests, and build.

Report privacy and medical implications and review gates. Stop after T2 and wait.
```

### 12. CODEX PROMPT: SHARED SUPPORT PLAN

```text
Objective

Implement only Shared Support Plan as a revisable relational preference document. It is not a medical plan, legal consent, signature instrument, account-sharing system, or authority transfer.

Prerequisite

Reuse only the approved local-save, print, and HTML-export foundation from T2. If persistence was not approved, keep saving disabled. Do not broaden the storage model.

Read

- 00-CAREGIVER-SYSTEM.md: Autonomy and consent; Support versus control; Privacy/storage; Shared Support Plan authority; Responsive/accessibility; Print/export.
- 02-CAREGIVER-TOOLS.md: Shared Tool Behavior and TOOL 4 in full, entry and participation gate, preparation worksheet, preference states, CG-T4-A01 to A12, disagreement/change, CG-T4-I01 to I06, confirmation, save/conflict states, output, boundaries, acceptance; CG-TOOL-REV-010 to REV-013.
- 03-CAREGIVER-CODEX-BUILD.md: Product Decisions; Local Storage; Print and HTML Export; Privacy; Accessibility; Phase 11.

Scope

Change only [T4 route/content/components], approved shared tool/output adapters, and direct tests.

Implementation

Require direct participation or explicit approval by the person living with diabetes as specified. Preserve the preparation-only path. Every agreement area starts Not discussed and confirms independently. Unresolved stays unresolved. Permission may change. Do not create a global consent checkbox, assumed yes, signature simulation, authority score, or automatic merge.

Keep patient-first reading order and supporter capacity distinct. A supporter can set their own boundary but cannot use it as punishment or medical control.

Saving follows the approved one-active-document and one-recovery-copy model. Print and export show current area states, unresolved items, review date, privacy, authority, outdated-copy, and regional status notices. Saving or printing does not increase authority.

Tests

Test participation gate, preparation path, independent area states, withdrawal, disagreement, unresolved preservation, no global consent, save/conflict/delete, print/export exclusions, semantic order, sensitive analytics exclusion, keyboard, screen reader, reduced motion, zoom, widths, TypeScript, lint, tests, and build.

Report using the required format. Stop after T4 and wait.
```

### 13. CODEX PROMPT: FINAL COMPLETION EXPERIENCE

```text
Objective

Implement only the final caregiver completion experience and private next-step category state.

Read

- 00-CAREGIVER-SYSTEM.md: Completion and progress; voice and tone; reflection; privacy; visual, motion, responsive, and accessibility systems.
- 02-CAREGIVER-TOOLS.md: FINAL CAREGIVER COMPLETION EXPERIENCE in full, including metadata, visual identity, exact copy, CG-COMPLETE-I01, and completion states.
- 03-CAREGIVER-CODEX-BUILD.md: Progress and Completion Model; Privacy and Analytics; Accessibility; Phase 12.

Scope

Change only [completion route or state], [private progress adapter], and direct tests. Do not add badges, certification, mastery, celebration effects, tool requirements, or public sharing.

Logic

Section completion requires all five modules completed and a successfully persisted current next-step category. Tools, quizzes, reflections, printing, and saving plans remain optional.

Persist only the approved category. Custom detail remains session-only and is excluded from analytics, errors, URLs, account sharing, and AI Tutor. If category persistence fails, preserve module completion, do not claim section completion, show exact failure behavior, and allow retry or changing the category.

Visual and emotional behavior

Use calm consolidation and an open path, not a trophy screen. Do not claim expertise, readiness, improved patient outcomes, sacrifice, or moral success. Revisit remains available and does not erase completion.

Test all gating combinations, persistence failure, category changes, custom-detail privacy, revisit, tool independence, keyboard, screen reader, reduced motion, zoom, required widths, TypeScript, lint, tests, and build.

Report using the required format. Stop after completion and wait.
```

### 14. CODEX PROMPT: FINAL INTEGRATION

```text
Objective

Integrate the approved caregiver experiences without changing learner-facing content or expanding scope. Verify routes, navigation, progress, deep links, return paths, immediate help, and content integrity.

Read

- 00-CAREGIVER-SYSTEM.md: Approved architecture; completion/progress; emergency interruption; privacy; responsive/accessibility; Codex handoff.
- 01-CAREGIVER-CONTENT.md: Content ID Index, Interaction Inventory, every module acceptance section, content-wide consistency audit, and End-of-Document Control Register. Read exact copy only for integrity failures.
- 02-CAREGIVER-TOOLS.md: Tool ID Index, Cross-Tool Interaction Inventory, every tool acceptance section, final completion states, consistency audit, and control index.
- 03-CAREGIVER-CODEX-BUILD.md: Source Model; Correction Register; Routing and Navigation; Progress and Completion; Privacy; Testing; Phase 13.

Scope

Change only [caregiver routes, caregiver navigation integration, caregiver progress integration, caregiver tests]. Protect patient-facing Lessons, Stories, Dashboard, Resources, Profile, account systems, and unrelated content.

Verify

- one landing route, five module routes, four tool routes, and completion route or state
- direct tool access without module prerequisites
- reliable deep-link return
- immediate-help access within two intentional actions
- no sensitive URLs or returning-state previews
- corrected completion logic for all modules
- section completion and failure behavior
- Revisit preserves completion
- no tool gates completion
- no duplicate IDs, missing feedback, or unapproved placeholders

Do not perform broad visual redesign or accessibility, privacy, or medical repairs outside a concrete integration defect. Log such findings for their audit phases.

Run route, state, content-integrity, navigation, regression, TypeScript, lint, unit, integration, available accessibility, and production-build checks. Report exact protected areas and any incidental changes. Stop after integration.
```

### 15. CODEX PROMPT: ACCESSIBILITY AUDIT

```text
Objective

Conduct a caregiver-only accessibility audit and repair verified defects within approved content and behavior. Do not claim WCAG 2.2 AA conformance solely from automation.

Read

- 00-CAREGIVER-SYSTEM.md: Interaction accessibility; Responsive and accessibility system; motion; print/export; emergency focus rules.
- 01-CAREGIVER-CONTENT.md: landing and each module Responsive and Accessibility Intent plus acceptance criteria.
- 02-CAREGIVER-TOOLS.md: Shared accessibility behavior, each tool acceptance criteria, print/export behavior, urgent behavior.
- 03-CAREGIVER-CODEX-BUILD.md: Accessibility Requirements; Interaction Requirements; Print and HTML Export; Testing; Phase 14.

Scope

Audit every implemented caregiver route. Modify only caregiver files and shared components when the change is demonstrably safe for existing consumers. If a shared change risks unrelated areas, create a caregiver-scoped fix or report the blocker.

Verify manually and automatically

- landmarks, heading order, names, roles, states, labels, descriptions
- full keyboard operation and visible focus
- focus movement and restoration
- live announcements after deliberate actions
- sorting, sequencing, maps, builders, branching, and spatial alternatives
- no auto-advance, time limit, unexpected audio, or motion dependence
- reduced motion
- target size and contrast
- color independence
- errors, summaries, field recovery
- urgent interruption focus
- clipboard, save, delete, conflict, and export announcements
- 200 percent zoom
- 320, 375, 768, 1024, and 1440 pixel layouts
- print preview and HTML reading order

Use available automated tooling, manual keyboard review, and the repository-supported screen reader or accessibility-tree inspection. Clearly mark assistive technologies not tested.

Do not change exact learner copy silently. Accessible names may add nonvisible clarity only when meaning remains exact; report each material addition.

Return findings by severity, fixes, evidence, untested items, and residual risks. Run TypeScript, lint, tests, accessibility checks, and build. Stop after this audit.
```

### 16. CODEX PROMPT: PRIVACY AND SECURITY AUDIT

```text
Objective

Audit the caregiver implementation for privacy, local-data, analytics, error-reporting, shared-device, output, and security-truthfulness risks. Repair only verified caregiver defects.

Read

- 00-CAREGIVER-SYSTEM.md: Autonomy/consent protected information; Privacy and storage; Shared Support Plan authority; print/export.
- 02-CAREGIVER-TOOLS.md: Shared privacy; T1 storage; T2 local persistence and output; T3 unsupported behavior; T4 persistence and output; relevant review requirements.
- 03-CAREGIVER-CODEX-BUILD.md: Privacy and Analytics; Local Storage; Print and HTML Export; Progress; Testing; Phase 15.

Inventory

Inspect analytics events and properties, error-report payloads and breadcrumbs, URLs, page titles, notifications, logs, clipboard, progress storage, session state, local document storage, migration, quota handling, conflict copies, deletion, reset, print, HTML export, authentication boundaries, and cross-account behavior.

Required checks

- reflections, drafts, Self-Check, plans, participation choices, custom detail, names, contacts, and medical pointers never enter prohibited channels
- sensitive interaction answers are not persisted for completion
- T1 and T3 are session-only
- T2 and T4 save only deliberately using the approved mechanism
- no cloud sync or account sharing is introduced
- one active and one recovery document limit holds
- no silent overwrite or merge
- truthful save, failure, and deletion language
- no unsupported encryption, security, backup, or deletion claim
- exported HTML is script-free and contains only approved visible document content
- printed output excludes private learning data

Use nonsensitive test fixtures. Do not expose real user entries in evidence. Report every caregiver analytics event and every error-report integration.

Fix verified issues within [caregiver privacy scope]. Treat new authority, new storage, or schema expansion as blocked pending approval.

Run privacy tests, storage tests, output sanitization, TypeScript, lint, tests, and build. Report threat assumptions, verified protections, unsupported claims removed, and remaining risks. Stop after this audit.
```

### 17. CODEX PROMPT: MEDICAL AND REGIONAL IMPLEMENTATION AUDIT

```text
Objective

Audit medical restraint, emergency interruption, regional configuration, plan authority, and review claims across the caregiver implementation. Do not add medical guidance or real regional data.

Read

- 00-CAREGIVER-SYSTEM.md: Product responsibility; Medical-safety; Emergency interruption; Region/localization; source/review.
- 01-CAREGIVER-CONTENT.md: Module 4 Required Final Safety Language, medical/privacy notes, source claims, Clinical-Review List.
- 02-CAREGIVER-TOOLS.md: T2 medical/safety, T3 urgent routes, T4-A11, tool-wide source and review tables, issue register.
- 03-CAREGIVER-CODEX-BUILD.md: Product Decisions and Open Release Gates; Regional Contract; Testing; Final Review Gates; Phase 16.

Audit

- no diagnosis, reading interpretation, threshold, dose, medication change, treatment improvisation, food/exercise correction, or device operation from memory
- urgent direction interrupts education without screening, scoring, or delay
- Know the Plan stores locations and agreed roles, not instructions or medical values
- Shared Support Plan remains relational and has no legal or clinical authority
- Self-Check remains nonclinical and never infers crisis
- all urgent surfaces use one regional provider
- unavailable, draft, and expired data show exact safe fallback
- no guessed, stale, or scattered real contact
- no medical-review claim without evidence
- print/export shows region status and review limits truthfully

Scope

Repair only clear implementation deviations within caregiver files. If approved learner copy appears medically unsafe, stop that affected correction, cite the exact ID, preserve the safer behavior, and request qualified review. Do not rewrite it yourself.

Tests

Run safety string and prohibited-field checks, regional status tests, urgent focus/exit tests, source-layer logic, output status tests, TypeScript, lint, tests, and build.

Report separately what is suitable for internal prototype, external relational testing, medical/emergency testing, and public release. Missing clinical or regional governance remains release-blocking. Stop after the audit.
```

### 18. CODEX PROMPT: ANTI-AI VISUAL AUDIT

```text
Objective

Audit the complete caregiver experience for repetitive, generic, card-heavy, falsely interactive, or machine-produced visual and content patterns. Apply caregiver-scoped visual repairs without rewriting approved learner-facing copy.

Read

- 00-CAREGIVER-SYSTEM.md: Voice and tone; Visual design; Motion; Responsive/accessibility; Module 2 risks.
- 01-CAREGIVER-CONTENT.md: Landing and module visual identities, interaction inventory, cross-module distinctness, language and pacing audits.
- 02-CAREGIVER-TOOLS.md: tool visual identities, cross-tool inventory, distinctness table, final completion visual identity.
- 03-CAREGIVER-CODEX-BUILD.md: Component Principles; Visual Implementation Requirements; Prototype-first rule; Phase 17.

Inspect every caregiver route for:

- wall of cards
- identical rounded containers or nested cards
- excessive pills, heavy shadows, meaningless gradients
- stock wellness imagery, repeated hearts, sparkle icons, generic illustration
- repeated three-column layouts and overly centered text
- giant empty heroes
- all modules using one shell
- static elements looking clickable or hover on static content
- generic motivational copy or accidental generated copy
- repetitive completion surfaces
- excessive or decorative animation
- interactions reduced to tap-to-reveal
- identical feedback surfaces
- hierarchy that ignores emotional pacing

Evidence

Capture screenshots or equivalent clear visual evidence at 320, 375, 768, 1024, and 1440 pixels for the landing, each module, each tool, and completion. Group evidence efficiently without omitting a route. Compare Lessons and Stories where needed to prove distinction.

Scope

Change caregiver composition, scoped tokens, spacing, dividers, state styling, and module-specific presentation only. Preserve exact copy, semantic order, cognitive mechanics, focus, contrast, and reduced motion. Do not add decorative imagery merely to create variety.

Acceptance

Each module and tool has its approved metaphor and rhythm. Reuse is logical, not visually homogenizing. Static content is visually static. Feedback supports meaning without becoming a repeated card. Mobile layouts preserve identity and cognitive task.

Run visual regression where available, accessibility spot checks, TypeScript, lint, tests, and build. Report all repairs and remaining subjective decisions. Stop after the audit.
```

### 19. CODEX PROMPT: FINAL TEST AND PRODUCTION-BUILD AUDIT

```text
Objective

Run the final caregiver test, integrity, regression, and production-build audit. Make only narrow caregiver defect repairs supported by failing evidence. Do not claim public readiness unless every named release gate is verified.

Read

- 00-CAREGIVER-SYSTEM.md: Caregiver Release Checklist; Codex handoff; source hierarchy.
- 01-CAREGIVER-CONTENT.md: Final Content Consistency Audit and End-of-Document Control Register.
- 02-CAREGIVER-TOOLS.md: Cross-Document Issue Register, Final Tool Consistency Audit, End-of-document control index.
- 03-CAREGIVER-CODEX-BUILD.md: Correction Register; Testing Strategy; Final Review Gates; Final Report Format; Four-Document Consistency Audit; Remaining Release Blockers; Phase 18.

Run

- full caregiver content-integrity and unique-ID tests
- all module and section completion permutations
- optional, quiz, reflection, Revisit, takeaway, and urgent behavior
- route, navigation, deep-link, return, and immediate-help tests
- privacy, analytics, error-report, URL, session, storage, conflict, delete, print, and HTML-export tests
- medical boundary and regional-status tests
- keyboard and available automated accessibility tests
- responsive and visual regression checks
- TypeScript, lint, unit, integration, end-to-end if available, and production build

Manually verify representative keyboard paths, screen-reader paths where available, reduced motion, 200 percent zoom, 320 and 375 mobile, tablet, desktop, print preview, exported HTML order, storage failure, and urgent exit.

Classify every result as verified, inferred, not tested, or blocked. List exact commands, versions, and results. Do not convert an unperformed manual check into a pass.

Repairs

Limit repairs to clear caregiver defects. Any content, medical, privacy architecture, regional data, or product change outside existing authority is blocked and reported.

Final conclusion

State separately:

- build status
- internal interface prototype readiness
- external relational usability testing readiness
- medical or emergency testing readiness
- public release readiness

A successful build proves only technical build status. Use the Final Codex Report Format and include a release-blocker table. Stop after the final report.
```

## Final Review Gates

### Release levels

| Level | Permitted scope | Required gates | Prohibited claims or use |
| --- | --- | --- | --- |
| Internal interface prototype | Internal development with `not-reviewed` content and controlled placeholders | Correct internal warnings, no public review claim, no unverified real contacts, privacy-safe test data | No public readiness, medical reliability, or regional verification claim |
| External usability testing | Relational, navigation, comprehension, and interface testing | Privacy, accessibility, cultural, and emotional-safety review appropriate to the study; study-specific consent and data handling | No medical or emergency reliance unless the next gate is met |
| Medical or emergency usability testing | Module 4, Know the Plan, urgent routes, or regional content | Qualified clinical, emergency/crisis, regional, privacy, and accessibility review before testing | No unreviewed safety behavior presented as dependable guidance |
| Public release | Full public caregiver experience | All named release-blocking reviews, regional owner and governance, verified nonexpired configuration, accessibility evidence, privacy/security evidence, clinical review where required | No release based only on a passing build |

### Mandatory review gates

- **Clinical:** Module 4, Know the Plan, medication/device boundaries, and safety claims.
- **Privacy and security:** local save, conflict recovery, deletion, analytics, errors, printing, export, and shared-device truth.
- **Accessibility:** keyboard, screen reader, focus, zoom, reduced motion, responsive, urgent surfaces, print, and export.
- **Cultural:** scenarios, family-role assumptions, food contexts, duty expectations, and translated variants.
- **Emotional safety:** guilt, resentment, strain, repair, coercion, crisis language, and stopping behavior.
- **Methodology:** Self-Check questions, descriptive pattern logic, ties, no-dominant behavior, and nonvalidation claims.
- **Regional governance:** named owner, official sources, verification date, cadence, expiry, translation workflow, and fallback.

No source citation replaces review. Changed safety claims return to review.

## Final Codex Report Format

Every implementation or audit phase must report:

1. Scope completed
2. Documents, headings, rule IDs, and content IDs read
3. Files created
4. Files modified
5. Files deleted
6. Content deviations
7. Missing information
8. Privacy implications
9. Medical or regional implications
10. Accessibility behavior
11. Responsive behavior
12. Tests run
13. Test results
14. TypeScript result
15. Lint result
16. Build result
17. Manual verification completed
18. Manual verification not completed
19. Remaining risks
20. Recommended next phase

Each item must distinguish:

- **verified:** supported by inspected repository evidence or a completed test
- **inferred:** reasoned from evidence but not directly verified
- **not tested:** a check was available conceptually but not completed
- **blocked:** authority, information, dependency, review, or governance is missing

Content deviations must say `None` or list exact old wording, new wording, reason, and approval. A report must not hide incidental shared-file changes.

## Four-Document Consistency Audit

### Audit result

The four-document system is implementation-coherent after the narrow completion correction in this document.

| Audit question | Result | Resolution or remaining control |
| --- | --- | --- |
| Unresolved completion ambiguity | Resolved | Five named core applications and exact patch matrix control implementation |
| Duplicated authority | Controlled | Source hierarchy and narrow correction authority prevent broad override |
| Unsafe medical behavior | No approved expansion found | Medical content remains not-reviewed; implementation and release gates remain |
| Privacy conflict | Product behavior aligned | T1, T3, reflections, and custom detail are session-only; T2 and T4 deliberate local only |
| Account-sharing assumption | Prohibited | No linked caregiver oversight, profiles, cloud workspace, or cross-account sharing |
| Hidden patient-data flow | Prohibited | Content, progress, analytics, errors, URLs, AI handoffs, and outputs have explicit exclusions |
| Conflicting storage language | Resolved at behavior level | Mechanism pending repository audit and privacy approval |
| Print/export conflict | Resolved | Print preview, browser print, and semantic HTML only; direct PDF requires separate approval |
| Regional hardcoding | Prohibited | Central provider, placeholders, exact fallback, governance blocker |
| Inaccessible interaction requirement | No authorized simplification | Equivalent cognitive tasks required; specialist and user verification remain |
| Excessive context | Resolved | Exact per-phase context map prevents full-document loading |
| Codex asked to invent copy | Prohibited | Deterministic content and blocker-reporting rules |
| Codex asked to read all files each phase | No | Master audit reads indexes; phases read named sections |
| Tools required for completion | No | Tools remain independently available and optional |
| Module 4 treated as ordinary learning | No | Urgent interruption overrides progress; heightened gates apply |
| Know the Plan treated as medical plan | No | It organizes locations and roles only |
| Shared Support Plan treated as legal consent | No | Area-level revisable preferences with no legal authority |
| Self-Check treated as diagnostic | No | No score, diagnosis, automatic urgent trigger, or validation claim |
| What Should I Say? becomes chatbot | Prohibited | Fixed scenario preparation, session-only, no sending or generative rewriting |
| Visual system collapses into cards | Prohibited and audited | Module/tool metaphors plus anti-AI audit and screenshot evidence |
| Phases too large to review | Controlled | Prototype-first and single-experience phases with stop gates |

### Preserved unresolved matters

This document does not silently resolve:

- exact repository routes, files, libraries, tokens, or component names
- exact browser storage mechanism
- reviewer identities or completed reviews
- regional governance, real contacts, or translation governance
- empirical Self-Check validity
- public release approval
- accessible direct PDF export
- future multiple profiles, shared workspaces, or cross-account sharing

Those matters require repository evidence, product authority, or qualified review.

## Remaining Release Blockers

| Blocker | Affected experiences | Required resolution | Internal prototype | External relational testing | Medical/emergency testing | Public release |
| --- | --- | --- | --- | --- | --- | --- |
| Regional owner and governance absent | M4, T3 urgent routes, T2/T4 output, all urgent surfaces | Named owner, official sources, cadence, expiry, translation review | Allowed with placeholder and fallback | Urgent routes limited or withheld per study review | Blocked | Blocked |
| Real regional contacts unverified | Same | Verified nonexpired controlled configuration | No real contacts | Do not present as verified | Blocked | Blocked |
| Clinical review incomplete | M4, T2, medication/device/safety claims | Qualified clinician with scope and date | Allowed with internal status | Relational areas only | Blocked | Blocked |
| Privacy/security implementation review incomplete | T2, T4, analytics, errors, print/export | Evidence-based review of final implementation | Use nonsensitive fixtures | Blocked for real entries unless study review permits | Blocked where real entries occur | Blocked |
| Accessibility specialist and disabled-user verification incomplete | All | Manual, assistive, zoom, print/export review | Development checks allowed | Requires study-appropriate review | Blocked for safety surfaces | Blocked |
| Cultural review incomplete | Scenarios and relationship assumptions | Representative review and translation-context review | Allowed internally | Blocked unless study scope and review address it | Blocked where relevant | Blocked |
| Emotional-safety review incomplete | All relational content, T3, repair, boundaries | Qualified review and representative usability | Allowed internally | Blocked unless study review addresses it | Blocked where crisis content appears | Blocked |
| Self-Check methodology review incomplete | T3 | Methodologist and caregiver/mental-health expertise | Interface logic testing only | Blocked for interpretive claims | Not applicable as assessment | Blocked |
| Storage mechanism not approved or implemented | T2 and T4 | Audit proposal, product approval, privacy review, tests | Saving disabled | Disabled or study-approved fixture only | Disabled | Feature blocked |
| Direct PDF accessibility unverified | T2 and T4 | Existing accessible capability plus separate approval | Not included | Not included | Not included | Direct export not approved |
| Review credentials absent | All review claims | Verified identity, qualification, scope, date | Internal metadata only | No public claim | No claim | Blocked claim and affected release |

## End-of-Document Handoff Checklist

### Final four-document source hierarchy

1. Verified medical, emergency, consent, autonomy, privacy, and accessibility requirements
2. Approved learner-facing copy in `01-CAREGIVER-CONTENT.md`
3. Approved learner-facing tool copy in `02-CAREGIVER-TOOLS.md`
4. Global system rules in `00-CAREGIVER-SYSTEM.md`
5. Binding Correction Register in `03-CAREGIVER-CODEX-BUILD.md`
6. Section-specific implementation instructions in this document
7. Existing repository conventions
8. Codex technical assumptions

### Binding correction summary

- `CG-TOOL-ISSUE-001` is resolved by product decision.
- Core applications are `CG-M1-I01`, `CG-M2-I03`, `CG-M3-I02`, `CG-M4-I02`, and `CG-M5-I01`.
- Every other module interaction is optional practice except `CG-M4-I03`, which is a safety interruption and never a completion activity.
- Knowledge checks and reflections never gate.
- Takeaway viewing gates.
- Urgent direction never completes, fails, or requires return.
- All learner-facing content and noncompletion behavior remain exact.

### Context map confirmation

The Context-Limit Strategy contains exact readings for repository audit, foundation, landing, prototype, prototype revision, all five modules, all four tools, completion, integration, and final audits. No phase requires all learner-facing content.

### Implementation phase confirmation

Phases 0 through 18 are defined with scope, IDs, change boundaries, and stop gates. Module 2 is reviewed before later modules scale.

### Prompt confirmation

This document contains:

- one complete master read-only repository-audit prompt
- nineteen complete standalone phased Codex prompts
- acceptance, test, report, and stopping requirements for every phase

### Release confirmation

The release-blocker table preserves all unresolved clinical, privacy, accessibility, cultural, emotional-safety, methodological, regional, storage, and output constraints. A successful build alone does not establish public readiness.

### Final handoff

- [x] Four authoritative documents only
- [x] No application code
- [x] No fifth caregiver specification
- [x] No wholesale learner-copy duplication
- [x] No fabricated repository findings
- [x] No fabricated medical content, regional contact, reviewer, or patient-data feature
- [x] Completion conflict resolved exactly
- [x] Context-limited implementation plan complete
- [x] Repository audit required before change
- [x] Storage proposal requires approval before implementation
- [x] Medical and regional release blockers preserved
- [x] Every phase stops for review
- [x] Final report format defined
- [x] No additional Work prompt is required

This document is the final Work-stage handoff. The next action is to place all four authoritative files under `docs/caregiver/` in the Health Decoded repository and give Codex the Master Codex Audit Prompt.
