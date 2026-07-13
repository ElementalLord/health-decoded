# Health Decoded AI Build Pipeline

# Prompt 12 — Today’s Journey Home

## Purpose

Implement the first real protected product screen for Health Decoded: **Today’s Journey**.

This screen replaces a traditional dashboard.

Its purpose is to help a newly diagnosed person immediately understand:

> “What is the next helpful thing I should do?”

This milestone should create the user’s calm, focused home experience after onboarding.

Do not implement the full lesson engine, activities, medications, caregiver pages, patient stories, AI Tutor, or profile experience.

---

# Prerequisites

Before beginning, confirm:

- Prompt 01 repository audit is complete.
- Prompt 02 architecture is approved.
- Prompt 03 repository normalization is committed.
- Prompt 04 repository standards is committed.
- Prompt 05 environment and Supabase foundation is committed.
- Prompt 06 database architecture is approved.
- Prompt 07 database foundation is implemented and reviewed.
- Prompt 08 backend service layer is implemented and reviewed.
- Prompt 09 authentication is implemented and reviewed.
- Prompt 10 route protection and protected application shell are implemented and reviewed.
- Prompt 11 onboarding is implemented and reviewed.
- The working tree contains no unexplained changes.
- The current authenticated user and onboarding-completion helpers are understood.

If any prerequisite is incomplete, stop and report it.

If Supabase persistence is not yet available, the screen may use a clearly isolated development fixture, but the implementation must not falsely claim live data verification.

---

# Required Documentation Resolution

Before planning or coding, inspect:

```text
Documentation/Project Playbook SPECS/
````

Locate the exact filenames corresponding to:

1. Home screen or Journey screen
2. Confidence Map or confidence system
3. Progress and unlocking
4. Information architecture and navigation
5. Application flow and screen specifications
6. Design system and visual language
7. Technical architecture and codebase structure
8. Content architecture, if the screen depends on published lesson metadata

Also read:

```text
Documentation/Constitutions/ENGINEERING CONSTITUTION.md
Documentation/Constitutions/Security Constitution.md
Documentation/Architecture Decisions/ADR-001-prototype-architecture.md
```

At the beginning of the implementation plan, list the **exact filenames actually read**.

Do not guess specification filenames.

Do not rely only on this prompt when the repository specifications define a more precise requirement.

If relevant specifications conflict, stop and report the conflict before editing files.

---

# Mandatory Planning Step

Before modifying files:

1. Inspect the current protected route tree.
2. Inspect the current `/account` placeholder.
3. Inspect the onboarding-completion behavior.
4. Inspect existing layout, card, button, progress, badge, skeleton, and empty-state components.
5. Inspect the existing service layer for journeys, lessons, profiles, and progress.
6. Inspect the approved database schema for:

   * journeys
   * journey_lessons
   * lessons
   * user_journeys
   * lesson_progress
   * confidence_check_ins
7. Determine whether live Supabase data is available.
8. Present a concise file-by-file implementation plan.
9. State exactly which specification controls each major screen section.
10. Wait for owner approval.

Do not modify files before approval.

---

# Objective

Create a protected home screen that:

* welcomes the authenticated user
* centers the current lesson as the primary action
* shows simple journey progress
* gives access to a daily confidence check
* offers limited help shortcuts only when their destinations exist
* feels calm, warm, trustworthy, and easy to understand
* avoids the visual density of a traditional medical dashboard

The current lesson must be the visual priority.

---

# Route Decision

Create the canonical protected home route:

```text
/journey
```

Recommended structure:

```text
app/
  (app)/
    journey/
      page.tsx
      loading.tsx
```

After this milestone, `/journey` becomes the default authenticated destination for users who completed onboarding.

Update successful onboarding redirect from:

```text
/account
```

to:

```text
/journey
```

Update successful login fallback destination from:

```text
/account
```

to:

```text
/journey
```

Keep `/account` temporarily only if it is still required for existing verification or compatibility.

If `/account` becomes unnecessary:

* do not delete it automatically
* explain whether it should redirect to `/journey`
* wait for owner approval before removing it

Do not create unrelated product routes.

---

# Access Rules

## Unauthenticated User

Visiting `/journey` must be handled by the existing protected layout and redirect safely to login.

## Authenticated User With Incomplete Onboarding

Visiting `/journey` should redirect to:

```text
/onboarding
```

This is now appropriate because the real protected home route exists.

Use the approved profile/onboarding service.

Do not trust a client-side onboarding flag.

## Authenticated User With Completed Onboarding

May access `/journey`.

## Completed User Visiting `/onboarding`

Must continue to redirect to `/journey`.

Do not create redirect loops.

---

# Screen Hierarchy

The screen should prioritize content in this order:

```text
Greeting

Today’s Journey hero card

Why this matters today

Journey progress

Daily confidence check

Available support shortcuts

Optional weekly story preview only if its route and data source already exist
```

Do not display every future feature at once.

Do not create a dense grid of widgets.

---

# Section 1 — Greeting

Display a short greeting using the user’s approved display name.

Examples:

```text
Good morning, Maya
```

or:

```text
Welcome back, Maya
```

Requirements:

* use the stored display name
* provide a safe fallback if the name is unavailable
* do not expose email addresses
* do not use overly enthusiastic or childish language
* do not include medical data
* do not derive sensitive conclusions about the user

Time-based greetings are optional.

If implemented, use the approved timezone or a safe fallback.

Do not introduce a large date/time library solely for greetings.

---

# Section 2 — Today’s Journey Hero

This is the primary visual focus.

Display:

* current journey day
* lesson title
* short lesson subtitle or objective
* estimated completion time
* current status
* primary action

Example structure:

```text
Day 1

Understanding Your Diagnosis

Learn what Type 2 diabetes means and why you do not have to understand everything today.

About 6 minutes

Start today’s lesson
```

Possible primary actions:

* `Start today’s lesson`
* `Continue today’s lesson`
* `Review completed lesson`

The action depends on progress state.

The lesson route does not need to be fully implemented yet.

If Prompt 13 will build the lesson engine, the button may link to a narrowly scoped placeholder route only if that route is explicitly approved and clearly marked as unfinished for development.

Prefer not to create dead links.

If no lesson route exists yet, use a disabled or development-only action with an honest message rather than pretending the lesson works.

---

# Current Lesson Selection

Use the approved service architecture.

Expected flow:

```text
Journey page
  → Journey feature server service
  → current authenticated user
  → active user journey
  → current or next journey lesson
  → published lesson metadata
  → typed view model
  → Journey screen
```

Rules:

* do not calculate current progress from client-local state
* do not trust a day number from the browser
* do not expose unpublished lesson content
* do not query Supabase directly in presentational components
* do not load full lesson content when only metadata is needed
* do not expose protected activity answers
* handle missing journey state safely

---

# Journey Initialization

If the authenticated user has completed onboarding but does not yet have a `user_journeys` record:

* create or retrieve the approved prototype journey through a controlled server-side service
* initialize the user journey safely
* set the first journey lesson as current where appropriate
* do not award XP
* do not mark any lesson complete
* do not let the browser choose the journey ID
* use only an approved published journey

If journey initialization requires a database mutation or function not already approved:

1. stop
2. explain the required change
3. propose the smallest secure implementation
4. wait for owner approval

Do not silently change migrations.

---

# Section 3 — Why This Matters Today

Display one short sentence from approved lesson metadata or content configuration.

Example:

```text
Understanding what Type 2 diabetes means can make the next steps feel less confusing.
```

Requirements:

* maximum one short paragraph
* no long explanation
* no medical advice
* no fear-based language
* no complication warnings
* no unsupported promises
* no hardcoded medical content inside the generic screen component

The text should come from published content metadata or an approved development fixture.

---

# Section 4 — Journey Progress

Display a simple progress summary.

Approved information:

* current day
* total prototype days
* completed lesson count
* percentage or progress bar
* next milestone only if supported by specifications

Example:

```text
Your 14-day journey

2 of 14 lessons complete
```

Requirements:

* calculate progress server-side from approved data
* do not store duplicated progress percentages in the database
* do not use competitive language
* do not display rankings
* do not display leaderboards
* do not exaggerate streaks
* do not shame missed days
* do not imply treatment adherence

Do not build the full Confidence Map in this milestone unless the exact specification explicitly requires it on this screen.

A small preview may be allowed, but the full experience belongs to its dedicated prompt.

---

# Section 5 — Daily Confidence Check

Implement a lightweight confidence interaction only if the relevant specification places it on the Journey screen.

Question example:

```text
How confident do you feel today?
```

Use the exact approved confidence scale from the relevant specification and database constraint.

Requirements:

* one submission per approved time boundary or lesson context
* server-side validation
* authenticated ownership
* no psychological diagnosis
* no sentiment inference
* no medical recommendation based on the score
* no public sharing
* no competitive scoring
* no misleading “confidence increased” claim without real data

The confidence interaction may use a Client Component.

Persistence must follow:

```text
Confidence control
  → server action
  → server-side schema validation
  → authenticated confidence service
  → Supabase with RLS
  → safe result
```

Do not call Supabase directly from the Client Component.

---

# Confidence Check UX

The interaction should feel optional and low-pressure.

Use:

* short labels
* large touch targets
* clear selected state
* no alarming colors
* no red failure state for low confidence
* calm confirmation after saving

Example confirmation:

```text
Thanks. We’ll use this to help show your progress over time.
```

Do not promise personalization that is not actually implemented.

If the system only records the answer, use:

```text
Your check-in was saved.
```

---

# Section 6 — Support Shortcuts

Only show shortcuts for routes that currently exist.

Possible future shortcuts include:

* Ask AI
* Medication Library
* Caregiver Support
* Patient Stories

Do not show them unless the route is implemented or explicitly allowed as a disabled preview by the specifications.

For this milestone, the safest default is:

* show no future-feature shortcuts, or
* show one non-interactive “More support is coming” section only in development mode

Do not create dead links.

Do not build placeholder product pages to fill the screen.

The Journey screen should still feel complete without feature shortcuts.

---

# Optional Weekly Story Preview

Include a story preview only if:

* patient story data already exists
* the exact specification requires it on the home screen
* the destination route exists

Otherwise omit it.

Do not add a fake story card with no destination.

Do not generate patient stories in this prompt.

---

# Empty and Edge States

Handle the following states.

## No Published Journey

Display a calm error state:

```text
Your learning journey is not available right now. Please try again later.
```

Provide a safe retry or logout action.

Do not expose database details.

## No Published Lesson

Display a safe unavailable state.

Do not fall back to draft content.

## Journey Complete

Display a calm completion state.

For the 14-day prototype, show:

* journey completed
* review availability if supported
* no fake “next program” content
* no 90-day content that has not been built

## Missing Profile

Handle safely.

Do not crash.

Do not display raw identifiers.

## Confidence Already Submitted

Show the saved state or allow revision only if the specifications permit it.

Do not create duplicate records accidentally.

---

# Data Fixture Boundary

If no working Supabase environment is available, use a fixture only through the feature service boundary.

Example:

```text
features/journey/services/
  get-journey-home-data.server.ts
  journey-home.fixture.ts
```

Requirements:

* fixture must be clearly marked as development-only
* production code must not silently use fake medical content
* fixture data must contain no real patient information
* fixture data must not be embedded directly in visual components
* final report must state that live persistence was not verified

Do not create a second parallel architecture for fixtures.

Use dependency injection, a development adapter, or another minimal pattern consistent with existing architecture.

---

# Feature Ownership

Use or create:

```text
features/journey/
  components/
  services/
  schemas/
  types/
  mappers/
```

Only create folders that receive real implementation.

Suggested responsibilities:

## Components

* Journey greeting
* Today’s lesson hero
* Journey progress summary
* Confidence check
* Journey empty/error states

## Services

* fetch active journey
* initialize user journey if approved
* fetch current lesson metadata
* calculate progress view model
* save confidence check-in

## Schemas

* confidence submission validation
* any approved route parameter validation

## Types

* Journey home view model
* Current lesson summary
* Progress summary

## Mappers

Convert database rows into UI-safe view models where useful.

Do not return raw database records directly to visual components if they expose unnecessary fields.

---

# Server and Client Component Boundary

Use Server Components for:

* page assembly
* authenticated user resolution
* onboarding completion check
* journey data loading
* progress calculation
* published lesson metadata loading

Use Client Components only for:

* confidence interaction
* small interactive controls
* necessary animation

Do not mark the entire page as a Client Component.

Do not fetch private user data from the browser when the server can provide it securely.

---

# Caching and Privacy

Journey-home data is user-specific.

Requirements:

* do not statically cache user progress
* do not share cached user data across requests
* do not store user data in module-level state
* do not place personal data in public metadata
* published lesson metadata may use safe server caching only if separated from user-specific state
* revalidate user-specific data after approved mutations

Do not add an advanced caching library.

---

# Medical Content Boundary

This screen may display only short, clinically reviewed educational metadata.

It must not:

* diagnose
* interpret symptoms
* recommend treatment changes
* recommend medication changes
* display complication warnings
* assess the severity of the user’s diabetes
* infer health status from confidence
* claim remission or guaranteed outcomes
* use Type 1 diabetes language

All product language must consistently refer to Type 2 diabetes where the condition is named.

---

# Design Requirements

Follow the exact design-system and visual-language specifications located during documentation resolution.

The screen should feel:

* calm
* warm
* modern
* spacious
* trustworthy
* focused

Avoid:

* dense dashboard grids
* excessive statistics
* decorative charts
* large gradients
* excessive badges
* childish game styling
* confetti
* bright warning colors
* hospital-dashboard styling
* generic AI-generated card walls

The primary lesson card must dominate the initial viewport without hiding essential navigation.

---

# Responsive Requirements

Mobile-first.

Verify at minimum:

* narrow phone width
* standard phone width
* tablet width
* desktop width

Requirements:

* hero action remains reachable
* bottom navigation does not cover content
* progress remains understandable
* confidence controls remain large enough to tap
* no horizontal scrolling
* typography does not truncate essential information
* desktop adds breathing room rather than unnecessary widgets

---

# Accessibility Requirements

Support:

* semantic heading hierarchy
* one clear page heading
* accessible progress labeling
* keyboard navigation
* visible focus
* accessible confidence control labels
* minimum touch targets
* no color-only selected states
* screen-reader-readable loading and error states
* reduced-motion settings
* enlarged text settings
* correct landmarks
* no duplicate navigation announcements

The progress bar must include a programmatic label and value.

---

# Loading State

Create:

```text
app/(app)/journey/loading.tsx
```

or reuse an approved shared loading pattern.

The loading state should mirror the page structure using skeletons.

Do not show a blank screen.

Do not reveal private data.

Do not use a large indefinite spinner as the only feedback.

---

# Error Handling

Expected errors must map to calm user-facing states.

Do not expose:

* Supabase error text
* SQL details
* stack traces
* internal IDs
* policy names
* user IDs
* tokens

Unexpected server errors should use the approved logger without including private content.

---

# Navigation Updates

Update protected navigation only to include valid implemented destinations.

After this milestone, `/journey` may become the primary protected navigation destination.

Do not add links to unimplemented features.

The active navigation state must be accessible and not rely only on color.

If `/account` remains, it must not compete visually with Today’s Journey.

---

# Forbidden Work

Do not implement:

* full lesson renderer
* lesson content blocks
* activity engine
* lesson completion logic
* XP awards
* boss levels
* full Confidence Map
* Medication Library
* Caregiver Companion
* Patient Stories page
* Reflection Journal
* Ask AI
* profile editing
* subscriptions
* analytics
* notifications
* admin tools
* clinician tools
* 90-day content
* advanced gamification

Do not modify database migrations unless a blocking defect exists.

If a schema defect is found:

1. stop
2. explain the defect
3. propose the smallest migration
4. wait for approval

Do not add dependencies without approval.

---

# Testing Requirements

Use the existing test setup only.

At minimum test:

## Journey View Model

* current lesson selected correctly
* first incomplete lesson selected
* completed journey handled
* progress percentage calculated correctly
* no division by zero
* unpublished content excluded

## Access Behavior

* incomplete onboarding redirects to `/onboarding`
* completed onboarding may access `/journey`
* unauthenticated behavior remains controlled by protected layout

## Confidence Validation

* valid value accepted
* invalid value rejected
* duplicate behavior follows approved specification
* client-provided user ID ignored or impossible

## Safe States

* missing journey
* missing lesson
* completed journey
* unavailable persistence

Do not install a test framework automatically.

If no test runner exists, report the limitation.

---

# Manual Verification

Verify:

1. `/journey` is protected.
2. Incomplete onboarding redirects to `/onboarding`.
3. Completed onboarding opens the Journey screen.
4. Greeting uses the approved display name or fallback.
5. Current lesson is the primary focus.
6. No unpublished content appears.
7. Progress displays correctly.
8. Confidence input validates and saves where persistence is available.
9. No dead links appear.
10. Loading state matches the screen structure.
11. Missing journey and missing lesson states are understandable.
12. Mobile navigation does not cover content.
13. Larger text does not break the layout.
14. Reduced motion is respected.
15. No raw database error reaches the user.
16. No Type 1 diabetes language appears.
17. Successful login and onboarding now lead to `/journey`.
18. No final lesson engine was implemented.

Separate live Supabase verification from fixtures or static verification.

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

Run the existing test command if available.

Inspect production route output and confirm that the only new product route is:

```text
/journey
```

Do not claim live journey initialization, progress, or confidence persistence passed unless tested against a working Supabase environment.

---

# Definition of Done

Prompt 12 is complete only when:

* exact specifications were located and listed
* `/journey` exists
* the route is protected
* incomplete onboarding redirects correctly
* completed onboarding redirects to `/journey`
* login fallback points to `/journey`
* current lesson metadata is loaded through the service layer
* lesson content is not over-fetched
* progress is calculated from source data
* the lesson card is the primary focus
* confidence check-in is implemented only within approved scope
* no dead feature links appear
* loading, empty, completion, and error states exist
* design matches the governing specifications
* accessibility requirements are met
* no Type 1 diabetes language exists
* lint passes
* type checking passes
* production build passes
* no unrelated features were added

---

# Required Final Report

Respond using this exact structure:

## Session Completed: Prompt 12

### Status

* Complete
* Complete with documented blocker
* Incomplete

### Exact Specifications Read

List the exact repository filenames.

### Route Created

List the route.

### Redirect Changes

List login, onboarding, and protected-route changes.

### Journey Screen Sections

List each implemented section.

### Data Sources

State whether data came from:

* local Supabase
* remote Supabase
* approved development fixtures
* static fallback

### Services Created or Modified

List files and responsibilities.

### Current Lesson Logic

Explain how the current lesson is selected.

### Progress Logic

Explain how progress is calculated.

### Confidence Check

Explain validation, ownership, persistence, and any limitations.

### Security Controls

Summarize:

* server-side access
* onboarding enforcement
* published-content filtering
* private-data caching rules
* input validation
* error redaction

### Accessibility

List implemented behavior.

### Tests Added

List tests and results.

### Manual Verification

List what was actually verified.

### Files Created

List files.

### Files Modified

List files.

### Database Changes

Expected answer:

```text
No database schema changes were made.
```

unless the owner explicitly approved a blocking migration.

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
feat: implement todays journey home
```

---

# Git Rule

Do not stage, commit, push, or modify remote Supabase configuration automatically.

Leave all changes unstaged for owner review.

---

# Stop Condition

Stop immediately after implementation, verification, and the final report.

Do not begin the lesson engine, activities, medication library, AI Tutor, or Prompt 13.
