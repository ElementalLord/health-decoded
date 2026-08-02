# 01-CAREGIVER-CONTENT.md

## Document Metadata

| Field | Value |
| --- | --- |
| Product | Health Decoded |
| Experience | Support Someone You Care About |
| Central promise | Help without taking over. |
| Document role | Final learner-facing content and experience specification for the caregiver landing page and five modules |
| Binding parent | `00-CAREGIVER-SYSTEM.md` |
| Prototype audience | People supporting an adult with Type 2 diabetes who generally retains decision-making capacity |
| Prototype region | United States, with all regional safety details supplied through controlled configuration |
| Version | 1.0 |
| Date | 2026-07-29 |
| Content status | Finalized for product approval; multidisciplinary review flags remain open |
| Medical review status | not-reviewed |
| Editorial review status | not-reviewed |
| Privacy review status | not-reviewed |
| Accessibility review status | not-reviewed |
| Cultural review status | not-reviewed |
| Emotional-safety review status | not-reviewed |

This document supplies exact learner-facing copy and complete experience behavior for the landing page and five modules. It does not specify the four practical tools, write application code, or replace the global rules in `00-CAREGIVER-SYSTEM.md`.

## Table of Contents

1. [Content ID Index](#content-id-index)
2. [Interaction Inventory](#interaction-inventory)
3. [Landing Page](#landing-page)
4. [Module 1: What They May Be Feeling](#module-1-what-they-may-be-feeling)
5. [Module 2: Support Without Taking Over](#module-2-support-without-taking-over)
6. [Module 3: Everyday Support That Actually Helps](#module-3-everyday-support-that-actually-helps)
7. [Module 4: When Something Feels Wrong](#module-4-when-something-feels-wrong)
8. [Module 5: The Caregiver Matters Too](#module-5-the-caregiver-matters-too)
9. [Content-Wide Source Table](#content-wide-source-table)
10. [Content-Wide Review Requirements](#content-wide-review-requirements)
11. [Final Content Consistency Audit](#final-content-consistency-audit)

## Content ID Index

| ID | Content |
| --- | --- |
| `CG-LANDING` | Caregiver landing page |
| `CG-LANDING-I01` | Need-based route chooser |
| `CG-LANDING-I02` | Guided-path starting-point chooser |
| `CG-M1` | Module 1 |
| `CG-M1-S01` to `CG-M1-S07` | Module 1 content sections |
| `CG-M1-I01` to `CG-M1-I03` | Module 1 interactions |
| `CG-M1-Q01` to `CG-M1-Q03` | Module 1 knowledge check |
| `CG-M1-R01` | Module 1 reflection |
| `CG-M2` | Module 2 |
| `CG-M2-S01` to `CG-M2-S08` | Module 2 content sections |
| `CG-M2-I01` to `CG-M2-I05` | Module 2 interactions |
| `CG-M2-Q01` to `CG-M2-Q03` | Module 2 knowledge check |
| `CG-M2-R01` | Module 2 reflection |
| `CG-M3` | Module 3 |
| `CG-M3-S01` to `CG-M3-S07` | Module 3 content sections |
| `CG-M3-I01` to `CG-M3-I04` | Module 3 interactions |
| `CG-M3-Q01` to `CG-M3-Q03` | Module 3 knowledge check |
| `CG-M3-R01` | Module 3 reflection |
| `CG-M4` | Module 4 |
| `CG-M4-S01` to `CG-M4-S08` | Module 4 content sections |
| `CG-M4-I01` to `CG-M4-I05` | Module 4 interactions |
| `CG-M4-Q01` to `CG-M4-Q03` | Module 4 knowledge check |
| `CG-M4-R01` | Module 4 reflection |
| `CG-M5` | Module 5 |
| `CG-M5-S01` to `CG-M5-S07` | Module 5 content sections |
| `CG-M5-I01` to `CG-M5-I05` | Module 5 interactions |
| `CG-M5-Q01` to `CG-M5-Q03` | Module 5 knowledge check |
| `CG-M5-R01` | Module 5 reflection |
| `CG-CLAIM-001` to `CG-CLAIM-014` | Sourced educational claims |

## Interaction Inventory

| Module or page | Emotional arc | Dominant cognitive action | Dominant mechanic | Supporting mechanics | Visual metaphor | Layout rhythm | Interaction IDs | Overlap and justification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Landing | Uncertainty to orientation to chosen entry | Identify present need and choose a starting point | Relational route line | Priority comparison | A shared entry table with several open places | Wide opening, compact safety route, branching line, guided sequence | `CG-LANDING-I01`, `CG-LANDING-I02` | Choice controls recur elsewhere because navigation requires them, but no module repeats this routing sequence |
| Module 1 | Confusion to curiosity to patient attention | Separate observation from interpretation | Two-column evidence workbench | Timing dial; response-mode mixer | Signals seen through changing distance and light | Scene, open annotation field, narrow timing strip, dialogue practice | `CG-M1-I01` to `CG-M1-I03` | Dialogue rehearsal also appears in Modules 2 and 5, but here the task is identifying listening versus fixing |
| Module 2 | Fear-driven action to impact recognition to permission to repair to reliability | Distinguish and choose | Consequence map | Continuum sort; sentence builder; branching conversation; repair sequencing | Shared space with individually controlled zones and consent points | Alternating scene and workspace, central branching sequence, quiet repair close | `CG-M2-I01` to `CG-M2-I05` | Classification appears in Module 4, but Module 2 classifies relationship control, not safety action |
| Module 3 | Uncertainty to specific usefulness to shared normalcy | Match and plan | Shared-table planning workspace | Request matching; support menu; routine boundary comparison | An ordinary home table changing through the day | Horizontal planning surface, short vignettes, menu assembly, ordinary-life close | `CG-M3-I01` to `CG-M3-I04` | Planning appears in Module 5, but here it organizes concrete household help |
| Module 4 | Alarm to slowing down to role clarity to appropriate escalation | Prioritize and escalate | Calm response sequence | Context organizer; source comparison; interruption; handoff summary; unsafe-action selection | A clearly labeled ready shelf and response folder | Immediate boundary, short scenario, ordered steps, interruption, compact handoff | `CG-M4-I01` to `CG-M4-I05` | Sequencing appears in Module 2 repair, but here order is safety-critical and urgent direction can replace learning |
| Module 5 | Responsibility to strain recognition to shared responsibility to sustainable limits | Map and rehearse | Responsibility map | Comparison; phrase rehearsal; network map; load reflection | Weight redistributed across a widening network | Dense opening, wide map, quiet language practice, expanding network, non-celebratory close | `CG-M5-I01` to `CG-M5-I05` | Mapping appears in Module 2, but Module 5 maps ownership and backup rather than consequences |

# LANDING PAGE

## `CG-LANDING` Page Metadata

- **Purpose:** Give supporters an emotionally safe, practical entry point without presenting a course catalog or monitoring dashboard.
- **Audience problem:** A visitor may know only that they want to help, are worried, or are worn down. They may not identify as a caregiver.
- **Emotional objective:** Replace vague responsibility with a clear, bounded place to begin.
- **Estimated time:** 1 to 3 minutes to choose a route.
- **Medical-risk level:** Moderate because an immediate safety route is present.
- **Review status:** Editorial, privacy, accessibility, cultural, emotional-safety, and clinical review required.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-10`, `CONTENT-01` to `CONTENT-15`, `AUTONOMY-01` to `AUTONOMY-09`, `CONSENT-01` to `CONSENT-10`, `MEDICAL-01` to `MEDICAL-15`, `EMERGENCY-01` to `EMERGENCY-10`, `REGION-01` to `REGION-08`, `PROGRESS-01` to `PROGRESS-08`, `PRIVACY-01` to `PRIVACY-15`, `VISUAL-01` to `VISUAL-11`, `MOTION-01` to `MOTION-08`, `RESPONSIVE-01` to `RESPONSIVE-10`, `ACCESSIBILITY-01` to `ACCESSIBILITY-20`, `REVIEW-01` to `REVIEW-08`.

## Visual Identity

- **Emotional tone:** Welcoming, grounded, relational, and adult.
- **Environmental concept:** A long shared table near a window. Different places at the table suggest different kinds of support without assigning ownership of the whole space.
- **Dominant composition:** Editorial hero on the left, restrained relational illustration on the right, followed by a fine horizontal safety route and an irregular branching pathway.
- **Typography emphasis:** Large serif title, short sans-serif explanation, small uppercase labels used only for orientation.
- **Color role:** Warm ivory canvas, deep forest text, terracotta for the chosen route, sage for agreed support, muted blue-green for privacy.
- **Interaction integration:** Routes appear as labeled places along a gently connected line, not five identical cards.
- **Illustration:** Abstracted adult figures or objects around a table. No embracing stock family, heart icon, medical device dashboard, or glucose chart.
- **Motion purpose:** A selected route gains a short connecting line to its destination. Motion confirms orientation, not success.
- **Transition rhythm:** Hero to immediate boundary to personal route to recommended path to tools.
- **Mobile composition:** Hero text, illustration, primary action, secondary action, safety route, need routes, guided path, tools, privacy boundary.
- **Reduced motion:** Lines and destination states appear immediately.
- **Anti-card strategy:** Use open sections, ruled dividers, asymmetric indents, and one focused privacy surface. Do not contain every item.
- **Must not appear:** Course catalog tiles, completion percentage hero, patient health data, family stock photography, certification language, giant manifesto, warning-red page field, identical five-card grid.

## Complete Experience Flow and Learner-Facing Content

### Hero

**Eyebrow:** SUPPORT SOMEONE YOU CARE ABOUT

**Title:** Help without taking over.

**Explanation:** Diabetes can affect routines, conversations, plans, and the space between two people. This section helps you offer support that is useful, respectful, and easier to revise when needs change.

**Audience line:** For partners, relatives, friends, roommates, chosen family, and anyone trying to help, whether or not you call yourself a caregiver.

**Primary action:** Find where to begin

**Secondary action:** Follow the five-part path

### Immediate Safety Route

**Link label:** Something feels wrong right now

**Boundary copy shown with the route:** Health Decoded cannot determine what is happening or whether someone is safe. If someone may be in immediate danger, stop here and use the person's clinician-created plan if it is immediately available. Contact emergency help using the reviewed information for your region. Do not delay help to finish this page.

**Regional action label:** View emergency help for [REGION_DISPLAY_NAME]

**Missing-region fallback:** Local emergency details are not available in Health Decoded right now. Contact your local emergency service if someone may be in immediate danger, or contact an appropriate healthcare professional for urgent guidance. Do not use a guessed number or wait for this page to update.

### What brought you here?

**Section title:** What brought you here?

**Introduction:** Choose the situation that is closest to what you need today. You can change direction at any time.

1. **Route title:** I want to understand what they may be feeling  
   **Description:** Slow down the urge to explain a reaction and practice asking what support, if any, is wanted.  
   **Action:** Go to What They May Be Feeling  
   **Destination:** `CG-M1`

2. **Route title:** I am unsure how to help without overstepping  
   **Description:** Separate support from pressure, monitoring, and assumed access.  
   **Action:** Go to Support Without Taking Over  
   **Destination:** `CG-M2`

3. **Route title:** I want to help with everyday life  
   **Description:** Turn broad offers into specific help with meals, errands, movement, appointments, and routines.  
   **Action:** Go to Everyday Support That Actually Helps  
   **Destination:** `CG-M3`

4. **Route title:** Something feels wrong  
   **Description:** Clarify your role when a situation is concerning but you do not know what it means.  
   **Action:** Go to When Something Feels Wrong  
   **Destination:** `CG-M4`

5. **Route title:** I am feeling stretched thin  
   **Description:** Notice what is becoming hard to sustain and make room for limits and backup support.  
   **Action:** Go to The Caregiver Matters Too  
   **Destination:** `CG-M5`

**Relational layout concept:** The five routes sit along one uneven line around the shared-table illustration. Each route has a distinct indent and short descriptor. The selected route connects to a destination summary below. At 320px, the line becomes a vertical sequence with numbered text labels.

### Guided Path

**Section title:** A guided path, when you want one

**Introduction:** The order moves from understanding to permission, daily support, safety, and sustainability. It is a recommendation, not a set of prerequisites.

| Order | Module | One-sentence purpose | Time |
| --- | --- | --- | --- |
| 1 | What They May Be Feeling | Practice staying curious when a reaction could mean more than one thing. | 8 to 10 minutes |
| 2 | Support Without Taking Over | Learn how permission, privacy, and revisable agreements keep help from becoming control. | 14 to 18 minutes |
| 3 | Everyday Support That Actually Helps | Build specific, ordinary support around what the person actually wants. | 10 to 13 minutes |
| 4 | When Something Feels Wrong | Use the person's plan and appropriate professional help without diagnosing or improvising treatment. | 10 to 12 minutes |
| 5 | The Caregiver Matters Too | Recognize strain, clarify responsibility, and build support that one person can sustain. | 10 to 13 minutes |

**Progress-state language and actions:**

- **Not started:** Not started. **Action:** Begin module
- **In progress:** In progress. Your last completed section is saved privately. **Action:** Continue module
- **Completed:** Completed. This records participation, not medical competence. **Action:** Review module
- **Revisit:** Marked to revisit. Completion is unchanged. **Action:** Revisit key idea

### Practical Tools Introduction

**Section title:** Use a tool when a conversation or plan cannot wait

**Copy:** The practical tools are available without completing a module. Use one, leave it, or return later.

- **What Should I Say?** Prepare a respectful way to open, pause, repair, or revisit a conversation.
- **Know the Plan** Organize where clinician-created instructions are kept and what role has been agreed.
- **Caregiver Self-Check** Privately notice support patterns that may be difficult to sustain.
- **Shared Support Plan** Record support preferences that both people can review and change.

**Tool action label:** View practical tools

### Autonomy and Privacy Boundary

**Heading:** Their health information remains theirs.

**Copy:** The person living with diabetes stays in control of medical decisions and what they share. This section does not give you automatic access to private health information. It does not monitor glucose, medication, location, appointments, or whether someone follows a plan.

### First-Visit State

**Greeting:** You do not need to know the right label for your role.

**Copy:** Start with the situation that brought you here, or follow the recommended path from the beginning. No health information about the person you support is needed.

**Primary action:** Choose what brought me here

**Secondary action:** Start with Module 1

### Returning-User State

**Greeting:** Continue from where you left off, or choose what is useful now.

**Recent module label:** Most recent

**Resume copy:** You stopped in **[MODULE_TITLE]** at **[SECTION_TITLE]**.

**Primary action:** Continue [MODULE_TITLE]

**Next recommendation label:** Next on the guided path

**Next recommendation copy:** **[NEXT_MODULE_TITLE]** is the next recommended module. You can open another module instead.

**Tool shortcut label:** Return to a recent tool

**Tool shortcut behavior:** Show only the most recently opened tool name. Do not preview private text or plan contents on the landing page.

**Private progress explanation:** Module progress is private to your account. It is not shared with the person you support, another supporter, or the AI Tutor. A completed label records participation, not expertise.

## Landing-Page Interaction Specifications

### `CG-LANDING-I01`

- **Learner-facing title:** Find the closest starting point
- **Purpose:** Convert an uncertain reason for visiting into one relevant module route.
- **Cognitive action:** Identify the present relational need rather than a diagnosis or medical category.
- **Narrative information already known:** Five modules exist and can be opened in any order.
- **New work required:** Compare the five needs and choose the closest fit.
- **Exact learner prompt:** Which situation is closest to what brought you here today?
- **Exact controls or choices:** The five route titles above as a single-select radio group; buttons **Show my starting point**, **Clear choice**, and **Open another module instead**.
- **Logic:** Any choice is interpretive, not correct. Submission displays the matching description, destination, and a reminder that the route can be changed.
- **Exact feedback:**  
  - M1 selected: “Start with noticing what happened without deciding what it means. This route practices curiosity, timing, and listening.”  
  - M2 selected: “Start with the line between offered help and assumed involvement. This route focuses on permission, privacy, and repair.”  
  - M3 selected: “Start with ordinary tasks. This route turns ‘Tell me if you need anything’ into support that is specific and easier to accept or decline.”  
  - M4 selected: “Start with role clarity. This route cannot assess a current situation. If someone may be in immediate danger, use the urgent route now.”  
  - M5 selected: “Start with what is becoming hard to sustain. This route separates caring from being responsible for another adult's decisions.”
- **Learning point:** A useful starting point depends on the current need, not on completing prerequisites.
- **Required or optional:** Optional.
- **Progression behavior:** Does not affect module or section completion.
- **Can answers be revised:** Yes, before and after submission.
- **Keyboard behavior:** Arrow keys move within the radio group; Tab reaches actions; Enter or Space activates.
- **Screen-reader behavior:** Group label and five options are announced; submitted feedback uses a polite status region; destination action includes the full module title.
- **Mobile behavior:** Options stack in reading order with the connecting line replaced by a labeled vertical rule. No horizontal scroll at 320px or 200 percent zoom.
- **Reduced-motion behavior:** Destination summary appears immediately with no line drawing.
- **Data-storage behavior:** The current choice may persist only until navigation. Do not save it as a health or caregiver profile.
- **Applicable global rules:** `CONTENT-04`, `INTERACTION-01` to `INTERACTION-08`, `PRIVACY-01`, `RESPONSIVE-01` to `RESPONSIVE-09`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** All routes remain equally reachable; no choice is styled as more caring; M4 preserves the immediate safety route; no personal data is requested.

### `CG-LANDING-I02`

- **Learner-facing title:** Choose how to begin
- **Purpose:** Help a learner decide between immediate relevance and the recommended order.
- **Cognitive action:** Compare two valid path strategies.
- **Narrative information already known:** The guided order is recommended but not locked.
- **New work required:** Select a path based on current need and available time.
- **Exact learner prompt:** What would be most useful right now?
- **Exact controls or choices:**  
  1. “Start with what is happening today”  
  2. “Follow the recommended path from the beginning”  
  3. “Open a practical tool”  
  Actions: **Use this path** and **Change choice**.
- **Logic and feedback:**  
  - Situation today: “Use the need-based routes above. You can return to the guided path without losing progress.”  
  - Recommended path: “Begin with What They May Be Feeling. Later modules stay open if another need becomes more urgent.”  
  - Practical tool: “Tools can be used without module completion. Their save and privacy behavior differs by tool and will be shown before use.”
- **Learning point:** Structure can guide attention without controlling access.
- **Required or optional:** Optional.
- **Progression behavior:** No completion effect.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Semantic radio group and explicit submit.
- **Screen-reader behavior:** The selected strategy and consequence are announced together after submission.
- **Mobile behavior:** Three choices appear as full-width rows separated by fine rules.
- **Reduced-motion behavior:** Immediate text replacement.
- **Data-storage behavior:** Session navigation state only.
- **Applicable global rules:** `CONTENT-01` to `CONTENT-04`, `PROGRESS-01` to `PROGRESS-08`, `INTERACTION-01` to `INTERACTION-08`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No path is locked; tools remain independent; choice does not imply urgency assessment.

## Landing-Page Acceptance Criteria

- All hero, route, module-preview, tool-introduction, autonomy, privacy, safety, first-visit, and returning-user copy appears exactly as specified.
- Regional numbers and agencies come only from controlled configuration.
- Urgent direction precedes educational routing when activated.
- The landing page requests no health data and exposes no tool contents.
- The visual structure is relational and asymmetric, not a card catalog.
- Every function works at 320px, keyboard-only, with a screen reader, at 200 percent zoom, with reduced motion, and with long translated labels.
- Returning-state progress uses only approved labels and remains non-credentialing.
- **Clinical-review flags:** Immediate-safety route, product limitation, regional fallback.

# MODULE 1: WHAT THEY MAY BE FEELING

## 1. Module Metadata

- **Module ID:** `CG-M1`
- **Purpose:** Help supporters interpret emotional reactions with curiosity rather than assumption.
- **Audience problem:** A supporter sees silence, anger, withdrawal, denial, or frustration and feels pressure to decide what it means or fix it.
- **Emotional objective:** Move from confusion to curiosity to patient attention.
- **Practical learning objectives:** Separate observation from interpretation; hold several explanations at once; check timing; offer listening, practical help, or space; stop repeated questioning.
- **Estimated time:** 8 to 10 minutes.
- **Medical-risk level:** Low to moderate. Emotional content must not become diagnosis; medical symptoms are outside this module.
- **Review status:** Editorial, cultural, emotional-safety, accessibility, and clinical-boundary review required.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-09`, `AUTONOMY-01` to `AUTONOMY-09`, `CONSENT-01`, `CONSENT-02`, `CONTENT-05` to `CONTENT-15`, `SCENARIO-01` to `SCENARIO-15`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `QUIZ-01` to `QUIZ-12`, `REFLECTION-01` to `REFLECTION-07`, `PROGRESS-01` to `PROGRESS-08`, `PRIVACY-01` to `PRIVACY-05`, `VISUAL-01` to `VISUAL-10`, `MOTION-01` to `MOTION-08`, `RESPONSIVE-01` to `RESPONSIVE-09`, `ACCESSIBILITY-01` to `ACCESSIBILITY-20`.

## 2. Visual Identity

- **Tone:** Observant, spacious, and gently uncertain.
- **Metaphor:** Signals seen across distance. A lit window, a quiet phone, or a partially open curtain suggests that observation is incomplete.
- **Dominant composition:** A scene with wide negative space, followed by an observation workbench and a narrow timing strip.
- **Typography:** Serif for scene moments; sans-serif for evidence, interpretations, and dialogue controls.
- **Accent:** Muted blue-green with a small terracotta timing marker.
- **Motion:** Possible interpretations separate from one observation, then settle side by side. Motion shows multiplicity, not emotional certainty.
- **Mobile order:** Scene, observed facts, unknowns, interpretation activity, timing activity, listening practice, takeaway.
- **Reduced motion:** Interpretations appear as a static labeled list.
- **Anti-card strategy:** Use annotated margins and open columns; only feedback receives a contained surface.
- **Must not appear:** Thought bubbles presented as facts, emotion scores, facial-expression diagnosis, therapist imagery, repeated reveal tiles.

## 3. Emotional Progression and Complete Experience Flow

1. A brief remote-support scenario creates uncertainty.
2. The learner sees the difference between an event and a story about the event.
3. The learner generates more than one possible interpretation.
4. The module introduces readiness as changeable, not a personality trait.
5. The learner chooses how to respond at different times.
6. The learner practices listening without turning every conversation into a solution session.
7. A new-context knowledge check tests transfer.
8. An optional private reflection and concise takeaway close quietly.

## 4. Complete Learner-Facing Content

### `CG-M1-S01` Opening

**Eyebrow:** MODULE 1 OF 5

**Title:** What They May Be Feeling

**Opening copy:** A short answer can sound like anger. Silence can look like denial. A changed subject can feel like rejection. What you observe is real, but the meaning may still be unclear.

**Central idea:** Notice what happened. Stay uncertain about what it means. Ask whether the person wants to talk, wants another kind of help, or wants to leave it for now.

### `CG-M1-S02` Illustrative Scenario: The unanswered call

Jules lives in another city from his older sister, Mira. Since Mira mentioned a new diabetes medication at dinner last week, Jules has texted every evening.

On Tuesday he writes, “How are you feeling? Did you figure everything out?”

Mira replies three hours later: “Busy. Can we not do diabetes tonight?”

Jules stares at the message. He thinks she may be scared and avoiding it. He also wonders whether she is angry with him. He starts typing, “I’m only asking because I care.”

He deletes it, then calls. Mira does not answer.

**What is observable:** Mira replied after three hours, said she was busy, asked not to discuss diabetes that night, and did not answer the call.

**What is not known:** Why she replied late, what she feels, whether she wants support later, and whether the call felt caring, pressuring, or unrelated to her silence.

### `CG-M1-S03` One event, several explanations

The same response could come from fear, irritation, information overload, embarrassment, fatigue, grief, wanting a normal evening, conflict unrelated to diabetes, or something else. Listing possibilities is useful only if it protects uncertainty. It is not a way to diagnose the person from a distance.

Repeated questions can add pressure even when each question sounds gentle. If the person has already said not now, more questions may make the conversation harder to reopen.

### `CG-M1-S04` Readiness changes

Someone may want to talk in the morning and not after work. They may want practical help without discussing feelings. They may want to explain something once but not provide ongoing updates.

Readiness is not a test of trust. A pause can be a preference for this moment.

**Language to open:** “Is now a good time to ask about how things have been going?”

**Language to clarify:** “Would listening, practical help, or some space be more useful?”

**Language to pause:** “Okay. I’ll leave it here. If you want, I can check another day.”

**Language for uncertainty:** “I noticed you got quiet, but I do not want to decide what that means.”

### `CG-M1-S05` Listening is an action

Listening does not require silence forever. It means the first response follows the kind of conversation the person agreed to have.

If they want listening, stay with what they said before introducing advice. If they want practical help, agree on one task. If they want space, accept the pause without making them reassure you.

**Listening response:** “That sounds like a lot to take in. Do you want to keep talking?”

**Fixing response:** “Here is what you need to do.”

The second line may be well intended, but it changes the speaker, subject, and goal. Advice belongs only when it is wanted and within your role.

### `CG-M1-S06` Returning later

A paused conversation does not need a dramatic reopening.

Try: “You asked not to talk about diabetes Tuesday. Would you rather leave it alone, or is there a better time to check in?”

If the answer is no, accept it: “Okay. I will not keep asking. If you want something specific later, tell me.”

### `CG-M1-S07` Common misunderstanding correction

**Misunderstanding:** “If I do not keep asking, they will think I do not care.”

**Correction:** Care can be visible without repeated questioning. A specific offer, a normal conversation, or respecting a pause may communicate steadiness more clearly than another request for an update.

## 5. Interaction Specifications

### `CG-M1-I01`

- **Learner-facing title:** What happened, and what are you adding?
- **Purpose:** Practice separating observable facts from interpretations.
- **Cognitive action:** Sort evidence and generate uncertainty.
- **Narrative information already known:** Mira replied late, set a boundary, and did not answer.
- **New work required:** Label statements and add one alternative interpretation not supplied by the narrative.
- **Exact learner prompt:** Place each statement under **Observed** or **Possible interpretation**. Then write one other explanation that remains possible.
- **Exact controls or choices:** Six movable statements with click, tap, and keyboard destination controls: “Mira replied after three hours”; “Mira is afraid of the medication”; “She asked not to discuss diabetes that night”; “She is angry with Jules”; “She did not answer the call”; “She does not trust him.” Text field label: “Another possible explanation, without deciding it is true.” Buttons: **Check the distinction**, **Revise**, **Clear**.
- **Logic:** Observed items are the first, third, and fifth statements. Interpretations are the others. The text field accepts any non-identifying entry and is not scored for emotional correctness.
- **Exact feedback:**  
  - All categories correct: “You kept the visible events separate from the meaning attached to them. The added possibility matters because it leaves room for asking instead of assuming.”  
  - Any interpretation placed as observed: “One or more statements describe a possible reason, not something Jules can verify from the message. Move feelings, motives, and relationship conclusions to Possible interpretation.”  
  - Any event placed as interpretation: “One or more statements can be verified from the exchange itself. Keeping those facts clear makes uncertainty easier to hold.”  
  - Text blank: “The categories are checked. Add another possible explanation if you want more practice. This field is optional.”
- **Learning point:** Uncertainty is not inattention. It is the space that keeps observation from becoming a label.
- **Required or optional:** Required category task; optional text.
- **Progression behavior:** Category submission counts as one meaningful application. Text does not gate.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Each statement has **Move to Observed** and **Move to Possible interpretation** controls; no drag is required.
- **Screen-reader behavior:** Statements announce current group and position; after submission, the result summary identifies statements needing review by text.
- **Mobile behavior:** Groups stack with persistent headings; moved statements remain visible; text field expands vertically.
- **Reduced-motion behavior:** Statements change groups immediately.
- **Data-storage behavior:** Session-only. Free text is not saved, logged, shared, or sent to the AI Tutor.
- **Applicable global rules:** `CONTENT-08`, `CONTENT-09`, `SCENARIO-13`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `REFLECTION-07`, `PRIVACY-01`, `PRIVACY-03`, `PRIVACY-11`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** The task adds classification and generation beyond the scenario; no emotion is treated as true; drag has full alternatives; long text and translation do not clip.

### `CG-M1-I02`

- **Learner-facing title:** Check the timing
- **Purpose:** Show that a respectful response depends on current readiness.
- **Cognitive action:** Choose among ask, pause, and revisit across changing contexts.
- **Narrative information already known:** Mira asked not to discuss diabetes that night.
- **New work required:** Apply timing to three later moments.
- **Exact learner prompt:** For each moment, choose the response that best protects Mira's ability to decide whether to talk.
- **Controls or choices:** A three-stop timeline.  
  - **That evening:** A “Call again”; B “Reply, ‘Okay. I’ll leave it here tonight’”; C “Ask why she is avoiding it.”  
  - **Two days later during her workday:** A “Send three questions at once”; B “Ask, ‘Is there a better time to check in, or would you rather leave it?’”; C “Contact another relative for an update.”  
  - **At their normal weekend call:** A “Talk normally, then ask if she wants to revisit it”; B “Begin with medication questions”; C “Avoid her because the topic feels awkward.”  
  Button: **Review the timing**.
- **Logic:** Preferred sequence B, B, A. Each stop can be revised independently.
- **Exact feedback:**  
  - Evening B: “This accepts the stated limit without demanding an explanation.”  
  - Evening A or C: “Concern may be real, but another call or a why-question presses after a clear not tonight.”  
  - Workday B: “This asks about both timing and whether the topic should be reopened.”  
  - Workday A: “Several questions make refusal harder and repeat the pressure.”  
  - Workday C: “Seeking private updates from someone else bypasses Mira rather than checking what she wants.”  
  - Weekend A: “A normal conversation preserves the relationship beyond diabetes, and the later question leaves the choice with Mira.”  
  - Weekend B: “Starting with health questions treats access as expected.”  
  - Weekend C: “Space can be respectful when requested. Silent withdrawal is different because Mira is left to guess what changed.”
- **Learning point:** Respecting not now includes both stopping and asking carefully before returning.
- **Required or optional:** Required.
- **Progression behavior:** Completion of all three moments counts as application.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Timeline is a labeled list of radio groups.
- **Screen-reader behavior:** Each moment is a fieldset; feedback is announced after submission and remains adjacent.
- **Mobile behavior:** Timeline becomes a vertical list with no loss of sequence.
- **Reduced-motion behavior:** No moving timing marker; selected labels update instantly.
- **Data-storage behavior:** Interaction state only until module exit; no analytics on individual choices.
- **Applicable global rules:** `CONSENT-02`, `SUPPORT-02`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** The activity tests changing timing, not recall; each choice has consequence-based feedback; private information is not requested.

### `CG-M1-I03`

- **Learner-facing title:** Listen, help, or leave space
- **Purpose:** Practice matching the first response to the conversation requested.
- **Cognitive action:** Assemble a response from intent and wording.
- **Narrative information already known:** Listening, practical help, and space are distinct.
- **New work required:** Build a response to a new statement.
- **Exact learner prompt:** A friend says, “I spent my whole lunch break on insurance calls, and I do not want advice right now.” Build the next response.
- **Controls or choices:** Two-part sentence builder. Opening options: “That sounds exhausting”; “You should call again tomorrow”; “At least it is handled.” Follow-up options: “Do you want to tell me what happened, or change the subject?”; “I can fix the insurance problem”; “Why did it take so long?” Button: **Hear the response**.
- **Logic:** Preferred combination is “That sounds exhausting” plus the choice-based follow-up. Other combinations receive component-specific feedback.
- **Exact feedback:**  
  - Preferred: “This stays with what the friend said and offers two directions without sneaking advice back in.”  
  - Advice opening: “The friend already declined advice. A solution offered immediately changes the kind of conversation.”  
  - Minimizing opening: “This closes the experience before the friend has decided whether to say more.”  
  - Fix follow-up: “The offer assumes both permission and that the problem can be taken over.”  
  - Why follow-up: “The question may sound like a request for justification. A choice about continuing is easier to decline.”
- **Learning point:** Listening can include a small choice about what happens next.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts as meaningful practice.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Two labeled radio groups; assembled sentence is available as text before submission.
- **Screen-reader behavior:** The full assembled sentence is announced once on request, not on every change.
- **Mobile behavior:** Openings and follow-ups stack; assembled sentence remains below the controls, not sticky.
- **Reduced-motion behavior:** Sentence updates without animated assembly.
- **Data-storage behavior:** Not saved or shared.
- **Applicable global rules:** `CONTENT-06`, `CONTENT-13`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `PRIVACY-01`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** Dialogue sounds speakable; the correct response is not identified by length alone; no perfect resolution follows.

## 6. Practical Language Scripts

- **Ask about timing:** “Is now a good time to ask about diabetes, or would you rather not?”
- **Offer three modes:** “Would listening, one practical task, or some space be more useful?”
- **Acknowledge uncertainty:** “I noticed the conversation stopped. I do not know what that means for you.”
- **Accept a pause:** “Okay. I will not keep asking tonight.”
- **Offer a return:** “Would you like me to check another day, or leave it with you?”
- **Remote support:** “I am thinking about you. No update is needed. If you want help with one call or errand, ask me.”
- **Listen before fixing:** “Do you want ideas, or do you want me to hear how frustrating this was?”

## 7. Knowledge Check

### `CG-M1-Q01`

- **Question:** At dinner, Rowan becomes quiet after a relative comments on dessert. What is the most careful first interpretation?
- **Choices:** A “Rowan is ashamed”; B “Rowan is refusing to face diabetes”; C “Something changed, but the reason is not clear”; D “Rowan wants someone to defend the food choice.”
- **Preferred response:** C.
- **Explanation:** Quiet is observable. Shame, denial, and wanting intervention are possible interpretations. Begin with uncertainty and ask privately only if the timing is appropriate.
- **Misconception tested:** Silence proves one emotion or intention.
- **Related section:** `CG-M1-S03`
- **Review link label:** Review one event, several explanations

### `CG-M1-Q02`

- **Question:** A coworker says, “I cannot talk about appointments right now, but could you cover the front desk Thursday?” What response fits the request?
- **Choices:** A “Sure. I can cover Thursday. We can leave the appointment topic alone”; B “Only if you promise to tell me later”; C “Are you sure the appointment is okay?”; D “I will ask the manager what happened.”
- **Preferred response:** A.
- **Explanation:** The coworker made one practical request and set one conversation limit. Accepting both avoids turning help into a trade for private information.
- **Misconception tested:** Practical help earns disclosure.
- **Related section:** `CG-M1-S04`
- **Review link label:** Review readiness and specific help

### `CG-M1-Q03`

- **Question:** A friend who previously wanted weekly check-ins replies, “Can we skip this week?” What is the best next step?
- **Choices:** A “Skip it and ask later whether the weekly arrangement still works”; B “Continue because the weekly plan was already agreed”; C “Stop all contact until the friend reaches out”; D “Ask another friend to check instead.”
- **Preferred response:** A.
- **Explanation:** This is a gray area because a recurring agreement exists. A current pause still matters, and the ongoing arrangement can be revisited without treating one skipped week as permanent withdrawal.
- **Misconception tested:** Previous consent cannot change, or one pause ends all support.
- **Related section:** `CG-M1-S06`
- **Review link label:** Review returning later

## 8. Optional Private Reflection

### `CG-M1-R01`

- **Exact prompt:** Think of a recent moment when you filled in the meaning of someone else's silence or short answer. What observable fact could you keep separate from your interpretation next time?
- **Privacy notice:** This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.
- **Save or session behavior:** Session-only editable text. Clear on session end or reset.
- **Skip label:** Skip for Now
- **Clear behavior:** **Clear reflection** removes the text immediately after a plain confirmation: “Clear this session-only reflection?”
- **Applicable global rules:** `REFLECTION-01` to `REFLECTION-07`, `PRIVACY-01`, `PRIVACY-03`, `PRIVACY-11`, `STORAGE-06`.

## 9. Practical Takeaway

**Heading:** Before you decide what it means

**Central idea:** One reaction can have several explanations.

**Practical action:** Name what you observed, then ask whether the person wants listening, practical help, or space.

**Boundary:** If they say not now, stop. Do not turn concern into repeated questioning.

## 10. Completion Copy and Progress Logic

**Completed state:** Module completed

**What you practiced:** You separated observation from interpretation, checked timing, and matched a response to the kind of support requested.

**Key idea status if all preferred answers selected:** Key idea appears understood: stay uncertain, then ask.

**Key idea status if any knowledge-check answer missed:** One idea may be worth revisiting: a previous agreement or caring intention does not remove the need to notice current readiness.

**Review option:** Review the key idea

**Next recommended module:** Next: Support Without Taking Over

**Other actions:** Continue to Module 2; Return to Support Someone You Care About

**Progress logic:** `moduleCompleted = true` after the central idea is reached, at least one of `CG-M1-I01` to `CG-M1-I03` is submitted, and the takeaway is viewed. Reflection and quiz accuracy do not affect completion. A missed knowledge-check answer may set `keyIdeaUnderstood = false` and offer Revisit.

## 11. Responsive and Accessibility Intent

The scenario remains before all interpretation tasks at 320px. Observation and interpretation columns stack with persistent group labels. Dialogue builders expose assembled text. No visual meaning depends on distance, light, line motion, or color. At 200 percent zoom, feedback follows its control in DOM order. Long dialogue and translations wrap naturally. All imagery either has concise alternative text describing the incomplete signal or empty alternative text when decorative.

## 12. Medical and Privacy Notes

- Emotional possibilities are illustrative and non-diagnostic.
- No answer asks about actual symptoms, readings, medications, names, or medical history.
- Free text is session-only and excluded from analytics and AI Tutor transfer.
- If a learner independently raises immediate danger, the global urgent-help route replaces ordinary reflection without classifying the danger.

## 13. Source Claims Used

- `CG-CLAIM-001`: Diabetes can carry emotional distress and substantial self-management demands.
- `CG-CLAIM-002`: Family and friend support can help, and asking and listening are appropriate starting points.

## 14. Content Acceptance Criteria

- The scenario uses remote sibling support and is not reused elsewhere.
- Observation, interpretation, and unknown information remain distinct.
- No emotion is diagnosed and no reaction is attributed to diabetes as a certainty.
- The interactions perform sorting, timing, and sentence construction rather than repeating the narrative.
- Exactly three knowledge-check questions use new contexts, including one gray area.
- Reflection is optional and session-only.
- Completion is calm, private, and non-credentialing.
- Visual direction remains signal-based and distinct from Module 2's shared-space metaphor.
- Accessibility and mobile behavior are specified inside every interaction.

# MODULE 2: SUPPORT WITHOUT TAKING OVER

## 1. Module Metadata

- **Module ID:** `CG-M2`
- **Purpose:** Teach the difference between support and control while acknowledging that overstepping often begins with worry, love, uncertainty, or responsibility.
- **Audience problem:** A supporter may believe helpful intention authorizes reminders, information access, appointment involvement, or disclosure.
- **Emotional objective:** Move from fear-driven action to recognition of impact, permission, repair, and reliable support.
- **Practical learning objectives:** Distinguish intention from impact; identify offered, assumed, pressured, monitored, and surveilled involvement; ask specific permission; accept no; clarify recurring agreements; repair privacy oversteps; set non-punitive limits.
- **Estimated time:** 14 to 18 minutes.
- **Medical-risk level:** Moderate because readings, medications, appointments, and emergency fear appear only as relational contexts.
- **Review status:** Prototype-quality content requiring editorial, clinical-boundary, privacy, accessibility, cultural, and emotional-safety review.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-09`, `AUTONOMY-01` to `AUTONOMY-10`, `CONSENT-01` to `CONSENT-10`, `SUPPORT-01` to `SUPPORT-08`, `PRIVACY-01` to `PRIVACY-15`, `MEDICAL-01` to `MEDICAL-15`, `CONTENT-05` to `CONTENT-15`, `SCENARIO-01` to `SCENARIO-15`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `QUIZ-01` to `QUIZ-12`, `REFLECTION-01` to `REFLECTION-07`, `PROGRESS-01` to `PROGRESS-08`, `VISUAL-01` to `VISUAL-10`, `MOTION-01` to `MOTION-08`, `RESPONSIVE-01` to `RESPONSIVE-09`, `ACCESSIBILITY-01` to `ACCESSIBILITY-20`.

## 2. Visual Identity

- **Tone:** Honest, relational, and steady, with enough tension to make consequences visible.
- **Metaphor:** A shared table with individually controlled areas. Connection lines cross only at visible consent points.
- **Composition:** Asymmetric dialogue scene, wide consequence map, open continuum, central branching conversation, quiet repair sequence.
- **Typography:** Large serif statements for intention and impact; compact sans-serif for actions, permission scope, and consequences.
- **Accent:** Terracotta for relational impact, sage for agreed support, blue-green for privacy. No green-versus-red moral coding.
- **Interaction integration:** Choices physically connect to likely impact or remain outside an agreed boundary.
- **Illustration:** Two adults occupying the same kitchen without posed affection. Objects such as a phone, grocery bag, and appointment note suggest the conflict.
- **Motion:** A support action crosses a consent point only after submission. Branch consequences unfold without dramatic shifts.
- **Mobile order:** Scenario, intention-impact map, continuum, permission builder, branching conversation, repair sequence, scripts, check, reflection, takeaway.
- **Reduced motion:** Static before-and-after diagrams with text labels.
- **Anti-card strategy:** Use the shared tabletop as the work surface and fine rules between dialogue moments.
- **Must not appear:** Locks and keys as simplistic virtue symbols, patient dashboard, villain framing, floating heart icons, wall of choice cards.

## 3. Emotional Progression and Complete Experience Flow

1. A close-support scenario shows an understandable intention and an overstep involving food, a medication reminder, health-app access, and family disclosure.
2. The learner maps intention to several possible impacts.
3. A continuum distinguishes support, pressure, monitoring, and surveillance.
4. A sentence builder makes permission specific and declinable.
5. A branching conversation shows that wording, repetition, and response to no change the impact.
6. A repair sequence practices naming the action without demanding reassurance.
7. Boundaries show how supporters can limit their own actions without punishing another adult.
8. New-context questions, private reflection, and a restrained close consolidate the module.

## 4. Complete Learner-Facing Content

### `CG-M2-S01` Opening

**Eyebrow:** MODULE 2 OF 5

**Title:** Support Without Taking Over

**Opening copy:** Overstepping often starts with a reasonable fear: What if I miss something? What if they need help and do not ask? What if staying quiet looks careless?

**Central idea:** Good support begins with permission and stays specific, proportional, private, easy to decline, and open to change.

### `CG-M2-S02` Illustrative Scenario: The phone on the counter

Leah and Andre have been partners for six years. Andre was diagnosed with Type 2 diabetes several months ago. One Saturday, Leah is putting away groceries while Andre is making coffee.

Leah takes cookies from a bag. “I thought we agreed not to keep these here.”

Andre says, “We did not agree. You said you were not buying them.”

Leah lowers her voice. “Fine. Did you take your medication?”

Andre looks at her. “Please stop checking.”

Later, while Andre showers, his phone lights up on the counter. Leah knows his passcode. She opens his health app because she wants to know whether the week has been okay. She sees a screen she does not understand and closes it.

That evening, Leah tells her sister, “I think Andre is slipping. I do not know how to get through to him.”

Andre hears from the next room. “Why are you talking about me?”

Leah replies, “Because I am worried. I am trying to help.”

Andre picks up his phone and leaves the kitchen. The conversation is not resolved.

### `CG-M2-S03` Intention and impact can both be real

Leah may be trying to reduce risk, make the household easier, and manage her own fear. Those intentions do not create permission to set Andre's food rules, check medication, open private information, or share it with someone else.

Possible impact includes feeling watched at home, exposed to family, or expected to report. Andre may also feel something different. The exact impact belongs to him to describe or not describe.

Recognizing impact is not the same as declaring Leah uncaring. It identifies what needs to change.

### `CG-M2-S04` A useful distinction

- **Invited support:** “Could you pick up my prescription?”
- **Offered support:** “Would it help if I picked it up?”
- **Negotiated support:** “Do you still want one reminder on weekday mornings?”
- **Pressure:** “I am going to keep asking until you answer.”
- **Monitoring:** Checking behavior or information as a routine. This requires a clear, specific, revisable agreement.
- **Surveillance:** Secret, continuous, coercive, or unauthorized access. Concern does not make it support.

One yes covers one agreed action. Permission to attend an appointment does not authorize speaking. Access to a phone does not authorize opening health information. A reminder requested last month can be changed today.

### `CG-M2-S05` Permission should answer five questions

1. What action are you offering?
2. What information, if any, is involved?
3. When does the agreement apply?
4. How can either person pause or change it?
5. Can no be given without guilt, argument, or repeated asking?

**Specific offer:** “Would you like one text reminder before Thursday's appointment?”

**Assumed offer:** “I will remind you so you do not forget.”

**Accepting no:** “Okay. I will not send one.”

### `CG-M2-S06` Appointments and private information

Ask before attending an appointment. If invited, ask what role is wanted.

“Would you like me there?”

“If I come, would you like me to listen, take notes, ask a question you choose, or wait outside?”

The person may change the role in the room. They speak for themselves unless a different role is clearly requested and appropriate.

Before sharing with relatives, friends, clinicians, or digital services, ask what can be shared, with whom, and for what purpose.

### `CG-M2-S07` Repair after an overstep

A repair does not erase the action or guarantee forgiveness.

**Name it:** “I opened your health app without asking.”

**Acknowledge impact without deciding it:** “That may have made home feel less private.”

**Apologize without a defense:** “I am sorry.”

**Change the behavior:** “I will not open it again.”

**Clarify future permission:** “If I am worried, I will ask what you want me to know.”

Do not add, “but I only did it because I love you,” or ask the other person to say the apology is accepted.

### `CG-M2-S08` Supporter boundaries

Respecting autonomy does not require agreeing to every request or being available at every hour.

**Usable boundary:** “I can drive on Tuesdays, but I cannot leave work without notice. We need another option for last-minute rides.”

**Punitive boundary:** “If you will not follow my advice, do not ask me for anything.”

The first line names the supporter's capacity. The second uses help as leverage over another adult's decisions.

**Common misunderstanding:** “If I ask permission every time, I will sound distant.”

**Correction:** Recurring support can be agreed without repeating a formal question each time. The agreement still needs a clear scope and an easy way to change it.

## 5. Interaction Specifications

### `CG-M2-I01`

- **Learner-facing title:** What Leah meant, what Andre may have received
- **Purpose:** Distinguish understandable intention from possible impact.
- **Cognitive action:** Map one action to multiple non-diagnostic consequences.
- **Narrative information already known:** Leah checked, accessed, and disclosed from worry.
- **New work required:** Connect each action to intention and plausible impact, then identify what cannot be known.
- **Exact learner prompt:** For each action, choose Leah's likely intention, one possible impact on Andre, and the fact that still requires Andre's perspective.
- **Controls or choices:** Three rows: cookie comment, medication question, app access and disclosure. Intention options: reduce risk, keep a routine, seek reassurance. Impact options: support, pressure, loss of privacy, feeling discussed rather than included. Unknown toggle: “Andre's exact experience remains unknown.” Button: **Map the consequences**.
- **Logic:** Several intention choices are plausible. Preferred impacts are pressure for repeated food or medication checking and loss of privacy for app access or disclosure. Every row requires the unknown toggle.
- **Exact feedback:**  
  - Plausible intention plus preferred impact: “The intention can be understandable while the action still adds pressure or removes privacy. Both belong in the map.”  
  - “Support” selected for an uninvited action: “An action does not become support from intention alone. Check whether permission, privacy, and an easy no were present.”  
  - Unknown omitted: “The scenario supports possible impacts, not Andre's exact feelings. Keep his perspective open.”
  - Unsupported arrangement: “Review what the action asks of the other person, what choice remains available, and what is still unknown. You can revise your response before continuing.”
- **Learning point:** Intention explains an action; it does not settle its impact or authorize it.
- **Required or optional:** Required.
- **Progression behavior:** All three rows must be submitted; accuracy does not gate.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Labeled select groups in each row; no line-drawing required.
- **Screen-reader behavior:** Each row is a fieldset with action text; result announces intention, impact, and unknown in sentence form.
- **Mobile behavior:** Rows stack as action, intention, impact, unknown, feedback.
- **Reduced-motion behavior:** Static consequence sentences replace connecting lines.
- **Data-storage behavior:** Module-state only; no individual-choice analytics.
- **Applicable global rules:** `SUPPORT-05` to `SUPPORT-07`, `CONTENT-08`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No intention is called malicious; impact is clear; Andre's feelings are not diagnosed.

### `CG-M2-I02`

- **Learner-facing title:** Support, pressure, monitoring, or surveillance?
- **Purpose:** Recognize how permission, repetition, and secrecy change an action.
- **Cognitive action:** Place behaviors on a relational continuum.
- **Narrative information already known:** Category definitions have been introduced.
- **New work required:** Classify six new behaviors and compare adjacent categories.
- **Exact learner prompt:** Place each behavior under the closest category. Use the permission, repetition, and privacy details, not the topic alone.
- **Controls or choices:** Categories: **Offered support**, **Pressure**, **Monitoring with an agreement**, **Surveillance**. Behaviors: “One offer to order supplies, with no repeated asking”; “A third medication text after two unanswered messages”; “A weekly check of a shared list that both people agreed to and can stop”; “Opening a glucose app in secret”; “Saying a ride is available only if the person shares a reading”; “Checking an agreed alert, then continuing after the agreement was withdrawn.” Buttons: **Review the line**, **Revise**.
- **Logic:** Offered, pressure, agreed monitoring, surveillance, pressure/coercive condition, surveillance/unauthorized monitoring. For the fifth behavior, feedback names coercive pressure while keeping the available category.
- **Exact feedback:** Each item receives:  
  - One offer: “Specific, visible, and easy to decline.”  
  - Third text: “Repetition changes the impact even when each message sounds polite.”  
  - Shared list: “This is monitoring only within a clear, revisable agreement.”  
  - Secret app: “Secret access removes permission and privacy.”  
  - Conditional ride: “The condition uses needed help to force disclosure. That is coercive pressure, not an ordinary offer.”  
  - Continued alert: “An old agreement does not survive withdrawal. Continued access is unauthorized.”
- **Learning point:** The same topic can be support or control depending on permission, privacy, repetition, and freedom to decline.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts as application.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Each behavior has a category select; drag is optional enhancement only.
- **Screen-reader behavior:** Category and rationale are announced for each item after submission.
- **Mobile behavior:** One behavior at a time with a persistent category legend.
- **Reduced-motion behavior:** Immediate category placement.
- **Data-storage behavior:** Session module state only.
- **Applicable global rules:** `SUPPORT-01` to `SUPPORT-08`, `CONSENT-06` to `CONSENT-09`, `INTERACTION-01` to `INTERACTION-08`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** Surveillance is never softened into care; emergency action is not introduced as a loophole.

### `CG-M2-I03`

- **Learner-facing title:** Make the offer clear enough to decline
- **Purpose:** Practice permission language with a specific action and scope.
- **Cognitive action:** Build and revise a support request.
- **Narrative information already known:** Permission should name action, timing, and ability to change.
- **New work required:** Construct a one-time appointment offer.
- **Exact learner prompt:** Build an offer for a ride to an appointment. Keep the appointment private unless the person chooses to share more.
- **Controls or choices:**  
  - Opening: “Would you like” / “I am going to” / “You need me to”  
  - Action: “a ride to Thursday's appointment” / “me involved in your care” / “me to handle the appointment”  
  - Decline clause: “It is fine to say no” / “because I am worried” / “so I know what is happening”  
  - Role follow-up: “If you want a ride, we can separately decide whether I come inside” / “A ride means I will join you” / “You can tell me the details afterward”  
  Button: **Review the offer**.
- **Logic:** Preferred sentence uses the first option in each relevant group. Component feedback explains scope.
- **Exact feedback:** “This offer names one action, keeps attendance separate, and makes no easier. A ride does not purchase appointment access.” Other selections receive: “This wording assumes the role,” “This scope is too broad,” “This adds emotional pressure,” or “This bundles transportation with private involvement.”
- **Learning point:** Specific permission protects both people from reading different meanings into the same yes.
- **Required or optional:** Required.
- **Progression behavior:** Any submitted sentence counts; learner can revise to preferred.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Semantic selects with a live assembled sentence.
- **Screen-reader behavior:** Full sentence announced only through **Read my offer**.
- **Mobile behavior:** Builder stacks in sentence order.
- **Reduced-motion behavior:** No animated word movement.
- **Data-storage behavior:** Not saved or copied automatically.
- **Applicable global rules:** `CONSENT-01` to `CONSENT-09`, `AUTONOMY-03`, `INTERACTION-01` to `INTERACTION-08`, `PRIVACY-01`.
- **Acceptance criteria:** Appointment attendance and speaking role remain separate; no medical detail is requested.

### `CG-M2-I04`

- **Learner-facing title:** When the answer is no
- **Purpose:** Show how the response to refusal determines whether an offer remains freely declinable.
- **Cognitive action:** Navigate a branching conversation and interpret consequences.
- **Narrative information already known:** Andre asked Leah to stop checking.
- **New work required:** Choose Leah's next line and later response when worry remains.
- **Exact learner prompt:** Andre says, “I do not want medication reminders.” Choose Leah's next response.
- **First choices and feedback:**  
  - A “Okay. I will stop.” Feedback: “This accepts the answer. Leah can manage her worry without making Andre defend the boundary.”  
  - B “But what if you forget?” Feedback: “The question reopens a decision Andre just made and asks him to manage Leah's fear.”  
  - C “Fine, I guess you do not need me.” Feedback: “Withdrawal and guilt make no costly. The offer was not freely declinable.”  
  - D “What about just one reminder?” Feedback: “A smaller offer may be reasonable at another time, but bargaining immediately can turn no into a negotiation.”
- **Second prompt after A or revision:** “Two weeks later, Leah wants to revisit household support. What can she ask?”  
  Choices: “Is there any support agreement you want to revisit, including keeping reminders off?”; “Are you ready to admit reminders would help?”; “Can I ask your clinician instead?”  
  Preferred first choice.
- **Consequence close:** Andre says, “Not today.” Leah replies, “Okay.” The branch ends without resolution.
- **Neutral fallback for nonpreferred second choices:** “Review what the action asks of the other person, what choice remains available, and what is still unknown. You can revise your response before continuing.”
- **Learning point:** Permission is visible in what happens after no, not only in how the first offer is worded.
- **Required or optional:** Required.
- **Progression behavior:** Learner must reach the branch close; revisions are permitted.
- **Can answers be revised:** Yes, with prior path visible.
- **Keyboard behavior:** Each branch is a fieldset; explicit **Continue** prevents auto-advance.
- **Screen-reader behavior:** New branch heading receives focus only after the learner activates Continue; prior choice remains available.
- **Mobile behavior:** One branch step per vertical section; history shown as plain text.
- **Reduced-motion behavior:** Branches appear instantly.
- **Data-storage behavior:** No persistence beyond module session.
- **Applicable global rules:** `AUTONOMY-02`, `CONSENT-07` to `CONSENT-09`, `SUPPORT-02`, `INTERACTION-03`, `INTERACTION-07`, `FEEDBACK-01` to `FEEDBACK-08`, `ACCESSIBILITY-06`, `ACCESSIBILITY-07`.
- **Acceptance criteria:** No branch creates a perfect speech; refusal does not cause punishment; the conflict remains partly open.

### `CG-M2-I05`

- **Learner-facing title:** Repair the privacy overstep
- **Purpose:** Rehearse a repair that names action, impact, apology, change, and future permission.
- **Cognitive action:** Order and edit repair components.
- **Narrative information already known:** Leah opened the app and disclosed concern to her sister.
- **New work required:** Sequence five lines and remove one defensive line.
- **Exact learner prompt:** Put the repair in a usable order. Remove the line that asks Andre to excuse the action.
- **Controls or choices:** Lines: “I opened your health app and talked to my sister without asking”; “That may have made home feel less private”; “I am sorry”; “I will not open or share that information again”; “If I am worried, I will ask what you want me to know”; “You know I only did it because I care.” Keyboard move controls and **Remove from repair**. Button: **Review the repair**.
- **Logic:** Preferred order is action, possible impact, apology, change, future permission. Defensive line removed.
- **Exact feedback:**  
  - Correct sequence: “The repair names what happened before explaining what will change. It does not require Andre to reassure Leah.”  
  - Defense included: “The intention may be true, but placing it in the apology asks Andre to soften the impact.”  
  - Impact stated as fact: Not applicable because supplied wording preserves possibility.  
  - Change before action: “The promise is clearer after the action has been named directly.”
  - Unsupported arrangement: “Review what the action asks of the other person, what choice remains available, and what is still unknown. You can revise your response before continuing.”
- **Learning point:** Repair centers the action and future behavior, not the supporter's need to be understood.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts as application; preferred order is suggested, not a passing gate.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Move up, move down, and remove buttons on every line.
- **Screen-reader behavior:** Position and removed state announced; full sequence review available.
- **Mobile behavior:** Single vertical list.
- **Reduced-motion behavior:** Items reorder instantly.
- **Data-storage behavior:** Not saved.
- **Applicable global rules:** `AUTONOMY-10`, `SUPPORT-05` to `SUPPORT-07`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** The apology does not guarantee forgiveness, demand a response, or excuse access.

## 6. Practical Language Scripts

- **Ask before helping:** “Would you like help with one part of this, or would you rather handle it yourself?”
- **Offer one action:** “I can pick up the prescription after work. Would that help?”
- **Accept no:** “Okay. I will leave it with you.”
- **Clarify reminders:** “Do you still want one reminder on weekday mornings? You can pause or change that.”
- **Ask before an appointment:** “Would you like me there? If yes, what role would be useful?”
- **Apologize after access or disclosure:** “I opened and shared information that was not mine to access. I am sorry. I will not do that again.”
- **Name a supporter boundary:** “I can help with planned rides, but I cannot be on call during work.”
- **Revisit an agreement:** “Does our current arrangement still work, or should something change?”
- **Remote digital boundary:** “I will not ask for app access. If there is information you want me to know, you can choose what to share.”

## 7. Knowledge Check

### `CG-M2-Q01`

- **Question:** Sam asked his cousin Priya to text once after a monthly supply delivery. This month, Priya also opens the delivery account to inspect the order. Which statement fits best?
- **Choices:** A “The account check is covered by the text agreement”; B “The text is agreed support, but account access needs separate permission”; C “Family members can check when supplies are important”; D “Priya should stop all support.”
- **Preferred response:** B.
- **Explanation:** Consent for one update does not authorize access to related private information. The original support can continue within its scope.
- **Misconception tested:** One agreed action authorizes adjacent involvement.
- **Related section:** `CG-M2-S04`
- **Review link label:** Review one yes, one scope

### `CG-M2-Q02`

- **Question:** A spouse offers to cook on busy clinic days. The offer is declined twice, but the spouse asks again each evening “just in case.” What changed?
- **Choices:** A “Nothing, because cooking is helpful”; B “The repeated offer may now add pressure”; C “The spouse is monitoring”; D “The person lost the right to ask later.”
- **Preferred response:** B.
- **Explanation:** Repetition can make refusal harder even when the action is ordinary and caring. A later offer may be appropriate after time or a request, but daily bargaining should stop.
- **Misconception tested:** Polite repetition cannot become pressure.
- **Related section:** `CG-M2-S04`
- **Review link label:** Review how repetition changes an offer

### `CG-M2-Q03`

- **Question:** Devon agrees that his friend may receive one device alert while he travels. Midway through the trip, Devon says, “Turn it off. I will use my own plan.” What should the friend do?
- **Choices:** A “Keep it on until the trip ends because that was the original agreement”; B “Turn it off and ask later whether any different support is wanted”; C “Keep it on but promise not to look”; D “Ask Devon's family to decide.”
- **Preferred response:** B.
- **Explanation:** This is a gray area because the agreement had a time period, but consent can be withdrawn before that period ends. Turning it off respects the current decision.
- **Misconception tested:** Consent lasts until a planned end date.
- **Related section:** `CG-M2-S05`
- **Review link label:** Review revisable permission

## 8. Optional Private Reflection

### `CG-M2-R01`

- **Exact prompt:** Which kind of help are you most likely to assume because it feels obviously useful? Write one question that would make the action specific and easy to decline.
- **Privacy notice:** This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.
- **Save or session behavior:** Session-only, editable, and resettable.
- **Skip label:** Skip for Now
- **Clear behavior:** **Clear reflection** removes the entry after confirmation.
- **Applicable global rules:** `REFLECTION-01` to `REFLECTION-07`, `PRIVACY-01`, `PRIVACY-03`, `PRIVACY-11`, `STORAGE-06`.

## 9. Practical Takeaway

**Heading:** Keep help inside the agreement

**Central idea:** Caring intention does not create access or authority.

**Practical action:** Offer one specific action, make no easy, and clarify when the agreement can change.

**Boundary:** Do not use worry, repeated reminders, private access, disclosure, or withdrawal of help to force involvement.

## 10. Completion Copy and Progress Logic

**Completed state:** Module completed

**What you practiced:** You reached the central idea, practiced making support easier to decline, and reviewed the practical takeaway. The other activities remain available whenever you want to revisit them.

**Key idea status, understood:** Key idea appears understood: permission is specific, private, declinable, and revisable.

**Key idea status, revisit:** One idea may be worth revisiting: an earlier yes does not authorize a new action or survive withdrawal.

**Actions:** Review the key idea; Continue to Everyday Support That Actually Helps; Return to Support Someone You Care About.

**Progress logic:** Complete after the central idea, any one submitted interaction, and the takeaway. Quiz and reflection do not gate. Revisit preserves completion.

## 11. Responsive and Accessibility Intent

All consequence maps linearize into explicit action, intention, impact, and unknown labels. The continuum becomes a labeled select list without losing category definitions. Branch history remains available in text. At 200 percent zoom, no shared-table composition requires horizontal reading. Future translations may expand labels without truncation. Focus moves only after explicit submission. Color never identifies permission or overstep alone.

## 12. Medical and Privacy Notes

- Medication, glucose, and device references are relational only. No values, schedules, targets, or operational instructions appear.
- The scenario's health-app screen is not interpreted.
- Secret access and unauthorized disclosure are clearly prohibited.
- Emergency concern is not used to justify ongoing monitoring.
- All reflection and interaction text is session-only and excluded from analytics.

## 13. Source Claims Used

- `CG-CLAIM-002`: Ask and listen; desired reminders and assistance vary and can change.
- `CG-CLAIM-003`: Diabetes self-management and treatment plans are individualized.
- `CG-CLAIM-004`: Autonomy-supportive involvement is associated with better diabetes-related attitudes and self-management outcomes, while nonsupportive family behavior can be counterproductive.

## 14. Content Acceptance Criteria

- Leah is understandable but not excused, and Andre is not required to explain autonomy perfectly.
- Food, medication, health-app access, and disclosure are handled without clinical advice.
- Five interactions use five distinct mechanics and complete feedback.
- Permission, appointment roles, privacy, digital surveillance, recurring agreements, repair, and supporter boundaries are explicit.
- Exactly three new-context questions include a realistic consent-withdrawal gray area.
- Completion does not claim ethical competence.
- The visual shared-space metaphor is distinct and establishes the prototype standard.

# MODULE 3: EVERYDAY SUPPORT THAT ACTUALLY HELPS

## 1. Module Metadata

- **Module ID:** `CG-M3`
- **Purpose:** Translate respect and permission into practical daily support.
- **Audience problem:** Broad offers are hard to use, while unrequested household changes can feel stigmatizing or controlling.
- **Emotional objective:** Move from uncertainty to specific usefulness to shared normalcy.
- **Practical learning objectives:** Match help to requests; plan inclusive shared meals; create a revisable support menu; recognize when routine becomes monitoring.
- **Estimated time:** 10 to 13 minutes.
- **Medical-risk level:** Moderate because food, movement, medication reminders, appointments, and supplies appear without individualized prescriptions.
- **Review status:** Editorial, clinical, cultural, privacy, accessibility, and emotional-safety review required.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-09`, `AUTONOMY-01` to `AUTONOMY-09`, `CONSENT-01` to `CONSENT-09`, `SUPPORT-01` to `SUPPORT-08`, `MEDICAL-01` to `MEDICAL-15`, `CONTENT-05` to `CONTENT-15`, `SCENARIO-01` to `SCENARIO-15`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `QUIZ-01` to `QUIZ-12`, `REFLECTION-01` to `REFLECTION-07`, `PROGRESS-01` to `PROGRESS-08`, `PRIVACY-01` to `PRIVACY-15`, `VISUAL-01` to `VISUAL-10`, `MOTION-01` to `MOTION-08`, `RESPONSIVE-01` to `RESPONSIVE-09`, `ACCESSIBILITY-01` to `ACCESSIBILITY-20`.

## 2. Visual Identity

- **Tone:** Ordinary, useful, and socially warm.
- **Metaphor:** A shared table and household rhythm across morning, errands, dinner, and evening.
- **Composition:** Wide meal-planning workspace, short scene fragments, a practical menu assembled in the page margin.
- **Typography:** Serif for ordinary-life scene headings; sans-serif for tasks and agreements.
- **Accent:** Soft sage with restrained ochre for household activity.
- **Motion:** Items move onto a shared plan only when matched to a stated request.
- **Mobile order:** Scenario, meal workspace, request matching, support menu, routine comparison, scripts, check, reflection, takeaway.
- **Reduced motion:** Static placement and labeled updates.
- **Anti-card strategy:** A single tabletop workspace, open lists, and ruled schedule bands.
- **Must not appear:** Calorie counters, carbohydrate targets, good-food badges, exercise rings, medical adherence trackers, separate “diabetic meal” tray.

## 3. Emotional Progression and Experience Flow

1. A roommate scenario presents an ordinary conflict about a shared dinner and household changes.
2. The learner plans a meal conversation without prescribing food.
3. Request matching turns general goodwill into one useful action.
4. A support menu organizes what is wanted now, maybe later, or not wanted.
5. A routine comparison identifies monitoring.
6. Scripts cover groceries, meals, movement, rides, appointments, reminders, routines, and declined offers.
7. Transfer questions, private reflection, and a normal-life close finish the module.

## 4. Complete Learner-Facing Content

### `CG-M3-S01` Opening

**Eyebrow:** MODULE 3 OF 5

**Title:** Everyday Support That Actually Helps

**Opening copy:** “Tell me if you need anything” can be sincere and still hard to use. Practical help becomes easier to accept when it is specific, connected to a real burden, and offered without turning daily life into a diabetes project.

**Central idea:** Ask what would reduce work, offer one concrete action, and keep ordinary life visible.

### `CG-M3-S02` Illustrative Scenario: Dinner at seven

Nia and Cam are roommates. They usually trade cooking nights. Cam was recently diagnosed with Type 2 diabetes and has had several appointments after work.

On Nia's cooking night she says, “I cleared out the snack shelf and found a diabetes recipe online.”

Cam looks into the cabinet. “You threw away my food?”

“I was trying to make this easier,” Nia says. “The recipe is supposed to be healthy.”

Cam sighs. “I wanted help getting to the pharmacy before it closes. I did not ask for a new kitchen.”

Nia feels unappreciated. Cam is frustrated that dinner and the shared cabinet changed without a conversation. Neither person is entirely wrong about wanting the home to work better, but the chosen help did not match the request.

### `CG-M3-S03` Shared meals are still shared life

Support does not require a separate meal, a forbidden-food list, or public comments about what belongs on someone's plate. Cultural and family foods can remain part of the conversation. The person living with diabetes and their qualified care team decide what fits their individual plan.

A useful household question is practical:

“What would make dinner easier this week?”

Possible answers may involve timing, budget, shared ingredients, cleanup, transportation, or no change at all.

### `CG-M3-S04` Specific help reduces decision work

Broad offer: “Let me know if you need anything.”

Specific offer: “I am going to the store at six. Would you like me to pick up anything from your list?”

Specific help can include a ride, one phone call, shared meal preparation, moving an errand, organizing a nonmedical supply space, taking notes if invited, or company on an ordinary walk if the person wants it.

Movement is companionship here, not a treatment for a reading or symptom.

### `CG-M3-S05` Support changes

An offer that helped during a busy month may become unnecessary. A medication reminder is appropriate only when requested and agreed. A supply shelf can be helpful without becoming an inspection point.

Ask: “Does this still reduce work, or has it started to feel like checking?”

### `CG-M3-S06` Preserve normal life

Not every meal, outing, text, or purchase needs a diabetes explanation. Continue invitations that are not built around health. Let the person decide what they disclose to guests or relatives.

### `CG-M3-S07` Common misunderstanding correction

**Misunderstanding:** “Changing the whole household is more supportive than asking one person to change.”

**Correction:** Shared changes can be welcome when discussed. Unilateral changes can still remove choice. Ask what the household wants to change, who the change is for, and whether everyone can revisit it.

## 5. Interaction Specifications

### `CG-M3-I01`

- **Learner-facing title:** Plan the conversation, not the plate
- **Purpose:** Practice shared-meal planning without giving an individualized diet.
- **Cognitive action:** Organize practical constraints and questions on a spatial workspace.
- **Narrative information already known:** Nia changed the cabinet and meal without asking.
- **New work required:** Build a dinner plan from stated household needs while leaving food decisions open.
- **Exact learner prompt:** Cam says the pharmacy closes at seven, the grocery budget is tight, and he does not want a separate meal. Arrange a plan for the evening.
- **Controls or choices:** Workspace zones **Timing**, **Shared task**, **Question for Cam**, **Leave undecided**. Items: “Pharmacy ride before seven”; “Cook after returning”; “Ask which shared ingredients work tonight”; “Choose Cam's portion”; “Buy a special separate meal”; “Decide whether to change the snack shelf together later.” Buttons: **Review the plan**, **Reset**.
- **Logic:** Place ride in Timing, cooking in Shared task, ingredient question in Question, snack-shelf discussion in Leave undecided or Question. Portion choice and separate meal remain unused.
- **Exact feedback:** Preferred plan: “The plan addresses the burden Cam named, keeps dinner shared, and leaves individual food decisions with him.” Portion choice: “Choosing the amount on another adult's plate turns planning into food control.” Separate meal: “A separate meal was not requested and may make the person conspicuous.” Snack shelf scheduled later: “Leaving this for a separate conversation keeps tonight's time pressure from deciding a household agreement.”
- **Learning point:** Practical context can be organized without prescribing what someone should eat.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts as application.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Each item has destination controls; no drag required.
- **Screen-reader behavior:** Workspace reads by zone with item names and current positions.
- **Mobile behavior:** Zones stack in chronological order; unused items stay below.
- **Reduced-motion behavior:** Immediate placement.
- **Data-storage behavior:** Not saved; no food preferences retained.
- **Applicable global rules:** `SUPPORT-04`, `MEDICAL-08`, `INTERACTION-01` to `INTERACTION-08`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No diet, portion, carbohydrate, or treatment instruction appears; cultural food remains possible.

### `CG-M3-I02`

- **Learner-facing title:** Match the offer to the request
- **Purpose:** Distinguish useful specificity from adjacent but unrequested help.
- **Cognitive action:** Match four requests with the narrowest relevant offer.
- **Narrative information already known:** Specific help can reduce decision work.
- **New work required:** Select support based on what was actually asked.
- **Exact learner prompt:** Match each request to the offer that answers it without adding a new role.
- **Controls or choices:**  
  - “Could someone drive me Tuesday?” -> “I can drive Tuesday at three.”  
  - “Would you take notes if I invite you in?” -> “Yes. Tell me what you want captured.”  
  - “Can you put these unopened supplies in one drawer?” -> “Yes. Which drawer should I use?”  
  - “I do not want reminders this week.” -> “Okay. I will pause them.”  
  Distractors include asking for appointment details, inspecting supplies, and sending reminders anyway.
- **Logic:** Exact matches above.
- **Feedback:** For each preferred match: “The offer stays inside the request.” For any adjacent offer: “This may be useful in another conversation, but it adds access, checking, or a role that was not requested.”
- **Learning point:** Useful help is not the largest action. It is the action that fits.
- **Required or optional:** Required.
- **Progression behavior:** All four matches submitted; no passing gate.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Select control per request.
- **Screen-reader behavior:** Each request and selected offer announced as a sentence.
- **Mobile behavior:** One request per row.
- **Reduced-motion behavior:** Static.
- **Data-storage behavior:** Module-state only.
- **Applicable global rules:** `SUPPORT-01`, `CONSENT-06`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`.
- **Acceptance criteria:** Every distractor is plausible, not villainous; exact request boundaries remain visible.

### `CG-M3-I03`

- **Learner-facing title:** Build a support menu
- **Purpose:** Create a revisable set of offers without making a plan for the other person.
- **Cognitive action:** Prioritize and categorize support.
- **Narrative information already known:** Support needs change.
- **New work required:** Organize six offers by current preference.
- **Exact learner prompt:** Imagine the person has responded to each offer. Place it under **Useful now**, **Ask another time**, or **Not wanted**.
- **Controls or choices:** Offers: grocery pickup, shared cooking, invitation to walk together, transportation, appointment notes, requested reminder. Each includes a supplied preference statement. Button **Review this menu**.
- **Logic:** Preference statements determine placement, not assumptions about medical usefulness.
- **Exact feedback:** “The menu follows stated preferences. A medically related action is not automatically more important than transportation or cleanup.” If any mismatch: “One or more offers were placed by likely usefulness rather than the person's stated preference.”
- **Learning point:** A support menu belongs to the relationship and can change; it is not a care plan.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Category buttons per offer.
- **Screen-reader behavior:** Current category and preference statement announced.
- **Mobile behavior:** Categories become filters only after a full linear list remains available.
- **Reduced-motion behavior:** Immediate state label.
- **Data-storage behavior:** Scenario-only; no real plan save.
- **Applicable global rules:** `AUTONOMY-02`, `SUPPORT-01`, `MEDICAL-03`, `INTERACTION-01` to `INTERACTION-08`.
- **Acceptance criteria:** It cannot be mistaken for Shared Support Plan or medical instruction.

### `CG-M3-I04`

- **Learner-facing title:** When a routine becomes checking
- **Purpose:** Identify the point where ordinary organization turns into monitoring.
- **Cognitive action:** Compare paired versions of one routine.
- **Narrative information already known:** A supply shelf can help without becoming an inspection point.
- **New work required:** Identify which detail changes each pair.
- **Exact learner prompt:** Compare each pair. Choose the detail that changes organization into monitoring.
- **Controls or choices:** Three pairs about a shared supply drawer, ride calendar, and requested reminder. Detail options: permission, frequency, private information, household convenience. Button **Compare the routines**.
- **Logic:** Drawer pair changes when contents are inspected; calendar pair changes when appointments are added without permission; reminder pair changes when it continues after pause.
- **Exact feedback:** “The object is the same. The change is access, purpose, or continued checking after permission changed.” Incorrect: “Frequency can matter, but look first for permission, private information, and whether the action continues after no.”
- **Learning point:** Monitoring is defined by how information and behavior are checked, not by whether the routine looks organized.
- **Required or optional:** Required.
- **Progression behavior:** Does not gate after submission.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Radio group per pair.
- **Screen-reader behavior:** Full paired descriptions read before options.
- **Mobile behavior:** Pairs stack with A and B labels.
- **Reduced-motion behavior:** No animated comparison.
- **Data-storage behavior:** Not saved.
- **Applicable global rules:** `SUPPORT-02` to `SUPPORT-04`, `PRIVACY-01`, `INTERACTION-01` to `INTERACTION-08`, `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No routine is judged by color or topic; feedback names the changing relational detail.

## 6. Practical Language Scripts

- **Groceries:** “I am going to the store at six. Would you like anything from your list?”
- **Family meal:** “What would help this meal work for everyone? We do not need to single out one plate.”
- **Movement invitation:** “I am taking a walk after dinner. Want company? It is fine if not.”
- **Transportation:** “I can drive Tuesday afternoon. Does that fit what you need?”
- **Appointment:** “If you want me there, what role would be useful?”
- **Reminders:** “Would a reminder help, and if so, when should it stop?”
- **Household routine:** “Before I change the cabinet, can we decide together what would make the space work?”
- **Declined offer:** “Okay. I will not keep offering this. Ask me if it becomes useful later.”

## 7. Knowledge Check

### `CG-M3-Q01`

- **Question:** At a family gathering, an aunt announces that she made a separate “diabetes plate” without asking. What is the main concern?
- **Choices:** A “The meal may expose and single out the person”; B “Every guest should eat the separate meal”; C “The aunt should explain the nutrition”; D “The person must accept because effort was made.”
- **Preferred response:** A.
- **Explanation:** A separate meal may be welcome if requested. Announcing it without permission can expose private information and make ordinary eating feel supervised.
- **Misconception tested:** Effort makes an unrequested food intervention supportive.
- **Related section:** `CG-M3-S03`
- **Review link label:** Review shared meals

### `CG-M3-Q02`

- **Question:** A neighbor asks for a ride to pick up supplies but declines help organizing them. What offer fits?
- **Choices:** A “Provide the ride and leave organization alone”; B “Organize them during the ride”; C “Ask to inspect the supplies first”; D “Decline the ride because only part of the help was accepted.”
- **Preferred response:** A.
- **Explanation:** Support can be accepted in one area and declined in another. The ride does not authorize inspection or organization.
- **Misconception tested:** Accepting one task opens related tasks.
- **Related section:** `CG-M3-S04`
- **Review link label:** Review specific help

### `CG-M3-Q03`

- **Question:** Two partners agreed to cook together on Sundays. One partner now wants some Sundays alone. What preserves both the routine and the new preference?
- **Choices:** A “Ask which Sundays, if any, they still want to share”; B “Keep every Sunday because routines improve consistency”; C “End shared cooking permanently”; D “Track whether solo Sundays go well.”
- **Preferred response:** A.
- **Explanation:** This gray area does not require keeping or ending the whole arrangement. The agreement can become more specific and remain revisable.
- **Misconception tested:** Routines must stay fixed or disappear.
- **Related section:** `CG-M3-S05`
- **Review link label:** Review support changing over time

## 8. Optional Private Reflection

### `CG-M3-R01`

- **Exact prompt:** Which ordinary task could you offer in one specific sentence without changing someone else's food, movement, medication, or privacy?
- **Privacy notice:** This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.
- **Save or session behavior:** Session-only and editable.
- **Skip label:** Skip for Now
- **Clear behavior:** Clear after plain confirmation.
- **Applicable global rules:** `REFLECTION-01` to `REFLECTION-07`, `PRIVACY-01`, `PRIVACY-03`, `PRIVACY-11`.

## 9. Practical Takeaway

**Heading:** Make help smaller and more useful

**Central idea:** Practical support works best when it answers a real request.

**Practical action:** Offer one task with a clear time or limit.

**Boundary:** Do not turn meals, movement, supplies, or reminders into inspection.

## 10. Completion Copy and Progress Logic

**Completed state:** Module completed

**What you practiced:** You planned around shared life, matched offers to requests, built a revisable support menu, and noticed when routine becomes monitoring.

**Key idea status:** Useful help follows the request and preserves normal life.

**Review option:** Review the key idea

**Next recommended module:** Next: When Something Feels Wrong

**Actions:** Continue to Module 4; Return to Support Someone You Care About.

**Progress logic:** Complete after central idea, one meaningful interaction, and takeaway. Reflection and quiz accuracy do not gate.

## 11. Responsive and Accessibility Intent

The tabletop workspace becomes a vertical chronological plan. Pair comparisons use explicit A and B headings. At 200 percent zoom, selected items remain adjacent to feedback. Long cultural food names and translated scripts wrap without truncation. No meaning depends on illustrated food, location, or color. All optional drag behavior has buttons.

## 12. Medical and Privacy Notes

- No individualized meal, carbohydrate, portion, medication, exercise, or glucose guidance appears.
- Movement is framed only as an invitation to companionship.
- Medication reminders appear only as requested relational support.
- Appointment, supply, and household information is not saved or treated as patient data.

## 13. Source Claims Used

- `CG-CLAIM-002`: Family and friend support may help and should begin by asking and listening.
- `CG-CLAIM-003`: Diabetes plans and practical needs are individualized.
- `CG-CLAIM-005`: DSMES provides personalized support for fitting diabetes care into daily life.

## 14. Content Acceptance Criteria

- Roommate relationship and shared-meal tension are distinct.
- No food morality, separate treatment, exercise prescription, or reminder policing appears.
- One interaction uses a true spatial planning workspace with complete alternatives.
- Scripts cover all required daily-life topics.
- Exactly three new-context questions include a revisable-routine gray area.
- The everyday-table metaphor is distinct from the Module 2 boundary table.

# MODULE 4: WHEN SOMETHING FEELS WRONG

## 1. Module Metadata

- **Module ID:** `CG-M4`
- **Purpose:** Help a supporter respond to uncertainty without diagnosing, improvising treatment, or delaying professional help.
- **Audience problem:** Worry can lead a supporter to interpret one number, repeatedly check, search for a quick treatment, or hesitate while trying to understand.
- **Emotional objective:** Move from alarm to slowing down, role clarity, and appropriate escalation.
- **Practical learning objectives:** Recognize the product boundary; use urgent direction immediately; distinguish general education from a clinician-created plan; gather concise context; contact appropriate help; avoid treatment improvisation.
- **Estimated time:** 10 to 12 minutes, except urgent interruption leaves learning immediately.
- **Medical-risk level:** High.
- **Review status:** All learner-facing medical, symptom, medication, glucose, device, plan, urgent, and emergency content is not-reviewed and requires qualified clinical review before relevant external testing or public release.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-10`, `AUTONOMY-01` to `AUTONOMY-10`, `CONSENT-01` to `CONSENT-10`, `MEDICAL-01` to `MEDICAL-15`, `EMERGENCY-01` to `EMERGENCY-10`, `REGION-01` to `REGION-08`, `CONTENT-05` to `CONTENT-15`, `SCENARIO-01` to `SCENARIO-15`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `QUIZ-01` to `QUIZ-12`, `REFLECTION-01` to `REFLECTION-07`, `PROGRESS-01` to `PROGRESS-08`, `PRIVACY-01` to `PRIVACY-15`, `VISUAL-01` to `VISUAL-11`, `MOTION-01` to `MOTION-08`, `RESPONSIVE-01` to `RESPONSIVE-10`, `ACCESSIBILITY-01` to `ACCESSIBILITY-20`, `REVIEW-01` to `REVIEW-08`.

## 2. Visual Identity

- **Tone:** Calm, sparse, organized, and action-first.
- **Metaphor:** A ready shelf with three clearly labeled folders: General information, Their plan, Professional or emergency help.
- **Composition:** Product boundary first, short scenario, ordered response lane, immediate interruption, handoff note.
- **Typography:** Short serif headings with high-legibility sans-serif actions.
- **Accent:** Muted blue-green and sage for ordinary readiness. Deep brick appears only in a genuine urgent interruption.
- **Motion:** Context items organize into a handoff note. Urgent information has no entrance animation.
- **Mobile order:** Product limit, immediate-danger route, scenario, context, plan distinction, handoff, unsafe actions, takeaway.
- **Reduced motion:** Identical static order.
- **Anti-card strategy:** Use one continuous response lane with labeled dividers, not symptom cards.
- **Must not appear:** Symptom checker, triage score, input for readings, flashing alert, siren, shaking, countdown, warning-red page, simulated emergency, medical certainty.

## 3. Required Final Safety Language

### Immediate-danger interruption

**Heading:** Stop here and get urgent help.

**Copy:** Health Decoded cannot determine what is happening. If someone may be in immediate danger, contact emergency help for **[REGION_DISPLAY_NAME]** now. Use the person's clinician-created emergency plan if it is immediately available, but do not delay emergency contact to search for it or finish this module.

**Primary action:** Contact emergency help

**Secondary action:** View [REGION_DISPLAY_NAME] emergency details

### Regional information unavailable fallback

**Heading:** Local details are unavailable.

**Copy:** Health Decoded cannot verify emergency contact information for your location right now. Contact your local emergency service if someone may be in immediate danger. For an urgent concern that is not an immediate emergency, contact an appropriate healthcare professional. Do not use a guessed number or wait for this page to update.

### Clinician-created plan

**Copy:** Use the person's clinician-created plan for individualized instructions and the support role they agreed to. General information in this module is not a replacement for that plan. If the plan is missing, unclear, or does not fit what is happening, contact the appropriate healthcare professional.

### Professional contact

**Copy:** Contact the appropriate member of the person's healthcare team, pharmacist, diabetes care and education specialist, urgent care service, poison service, or emergency service based on the person's plan and the reviewed options available in your region. Health Decoded cannot choose the service for an individual situation.

### Product limitation

**Copy:** Health Decoded provides general education. It cannot diagnose symptoms, interpret a personal glucose reading, decide whether a situation is safe, or create treatment instructions.

### Do not delay

**Copy:** Do not delay urgent or emergency help to check another reading, search this application, complete an interaction, sign in, or gather every detail.

### Medication boundary

**Copy:** Do not change, skip, add, repeat, or adjust another person's medication based on this module. Use their current clinician-created plan and contact an appropriate healthcare professional for medication questions.

### Reading boundary

**Copy:** Do not enter a glucose reading here. Health Decoded does not interpret personal readings or decide what action a number requires. Use the person's clinician-created plan, current device instructions, or appropriate professional help.

## 4. Complete Learner-Facing Content

### `CG-M4-S01` Opening

**Eyebrow:** MODULE 4 OF 5

**Title:** When Something Feels Wrong

**Opening copy:** A supporter does not need to name the problem before taking it seriously. The useful question is not “Can I diagnose this?” It is “What is happening, what plan already exists, and what level of human help belongs here?”

**Three layers:** General education. The person's clinician-created plan. Professional or emergency help.

### `CG-M4-S02` Immediate route

**Visible link before any scenario:** Someone may be in immediate danger

Activating it replaces the learning area with the immediate-danger interruption above. No answer, sign-in, or confirmation question appears first.

### `CG-M4-S03` Illustrative Scenario: The unfinished errand

Omar is helping his neighbor, Celeste, carry groceries upstairs. Halfway up, Celeste stops and sits on a step. She looks unsteady and answers more slowly than usual.

Omar asks, “Do you want me to call someone?”

Celeste says, “Wait. I have a plan in my bag.”

Omar feels an urge to ask for a glucose number and search what it means. He also thinks about offering food and telling Celeste to walk around. He does not know what is happening.

The module pauses here. It does not diagnose Celeste or decide that the situation is safe.

### `CG-M4-S04` Notice without diagnosing

Useful observations are concrete: what changed, when it began, whether the person can respond, and what they ask for. Do not turn those observations into a diagnosis.

If immediate danger may be present, urgent action comes first. Otherwise, use the person's plan and appropriate professional guidance.

Symptoms and readings have context. One number does not give this application enough information to determine safety.

### `CG-M4-S05` The person's plan is the individualized layer

A clinician-created plan may identify the person's known signs, what they want a supporter to do, where supplies or instructions are kept, and whom to contact. It is not the same as an online article, another person's plan, or a supporter-created checklist.

Use current manufacturer instructions for a specific device or medicine. Do not improvise operation from memory or a generic example.

### `CG-M4-S06` A concise professional handoff

When contacting an appropriate healthcare professional, organize only what is useful and available:

- what you observed
- when it started or changed
- what the person can tell you
- actions already taken under their plan
- current medicines or device details only if the person chooses to share them and the professional asks
- how to call back

Do not delay contact to make the summary complete.

### `CG-M4-S07` Unsafe improvisation

This module does not direct a supporter to change medication, repeat a dose, provide food or drink as a guessed treatment, use exercise to correct a reading, operate an unfamiliar device, or keep checking until the situation feels clearer.

Some severe diabetes-related events can require immediate treatment. That is why the person's reviewed plan, current product instructions, trained response, and professional or emergency help matter.

### `CG-M4-S08` Common misunderstanding correction

**Misunderstanding:** “If I can get one more reading, I will know whether to call.”

**Correction:** Repeated checking can delay help and still cannot make this application a triage tool. Follow urgent direction, the person's plan, and appropriate professional guidance.

## 5. Interaction Specifications

### `CG-M4-I01`

- **Learner-facing title:** Gather context without naming the cause
- **Purpose:** Practice organizing observable information for a professional.
- **Cognitive action:** Select concise context while excluding diagnosis and speculation.
- **Narrative information already known:** Celeste stopped, sat down, looked unsteady, and answered slowly.
- **New work required:** Choose what belongs in an initial contact summary.
- **Exact learner prompt:** Select the details Omar can report without diagnosing Celeste.
- **Controls or choices:** “Celeste stopped halfway upstairs”; “She sat down”; “Her answers became slower than usual”; “She is definitely having low blood glucose”; “The change began while carrying groceries”; “Her diabetes is out of control”; “She said a plan is in her bag.” Button **Build the summary**.
- **Logic:** Select all concrete observations and her statement. Exclude diagnosis and judgment.
- **Exact feedback:** Preferred: “This summary reports a change, timing, and the person's own words. It leaves diagnosis to qualified care.” Diagnosis selected: “This conclusion is not established by the observation. Report what changed instead.” Judgment selected: “This label is neither useful context nor a diagnosis the supporter can make.”
- **Learning point:** A concise description can support help without pretending to know the cause.
- **Required or optional:** Required in ordinary learning flow; bypassed by urgent interruption.
- **Progression behavior:** Submission counts; urgent route overrides it.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Checkbox group and explicit submit.
- **Screen-reader behavior:** Selected summary is announced as one ordered sentence.
- **Mobile behavior:** Single column; summary follows immediately.
- **Reduced-motion behavior:** Static.
- **Data-storage behavior:** Scenario-only. Never accept or save real symptoms or readings.
- **Applicable global rules:** `MEDICAL-02`, `MEDICAL-10`, `INTERACTION-01` to `INTERACTION-08`, `PRIVACY-01`, `PRIVACY-10`, `MEDICAL-15`.
- **Acceptance criteria:** No free-text real-situation field; urgent action remains continuously available.

### `CG-M4-I02`

- **Learner-facing title:** Which source belongs here?
- **Purpose:** Distinguish general education, individualized plans, and professional help.
- **Cognitive action:** Match a question to the correct information layer.
- **Narrative information already known:** Three safety layers exist.
- **New work required:** Assign five needs to a source.
- **Exact learner prompt:** Choose the source that should guide each need.
- **Controls or choices:** Layers: **General education**, **Their clinician-created plan**, **Professional or emergency help**. Needs: “Learn why individualized plans matter”; “Find their agreed supporter role”; “Know what their clinician told them to do in a known situation”; “Respond when the plan is unclear and the situation is concerning”; “Respond when someone may be in immediate danger.”
- **Logic:** General; plan; plan; professional; emergency.
- **Exact feedback:** General: “Education explains the framework, not an individual action.” Plan: “The individualized layer belongs to the person and their care team.” Professional: “Uncertainty outside the plan requires human guidance.” Emergency: “Immediate danger interrupts education.”
- **Learning point:** Safe support depends on using the right source, not gathering the most information.
- **Required or optional:** Required unless interrupted.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Select per row.
- **Screen-reader behavior:** Need and source read together.
- **Mobile behavior:** Stacked rows.
- **Reduced-motion behavior:** Static.
- **Data-storage behavior:** Not saved.
- **Applicable global rules:** `MEDICAL-03`, `MEDICAL-13`, `EMERGENCY-01` to `EMERGENCY-08`, `INTERACTION-01` to `INTERACTION-08`.
- **Acceptance criteria:** No example plan becomes an instruction; emergency is action-first.

### `CG-M4-I03`

- **Learner-facing title:** Urgent direction interrupts learning
- **Purpose:** Demonstrate that an urgent cue replaces the educational task.
- **Cognitive action:** Recognize a product handoff, not diagnose severity.
- **Narrative information already known:** Immediate danger bypasses interaction.
- **New work required:** None after the urgent cue.
- **Exact trigger example:** “The person is unresponsive or having a seizure.”
- **Exact behavior:** Immediately replace normal content with the immediate-danger interruption. Do not ask “Is this happening now?” and do not display answer choices.
- **Exact controls:** Regional emergency action, regional details, and **Leave this module**.
- **Logic:** No correctness state. No completion penalty. Do not automatically return to the module.
- **Exact feedback:** Not applicable. The safety action is the response.
- **Learning point:** The product stops teaching when urgent human help may be needed.
- **Required or optional:** Mandatory system behavior.
- **Progression behavior:** Bypasses all progression.
- **Can answers be revised:** No answer exists.
- **Keyboard behavior:** Focus moves to urgent heading, then primary action.
- **Screen-reader behavior:** Assertive but non-repeating announcement of heading, action, and region.
- **Mobile behavior:** Action fits at 320px without horizontal scroll.
- **Reduced-motion behavior:** No motion or progressive reveal.
- **Data-storage behavior:** Do not log inferred emergency status, symptoms, or action choice as health data.
- **Applicable global rules:** `INTERACTION-05`, `MEDICAL-14`, `EMERGENCY-01` to `EMERGENCY-10`, `REGION-01` to `REGION-08`, `ACCESSIBILITY-16`.
- **Acceptance criteria:** Action appears immediately, no gate or animation, safe regional fallback works.

### `CG-M4-I04`

- **Learner-facing title:** Prepare the first 20 seconds
- **Purpose:** Practice a concise initial handoff without delaying contact.
- **Cognitive action:** Prioritize observations and sequence a short summary.
- **Narrative information already known:** Useful handoff fields are listed.
- **New work required:** Order four supplied facts and exclude two irrelevant ones.
- **Exact learner prompt:** Build the beginning of Omar's call. Use only supplied scenario facts. A complete record is not required.
- **Controls or choices:** “I am with Celeste”; “She stopped on the stairs and sat down”; “Her responses are slower than usual”; “The change began a few minutes ago”; “I think her medication caused it”; “I searched three websites.” Buttons **Review the handoff**, move up/down, exclude.
- **Logic:** Include first four; exclude speculation and search history.
- **Exact feedback:** Preferred: “This gives identity context, observable change, and timing without delaying for a diagnosis.” Speculation: “Possible causes belong to qualified assessment.” Search history: “This does not help the first handoff and may distract from the change.”
- **Learning point:** A short, factual opening is enough to begin getting help.
- **Required or optional:** Required unless interrupted.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Move and exclude buttons.
- **Screen-reader behavior:** Full summary review on demand.
- **Mobile behavior:** Vertical sequence.
- **Reduced-motion behavior:** Instant reorder.
- **Data-storage behavior:** Scenario-only; no real call recording.
- **Applicable global rules:** `MEDICAL-02`, `MEDICAL-10`, `INTERACTION-01` to `INTERACTION-08`, `PRIVACY-01`.
- **Acceptance criteria:** The task cannot accept real medical information; it states not to delay contact.

### `CG-M4-I05`

- **Learner-facing title:** Do not improvise treatment
- **Purpose:** Identify actions that exceed the supporter's role.
- **Cognitive action:** Select unsafe improvisations and pair them with safer next layers.
- **Narrative information already known:** Medication, food, exercise, device, and reading boundaries are explicit.
- **New work required:** Apply boundaries to five new actions.
- **Exact learner prompt:** Mark actions that should not be invented by a supporter from this module.
- **Controls or choices:** “Repeat a medicine dose”; “Give food as a guessed treatment”; “Tell the person to exercise to change a reading”; “Follow the person's immediately available clinician-created plan”; “Operate an unfamiliar device from memory”; “Contact appropriate professional help when the plan is unclear.” Button **Review the actions**.
- **Logic:** First, second, third, and fifth are unsafe improvisations. Plan and professional contact are appropriate layers.
- **Exact feedback:** Medication: “Do not change or repeat another person's medication.” Food: “This module does not recommend food or drink as a guessed treatment.” Exercise: “Do not use exercise as an improvised correction.” Device: “Use current instructions and trained help.” Plan: “Use the individualized plan when available without delaying urgent contact.” Professional: “Human guidance is the next layer when the plan is unclear.”
- **Learning point:** Not improvising is an active safety choice.
- **Required or optional:** Required unless interrupted.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Checkbox group.
- **Screen-reader behavior:** Each result announces action and boundary.
- **Mobile behavior:** One action per row.
- **Reduced-motion behavior:** Static.
- **Data-storage behavior:** Not saved.
- **Applicable global rules:** `MEDICAL-07` to `MEDICAL-14`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-06`.
- **Acceptance criteria:** No treatment details, thresholds, doses, or device steps are introduced in feedback.

## 6. Practical Language Scripts

- **Ask before helping when there is no immediate danger:** “Something seems different. Do you want me to get your plan or contact someone?”
- **Describe change:** “You stopped and your answers became slower than usual. I do not know what it means.”
- **Use the plan:** “Where is the plan you want me to use?”
- **Contact professional help:** “The plan is unclear. I am contacting the appropriate healthcare professional.”
- **Decline to interpret:** “I cannot tell you what that reading means. Let us use your plan or contact someone qualified.”
- **Avoid medication change:** “I will not change or repeat medication. We need the plan or a healthcare professional.”
- **Urgent action:** “I am contacting emergency help now.”

## 7. Knowledge Check

### `CG-M4-Q01`

- **Question:** A relative sends a screenshot of a glucose reading and asks, “Is this safe?” What can Health Decoded do?
- **Choices:** A “Interpret the number using a standard range”; B “Ask for more readings”; C “State that it cannot interpret the reading and direct them to their plan or appropriate professional help”; D “Recommend food or exercise.”
- **Preferred response:** C.
- **Explanation:** A personal reading needs individual context. This application does not interpret it or recommend treatment.
- **Misconception tested:** A general threshold can answer an individual safety question.
- **Related section:** `CG-M4-S04`
- **Review link label:** Review the reading boundary

### `CG-M4-Q02`

- **Question:** A person feels unwell, their plan is nearby, and someone may be in immediate danger. What comes first?
- **Choices:** A “Search the whole plan before calling”; B “Contact emergency help, using the plan only if it does not delay contact”; C “Finish the module”; D “Collect every medication name.”
- **Preferred response:** B.
- **Explanation:** Immediate danger interrupts education. The plan can support action when immediately available, but finding it must not delay emergency contact.
- **Misconception tested:** Complete information must be gathered before help.
- **Related section:** `CG-M4-S02`
- **Review link label:** Review immediate danger

### `CG-M4-Q03`

- **Question:** A supporter notices a change, but the person's plan does not clearly cover it and immediate danger is not apparent. What is the safest next layer?
- **Choices:** A “Invent a response from general articles”; B “Contact an appropriate healthcare professional”; C “Keep checking until the answer is obvious”; D “Change medication as a precaution.”
- **Preferred response:** B.
- **Explanation:** This is a gray area because the situation is concerning without an obvious emergency cue. When the plan is unclear, qualified human guidance is the next layer. If immediate danger becomes possible, emergency direction takes over.
- **Misconception tested:** Uncertainty justifies improvisation or delay.
- **Related section:** `CG-M4-S05`
- **Review link label:** Review the three layers

## 8. Optional Private Reflection

### `CG-M4-R01`

- **Exact prompt:** Without writing symptoms, readings, medicines, names, or emergency details, note one nonmedical preparation task you could discuss later, such as where an existing plan is kept or who has agreed to be contacted.
- **Privacy notice:** This reflection is optional and stays in this session. Do not enter current symptoms, readings, medication details, names, or emergency information. It is not sent to the AI Tutor, added to your account, or shared.
- **Save or session behavior:** Session-only. If session-only handling cannot be guaranteed, show this as a mental prompt with no field.
- **Skip label:** Skip for Now
- **Clear behavior:** Immediate clear after confirmation.
- **Applicable global rules:** `REFLECTION-01` to `REFLECTION-07`, `PRIVACY-01`, `PRIVACY-03`, `PRIVACY-10` to `PRIVACY-12`, `MEDICAL-15`.

## 9. Practical Takeaway

**Heading:** Know the next layer

**Central idea:** Your role is to notice, use the person's plan, and reach appropriate human help.

**Practical action:** Report concrete changes and timing without naming the cause.

**Boundary:** Do not interpret readings, change medication, invent food or exercise treatment, operate unfamiliar devices, or delay urgent help.

## 10. Completion Copy and Progress Logic

**Completed state:** Module completed

**What you practiced:** You separated observation from diagnosis, chose the correct safety layer, prepared a concise handoff, and identified unsafe improvisation.

**Key idea status:** Health Decoded cannot determine safety. Use the person's plan and appropriate professional or emergency help.

**Review option:** Review the three safety layers

**Next recommended module:** Next: The Caregiver Matters Too

**Actions:** Continue to Module 5; Return to Support Someone You Care About.

**Progress logic:** In ordinary flow, complete after central idea, one submitted application, and takeaway. Urgent interruption neither completes nor fails the module and does not reopen it automatically.

## 11. Responsive and Accessibility Intent

Urgent headings and actions are first in DOM and visual order. At 320px and 200 percent zoom, no horizontal scroll is needed. The three-layer model becomes a numbered list. Every organizer has a non-drag alternative. Safety text is real text, not image text. Deep brick is paired with heading and action language. No motion delays any content. Translated regional strings can expand without clipping.

## 12. Medical and Privacy Notes

- Heightened clinical review applies to every section in this module.
- No input accepts real readings, symptoms, medication names, device data, or identifying details.
- Symptom examples are limited to official-source-supported broad urgent cues and remain non-diagnostic.
- No phone number is hardcoded in general content.
- No action implies that the module can determine urgency.

## 13. Source Claims Used

- `CG-CLAIM-006`: Severe hypoglycemia can involve loss of consciousness or seizure and requires immediate response.
- `CG-CLAIM-007`: DKA can occur in Type 2 diabetes, can be life-threatening, and certain broad signs require emergency care.
- `CG-CLAIM-008`: Prescription medicine and device instructions are product-specific and current labeling matters.
- `CG-CLAIM-009`: Medication changes should involve a qualified healthcare professional.

## 14. Content Acceptance Criteria

- Immediate direction appears before any interaction and works without regional data.
- The module contains no symptom checker, score, personal reading, threshold, dose, or treatment recommendation.
- Five distinct interactions add context selection, source matching, interruption behavior, handoff sequencing, and boundary recognition.
- Exactly three new-context questions include a plan-unclear gray area.
- Qualified clinical review is explicitly required before relevant external testing and release.
- Deep brick appears only for genuine urgent interruption.

# MODULE 5: THE CAREGIVER MATTERS TOO

## 1. Module Metadata

- **Module ID:** `CG-M5`
- **Purpose:** Help supporters recognize strain, limits, responsibility beliefs, and sustainable boundaries without shifting control away from the person living with diabetes.
- **Audience problem:** A supporter may become constantly available, hypervigilant, isolated, guilty, or resentful while believing that stepping back makes them responsible for harm.
- **Emotional objective:** Move from responsibility to strain recognition, shared responsibility, and sustainable limits.
- **Practical learning objectives:** Separate ownership; compare sustainable and unsustainable arrangements; rehearse boundaries; map backup support; notice nonclinical load without self-diagnosis.
- **Estimated time:** 10 to 13 minutes.
- **Medical-risk level:** Low to moderate. Caregiver strain is discussed descriptively, not diagnostically.
- **Review status:** Editorial, emotional-safety, cultural, accessibility, privacy, and clinical-boundary review required.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-09`, `AUTONOMY-01` to `AUTONOMY-10`, `CONSENT-01` to `CONSENT-09`, `SUPPORT-01` to `SUPPORT-08`, `CONTENT-05` to `CONTENT-20`, `SCENARIO-01` to `SCENARIO-15`, `INTERACTION-01` to `INTERACTION-08`, `FEEDBACK-01` to `FEEDBACK-08`, `QUIZ-01` to `QUIZ-12`, `REFLECTION-01` to `REFLECTION-07`, `PROGRESS-01` to `PROGRESS-08`, `PRIVACY-01` to `PRIVACY-15`, `VISUAL-01` to `VISUAL-10`, `MOTION-01` to `MOTION-08`, `RESPONSIVE-01` to `RESPONSIVE-09`, `ACCESSIBILITY-01` to `ACCESSIBILITY-20`.

## 2. Visual Identity

- **Tone:** Candid, dignified, and relieving without inflated reassurance.
- **Metaphor:** A load distributed across a widening network of hands, schedules, services, and limits.
- **Composition:** Dense list at the opening, wide responsibility map, paired schedule comparison, quiet script rehearsal, expanding network.
- **Typography:** Strong serif statement for ownership; plain sans-serif for tasks and availability.
- **Accent:** Dusty plum-brown paired with sage and blue-green. No clinical gauge colors.
- **Motion:** Tasks redistribute across a network after deliberate assignment.
- **Mobile order:** Scenario, ownership, responsibility map, sustainability comparison, boundary rehearsal, network map, load reflection, scripts, check, reflection, takeaway.
- **Reduced motion:** Static network with text labels.
- **Anti-card strategy:** Use an open map, ruled schedule, and margin notes.
- **Must not appear:** Burnout score, battery icon, stress gauge, diagnostic labels, self-care clichés, blame toward the person with diabetes.

## 3. Emotional Progression and Experience Flow

1. An adult child supporting a parent from another household shows unsustainable availability.
2. Ownership separates the parent's decisions, the supporter's offers, shared agreements, and professional roles.
3. A responsibility map reorganizes tasks.
4. Two arrangements reveal sustainable versus unsustainable patterns.
5. Boundary rehearsal removes punishment and over-explanation.
6. A support-network map widens backup without forcing disclosure.
7. A nonclinical reflection notices load without producing a score.
8. Knowledge transfer, private reflection, and a practical close complete the section.

## 4. Complete Learner-Facing Content

### `CG-M5-S01` Opening

**Eyebrow:** MODULE 5 OF 5

**Title:** The Caregiver Matters Too

**Opening copy:** A support arrangement can become difficult to sustain before anyone names it. Constant availability, repeated checking, interrupted sleep, practical load, guilt, resentment, and isolation are signals worth noticing. They are not a diagnosis and do not make either person the problem.

**Central idea:** You can care deeply without becoming responsible for another adult's decisions. A sustainable arrangement needs clear limits, shared responsibility, and backup.

### `CG-M5-S02` Illustrative Scenario: The 6:10 call

Elena lives twenty minutes from her father, Tomas. For three months, she has called before work, driven to most appointments, handled insurance mail, and kept her phone on through the night.

At 6:10 one morning, Tomas calls to ask whether she can bring a folder he left at home. Elena has an important meeting. She says, “I will figure it out,” then starts crying after they hang up.

That evening she tells Tomas, “I cannot keep doing all of this.”

Tomas replies, “I did not ask you to stay awake every night.”

Elena says, “If I do not pay attention, who will?”

Neither has a complete picture. Tomas has accepted some help, Elena has assumed other responsibilities, and their current arrangement depends on her being reachable almost all the time.

### `CG-M5-S03` Sort responsibility before solving the schedule

**Tomas owns:** His medical decisions, what information he shares, and whether he accepts support.

**Elena owns:** What time, money, travel, and emotional availability she can offer.

**They may agree together:** Specific rides, paperwork tasks, check-ins, backup contacts, and how to change the arrangement.

**Qualified professionals own:** Clinical assessment, medication decisions, treatment instructions, and emergency guidance.

Responsibility can be shared without being blurred.

### `CG-M5-S04` Strain is information

Difficulty sleeping, dread before the phone rings, resentment, missed work, isolation, or feeling unable to step away may show that the arrangement is difficult to sustain. These experiences do not diagnose burnout, anxiety, depression, or trauma.

The question is practical: What needs to stop, shrink, move, or gain backup?

### `CG-M5-S05` A boundary is about your action

**Boundary:** “I can answer calls until nine. After that, use the agreed backup or emergency plan.”

**Punishment:** “If you call after nine, I will stop helping with appointments.”

**Boundary:** “I can handle one insurance call a week.”

**Control:** “I will handle your insurance only if you show me your readings.”

A limit can disappoint someone and still be legitimate. It should not be used to force a medical decision or disclosure.

### `CG-M5-S06` Backup changes the structure

Backup may include another relative or friend with permission, a transportation option, delivery, community support, a diabetes care and education specialist, a healthcare team contact, respite or caregiver services when relevant, or a revised task that no longer depends on one person.

Do not share private health details simply to recruit help. Ask what can be shared and what the backup person actually needs to know.

### `CG-M5-S07` Keep the relationship larger than diabetes

Elena and Tomas can still talk about work, music, neighbors, or dinner without every call becoming a check-in. Preserving ordinary parts of the relationship is not avoidance. It can reduce the sense that one person is a patient and the other is a manager.

**Common misunderstanding:** “If I feel resentful, I should hide it so I do not make them feel guilty.”

**Correction:** Resentment does not need to become blame or punishment. Name the arrangement that is difficult to sustain and the change you can make.

## 5. Interaction Specifications

### `CG-M5-I01`

- **Learner-facing title:** Who owns what?
- **Purpose:** Separate decision ownership, supporter capacity, shared agreements, and professional roles.
- **Cognitive action:** Map responsibilities.
- **Narrative information already known:** Elena and Tomas have mixed requested and assumed tasks.
- **New work required:** Assign eight items to four ownership zones.
- **Exact learner prompt:** Place each item with the person or group that owns it. Shared does not mean permanent.
- **Controls or choices:** Zones **Tomas**, **Elena**, **Agreed together**, **Qualified professional**. Items: medical decisions; what health information to share; Elena's work availability; Elena's overnight phone limit; planned rides; backup contact agreement; medication changes; clinical assessment. Button **Review responsibility**.
- **Logic:** Tomas owns first two; Elena owns next two; agreed together owns rides and backup; professional owns final two.
- **Exact feedback:** Preferred: “The map separates autonomy from availability and keeps clinical decisions with qualified care.” Misplaced medical decision: “Support does not transfer medical authority.” Misplaced availability: “The supporter decides what they can sustainably offer.” Shared item assigned permanently: “An agreement can be shared and still remain revisable.”
- **Learning point:** Clear ownership reduces both takeover and impossible responsibility.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts as application.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Destination buttons per item.
- **Screen-reader behavior:** Zone, item, and current position announced.
- **Mobile behavior:** Four labeled sections stack.
- **Reduced-motion behavior:** Instant assignment.
- **Data-storage behavior:** Scenario-only.
- **Applicable global rules:** `AUTONOMY-01` to `AUTONOMY-06`, `MEDICAL-01`, `INTERACTION-01` to `INTERACTION-08`.
- **Acceptance criteria:** Medical authority and supporter limits remain distinct.

### `CG-M5-I02`

- **Learner-facing title:** Can this arrangement last?
- **Purpose:** Compare support patterns by capacity, backup, permission, and review.
- **Cognitive action:** Evaluate two weekly arrangements.
- **Narrative information already known:** Elena is nearly always available.
- **New work required:** Identify which structural details make one arrangement more sustainable.
- **Exact learner prompt:** Compare Plan A and Plan B. Select the differences that reduce dependence on one person.
- **Controls or choices:** Plan A: Elena handles every ride, all mail, nightly calls, no backup. Plan B: two planned rides, one weekly mail task, calls before nine, approved backup for another task, review in two weeks. Difference choices: fewer tasks, clearer time limits, backup, permission, medical control, planned review.
- **Logic:** Select clearer scope, limits, backup, and review. Do not select “medical control.”
- **Exact feedback:** “Plan B does not prove that the arrangement will work. It makes responsibilities visible, limits dependence on one person, and creates a point to revise.” If medical control selected: “Sustainability does not require the supporter to control medical decisions.”
- **Learning point:** A sustainable plan has limits and backup, not simply a more efficient primary supporter.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Checkbox comparison.
- **Screen-reader behavior:** Plans read fully before options.
- **Mobile behavior:** Plans appear sequentially with a comparison summary.
- **Reduced-motion behavior:** Static.
- **Data-storage behavior:** Not saved.
- **Applicable global rules:** `AUTONOMY-06`, `SUPPORT-01`, `CONTENT-16` to `CONTENT-19`, `INTERACTION-01` to `INTERACTION-08`.
- **Acceptance criteria:** No plan is called healthy or unhealthy; no outcome is guaranteed.

### `CG-M5-I03`

- **Learner-facing title:** Say the limit without punishment
- **Purpose:** Rehearse direct boundary language.
- **Cognitive action:** Revise a coercive or vague statement.
- **Narrative information already known:** Boundaries concern the supporter's action.
- **New work required:** Choose a usable revision for three statements.
- **Exact learner prompt:** Choose the revision that names capacity without controlling Tomas.
- **Controls or choices:**  
  - “I cannot keep doing everything” -> “I can handle one insurance call a week. We need another option for the rest.”  
  - “If you will not listen, I am done helping” -> “I will not make medical decisions. I can still offer the two rides we agreed.”  
  - “Call whenever” -> “I can answer before nine. After that, use the agreed backup or emergency plan.”  
  Plausible distractors preserve guilt, vagueness, or control.
- **Logic:** Exact revisions above.
- **Feedback:** Preferred: “This names what the supporter can do and keeps the other person's medical choices separate.” Guilt option: “This makes help conditional on obedience.” Vague option: “The feeling is clear, but the other person still cannot tell what will change.”
- **Learning point:** A boundary becomes usable when it names a specific supporter action.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Radio group per statement.
- **Screen-reader behavior:** Original and revision announced together.
- **Mobile behavior:** One pair at a time.
- **Reduced-motion behavior:** Static.
- **Data-storage behavior:** Not saved.
- **Applicable global rules:** `AUTONOMY-06`, `CONTENT-15`, `SUPPORT-05` to `SUPPORT-07`, `INTERACTION-01` to `INTERACTION-08`.
- **Acceptance criteria:** Scripts sound speakable, not therapeutic; no threat or forced disclosure.

### `CG-M5-I04`

- **Learner-facing title:** Widen the support network
- **Purpose:** Find backup roles without unnecessary disclosure.
- **Cognitive action:** Map tasks to possible backup and minimum information.
- **Narrative information already known:** Backup can be personal, professional, community-based, or a changed task.
- **New work required:** Assign three tasks and choose what the backup person needs to know.
- **Exact learner prompt:** Build backup for rides, paperwork, and an after-hours concern. Share only what each role needs.
- **Controls or choices:** Backup options include approved relative, transportation service, clinic office, pharmacist, regional urgent resource, or “change the task.” Information options include pickup time, document deadline, full diagnosis history, all readings, agreed contact instruction. Button **Review the network**.
- **Logic:** Rides need logistics, paperwork needs task and deadline, after-hours concern uses the person's plan and reviewed regional/professional route. Full history and all readings are unnecessary.
- **Exact feedback:** “The network shares task-level information and preserves private health details.” If private data selected: “Recruiting backup does not authorize broad disclosure.” If one person remains assigned everywhere: “This network still depends on one person. Reassign or change at least one task.”
- **Learning point:** Backup can reduce load without creating a larger audience for private health information.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Select controls per task.
- **Screen-reader behavior:** Task, backup, and minimum information announced together.
- **Mobile behavior:** Linear task sections.
- **Reduced-motion behavior:** Static network list.
- **Data-storage behavior:** Scenario-only; no real contacts collected.
- **Applicable global rules:** `CONSENT-05`, `CONSENT-06`, `PRIVACY-01`, `SUPPORT-01`, `INTERACTION-01` to `INTERACTION-08`.
- **Acceptance criteria:** No real names or contacts; regional urgent options remain configured.

### `CG-M5-I05`

- **Learner-facing title:** What is taking up room?
- **Purpose:** Notice nonclinical load without scoring or diagnosis.
- **Cognitive action:** Select descriptive patterns and choose one planning priority.
- **Narrative information already known:** Strain can be practical, emotional, social, or schedule-related.
- **New work required:** Review fictional week details and choose what should be discussed first.
- **Exact learner prompt:** In Elena's week, what appears difficult to sustain? Select the patterns, then choose one arrangement to discuss.
- **Controls or choices:** Patterns: interrupted sleep, missed work, no backup, resentment, all health decisions, one planned ride. Discussion choices: overnight availability, ride schedule, medical decisions, “Elena has burnout.” Button **Review the load**.
- **Logic:** Select first four; do not label medical decisions as her load to control or diagnose burnout. Overnight availability or ride schedule are valid priorities.
- **Exact feedback:** “These are descriptive patterns, not a diagnosis. Choosing one arrangement creates a practical conversation.” Burnout selected: “This module does not diagnose burnout.” Medical decisions selected: “Those decisions belong to Tomas and qualified care, not to Elena's workload plan.”
- **Learning point:** Notice the arrangement before assigning a clinical label.
- **Required or optional:** Required.
- **Progression behavior:** Submission counts.
- **Can answers be revised:** Yes.
- **Keyboard behavior:** Checkbox group plus radio group.
- **Screen-reader behavior:** Result states patterns and chosen arrangement without a score.
- **Mobile behavior:** Stacked.
- **Reduced-motion behavior:** Static.
- **Data-storage behavior:** Fictional scenario only; no Self-Check profile or score.
- **Applicable global rules:** `CONTENT-16` to `CONTENT-20`, `INTERACTION-01` to `INTERACTION-08`, `PRIVACY-11`.
- **Acceptance criteria:** Remains distinct from Caregiver Self-Check; no diagnosis, gauge, score, or outreach.

## 6. Practical Language Scripts

- **Ask for backup:** “Could you take one planned ride next Thursday? I will ask Tomas what details he is comfortable sharing.”
- **Name availability:** “I can talk until nine tonight. I will be unavailable after that.”
- **Change a recurring arrangement:** “The daily call is becoming hard to sustain. Can we choose fewer planned times?”
- **State capacity:** “I can handle this form, but I cannot take on all of the mail.”
- **Preserve the relationship:** “Can we have dinner Friday and leave diabetes tasks for another time?”
- **Discuss resentment:** “I am getting frustrated with the current schedule. I want to change the schedule before that frustration turns into blame.”
- **Separate decisions:** “I care about what happens. The medical decision is still yours.”

## 7. Knowledge Check

### `CG-M5-Q01`

- **Question:** A friend has become the only person providing rides and is missing work. What is the most useful first change?
- **Choices:** A “Add backup and define which rides the friend can provide”; B “Take over appointment scheduling”; C “Ask for more health information”; D “Stop every ride without discussion.”
- **Preferred response:** A.
- **Explanation:** Backup and scope address the practical strain without expanding control or forcing an abrupt end.
- **Misconception tested:** Sustainability requires more authority or total withdrawal.
- **Related section:** `CG-M5-S06`
- **Review link label:** Review backup support

### `CG-M5-Q02`

- **Question:** A supporter says, “I will help only if you follow my food rules.” What makes this different from a boundary?
- **Choices:** A “It uses help to force another adult's choice”; B “It mentions food”; C “It is too short”; D “Boundaries cannot disappoint anyone.”
- **Preferred response:** A.
- **Explanation:** A boundary names what the supporter will or will not do. This condition uses support as leverage over someone else's decision.
- **Misconception tested:** Any limit stated by a supporter is a healthy boundary.
- **Related section:** `CG-M5-S05`
- **Review link label:** Review boundary versus punishment

### `CG-M5-Q03`

- **Question:** Two siblings share support for a parent. One can no longer handle weekly paperwork but can still provide monthly rides. What is the best interpretation?
- **Choices:** A “The sibling can revise one role without ending all support”; B “The original agreement must continue”; C “The sibling no longer cares”; D “The parent should give both siblings full account access.”
- **Preferred response:** A.
- **Explanation:** This gray area calls for revising the arrangement by task. Capacity can change without turning support into all or nothing.
- **Misconception tested:** Support roles are permanent and indivisible.
- **Related section:** `CG-M5-S03`
- **Review link label:** Review shared and revisable responsibility

## 8. Optional Private Reflection

### `CG-M5-R01`

- **Exact prompt:** Name one support task you can sustain, one limit you need to state, and one kind of backup that could reduce dependence on you. Do not include another person's health details.
- **Privacy notice:** This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.
- **Save or session behavior:** Session-only and editable.
- **Skip label:** Skip for Now
- **Clear behavior:** Clear all three fields after confirmation.
- **Applicable global rules:** `REFLECTION-01` to `REFLECTION-07`, `PRIVACY-01`, `PRIVACY-03`, `PRIVACY-11`.

## 9. Practical Takeaway

**Heading:** Make the arrangement possible to keep

**Central idea:** Caring does not make one supporter responsible for another adult's decisions.

**Practical action:** Name one task, one limit, and one backup.

**Boundary:** Do not turn exhaustion or resentment into punishment, control, or forced disclosure.

## 10. Completion Copy and Progress Logic

**Completed state:** Module completed

**What you practiced:** You separated responsibility, compared support arrangements, rehearsed limits, and widened backup.

**Key idea status:** Sustainable support has scope, review, and backup while medical decisions remain with the person and qualified care.

**Review option:** Review the responsibility map

**Next recommended action:** Return to the caregiver landing page and choose one personal next step.

**Actions:** Choose my next step; Review a module; Return to Support Someone You Care About.

**Progress logic:** Complete after central idea, one meaningful application, and takeaway. Section completion requires all five modules plus one deliberately selected personal next step. No tool use, reflection, or quiz score is required.

## 11. Responsive and Accessibility Intent

Ownership zones become labeled vertical groups. Plan comparisons preserve complete text before differences. The network remains a task list when lines cannot be shown. At 200 percent zoom, no node map requires panning. No load state depends on size, color, or spatial weight alone. Screen-reader output never announces a clinical risk level or score.

## 12. Medical and Privacy Notes

- Burnout, anxiety, depression, trauma, abuse, and caregiver burden are not diagnosed.
- No actual supporter profile, contact network, or private health detail is saved.
- Any immediate danger or crisis raised by a user activates configured urgent support without claiming assessment.
- Professional and community support categories require current regional verification before release.

## 13. Source Claims Used

- `CG-CLAIM-010`: Caregiving can be stressful and supporters may benefit from help, rest, and backup.
- `CG-CLAIM-011`: Federal caregiver strategies emphasize caregiver health, wellbeing, and support across varied roles.
- `CG-CLAIM-012`: Type 2 diabetes caregiver burden research identifies practical and quality-of-life strain, with limits in generalizability.

## 14. Content Acceptance Criteria

- Adult child and non-co-resident parent relationship is distinct.
- Tomas is not blamed for Elena's strain, and Elena is not diagnosed.
- Five mechanics remain distinct from the later Self-Check tool.
- Scripts include backup, availability, changing arrangements, capacity, ordinary relationship, and resentment.
- Exactly three new-context questions include a task-specific revision gray area.
- No battery, gauge, score, guilt, or self-care cliché appears.

# CONTENT-WIDE SOURCE TABLE

All statuses remain `not-reviewed`. A current source supports drafting but does not substitute for qualified review.

| Claim ID | Educational claim | Source | Publication or review date | Exact content location | Uncertainty or limitation | Required review | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CG-CLAIM-001` | Living with diabetes can involve emotional distress and substantial ongoing self-management demands. | [NIDDK, Diabetes Distress and Depression](https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/diabetes-distress-and-depression) | 2020-01-08 | `CG-M1-S03`; emotional framing only | Professional interview and synthesis; this product does not diagnose distress or depression | Clinical, editorial, emotional safety | not-reviewed |
| `CG-CLAIM-002` | Family and friend support may help; asking how to help and listening are appropriate starting points, and desired help may change. | [CDC, Helping Friends and Family With Diabetes](https://www.cdc.gov/diabetes/caring/index.html) | 2024-05-15 | Landing, `CG-M1`, `CG-M2`, `CG-M3` | CDC page includes some broad advice not adopted here; this specification applies stricter autonomy and privacy controls | Clinical, editorial, cultural | not-reviewed |
| `CG-CLAIM-003` | Diabetes treatment and support needs are individualized. | [CDC, Helping Friends and Family With Diabetes](https://www.cdc.gov/diabetes/caring/index.html) | 2024-05-15 | `CG-M2-S04` to `S06`; `CG-M3-S03` | Does not itself define this product's consent model | Clinical, editorial | not-reviewed |
| `CG-CLAIM-004` | Autonomy-supportive involvement is associated with better diabetes attitudes and self-management, while nonsupportive behaviors may be counterproductive. | [Lee et al., Diabetes self-management and glycemic control: The role of autonomy support from informal health supporters](https://pubmed.ncbi.nlm.nih.gov/30652911/); [Mayberry and Osborn, Family support, medication adherence, and glycemic control](https://pubmed.ncbi.nlm.nih.gov/22538012/) | 2019; 2012 | `CG-M2` central framework | Observational associations do not prove causation; study populations and measures limit generalization | Clinical, research, cultural | not-reviewed |
| `CG-CLAIM-005` | DSMES offers personalized education and support for practical skills and fitting diabetes care into daily life. | [CDC, About Diabetes Self-Management Education and Support](https://www.cdc.gov/diabetes/education-support-programs/index.html) | 2024-05-15 | `CG-M3-S04`; Module 4 professional-support layer | Coverage, access, and services vary | Clinical, regional, editorial | not-reviewed |
| `CG-CLAIM-006` | Severe low blood glucose can involve loss of consciousness or seizure and requires immediate response. | [NIDDK, Low Blood Glucose](https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/low-blood-glucose-hypoglycemia) | Page current when accessed 2026-07-29 | `CG-M4-I03`; urgent examples | Symptoms vary; no threshold or treatment protocol is imported into this product | Qualified clinical, emergency, editorial | not-reviewed |
| `CG-CLAIM-007` | DKA can occur in people with Type 2 diabetes, can be life-threatening, and broad signs such as trouble breathing, inability to keep food or drink down, or multiple DKA symptoms require emergency care. | [CDC, Diabetic Ketoacidosis](https://www.cdc.gov/diabetes/about/diabetic-ketoacidosis.html) | 2024-05-15 | Module 4 source rationale and clinical review list | Learner-facing module avoids creating a checklist or threshold; exact wording needs clinical review | Qualified clinical, emergency, editorial | not-reviewed |
| `CG-CLAIM-008` | Prescription medicines and some devices have product-specific patient or caregiver instructions; current approved labeling matters. | [FDA, Labeling for Prescription Medicines](https://www.fda.gov/drugs/fdas-labeling-resources-human-prescription-drugs/frequently-asked-questions-about-labeling-prescription-medicines) | Updated information accessed 2026-07-29 | `CG-M4-S05`, `CG-M4-I05` | Not every instruction document is FDA-approved; product-specific verification is required | Qualified clinical, medication safety, device safety | not-reviewed |
| `CG-CLAIM-009` | Medicine changes and questions should involve a healthcare professional rather than supporter improvisation. | [FDA, 5 Medication Safety Tips for Older Adults](https://www.fda.gov/consumers/consumer-updates/5-medication-safety-tips-older-adults) | Source current when accessed 2026-07-29 | Module 4 medication boundary | Older-adult framing is not universal; the product uses only the general professional-input principle | Qualified clinical, medication safety | not-reviewed |
| `CG-CLAIM-010` | Caregiving can be stressful, and asking for help, rest, and support may be useful. | [National Institute on Aging, Caregiving](https://www.nia.nih.gov/health/caregiving); [NIA, Taking Care of Yourself: Tips for Caregivers](https://www.nia.nih.gov/health/caregiving/taking-care-yourself-tips-caregivers) | 2023-10-12 and current portal | `CG-M5-S04` to `S06` | Much NIA content focuses on older-adult caregiving; this module avoids universal claims and diagnoses | Clinical boundary, editorial, cultural | not-reviewed |
| `CG-CLAIM-011` | Caregiver-support policy should address caregiver health, wellbeing, financial security, and varied caregiving roles. | [Administration for Community Living, National Strategy to Support Family Caregivers](https://acl.gov/CaregiverStrategy) | 2025-07-25 | `CG-M5-S06`; resource categories | Policy framework is broad and not diabetes-specific | Editorial, policy, cultural | not-reviewed |
| `CG-CLAIM-012` | Some studies of caregivers for adults with Type 2 diabetes report burden and quality-of-life strain. | [Vega-Silva et al., Quality of life and caregiver burden](https://pubmed.ncbi.nlm.nih.gov/37540582/); [Bárcenas et al., Factors associated with caregiver burden](https://pubmed.ncbi.nlm.nih.gov/38688187/) | 2023; 2024 | `CG-M5-S01`, `CG-M5-S04` | Cross-sectional studies, often in specific settings and populations; no prevalence estimate or clinical label is used | Clinical, research, cultural | not-reviewed |
| `CG-CLAIM-013` | Social support is associated with diabetes self-care across research literature, but type, quality, and context matter. | [Song et al., The Impact of Social Support on Self-care of Patients With Diabetes](https://pubmed.ncbi.nlm.nih.gov/28578632/) | 2017 | Content-wide rationale | Meta-analysis includes varied diabetes types and measures; association does not validate controlling support | Clinical, research | not-reviewed |
| `CG-CLAIM-014` | Current emergency, professional, medicine, and device information must be regionally and product-specifically maintained. | CDC, NIDDK, FDA sources above; `00-CAREGIVER-SYSTEM.md` regional rules | Verified 2026-07-29 for drafting | Landing and Module 4 | Information can change; source owner, cadence, and expiration remain unresolved | Clinical, regional governance, privacy | not-reviewed |

# CONTENT-WIDE REVIEW REQUIREMENTS

## Clinical-Review List

| Review ID | Content | Reason | Required reviewer | Status |
| --- | --- | --- | --- | --- |
| `CG-REV-001` | Landing immediate-danger route and fallback | Emergency action and regional failure | Qualified clinician with diabetes and emergency-content competence | not-reviewed |
| `CG-REV-002` | Module 1 emotional framing | Avoid diagnostic implication and medical attribution | Diabetes behavioral-health or psychosocial expert | not-reviewed |
| `CG-REV-003` | Module 2 medication, reading, appointment, and app contexts | Preserve relational scope and prevent clinical inference | Diabetes clinician plus privacy reviewer | not-reviewed |
| `CG-REV-004` | Module 3 meal and movement content | Prevent nutrition or exercise prescription and stigma | Registered dietitian nutritionist or qualified diabetes clinician, plus cultural reviewer | not-reviewed |
| `CG-REV-005` | All Module 4 content | Highest-risk medical and emergency material | Qualified diabetes clinician and emergency-content reviewer | not-reviewed |
| `CG-REV-006` | Module 4 regional safety strings | Current services, region label, fallback, expiration | Regional content owner and qualified clinician | not-reviewed |
| `CG-REV-007` | Module 4 medication and device boundaries | Product labeling and medication safety | Pharmacist or qualified medication-safety reviewer; device specialist as needed | not-reviewed |
| `CG-REV-008` | Module 5 strain language and resource categories | Avoid diagnosis and verify appropriate support routes | Behavioral-health or caregiver-support expert | not-reviewed |

## Other Required Reviews

- **Editorial:** Every learner-facing line, choice, feedback message, script, and completion state.
- **Privacy:** Progress visibility, session-only fields, landing shortcuts, logging exclusions, urgent route data, and future implementation.
- **Accessibility:** All 24 interactions, urgent interruption, focus management, 320px behavior, 200 percent zoom, reduced motion, long text, and translation expansion.
- **Cultural:** All family roles, household expectations, food contexts, transportation assumptions, authority expectations, and translated scripts.
- **Emotional safety:** Overstepping, conflict, coercion, guilt, resentment, privacy repair, refusal, and supporter strain.

## Unresolved Decisions

1. Named reviewers, qualifications, review scope, and review dates.
2. Exact regional configuration owner, review cadence, expiration period, and fallback governance.
3. Exact caregiver design tokens after repository inspection.
4. Whether module reflections ever gain explicit private saving. Current approved behavior remains session-only.
5. Exact list of regionally verified professional and caregiver-support resources.
6. Whether Module 4 should name additional official urgent cues after clinical review. No expansion is authorized yet.
7. Exact retention and analytics implementation for module progress, with all free text and individual answers excluded.

# FINAL CONTENT CONSISTENCY AUDIT

## Cross-Module Distinctness

| Page or module | Emotionally distinct | Visually distinct | Mechanically distinct | Practically distinct |
| --- | --- | --- | --- | --- |
| Landing | Moves uncertainty toward orientation | Shared entry table and branching route line | Need routing and path strategy | Chooses where to begin without assessment |
| Module 1 | Confusion to patient curiosity | Distant signals and partial information | Evidence sort, timing sequence, response mixer | Helps interpret reactions without labeling |
| Module 2 | Fear to impact recognition and repair | Shared zones with consent points | Consequence map, continuum, builder, branch, repair sequence | Defines ethical center of support and control |
| Module 3 | Uncertainty to ordinary usefulness | Household table across a day | Meal workspace, request matching, support menu, paired routine | Turns consent into concrete daily help |
| Module 4 | Alarm to organized escalation | Three-folder ready shelf and response lane | Context selection, source layer match, interruption, handoff, unsafe-action review | Establishes product limits and human handoff |
| Module 5 | Responsibility to sustainable limits | Load redistribution and widening network | Ownership map, plan comparison, boundary rehearsal, network map, descriptive load review | Protects supporter capacity without taking authority |

## Interaction Sequence Audit

- No two modules use the same full interaction sequence.
- Tap-to-reveal is not used as a dominant mechanic.
- All spatial and drag-capable interactions have complete keyboard, click, and screen-reader alternatives.
- Every interaction requires classification, comparison, organization, construction, prioritization, sequencing, or application beyond adjacent narrative.
- Module 4 urgent direction requires no interaction.
- Feedback exists for every meaningful choice and explains likely consequence without praise or shame.
- Exactly 15 knowledge-check questions are present, three per module.
- Each module includes at least one gray-area question and uses contexts not used in its main scenario.
- Exactly five optional private reflections are present, one per module.

## Relationship and Scenario Audit

| Module | Main relationship | Living arrangement | Central tension |
| --- | --- | --- | --- |
| 1 | Adult siblings | Different cities | Repeated remote questions after a request to pause |
| 2 | Long-term partners | Same home | Food comment, medication checking, private app access, family disclosure |
| 3 | Roommates | Same home | Unrequested kitchen changes versus requested transportation help |
| 4 | Neighbors | Separate homes | Concerning change during an errand and uncertainty about what it means |
| 5 | Adult daughter and father | Separate homes nearby | Assumed constant availability and insufficient backup |

No character delivers a perfect autonomy speech. No conflict is fully resolved through one ideal line. No person living with diabetes is blamed for supporter worry or exhaustion.

## Language Audit

- No learner-facing generic motivational slogan is intentionally used.
- No moral label such as good caregiver or bad caregiver appears.
- No completion copy uses congratulations, praise, trophies, certificates, or claims of competence.
- Dialogue is short, imperfect, and speakable.
- Ordinary relational language remains calm. Emergency language is short and direct.
- The specification uses no em dash.

## Safety, Autonomy, and Privacy Audit

- The person living with diabetes remains the primary decision-maker in every module.
- Consent is specific, temporary, freely declinable, and revisable.
- Appointment attendance and speaking roles are separate.
- No action normalizes food policing, medication policing, glucose surveillance, secret access, forced disclosure, or speaking over the person.
- No module requests or stores a real glucose value, symptom, medication detail, clinician name, device data, or identifying information.
- Module 4 contains no triage score, symptom checker, personal threshold, dose, medication change, food treatment, exercise treatment, or device-operation instruction.
- Regional safety details are placeholders owned by controlled configuration.
- Session-only reflections explicitly exclude AI Tutor transfer, account save, sharing, and analytics.
- Completion and progress are private and non-credentialing.

## Length and Pacing Audit

- Module 2 is intentionally the longest prototype module because it carries the ethical center.
- Module 1 is shorter and interpretive.
- Module 3 alternates practical planning with short copy.
- Module 4 uses short action-first sections and minimal narrative.
- Module 5 uses mapping and rehearsal rather than a long self-care article.
- The landing page avoids a giant manifesto and course catalog structure.

## Final Content Acceptance

- All required learner-facing headings, descriptions, scenarios, dialogue, controls, choices, feedback, quizzes, reflections, takeaways, completion states, safety language, privacy language, visual purpose, and interaction purpose are specified.
- The four practical tools are introduced but not specified or created.
- No application code or Codex implementation prompt is included.
- Stable IDs are unique.
- All health and safety claims have source IDs and remain `not-reviewed`.
- Every flagged medical section is listed for review.
- Responsive and accessibility intent is embedded in each interaction.
- Remaining decisions are explicit and do not silently change the binding system.

## End-of-Document Control Register

### 1. Content ID Index

| Area | Stable IDs |
| --- | --- |
| Landing | `CG-LANDING`, `CG-LANDING-I01` to `CG-LANDING-I02` |
| Module 1 | `CG-M1`, `CG-M1-S01` to `CG-M1-S07`, `CG-M1-I01` to `CG-M1-I03`, `CG-M1-Q01` to `CG-M1-Q03`, `CG-M1-R01` |
| Module 2 | `CG-M2`, `CG-M2-S01` to `CG-M2-S08`, `CG-M2-I01` to `CG-M2-I05`, `CG-M2-Q01` to `CG-M2-Q03`, `CG-M2-R01` |
| Module 3 | `CG-M3`, `CG-M3-S01` to `CG-M3-S07`, `CG-M3-I01` to `CG-M3-I04`, `CG-M3-Q01` to `CG-M3-Q03`, `CG-M3-R01` |
| Module 4 | `CG-M4`, `CG-M4-S01` to `CG-M4-S08`, `CG-M4-I01` to `CG-M4-I05`, `CG-M4-Q01` to `CG-M4-Q03`, `CG-M4-R01` |
| Module 5 | `CG-M5`, `CG-M5-S01` to `CG-M5-S07`, `CG-M5-I01` to `CG-M5-I05`, `CG-M5-Q01` to `CG-M5-Q03`, `CG-M5-R01` |
| Claims | `CG-CLAIM-001` to `CG-CLAIM-014` |
| Reviews | `CG-REV-001` to `CG-REV-008` |

### 2. Interaction Inventory

| Area | Interaction IDs | Dominant work |
| --- | --- | --- |
| Landing | `CG-LANDING-I01` to `CG-LANDING-I02` | Need routing and path comparison |
| Module 1 | `CG-M1-I01` to `CG-M1-I03` | Evidence sorting, timing, response construction |
| Module 2 | `CG-M2-I01` to `CG-M2-I05` | Consequence mapping, continuum classification, permission construction, branching, repair sequencing |
| Module 3 | `CG-M3-I01` to `CG-M3-I04` | Shared planning, request matching, menu organization, routine comparison |
| Module 4 | `CG-M4-I01` to `CG-M4-I05` | Context selection, source matching, urgent interruption, handoff sequencing, unsafe-action recognition |
| Module 5 | `CG-M5-I01` to `CG-M5-I05` | Responsibility mapping, sustainability comparison, boundary rehearsal, network planning, descriptive load review |

### 3. Source Table

The finalized content-wide source table contains `CG-CLAIM-001` to `CG-CLAIM-014`. Every item remains `not-reviewed`, records limitations, and names required review.

### 4. Clinical-Review List

The clinical-review list contains `CG-REV-001` to `CG-REV-008`. Module 4, its regional strings, and its medication and device boundaries require heightened qualified review.

### 5. Cross-Module Distinctness

The cross-module table above confirms distinct emotional arcs, visual metaphors, dominant mechanics, scenarios, and practical purposes across the landing page and five modules.

### 6. Remaining Unresolved Content Decisions

The seven unresolved decisions above remain open. None authorizes Codex or a later content stage to invent medical guidance, regional information, reviewer credentials, privacy behavior, or design tokens.

### 7. Readiness for Prompt 3

Subject to product approval of this document and completion of the listed multidisciplinary reviews at the required stage, `01-CAREGIVER-CONTENT.md` is ready to control Prompt 3. Prompt 3 may specify the four practical tools but must not rewrite, weaken, or contradict this learner-facing content or `00-CAREGIVER-SYSTEM.md`.
