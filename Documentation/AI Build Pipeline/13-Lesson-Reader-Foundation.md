# Health Decoded AI Build Pipeline

# Prompt 13, Lesson Reader Foundation

## Purpose

Implement the foundational lesson-reading experience for Health Decoded.

This milestone allows an authenticated user to:

- open the current published lesson from Today’s Journey
- view a short lesson introduction
- move through approved educational content blocks one at a time
- see clear lesson progress
- leave and safely resume the lesson
- return to Today’s Journey

This milestone establishes the lesson player and non-interactive content renderer.

Do not implement scored activities, lesson completion, XP, unlocking, Boss Levels, AI explanations, reflections, medication sheets, or advanced gamification.

---

# Prerequisites

Before beginning, confirm:

- Prompts 01–12 are implemented and reviewed.
- Prompt 12 is committed.
- `/journey` exists and is protected.
- Today’s Journey securely selects the first incomplete published lesson.
- The Journey lesson action is currently disabled pending this milestone.
- The approved database migrations exist locally.
- The working tree contains no unexplained changes.
- Any known unrelated files remain untouched.
- No migration has been applied remotely without owner approval.

If Prompt 12 remains unstaged or uncommitted, stop.

If the lesson schema cannot support safe resume behavior, follow the database-blocker process in this prompt. Do not silently redesign the schema.

---

# Required Documentation Resolution

Before planning or coding, inspect:

```text
Documentation/Project Playbook SPECS/
```

Locate and read the exact filenames corresponding to:

1. Learning or lesson experience
2. Journey experience
3. Interactive learning system
4. Content management and content-block architecture
5. Application flow and screen specifications
6. Information architecture and navigation
7. Design system and visual language
8. Technical architecture and codebase structure
9. Accessibility requirements, if separate

Also read:

```text
Documentation/Constitutions/ENGINEERING CONSTITUTION.md
Documentation/Constitutions/Security Constitution.md
Documentation/Architecture Decisions/ADR-001-prototype-architecture.md
```

Review:

- Prompt 12 implementation summary
- current Journey service
- current database migrations
- current lesson and journey seed files
- existing shared UI components
- current protected layout and navigation

At the beginning of the implementation plan, list the exact filenames actually read.

Do not guess filenames.

If the relevant specifications conflict, stop and report the conflict before modifying files.

---

# Mandatory Planning Step

Before modifying files:

1. Inspect the current `lessons`, `journey_lessons`, and `lesson_progress` schema.
2. Inspect the exact structure of `lessons.content_blocks`.
3. Inspect the deterministic seed lesson content.
4. Inspect how Today’s Journey identifies the current `journey_lesson`.
5. Determine whether lesson progress currently supports:
   - not started
   - in progress
   - completed
   - safe resume position
6. Inspect existing feature-service and result patterns.
7. Inspect existing card, button, progress, dialog, callout, loading, and error components.
8. Propose the exact route structure.
9. Propose the supported content-block types for this milestone.
10. Identify whether a narrowly scoped database migration or authenticated function is required.
11. Present a concise file-by-file plan.
12. Wait for owner approval.

Do not modify files before the plan is approved.

---

# Objective

Create a calm lesson experience that teaches one small idea at a time.

The experience must answer:

> “What should I understand next?”

It must not resemble:

- a long article
- a medical textbook
- a quiz-heavy course
- a children’s game
- a dense slideshow
- a generic AI-generated learning page

The lesson should feel guided, focused, and easy to leave and resume.

---

# Approved Route

Create:

```text
/lessons/[day]
```

Recommended structure:

```text
app/
  (app)/
    lessons/
      [day]/
        page.tsx
        loading.tsx
```

Use the exact route structure required by the governing specification if it differs.

The route parameter is a navigation aid, not an authorization boundary.

The server must validate the requested day against the authenticated user’s active journey and published `journey_lessons` records.

Do not trust the browser-provided day number.

---

# Journey Button Integration

Update Today’s Journey so the current lesson action links to the validated lesson route.

Allowed action states:

- `Start today’s lesson`
- `Continue today’s lesson`
- `Review completed lesson`

The action must not link to:

- an unpublished lesson
- a lesson outside the active journey
- a future locked lesson
- an arbitrary user-supplied lesson identifier

Remove the temporary disabled state only after the lesson route exists and validates access correctly.

---

# Lesson Access Rules

## Unauthenticated User

Handled by the existing protected application layout.

## Incomplete Onboarding

Redirect to:

```text
/onboarding
```

Use the existing approved onboarding check.

## No Active Journey

Redirect safely to:

```text
/journey
```

or show the approved unavailable state if the specifications require it.

## Current or Previously Available Lesson

Allow access if the lesson is:

- the current lesson
- already started
- already completed and review is allowed
- otherwise unlocked according to currently implemented rules

## Future or Locked Lesson

Do not display the content.

Redirect to `/journey` or render the approved locked state.

Do not reveal lesson titles or content that should not yet be available.

## Unpublished Content

Never display it to an ordinary authenticated user.

---

# Lesson Data Boundary

Expected server flow:

```text
Lesson route
  → validate route parameter
  → resolve authenticated user
  → verify completed onboarding
  → retrieve active user journey
  → retrieve authorized journey lesson
  → retrieve published lesson metadata and content blocks
  → retrieve owned lesson progress
  → map to a UI-safe lesson view model
  → render lesson player
```

Requirements:

- no direct Supabase calls in visual components
- no full raw database row passed to Client Components
- no activity answer data requested
- no draft content requested
- no user ID accepted from the browser
- no arbitrary journey ID accepted from the browser
- no unsafe shared caching of user progress

---

# Content Block Contract

Inspect the actual approved content schema before implementing.

For this milestone, support only non-interactive educational blocks required by the specifications.

The expected minimum set is:

- `heading`
- `paragraph`
- `illustration`
- `callout`
- `fact`
- `quote`
- `summary`

Use the exact approved block names if the specifications define them differently.

Do not support arbitrary block types.

Each block must be validated with a discriminated Zod schema before rendering.

Unknown or malformed blocks must:

- fail safely
- not crash the entire application
- not render arbitrary HTML
- not be interpreted dynamically as executable code
- be logged only with safe structural information

Do not use:

```tsx
dangerouslySetInnerHTML
```

Do not render HTML strings from Supabase.

All text must render through normal React escaping.

---

# Content Block Limits

Apply reasonable schema limits.

Examples:

- heading length
- paragraph length
- quote length
- callout length
- number of summary points
- image URL or asset identifier format
- caption length

Do not accept unlimited content payloads.

Do not invent clinical content in visual components.

The renderer displays approved data; it does not author medical information.

---

# Lesson Player Structure

The lesson player should include:

```text
Lesson header
Progress indicator
Current content block
Previous control
Continue control
Exit lesson control
```

## Header

Display only necessary information:

- day number
- lesson title
- block position or progress
- close or exit action

Avoid a dense application header inside the lesson.

## Progress

Show the user’s progress through the current lesson.

Use:

- current block number
- total block count
- accessible progress bar

This progress is lesson-reading progress, not medical progress or treatment adherence.

## Previous

Allow returning to an earlier content block.

Do not allow going before the first block.

## Continue

Moves to the next block.

On the final block, do not complete the lesson yet.

Use a clearly labeled temporary endpoint such as:

```text
Ready for your check-in
```

or another exact label from the specification.

The final completion flow belongs to a later prompt.

## Exit

Open a calm confirmation dialog.

Example:

```text
Leave this lesson?

Your place will be saved so you can return later.
```

Do not use guilt-based language.

Return to `/journey` after a confirmed exit.

---

# Client and Server Boundary

Use a Server Component for:

- route validation
- user resolution
- onboarding check
- lesson authorization
- published lesson loading
- initial progress loading

Use a focused Client Component for:

- current block navigation
- Previous and Continue controls
- exit confirmation
- optional lightweight transition
- debounced or explicit progress-saving requests

Do not mark the entire route tree as client-side unnecessarily.

---

# Resume Behavior

A user should be able to leave and return to the same lesson position.

First inspect whether the existing schema already contains a safe resume-position field.

Possible approved representations include:

- `current_block_index`
- `last_viewed_block`
- another explicit bounded integer field

Do not store the entire lesson state as arbitrary client JSON unless the specification requires it.

Requirements:

- server-side validation
- authenticated ownership
- block position bounded by the published lesson’s block count
- no user ID accepted from the client
- no lesson-progress record outside the caller’s journey
- repeated saves remain safe
- stale or out-of-range positions fall back safely
- completed lesson review starts according to the governing specification

Do not use localStorage as the authoritative resume source.

Local component state may provide immediate interaction, but the database is the durable source of truth.

---

# Database Blocker Process

If the approved schema does not support resume position, stop before implementation and propose the smallest secure change.

The proposal may include only:

1. One bounded resume-position column on `lesson_progress`.
2. One narrowly scoped authenticated database operation to begin or resume an authorized lesson.
3. One narrowly scoped authenticated operation to save an authorized block position.

The operation must:

- derive identity from `auth.uid()`
- verify ownership through `lesson_progress → user_journeys → user_id`
- verify that the lesson belongs to the user’s active journey
- verify that the lesson is currently accessible
- verify the block index against the published lesson content length
- accept no user ID
- accept no journey ID chosen by the browser
- award no XP
- mark no lesson complete
- unlock no future lesson

Do not:

- add broad INSERT or UPDATE policies
- expose direct browser writes
- modify unrelated tables
- apply migrations remotely
- use the service-role key in browser code

Wait for owner approval before writing the migration.

---

# Lesson Start Behavior

When an authorized user first opens the current lesson:

- create or update the appropriate `lesson_progress` state through the approved secure operation
- set status to the approved in-progress value
- set `started_at` only if it is not already set
- do not overwrite an existing start time unnecessarily
- do not mark the lesson complete
- do not award XP
- do not alter future lessons

Repeated page loads must be idempotent.

---

# Review Behavior

If the lesson is already completed and review is permitted:

- render the published lesson safely
- do not reset completion
- do not remove earned progress
- do not create duplicate progress rows
- do not automatically change the current journey position
- label the experience as review where appropriate

Do not implement version-history comparisons.

---

# Lesson Introduction

Before the first main content block, display a short lesson introduction if required by the specifications.

It may include:

- title
- one-sentence purpose
- estimated time
- what the user will understand

Do not create a separate preview route unless the specification explicitly requires it.

Keep the introduction within the lesson player.

---

# Visual Design Requirements

Follow the exact design and lesson specifications found during documentation resolution.

The lesson should feel:

- focused
- calm
- warm
- readable
- mature
- reassuring

Use:

- generous spacing
- short paragraphs
- strong visual hierarchy
- one primary action
- restrained motion
- clear block transitions

Avoid:

- full-screen gradients
- confetti
- decorative progress effects
- game-like lives or hearts
- flashing feedback
- excessive iconography
- dense sidebars
- multiple competing CTAs
- long walls of text

---

# Illustration Handling

If a content block references an illustration:

- use only approved local assets or approved remote image domains
- provide descriptive alternative text where informative
- use empty alt text where purely decorative
- prevent layout shift
- use Next.js image optimization where appropriate
- do not load arbitrary user-provided URLs
- do not generate images during this prompt

If no approved illustration exists, render the lesson without a fake decorative placeholder unless the specification requires one.

---

# Motion

Use subtle block transitions only where the design specification permits them.

Requirements:

- respect reduced-motion settings
- do not block interaction while animating
- do not exceed the approved duration tokens
- do not create parallax or decorative looping motion
- preserve focus correctly after block changes

The transition must improve orientation rather than entertainment.

---

# Focus Management

When the user moves to another block:

- move screen-reader and keyboard focus to the new block heading or content region
- avoid returning focus to the top of the entire application
- announce progress changes politely where useful
- do not create a focus trap outside the exit dialog
- restore focus correctly when the dialog closes

---

# Responsive Requirements

Verify at:

- narrow mobile width
- standard phone width
- tablet width
- desktop width

Requirements:

- content remains readable
- controls remain reachable
- bottom navigation must not overlap the lesson controls
- consider hiding the normal bottom navigation during the focused lesson if specifications approve
- exit control remains discoverable
- no horizontal scrolling
- large text does not hide controls
- safe-area padding is preserved

Do not invent a desktop sidebar for the lesson.

---

# Accessibility Requirements

Support:

- semantic heading hierarchy
- one primary lesson heading
- labeled progress indicator
- keyboard-operable Previous, Continue, and Exit controls
- visible focus states
- accessible dialog
- screen-reader-readable block changes
- reduced motion
- enlarged text
- sufficient contrast
- minimum touch-target sizing
- alternative text for meaningful illustrations
- no color-only progress communication

The content reader must remain usable at 200% browser zoom.

---

# Error and Edge States

Handle:

## Invalid Day

Redirect safely to `/journey` or show the approved not-found state.

## Unauthorized Future Lesson

Do not reveal content.

Return to `/journey` with a safe explanation if supported.

## Missing Published Lesson

Show a calm unavailable state.

## Malformed Content Block

Do not render arbitrary content.

Display a generic lesson-unavailable state if the lesson cannot be safely rendered.

## Resume Save Failure

Allow the user to continue reading in the current session.

Show a calm non-blocking message:

```text
Your place could not be saved right now.
```

Do not falsely claim persistence.

## Supabase Failure

Use a safe retry or return-to-journey action.

Do not expose raw errors.

---

# Logging

Safe logs may include:

- route category
- safe error category
- content validation failure type
- operation name

Do not log:

- lesson text
- reflection-like user input
- tokens
- cookies
- user email
- user ID unless the approved logger securely hashes or redacts it
- raw Supabase error payloads
- protected activity answers

---

# Medical Content Boundary

The renderer must not alter or augment the approved content.

It must not:

- diagnose
- provide individualized treatment advice
- recommend medication changes
- interpret symptoms
- add emergency guidance not present in reviewed content
- claim guaranteed outcomes
- convert Type 2 content into Type 1 explanations
- improvise missing educational text

If content is missing, show an unavailable state rather than generating medical advice.

---

# Navigation Updates

After the lesson route works:

- enable the Today’s Journey lesson action
- keep `/journey` as the primary protected destination
- avoid adding the lesson route to persistent bottom navigation
- use a focused lesson back or exit control
- preserve safe return to `/journey`

Do not expose arbitrary lesson links in navigation.

---

# Feature Ownership

Use or extend:

```text
features/lessons/
  components/
  services/
  schemas/
  actions/
  types/
  mappers/
```

Create only folders with implementation.

Recommended responsibilities:

## Components

- lesson player
- lesson header
- block renderer
- individual safe block components
- lesson controls
- exit dialog
- lesson unavailable state

## Services

- retrieve authorized lesson
- begin or resume lesson
- retrieve owned lesson progress

## Actions

- save block position if approved and supported

## Schemas

- route day validation
- content-block validation
- resume-position validation

## Types

- validated content blocks
- lesson-player view model
- lesson progress state

## Mappers

- database result to UI-safe view model

Do not return raw database rows directly to Client Components.

---

# Fixture Boundary

If the database migration or seed data is not available:

- do not silently substitute fake medical lesson content in production
- a development-only fixture may be used only through the lesson service boundary
- clearly mark the fixture
- use non-clinical placeholder language
- state in the final report that live content was not verified

Do not embed fixture content in visual components.

---

# Forbidden Work

Do not implement:

- scored activity rendering
- answer evaluation
- lesson completion
- XP
- confidence increase claims
- unlocking the next lesson
- Boss Levels
- Match the Pair
- Myth Busters
- Plate Builder
- Build Your Body
- Can You Explain It
- AI Tutor
- Medication bottom sheets
- Reflection Journal
- caregiver content
- patient stories
- subscriptions
- analytics
- notifications
- admin tools
- clinician tools

Do not add dependencies without approval.

Do not modify unrelated migrations.

Do not apply database changes remotely.

---

# Testing Requirements

Use the existing test setup only.

At minimum test:

## Route Validation

- valid positive day accepted
- zero rejected
- negative value rejected
- non-integer rejected
- malformed value rejected

## Content Validation

- each approved block type accepted
- unknown block type rejected
- oversized content rejected
- arbitrary HTML remains text or is rejected
- malformed illustration source rejected
- missing required fields rejected

## Lesson Selection and Access

- current lesson permitted
- completed review lesson permitted when approved
- future locked lesson denied
- unpublished lesson denied
- lesson outside active journey denied

## Mapper

- block count calculated correctly
- resume position clamped safely
- zero-block lesson handled as unavailable
- completed lesson review state represented correctly

## Resume Validation

If implemented:

- valid owned progress accepted
- out-of-range block rejected
- cross-user progress rejected
- repeated save remains idempotent
- client-provided user ID is impossible or ignored

Do not install a test framework automatically.

If no test runner exists, report the limitation.

---

# Manual Verification

Verify:

1. `/journey` lesson action opens the current lesson.
2. Unauthenticated users cannot access the lesson.
3. Incomplete onboarding redirects correctly.
4. Invalid day values fail safely.
5. Future locked lessons cannot be opened.
6. Draft content is unavailable.
7. Lesson introduction is understandable.
8. Each approved non-interactive block renders correctly.
9. Unknown content blocks fail safely.
10. Previous and Continue work.
11. Continue cannot advance beyond the final block.
12. Exit dialog returns to `/journey`.
13. Resume state survives reload where persistence is available.
14. Save failure does not destroy in-session reading.
15. Reduced motion works.
16. Keyboard and screen-reader focus follows block changes.
17. Mobile controls remain reachable.
18. Large text does not break the layout.
19. No protected answer configuration is requested.
20. No Type 1 diabetes language is introduced.
21. No lesson completion, XP, or unlocking is implemented.

Separate database-backed verification from static or fixture verification.

---

# Verification Commands

Run:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
git status
```

Run the existing test command if one exists.

Inspect the production route output and confirm that the only new route is the approved lesson route.

Do not claim resume persistence, access enforcement, or database operation success unless tested against an available database.

---

# Definition of Done

Prompt 13 is complete only when:

- exact specifications were located and listed
- the approved lesson route exists
- access is validated server-side
- Today’s Journey links safely to the current lesson
- only published authorized lesson content is loaded
- non-interactive blocks are validated and rendered safely
- arbitrary HTML is not rendered
- lesson progress is clear and accessible
- Previous, Continue, and Exit work
- safe resume behavior exists or its schema blocker is documented
- lesson completion is not implemented
- XP and unlocking are not implemented
- no protected activity answers are accessed
- loading, unavailable, and error states exist
- the experience is responsive and accessible
- lint passes
- type checking passes
- production build passes
- no unrelated feature was added

---

# Required Final Report

Respond using this exact structure:

## Session Completed: Prompt 13

### Status

- Complete
- Complete with documented blocker
- Incomplete

### Exact Specifications Read

List the exact repository filenames.

### Route Created

List the lesson route.

### Journey Integration

Explain how the Journey action was enabled safely.

### Lesson Access Rules

Summarize current, completed, locked, invalid, and unpublished behavior.

### Supported Content Blocks

List every implemented block type.

### Content Validation

Explain the Zod/discriminated-union boundary and size limits.

### Lesson Player

Describe:

- header
- progress
- navigation
- exit behavior
- focus management

### Resume Behavior

Explain:

- storage model
- ownership verification
- bounds validation
- live verification status

### Services and Actions

List files and responsibilities.

### Security Controls

Summarize:

- server-side access validation
- ownership
- publication filtering
- answer-key isolation
- HTML safety
- caching and privacy
- error redaction

### Accessibility

List implemented behavior.

### Tests Added

List tests and results.

### Manual Verification

List what was actually verified.

### Environment Limitations

State whether behavior was verified using:

- local Supabase
- remote Supabase
- approved fixture
- static build only

### Files Created

List files.

### Files Modified

List files.

### Database Changes

State:

```text
No database schema changes were made.
```

or identify the separately approved narrow migration.

### Dependencies

Expected answer:

```text
No dependencies were added or removed.
```

unless separately approved.

### Remote Actions

Expected answer:

```text
No remote Supabase actions were performed.
```

unless explicitly approved.

### Known Issues or Blockers

List honestly.

### Suggested Commit

```text
feat: implement lesson reader foundation
```

---

# Git Rule

Do not stage, commit, push, apply migrations remotely, or change remote Supabase configuration automatically.

Leave all changes unstaged for owner review.

---

# Stop Condition

Stop immediately after implementation, verification, and the final report.

Do not begin activities, lesson completion, XP, unlocking, AI explanations, or Prompt 14.
