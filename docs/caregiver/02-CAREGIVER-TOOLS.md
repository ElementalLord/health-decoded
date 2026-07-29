# 02-CAREGIVER-TOOLS.md

## Document Metadata

- **Document:** `02-CAREGIVER-TOOLS.md`
- **Status:** Final content specification, pending the reviews named in this document
- **Project:** Health Decoded, Support Someone You Care About
- **Version date:** 2026-07-29
- **Authority:** Controlled by `00-CAREGIVER-SYSTEM.md` and `01-CAREGIVER-CONTENT.md`
- **Purpose:** Remove content, interaction, privacy, storage, state, print, export, responsive, and accessibility ambiguity from the four practical caregiver tools and the final caregiver completion experience.
- **Prototype audience:** People supporting an adult with Type 2 diabetes who generally retains decision-making capacity
- **Prototype market:** United States, with safety and support resources supplied only through controlled regional configuration
- **Implementation boundary:** This document contains no application code and is not the final Codex build prompt.
- **Review state:** All entries remain `not-reviewed`. No medical-review or other review claim may appear in the product until reviewer identity, qualifications, scope, and date are verified.

## Table of Contents

1. [Tool ID Index](#tool-id-index)
2. [Cross-Tool Interaction Inventory](#cross-tool-interaction-inventory)
3. [Shared Tool Behavior](#shared-tool-behavior)
4. [Tool 1: What Should I Say?](#tool-1-what-should-i-say)
5. [Tool 2: Know the Plan](#tool-2-know-the-plan)
6. [Tool 3: Caregiver Self-Check](#tool-3-caregiver-self-check)
7. [Tool 4: Shared Support Plan](#tool-4-shared-support-plan)
8. [Final Caregiver Completion Experience](#final-caregiver-completion-experience)
9. [Tool-Wide Source Table](#tool-wide-source-table)
10. [Tool-Wide Review Requirements](#tool-wide-review-requirements)
11. [Cross-Document Issue Register](#cross-document-issue-register)
12. [Final Tool Consistency Audit](#final-tool-consistency-audit)
13. [Remaining Unresolved Tool Decisions](#remaining-unresolved-tool-decisions)

## Tool ID Index

| ID or range | Meaning |
| --- | --- |
| `CG-T1` | What Should I Say? |
| `CG-T1-SC01` to `CG-T1-SC12` | Communication scenario packs |
| `CG-T1-I01` to `CG-T1-I07` | Scenario, goal, comparison, impact, adaptation, follow-up, and review interactions |
| `CG-T1-N01` to `CG-T1-N04` | Privacy, limits, clipboard, and session notices |
| `CG-T2` | Know the Plan |
| `CG-T2-F01` to `CG-T2-F34` | Organizer fields |
| `CG-T2-I01` to `CG-T2-I06` | Participation, preparation, organization, role, review, and output interactions |
| `CG-T2-N01` to `CG-T2-N08` | Authority, privacy, local-save, regional, outdated, shared-device, print, and export notices |
| `CG-T3` | Caregiver Self-Check |
| `CG-T3-Q01` to `CG-T3-Q15` | Private noticing questions |
| `CG-T3-R01` to `CG-T3-R06` | Descriptive result patterns |
| `CG-T3-I01` to `CG-T3-I03` | Response, pattern review, and urgent/support route interactions |
| `CG-T3-N01` to `CG-T3-N04` | Nonclinical, privacy, session, and urgent-route notices |
| `CG-T4` | Shared Support Plan |
| `CG-T4-A01` to `CG-T4-A12` | Agreement areas |
| `CG-T4-I01` to `CG-T4-I06` | Participation, preparation, preference, disagreement, confirmation, and output interactions |
| `CG-T4-N01` to `CG-T4-N09` | Authority, privacy, consent, shared-device, unresolved, outdated, regional, print, and export notices |
| `CG-COMPLETE` | Final caregiver completion experience |
| `CG-COMPLETE-I01` | Current next-step selection |
| `CG-TOOL-CLAIM-001` to `CG-TOOL-CLAIM-012` | Sourced educational claims |
| `CG-TOOL-REV-001` to `CG-TOOL-REV-018` | Required review entries |
| `CG-TOOL-ISSUE-001` onward | Cross-document issues |

No ID in this document reuses an ID from `01-CAREGIVER-CONTENT.md`.

## Cross-Tool Interaction Inventory

| Experience | Primary need | Emotional start to shift | Dominant cognitive action | Dominant mechanic | Supporting mechanics | Visual metaphor and workspace | Data sensitivity | Persistence | Print or export | Overlap and justification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| What Should I Say? | Prepare for an ordinary difficult conversation | Uncertainty to grounded readiness | Compare intention and possible impact, then adapt | Scenario rehearsal strip | Goal choice, line comparison, sentence editing, pause selection | A conversation drafting table with two voices and generous blank space | Moderate; drafts may include relationship details | Session-only; no automatic save | Not supported in this prototype | Uses dialogue skills from Modules 1, 2, and 5, but assembles one situation-specific preparation sheet rather than reteaching those modules |
| Know the Plan | Find existing professional instructions and clarify a limited role | Unpreparedness to organized restraint | Locate, label, and verify existing information | Ready-folder organizer | Permission gate, location fields, role boundaries, review date, print/export preview | A labeled shelf or open folder divided into location, contacts, role, and boundaries | High; may contain sensitive location and contact pointers | Deliberate local-device save only | Accessible print and export after confirmation | Shares Module 4's three safety layers but organizes references; it never teaches the full urgent-response sequence or creates instructions |
| Caregiver Self-Check | Privately notice strain and pressure patterns | Diffuse strain to specific noticing | Compare current experience across areas without scoring | Unscored pattern surface | Optional questions, pattern matching, area review, resource routes | Open desk areas connected by quiet strands, never a gauge | High emotional sensitivity; no patient data needed | Session-only | Not supported in this prototype | Shares Module 5 topics but privately identifies current patterns; it does not teach responsibility mapping or count toward progress |
| Shared Support Plan | Record current relational preferences with participation | Assumption or ambiguity to bounded, revisable clarity | Negotiate each support area independently | Two-person agreement canvas | Participation gate, preference states, disagreement handling, area-by-area confirmation | One shared table with the person living with diabetes visually primary and unresolved areas left open | High; may include names, preferences, boundaries, and contact pointers | Deliberate local-device save only | Accessible print and export after independent review | Shares Module 2 permission and Module 3 planning, but records current mutual preferences rather than classifying behavior or organizing professional instructions |
| Final completion | Consolidate learning and choose one current action | Closure pressure to open-ended practical focus | Select one nonprivate next-step category | Open-path choice | Quiet summary, change action, return routes | Five paths returning to one movable marker on an open route | Low; custom detail is session-only | Selected category only may persist with private progress | Not supported in this prototype | Refers to all modules and tools without requiring or summarizing private responses |

## Shared Tool Behavior

### Shared entry and availability

All four tools are optional and directly reachable from the caregiver landing page. No tool is required to open or complete a module, maintain progress, access urgent direction, complete the caregiver section, or receive a completion state. No tool requires a new account, patient-data import, account linking, or another person's login.

Every tool begins in this order:

1. Tool title, purpose, estimated time, and explicit non-use.
2. A visible privacy notice before any input.
3. **Start** and **Return to caregiver home** actions.
4. A visible urgent-help route when the tool contains health, emergency, or caregiver-crisis context.

Related modules appear only after the core task or when permission blocks the requested task. Opening a related module preserves only the storage state already disclosed for the tool.

### Shared control language

- **Leave without saving:** “Leave without saving”
- **Return path:** “Return to caregiver home”
- **Reset session tool:** “Clear this tool”
- **Reset local draft:** “Reset unsaved changes”
- **Delete local document:** “Delete from this device”
- **Cancel destructive action:** “Keep my current work”
- **Save local document:** “Save on this device”
- **Status labels:** “Not saved,” “Unsaved changes,” “Saved on this device,” “Save failed,” and “Deleted from this device”

No status uses *securely saved*, *protected*, *backed up*, or *synced*.

### Shared privacy and analytics behavior

- Session-only responses do not save to the learner's account, do not transfer to the AI Tutor, do not transfer to another account, and clear when the session ends or the learner resets the tool.
- Local content saves only after **Save on this device** is activated and the save succeeds.
- Local content remains in the current browser on the current device. It does not automatically sync or create a backup. Browser clearing may remove it. Another person using the device or an exported or printed copy may expose it.
- Free text, scenario drafts, Self-Check responses, plan content, names, contact details, health-information pointers, and participation-gate selections are excluded from analytics, URLs, page titles, notifications, and error reports.
- Allowed analytics are limited to nonsensitive events such as `tool_opened`, `tool_reset`, `local_save_attempted`, `local_save_succeeded`, `print_preview_opened`, and `export_cancelled`. Events may identify the tool ID, not input content, answer values, result patterns, names, or plan areas.
- Clipboard use is always a deliberate user action. Clipboard success or failure is announced. No clipboard content is logged.
- There is no cross-account sharing, automatic email, messaging, direct send, patient-account connection, or AI Tutor handoff.

### Shared urgent interruption

**Visible action:** “Someone may be in immediate danger”

When activated, normal tool flow is replaced immediately:

**Heading:** Stop here and get urgent help.

**Copy:** Health Decoded cannot determine what is happening or whether someone is safe. Use the person's clinician-created plan if it is immediately available, and contact emergency help using the reviewed information for **[REGION_DISPLAY_NAME]**. Do not delay help to finish this tool or find missing details.

**Action:** “View emergency help for [REGION_DISPLAY_NAME]”

**Missing or expired regional fallback:** “Local emergency details are not available in Health Decoded right now. Contact your local emergency service if someone may be in immediate danger, or contact an appropriate healthcare professional for urgent guidance. Do not use a guessed number or wait for this page to update.”

The urgent heading receives focus. The region and action are announced next. There is no confirmation question, animation, login, data entry, or completion requirement.

### Shared state and error behavior

- **First visit:** No fields are prefilled except neutral defaults explicitly named in this document.
- **Partial session:** Valid input remains while the same browser session remains active. “Your unfinished work is still open in this session. It has not been saved to your account.”
- **Leave with session-only content:** “Leaving will clear this tool's responses. Copy anything you want to keep before you leave.” Actions: **Leave and clear** and **Stay here**.
- **Leave with unsaved local content:** “You have unsaved changes on this device. Leaving now will discard those changes.” Actions: **Leave without saving**, **Save on this device**, and **Stay here**.
- **Unexpected error:** Preserve valid input when technically possible. Move focus to: “This part did not load. Your visible entries have been kept where possible. Try again, or return without saving.” Actions: **Try again** and **Return to caregiver home**.
- **Offline:** Session-only tools continue when all required content is bundled. Local saving may continue if available. Export and regional resources must state when current verification cannot be completed.
- **Reset:** Always states whether it clears session responses, unsaved changes, or a saved local document. Reset never silently deletes a saved local document.

### Shared accessibility, responsive, and motion behavior

All tools meet WCAG 2.2 AA and `ACCESSIBILITY-01` to `ACCESSIBILITY-20`. Headings are semantic; every field has a persistent label and help text association; required status is expressed in text; errors identify the field and recovery; focus order follows reading order; no time limits or auto-advance exist; and every function works with keyboard only.

At 320px, 375px, 768px, 1024px, 1440px, and 200 percent zoom, controls remain near their prompt, text wraps without truncation, side-by-side areas become a logical sequence, and no task requires horizontal scrolling. Wide review tables become labeled stacked groups. The virtual keyboard must not hide focused inputs or primary actions.

Ordinary transitions complete in 150 to 250 milliseconds. Larger workspace changes may take 250 to 400 milliseconds. Reduced motion replaces path or spatial movement with immediate state changes or brief opacity changes. Motion never delays urgent copy, implies correctness, or serves as the only state indicator.

### Shared applicable global rules

`SCOPE-01` to `SCOPE-10`; `AUTONOMY-01` to `AUTONOMY-10`; `CONSENT-01` to `CONSENT-15`; `SUPPORT-01` to `SUPPORT-08`; `PRIVACY-01` to `PRIVACY-15`; `MEDICAL-01` to `MEDICAL-15`; `EMERGENCY-01` to `EMERGENCY-10`; `REGION-01` to `REGION-08`; `CONTENT-01` to `CONTENT-20`; `SCENARIO-01` to `SCENARIO-15`; `INTERACTION-01` to `INTERACTION-08`; `FEEDBACK-01` to `FEEDBACK-08`; `REFLECTION-01` to `REFLECTION-07`; `PROGRESS-01` to `PROGRESS-08`; `VISUAL-01` to `VISUAL-11`; `MOTION-01` to `MOTION-08`; `RESPONSIVE-01` to `RESPONSIVE-10`; `ACCESSIBILITY-01` to `ACCESSIBILITY-20`; `STORAGE-01` to `STORAGE-06`; `PRINT-01` to `PRINT-10`; `REVIEW-01` to `REVIEW-08`; `CODEX-01` to `CODEX-06`.

# TOOL 1: WHAT SHOULD I SAY?

## 1. Tool metadata

- **Tool ID:** `CG-T1`
- **Public title:** What Should I Say?
- **Purpose:** Help a supporter prepare a respectful opening, response, pause, repair, boundary, or follow-up for one difficult ordinary conversation.
- **Audience need:** The supporter knows a conversation is needed but is unsure how to begin without hiding pressure inside caring language.
- **Intended use:** Rehearse a provided scenario, identify a goal, compare possible impact, adapt a short line, and prepare for refusal or disagreement.
- **Explicit non-use:** Not an AI chatbot, relationship assessment, prediction engine, messaging service, medical adviser, or adherence tool. It does not contact anyone, generate unlimited personalized advice, interpret health information, or produce a guaranteed script.
- **Emotional objective:** Move from searching for the perfect sentence to entering one bounded conversation with permission and room for a real response.
- **Estimated time:** 5 to 8 minutes.
- **Medical-risk level:** Moderate because scenarios may mention medications, appointments, devices, and private information without advising medical action.
- **Data-sensitivity level:** Moderate to high when the learner edits a draft.
- **Review status:** Editorial, clinical-boundary, privacy, accessibility, cultural, and emotional-safety review required.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-09`; `AUTONOMY-01` to `AUTONOMY-10`; `CONSENT-01` to `CONSENT-10`; `SUPPORT-01` to `SUPPORT-08`; `PRIVACY-01` to `PRIVACY-05`, `PRIVACY-08`, `PRIVACY-11`, `PRIVACY-12`; `MEDICAL-01` to `MEDICAL-15`; `EMERGENCY-01` to `EMERGENCY-10`; `REGION-01` to `REGION-08`; `CONTENT-03` to `CONTENT-15`; `SCENARIO-01` to `SCENARIO-15`; `INTERACTION-01` to `INTERACTION-08`; `FEEDBACK-01` to `FEEDBACK-08`; `VISUAL-01` to `VISUAL-10`; `MOTION-01` to `MOTION-08`; `RESPONSIVE-01` to `RESPONSIVE-09`; `ACCESSIBILITY-01` to `ACCESSIBILITY-20`; `STORAGE-01`, `STORAGE-06`; `PRINT-01`; `REVIEW-03` to `REVIEW-08`.

## 2. Visual identity

The workspace resembles a conversation drafting table, not a chat window. One short scenario sits in an editorial column. Candidate openings align on a ruled comparison strip labeled **What you mean** and **What the other person may hear**. A small movable marker shows the selected goal. The learner's draft sits on an unlined writing area, visually separate from supplied language.

Use warm ivory, forest text, muted blue-green for permission, and restrained terracotta for possible pressure. Do not color a sentence green for “good” or red for “bad.” Avoid message bubbles, typing dots, bot avatars, chat timestamps, canned sparkle icons, score states, and a grid of scenario cards. On mobile, the scenario, goal, openings, impact, adaptation, follow-up, and sheet follow one linear reading order.

## 3. Entry experience and learner-facing copy

**Eyebrow:** PRACTICAL TOOL

**Title:** What Should I Say?

**Introduction:** A useful opening can make a conversation easier to enter. It cannot control the response or guarantee agreement. This tool helps you choose a purpose, notice hidden pressure, and prepare words that the other person can accept, decline, or answer differently.

**Limitation notice `CG-T1-N01`:** “This tool prepares ordinary communication. It does not assess a relationship, predict another person's reaction, or provide medical or treatment advice.”

**Privacy notice `CG-T1-N02`:** “Your choices and draft stay in this browser session. They are not saved to your account, shared with the person you support, or sent to the AI Tutor. They clear when this session ends or when you clear the tool.”

**Clipboard notice `CG-T1-N03`:** “Nothing is copied automatically. If you choose Copy preparation sheet, the text moves to your device clipboard and may be visible to other apps or people with access to the device.”

**Estimated time:** About 5 to 8 minutes

**Primary action:** Start preparing

**Secondary action:** Return to caregiver home

**Reset action:** Clear this tool

**Scenario-selection prompt:** “Which situation is closest to the conversation you want to prepare for?”

**Custom-situation option:** “A different ordinary conversation.” Help: “Use a short neutral label. Do not enter readings, medication doses, medical records, or details you would not want visible on this device.”

## 4. Scenario library

All scenarios are original illustrative learning material. Names and situations are fictional.

### `CG-T1-SC01` Checking in after a recent diagnosis

- **Relationship:** Longtime friends, different cities
- **Setting:** Weekend phone call
- **Observable situation:** Priya mentioned a recent Type 2 diabetes diagnosis, then changed the subject. Morgan wants to check in without making every call about health.
- **Information not known:** Whether Priya wants to talk, what she is feeling, or whether practical help is wanted.
- **Goal options:** Listen; ask permission; preserve ordinary conversation.
- **Opening A:** “Would you like me to ask how the diabetes stuff is going, or would you rather talk about something else?”
- **Possible impact:** Makes both paths legitimate and does not require disclosure.
- **Opening B:** “I've been wondering how you're doing with everything.”
- **Possible impact:** Natural and caring, but “everything” may feel broad or require Priya to decide what Morgan means.
- **Opening C:** “You need to tell me what's happening so I know you're okay.”
- **Possible impact:** Morgan's uncertainty becomes Priya's reporting duty.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Do you want listening, one practical idea, or no diabetes talk today?” / “What kind of check-in, if any, would be useful later?”
- **Pause:** “Okay. We can leave it there.”
- **Repair:** “I made my worry the reason you had to explain. I’m sorry. I’ll ask before bringing it up again.”
- **Boundary:** Not usually needed.
- **Cannot predict:** Whether Priya will talk, decline, joke, change the subject, or want a different kind of support.
- **Related module:** What They May Be Feeling
- **Medical/privacy boundary:** No symptom, treatment, or glucose discussion is requested.

### `CG-T1-SC02` A comment at a family meal

- **Relationship:** Adult cousins
- **Setting:** Birthday dinner with relatives
- **Observable situation:** Luis commented, “Is that on your plan?” when Mateo reached for dessert. Mateo went quiet. Luis wants to repair without reopening the topic publicly.
- **Information not known:** Mateo's interpretation, food plan, or willingness to discuss it.
- **Goal options:** Repair an overstep; accept a boundary; preserve privacy.
- **Opening A:** “I commented on your food in front of everyone. I’m sorry. I won’t do that again.”
- **Possible impact:** Names the action and change without demanding reassurance.
- **Opening B:** “I’m sorry if that came out wrong. I was worried.”
- **Possible impact:** Sounds familiar, but “if” and the explanation may shift attention back to Luis's intention.
- **Opening C:** “I was only trying to help, and you embarrassed me by shutting down.”
- **Possible impact:** Makes Mateo responsible for comforting Luis and defending his response.
- **Permission-based start:** Opening A, followed later by “Do you want any conversation about food from me in private, or none?”
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “What would you like me to do if someone else comments?” / “Would you rather not discuss this with me?”
- **Pause:** “You don’t have to answer now.”
- **Repair:** Opening A is the repair.
- **Boundary:** “If relatives ask me questions about your health, I’ll tell them to ask you rather than answering for you.”
- **Cannot predict:** Whether Mateo accepts the apology or wants further conversation.
- **Related module:** Support Without Taking Over
- **Medical/privacy boundary:** No food judgment or plan interpretation.

### `CG-T1-SC03` A reminder that was never clearly requested

- **Relationship:** Spouses
- **Setting:** Weekday kitchen
- **Observable situation:** Devon has been saying “Don’t forget your medicine” each morning. Rae finally says, “Please stop reminding me.”
- **Information not known:** Whether any reminder was ever wanted, whether Rae's preference changed, or how medication is managed.
- **Goal options:** Accept a boundary; repair; revisit an agreement.
- **Opening A:** “Okay. I’ll stop. I should have checked whether you wanted reminders.”
- **Possible impact:** Ends the current pressure and names the missing permission.
- **Opening B:** “Fine, but I’m going to worry.”
- **Possible impact:** Stops the reminder while leaving Rae responsible for Devon's worry.
- **Opening C:** “I’ll stop when I know you’re taking it.”
- **Possible impact:** Makes privacy and support conditional on proving adherence.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Would you like no reminders, or to discuss a different arrangement another time?” / “Should I leave this topic alone unless you raise it?”
- **Pause:** “No need to decide anything else now.”
- **Repair:** “I repeated something you had not agreed to. I’m sorry.”
- **Boundary:** “I can listen when you want to talk about routines, but I won’t track whether you follow them.”
- **Cannot predict:** Whether Rae wants a future reminder agreement.
- **Related module:** Support Without Taking Over
- **Medical/privacy boundary:** No medication name, dose, schedule, or adherence data.

### `CG-T1-SC04` Offering a ride

- **Relationship:** Neighbor and friend
- **Setting:** Building hallway
- **Observable situation:** Ben knows Alana has an appointment across town and that buses have been unreliable. He can drive but does not want the offer to imply she cannot manage.
- **Information not known:** Whether transportation is already arranged or whether Alana wants Ben to know more.
- **Goal options:** Offer one practical action; make no easy.
- **Opening A:** “I’m free Tuesday morning and can drive you if that would help. No problem if you already have a plan.”
- **Possible impact:** Specific, bounded, and easy to decline.
- **Opening B:** “Let me know if you need a ride.”
- **Possible impact:** Respectful but leaves Alana to remember, ask, and coordinate.
- **Opening C:** “I don’t think you should be taking the bus to that appointment.”
- **Possible impact:** Turns an offer into a judgment about competence.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Would pickup at nine work?” / “Would you prefer I not ask about rides again?”
- **Pause:** “You can decide later. I need to know by Monday evening.”
- **Repair:** “I made the ride sound like something you should accept. That wasn’t fair.”
- **Boundary:** “I can drive Tuesday morning, but I can’t wait through the appointment.”
- **Cannot predict:** Whether Alana wants a ride or why.
- **Related module:** Everyday Support That Actually Helps
- **Medical/privacy boundary:** No appointment purpose or clinical details requested.

### `CG-T1-SC05` Asking whether to attend an appointment

- **Relationship:** Adult daughter and mother
- **Setting:** Video call
- **Observable situation:** Mei wants to offer to attend her mother Lian's next appointment. Lian invited her once last year but has not asked this time.
- **Information not known:** Whether Lian wants company, privacy, transportation, note-taking, or no involvement.
- **Goal options:** Ask permission; clarify a role; accept a boundary.
- **Opening A:** “Would you like me at this appointment, nearby afterward, or not involved this time?”
- **Possible impact:** Separates attendance from broader authority and includes no involvement as a real option.
- **Opening B:** “Should I come with you again?”
- **Possible impact:** Natural, but “again” may imply the previous invitation continues.
- **Opening C:** “I need to be there so I can hear what the doctor says.”
- **Possible impact:** Centers Mei's access and assumes attendance and listening rights.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “If I come, would you like me to listen, take notes, ask a question you choose, or wait outside?” / “If you change your mind in the room, tell me and I’ll step out.”
- **Pause:** “You don’t need to answer on this call.”
- **Repair:** “I treated last year's invitation as permission for this visit. I’m sorry.”
- **Boundary:** “I can attend in the afternoon, but I cannot take the morning off.”
- **Cannot predict:** Lian's choice or preferred role.
- **Related module:** Support Without Taking Over
- **Medical/privacy boundary:** Attendance never authorizes speaking or receiving information.

### `CG-T1-SC06` Information shared with another relative

- **Relationship:** Siblings supporting their aunt
- **Setting:** Private phone call after a family gathering
- **Observable situation:** Sam told his sister that Aunt Imani had changed a diabetes medication. Imani later learned about the conversation and said, “That was mine to share.”
- **Information not known:** What Imani wants shared in the future or whether she wants an apology now.
- **Goal options:** Repair an overstep; accept a boundary; revisit information-sharing permission.
- **Opening A:** “I shared your medication information with Nia without asking. That was private, and I’m sorry. I won’t share more.”
- **Possible impact:** Names the specific disclosure and stops it.
- **Opening B:** “I didn’t think Nia counted because she’s family.”
- **Possible impact:** Explains the assumption but minimizes Imani's control.
- **Opening C:** “We need to coordinate, so you’ll have to expect us to talk.”
- **Possible impact:** Converts concern into standing family access.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Is there anything you want me to correct with Nia?” / “If future coordination comes up, what may I share, if anything?”
- **Pause:** “You do not need to decide future sharing now.”
- **Repair:** Opening A plus follow-through.
- **Boundary:** “If Nia asks, I’ll say I can’t discuss your health.”
- **Cannot predict:** Whether Imani wants Sam to correct, disclose, or stop discussing anything.
- **Related module:** Support Without Taking Over
- **Medical/privacy boundary:** No further medication detail is repeated.

### `CG-T1-SC07` Opening a health app

- **Relationship:** Roommates
- **Setting:** Shared tablet at home
- **Observable situation:** Tessa saw a diabetes app open under Noor's profile and tapped through two screens. Noor noticed the recent activity.
- **Information not known:** What Tessa saw, how Noor feels, or whether shared-device settings need to change.
- **Goal options:** Repair an overstep; clarify future privacy.
- **Opening A:** “I opened your health app on the tablet without asking. I’m sorry. I won’t open it again, and I’ll use my own profile.”
- **Possible impact:** Names access, change, and a concrete prevention step.
- **Opening B:** “I got curious when it was already open.”
- **Possible impact:** Honest but incomplete because it does not acknowledge privacy impact or future behavior.
- **Opening C:** “You shouldn’t leave it open if you don’t want me to see.”
- **Possible impact:** Shifts responsibility for unauthorized access to Noor.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Do you want me to close the app now, or would you rather handle the device yourself?” / “Is there any action you want from me about what I saw?”
- **Pause:** “You do not have to respond right now.”
- **Repair:** Opening A.
- **Boundary:** “I will not use your profile.”
- **Cannot predict:** Noor's reaction or whether trust repairs quickly.
- **Related module:** Support Without Taking Over
- **Medical/privacy boundary:** The tool never asks what the app displayed.

### `CG-T1-SC08` Remote support becoming repeated texting

- **Relationship:** Brothers living in different states
- **Setting:** Text conversation
- **Observable situation:** Eli sent four “checking in” messages before noon. Jonah replied, “I can’t report in all day.”
- **Information not known:** Whether Jonah was busy, annoyed, worried, or wants a different check-in schedule.
- **Goal options:** Accept a boundary; repair; revisit an agreement.
- **Opening A:** “You’re right. Four messages was too much. I’ll stop checking today. Would you want to discuss a different check-in another time?”
- **Possible impact:** Stops repetition now and separates a future agreement.
- **Opening B:** “Sorry. Distance makes me nervous.”
- **Possible impact:** Names Eli's experience but may invite Jonah to manage it.
- **Opening C:** “Then answer the first text so I don’t have to keep asking.”
- **Possible impact:** Makes access to Jonah the condition for stopping.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Would one planned call be useful, or would you rather contact me when you want?” / “What should I do with worry that is mine to manage?”
- **Pause:** “No need to reply today.”
- **Repair:** “I turned a check-in into monitoring. I’m sorry.”
- **Boundary:** “I’ll keep my phone on for planned calls, but I can’t promise immediate replies.”
- **Cannot predict:** Whether Jonah wants any recurring contact.
- **Related module:** What They May Be Feeling
- **Medical/privacy boundary:** No remote monitoring or app access.

### `CG-T1-SC09` Setting an availability boundary

- **Relationship:** Close friends
- **Setting:** Evening call
- **Observable situation:** Asha has taken several last-minute calls from Ren during work shifts. Asha wants to remain supportive but cannot keep leaving the floor.
- **Information not known:** What other support Ren has or how Ren will receive the boundary.
- **Goal options:** Set my own boundary; ask for backup; revisit an agreement.
- **Opening A:** “I can talk after seven, but I can’t answer personal calls during my shift. We need another option for daytime help.”
- **Possible impact:** Names Asha's action and a structural gap without threatening withdrawal.
- **Opening B:** “Work has been a lot, so I may not always answer.”
- **Possible impact:** Gentle but too vague to plan around.
- **Opening C:** “If you keep calling at work, I’m done helping.”
- **Possible impact:** Uses future help as punishment rather than stating capacity.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Who else could be part of daytime backup with your permission?” / “Which requests can wait until evening?”
- **Pause:** “We don’t have to solve every backup tonight.”
- **Repair:** “I answered resentfully yesterday. The limit is still real, but I want to state it clearly.”
- **Boundary:** Opening A.
- **Cannot predict:** Whether Ren agrees or feels disappointed.
- **Related module:** The Caregiver Matters Too
- **Medical/privacy boundary:** Asha does not become emergency coverage; urgent routes remain separate.

### `CG-T1-SC10` Revisiting a recurring agreement

- **Relationship:** Partners
- **Setting:** Sunday planning conversation
- **Observable situation:** For two months, Jo has picked up Casey's supplies every Friday. Jo's schedule changed and the arrangement no longer works.
- **Information not known:** Whether Casey still wants this help or which alternative is workable.
- **Goal options:** Revisit an agreement; set a boundary; ask for backup.
- **Opening A:** “Friday pickup no longer works with my schedule. I can do Tuesday, or we can find another option. What works for you?”
- **Possible impact:** Treats the agreement as revisable and preserves Casey's choice.
- **Opening B:** “I’m getting tired of always doing pickup.”
- **Possible impact:** Honest strain, but “always” may turn the task into a character judgment.
- **Opening C:** “You need to handle this yourself now.”
- **Possible impact:** Ends the arrangement without planning and may sound punitive.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “Would you prefer Tuesday, delivery, another person, or leaving this unresolved for now?” / “What information, if any, can be shared with a backup?”
- **Pause:** “We can list options now and decide tomorrow.”
- **Repair:** “I let frustration build instead of revisiting the agreement earlier.”
- **Boundary:** “I can do Tuesday pickups twice a month. I cannot keep Friday.”
- **Cannot predict:** Which replacement Casey prefers.
- **Related module:** The Caregiver Matters Too
- **Medical/privacy boundary:** No supply contents need to be entered.

### `CG-T1-SC11` A declined practical offer

- **Relationship:** Coworkers and friends
- **Setting:** Office parking lot
- **Observable situation:** Dani offers to bring lunch during a busy week. Sol says, “No thanks, I’ve got it.” Dani feels tempted to offer again with more reasons.
- **Information not known:** Why Sol declined or whether another kind of help is wanted.
- **Goal options:** Accept a boundary; preserve normal conversation.
- **Opening A:** “Okay. See you at the meeting.”
- **Possible impact:** Accepts no without requiring an explanation.
- **Opening B:** “Are you sure? It really wouldn’t be a problem.”
- **Possible impact:** Common courtesy, but a repeated offer can make refusal harder.
- **Opening C:** “You always refuse help, even when you need it.”
- **Possible impact:** Recasts decline as a personal flaw and claims knowledge Dani does not have.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** None required. Later, a separate specific offer may be made if context changes.
- **Pause:** “No problem.”
- **Repair:** “I kept offering after you said no. I’m sorry.”
- **Boundary:** Not needed.
- **Cannot predict:** Whether Sol wanted help or simply chose not to accept this offer.
- **Related module:** Everyday Support That Actually Helps
- **Medical/privacy boundary:** No food or health assumptions.

### `CG-T1-SC12` Keeping one conversation ordinary

- **Relationship:** Parent and adult son
- **Setting:** Weekly video call
- **Observable situation:** Gabriel notices that every recent call with his mother, Rosa, has become a diabetes update. He wants to protect space for their shared interest in gardening.
- **Information not known:** Whether Rosa also wants a break or wants to raise health first.
- **Goal options:** Preserve ordinary conversation; ask permission.
- **Opening A:** “I’d love to hear what happened with the tomatoes. Do you want this call to stay non-diabetes unless you bring it up?”
- **Possible impact:** Makes ordinary conversation explicit without forbidding Rosa from raising health.
- **Opening B:** “Let’s not talk about diabetes today.”
- **Possible impact:** Clear, but Gabriel unilaterally closes a topic Rosa may need.
- **Opening C:** “I can’t keep hearing about diabetes every week.”
- **Possible impact:** Turns Gabriel's limit into rejection of Rosa's experience.
- **Permission-based start:** Opening A.
- **Natural but imperfect alternative:** Opening B.
- **Clearly pressuring alternative:** Opening C.
- **Follow-ups:** “What are you planting next?” / “If you do want support later, should we choose another time?”
- **Pause:** “We can change course if you want.”
- **Repair:** “I shut down the topic instead of asking what kind of call you wanted.”
- **Boundary:** “I have ten minutes for health logistics tonight, then I need to stop.”
- **Cannot predict:** Whether Rosa wants ordinary talk, health talk, or both.
- **Related module:** The Caregiver Matters Too
- **Medical/privacy boundary:** Ordinary connection is not treated as avoidance.

All scenario packs apply `SCENARIO-01` to `SCENARIO-15`, `AUTONOMY-01` to `AUTONOMY-10`, `CONSENT-01` to `CONSENT-09`, `SUPPORT-01` to `SUPPORT-08`, `CONTENT-05` to `CONTENT-15`, `MEDICAL-01` to `MEDICAL-15`, and `PRIVACY-01` to `PRIVACY-05`.

## 5. Complete interaction specifications

### `CG-T1-I01` Choose the situation

- **Learner-facing title:** Choose the conversation
- **Purpose:** Establish a bounded situation without asking for medical details.
- **Cognitive action:** Match the current need to a scenario category.
- **Information already known:** The tool cannot predict the other person's response.
- **New work required:** Identify the closest communication situation.
- **Exact learner prompt:** “Which situation is closest to the conversation you want to prepare for?”
- **Exact controls, choices, or fields:** Twelve scenario titles; **A different ordinary conversation**; actions **Use this situation**, **Read scenario details**, and **Clear choice**.
- **Defaults:** No selection.
- **Validation:** A selection is required to continue. Custom label accepts 3 to 80 characters and rejects line breaks.
- **Response logic:** Selecting a supplied scenario loads its observable situation and goal options. Custom selection loads the eight general goals and generic medical/privacy boundaries.
- **Exact feedback for every meaningful state:** Supplied scenario: “This tool will use the observable situation, not guess the other person's feelings.” Custom: “Keep the label broad. You can prepare communication without entering private health details.” None: “Choose one situation, or return without starting.”
- **Required or optional:** Required for this tool sequence.
- **Progression behavior:** Opens `CG-T1-I02`; no module or section progress.
- **Can responses be revised:** Yes, until a final preparation sheet is copied; revision remains available afterward.
- **Keyboard behavior:** Semantic radio group; arrow keys move; Space selects; Enter activates actions.
- **Screen-reader behavior:** Group name, option position, and selection are announced. Loaded description is a polite status.
- **Mobile behavior:** Options appear as ruled rows, not cards.
- **Reduced-motion behavior:** Scenario details replace immediately.
- **Data collected:** Scenario ID or custom neutral label.
- **Data persisted:** Session-only.
- **Data shared:** None.
- **Reset behavior:** Clears selection and downstream work after confirmation.
- **Error recovery:** Preserve selection; announce unavailable scenario and allow another.
- **Applicable global rules:** `INTERACTION-01` to `INTERACTION-08`; `PRIVACY-01` to `PRIVACY-05`; `STORAGE-01`; `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No medical details are requested; all scenarios remain reachable; custom text never enters analytics.

### `CG-T1-I02` Choose the goal

- **Learner-facing title:** Decide what this conversation is for
- **Purpose:** Prevent one opening from carrying several hidden demands.
- **Cognitive action:** Choose one primary intention.
- **Information already known:** The selected situation and its unknowns.
- **New work required:** Distinguish listening, offering, permission, acceptance, repair, boundary, revision, and pause.
- **Exact learner prompt:** “What is the main job of your next sentence?”
- **Exact controls, choices, or fields:** **Listen**, **Offer one practical action**, **Ask permission**, **Accept a boundary**, **Repair an overstep**, **Set my own boundary**, **Revisit an agreement**, **Pause the conversation**; actions **Use this goal** and **Change situation**.
- **Defaults:** No goal.
- **Validation:** One selection required.
- **Response logic:** Filters scenario openings and labels any mismatch between situation and goal without blocking it.
- **Exact feedback for every meaningful state:** Listen: “Make room before adding advice.” Offer: “Name one action and make refusal easy.” Permission: “Ask about one action, topic, or role.” Accept: “Stop the repeated action before negotiating anything new.” Repair: “Name what you did, its possible impact, and what will change.” Boundary: “State what you can do, not what the other person must do.” Revisit: “Treat the old arrangement as changeable.” Pause: “End the current exchange without punishment or forced reassurance.”
- **Required or optional:** Required.
- **Progression behavior:** Opens `CG-T1-I03`.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Radio group and explicit submit.
- **Screen-reader behavior:** Feedback is announced once with the selected goal.
- **Mobile behavior:** Full-width rows separated by fine rules.
- **Reduced-motion behavior:** Immediate filter update.
- **Data collected:** Goal ID.
- **Data persisted:** Session-only.
- **Data shared:** None.
- **Reset behavior:** Goal and later choices clear; situation remains after confirmation.
- **Error recovery:** Keeps selection and reoffers submit.
- **Applicable global rules:** `SUPPORT-01` to `SUPPORT-08`; `INTERACTION-01` to `INTERACTION-08`; `FEEDBACK-01` to `FEEDBACK-08`.
- **Acceptance criteria:** No option is morally ranked; boundary does not become leverage; repair does not promise resolution.

### `CG-T1-I03` Compare openings

- **Learner-facing title:** Compare what the opening may make possible
- **Purpose:** Show how similar intentions can produce different pressure.
- **Cognitive action:** Compare three lines against the selected goal.
- **Information already known:** Three scenario lines and possible impacts exist.
- **New work required:** Predict which line leaves the most room for a real answer.
- **Exact learner prompt:** “Which opening best fits your goal while leaving room for no, uncertainty, or a different response?”
- **Exact controls, choices, or fields:** Scenario openings A, B, and C; **Compare impact**; **Choose this opening**; **Go back to goal**.
- **Defaults:** None chosen; impact text hidden until deliberate comparison submission.
- **Validation:** One choice required.
- **Response logic:** Shows intention and possible impact for all three after submission. Any line may be selected for adaptation, but the pressuring line triggers a revision prompt.
- **Exact feedback for every meaningful state:** Permission-based line: “This line fits the goal and leaves the response open. It still cannot guarantee how it will be received.” Imperfect line: “This line is speakable, but part of the burden remains unclear. Adapt it so the action, limit, or permission is easier to understand.” Pressuring line: “The concern may be real, but this line makes refusal, privacy, or disagreement harder. Keep the intention and remove the demand.” No choice: “Choose a line to compare. You can change it before continuing.”
- **Required or optional:** Required.
- **Progression behavior:** Opens `CG-T1-I04`; pressuring choice does not block but requires an edit before review.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Radio group; no drag; impact regions follow each line in DOM order.
- **Screen-reader behavior:** Each line is followed by its labeled impact after submit.
- **Mobile behavior:** Lines become sequential groups with repeated **Possible impact** label.
- **Reduced-motion behavior:** Impact appears immediately.
- **Data collected:** Opening ID.
- **Data persisted:** Session-only.
- **Data shared:** None.
- **Reset behavior:** Clears opening and later draft.
- **Error recovery:** Keeps selected line.
- **Applicable global rules:** `INTERACTION-01` to `INTERACTION-08`; `FEEDBACK-01` to `FEEDBACK-08`; `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** Preferred wording is not always longest; all meaningful choices receive consequence feedback.

### `CG-T1-I04` Check intention and possible impact

- **Learner-facing title:** Keep the intention. Change the pressure.
- **Purpose:** Separate a reasonable motive from a potentially controlling effect.
- **Cognitive action:** Assign the line's clauses to intention, permission, pressure, boundary, or uncertainty.
- **Information already known:** The chosen line and supplied impact.
- **New work required:** Identify which phrase carries hidden pressure or ambiguity.
- **Exact learner prompt:** “What is each part of this sentence doing?”
- **Exact controls, choices, or fields:** Sentence split into no more than three selectable clauses; category choices **Names my intention**, **Asks permission**, **Makes no harder**, **States my limit**, **Leaves meaning uncertain**; **Review impact**.
- **Defaults:** None.
- **Validation:** Every clause needs one category; keyboard-selectable list, not drag-only.
- **Response logic:** Shows clause-level feedback and suggests the relevant change, not a full generated script.
- **Exact feedback for every meaningful state:** Intention correctly identified: “An intention can explain why you are speaking. It does not create access or agreement.” Permission: “Permission is specific only when the action or topic is clear.” Pressure: “This phrase adds a cost to no. Remove the consequence, repetition, or demand for reassurance.” Boundary: “A usable boundary describes your availability or action.” Uncertainty: “This phrase avoids claiming what the other person feels.” Misclassified: “Look at what the phrase asks the other person to do, not only how caring it sounds.”
- **Required or optional:** Required only to complete this interaction sequence. The tool can be left at any time.
- **Progression behavior:** Opens adaptation.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Each clause uses a labeled select or radio group.
- **Screen-reader behavior:** Clause text is included in every control label.
- **Mobile behavior:** One clause per section.
- **Reduced-motion behavior:** Static feedback.
- **Data collected:** Clause categories.
- **Data persisted:** Session-only.
- **Data shared:** None.
- **Reset behavior:** Clears classifications only.
- **Error recovery:** Identifies missing clause; preserves others.
- **Applicable global rules:** `SUPPORT-01` to `SUPPORT-08`; `INTERACTION-01` to `INTERACTION-08`; `FEEDBACK-01` to `FEEDBACK-08`.
- **Acceptance criteria:** The activity performs new interpretive work and never labels the learner.

### `CG-T1-I05` Adapt the language

- **Learner-facing title:** Make it sound like you
- **Purpose:** Create one short, usable line without unlimited AI generation.
- **Cognitive action:** Edit supplied language while preserving permission, specificity, or boundary.
- **Information already known:** Goal, chosen opening, and pressure analysis.
- **New work required:** Produce a concise personal version.
- **Exact learner prompt:** “Edit the opening so you could actually say it. Keep the action or limit clear, and leave room for a different answer.”
- **Exact controls, choices, or fields:** Text area, 280-character maximum; optional phrase starters **Would you like...**, **I can...**, **I’m sorry I...**, **I’ll stop...**, **Does this agreement still...**, **We can pause...**; **Use my version**, **Use the supplied opening**, **Clear draft**.
- **Defaults:** Chosen opening prefilled only after explicit **Use as starting text**.
- **Validation:** 1 to 280 characters; no medical correctness validation; soft warning for question plus ultimatum patterns, repeated exclamation marks, or dose/reading-like numeric strings.
- **Response logic:** Rules-based checks flag possible pressure for learner review. The tool does not rewrite automatically.
- **Exact feedback for every meaningful state:** Clear action and choice: “The action is specific and the response remains open.” Vague: “Name the one action, topic, or limit this sentence is about.” Possible pressure: “Read this once as the person declining. A consequence or repeated demand may make no harder.” Medical detail detected: “Keep medical values and instructions out of this communication tool. Refer to the person's plan or a qualified professional instead.” Empty: “Write a short opening or use the supplied line.”
- **Required or optional:** Optional editing; learner may use supplied opening.
- **Progression behavior:** Opens follow-up and pause selection.
- **Can responses be revised:** Yes, until session clears.
- **Keyboard behavior:** Standard text editing; phrase starters insert at caret only after activation.
- **Screen-reader behavior:** Character count and warnings announced politely, not on every keystroke.
- **Mobile behavior:** Text area remains at least five lines; keyboard does not cover actions.
- **Reduced-motion behavior:** No animated rewriting.
- **Data collected:** Draft text.
- **Data persisted:** Session-only.
- **Data shared:** None; draft text is not logged.
- **Reset behavior:** Clears draft but retains supplied opening selection.
- **Error recovery:** Preserves text; permits copy if next step fails.
- **Applicable global rules:** `PRIVACY-01` to `PRIVACY-05`, `PRIVACY-11`, `PRIVACY-12`; `MEDICAL-01` to `MEDICAL-15`; `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No generative chatbot behavior; no automatic sending; no health information is required.

### `CG-T1-I06` Prepare a follow-up or pause

- **Learner-facing title:** Prepare for an answer you did not choose
- **Purpose:** Rehearse accepting no, uncertainty, disagreement, or delay.
- **Cognitive action:** Match a follow-up to a response state.
- **Information already known:** A conversation cannot control the response.
- **New work required:** Select one follow-up and one pause.
- **Exact learner prompt:** “If the answer is no, unclear, or not now, what will you say next?”
- **Exact controls, choices, or fields:** Scenario follow-ups; universal choices **Okay. I’ll leave it here**, **Would another time be better, or should I stop asking?**, **We do not have to settle this now**, **I need to pause and return when I can speak more clearly**; one follow-up and one pause; **Add to my sheet**.
- **Defaults:** None.
- **Validation:** One follow-up or pause required; both recommended but not forced.
- **Response logic:** Repeated-question options are flagged; boundaries are checked for punishment framing.
- **Exact feedback for every meaningful state:** Accept no: “This stops the current request without requiring an explanation.” Ask later: “This works only if ‘stop asking’ remains a real option.” Pause: “A pause should name what happens next without using silence as punishment.” Boundary: “Keep the limit about what you will do.” Repeated question: “Another question may turn the same offer into pressure. Accept the answer before reopening the topic.”
- **Required or optional:** Required for a complete preparation sheet.
- **Progression behavior:** Opens final review.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Two labeled radio groups.
- **Screen-reader behavior:** Follow-up and pause groups announced separately.
- **Mobile behavior:** Sequential layout.
- **Reduced-motion behavior:** Immediate feedback.
- **Data collected:** Choice IDs.
- **Data persisted:** Session-only.
- **Data shared:** None.
- **Reset behavior:** Clears follow-up and pause.
- **Error recovery:** Preserves valid group selection.
- **Applicable global rules:** `AUTONOMY-02`; `SUPPORT-01`, `SUPPORT-02`, `SUPPORT-05`; `INTERACTION-01` to `INTERACTION-08`; `FEEDBACK-01` to `FEEDBACK-08`.
- **Acceptance criteria:** The learner practices response acceptance, not only an ideal opening.

### `CG-T1-I07` Review the preparation sheet

- **Learner-facing title:** Your conversation preparation
- **Purpose:** Consolidate one usable, nonpredictive plan.
- **Cognitive action:** Review consistency across goal, opening, follow-up, pause, and boundary.
- **Information already known:** All selected elements.
- **New work required:** Confirm that the sheet reflects the intended conversation.
- **Exact learner prompt:** “Read the sheet once. Does it leave the other person room to answer differently?”
- **Exact controls, choices, or fields:** Read-only sections **Situation**, **Goal**, **Opening**, **Possible follow-up**, **Possible pause**, **What cannot be predicted**, **Respect no**, **Privacy or safety boundary**; actions **Edit opening**, **Change follow-up**, **Copy preparation sheet**, **Clear this tool**, **Return to caregiver home**.
- **Defaults:** Current session choices.
- **Validation:** Copy is disabled until situation, goal, opening, and one follow-up or pause exist.
- **Response logic:** Copy includes only visible sheet text. Print and export are not supported.
- **Exact feedback for every meaningful state:** Complete: “This is preparation, not a prediction. The other person may respond differently or decline the conversation.” Incomplete: “Finish the labeled sections before copying.” Copy success: “Copied to this device's clipboard.” Copy failure: “The clipboard was not available. Select the text manually or keep it open in this session.” Reset: “This will clear the scenario, choices, and draft from this session.”
- **Required or optional:** Optional; tool use never affects progress.
- **Progression behavior:** No completion state or credential.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Section edit links return focus to the exact control.
- **Screen-reader behavior:** Sheet is one labeled region with headings; copy status is announced.
- **Mobile behavior:** Single column.
- **Reduced-motion behavior:** Static sheet.
- **Data collected:** Visible sheet content.
- **Data persisted:** Session-only.
- **Data shared:** None automatically; copied only by user action.
- **Reset behavior:** Clears all session data after confirmation.
- **Error recovery:** Keeps the sheet if copy fails.
- **Applicable global rules:** `PRIVACY-01` to `PRIVACY-05`, `PRIVACY-08`, `PRIVACY-11`; `PRINT-01`; `ACCESSIBILITY-01` to `ACCESSIBILITY-20`.
- **Acceptance criteria:** Contains no score, diagnosis, predicted outcome, label of communication quality, medical advice, or treatment advice.

## 6. Storage, states, print, and error copy

- **Storage model:** Session-only. No local save and no account save.
- **Save behavior:** Not supported in this prototype.
- **Print behavior:** Not supported in this prototype.
- **Export behavior:** Not supported in this prototype.
- **Automatic draft saving:** Not supported in this prototype.
- **Direct message sending:** Not supported in this prototype.
- **AI Tutor transfer:** Not supported in this prototype.
- **Returning within the same session:** “Your conversation preparation is still open in this session. It has not been saved to your account.”
- **Returning after the session ended:** “No previous draft is stored. Start with the situation you want to prepare for now.”
- **Reset confirmation:** “Clear this conversation preparation? The scenario, choices, and draft will be removed from this session.” Actions: **Clear it** and **Keep my work**.
- **Session-ending warning `CG-T1-N04`:** “Leaving will clear this draft. Copy the preparation sheet first if you want to keep it.”
- **File export:** Not supported in this prototype.
- **Empty state:** “Choose a situation to begin. No health information is needed.”
- **Error state:** “This preparation step did not load. Your visible draft has been kept where possible. Try again or copy the text you can see.”
- **Observable acceptance criteria:** All twelve scenarios are complete; every supplied line has a distinct impact explanation; custom text is bounded and session-only; a learner can complete the tool at 320px, 200 percent zoom, keyboard-only, with a screen reader, and with reduced motion; print and export are unavailable; no message is sent.

# TOOL 2: KNOW THE PLAN

## 1. Tool metadata

- **Tool ID:** `CG-T2`
- **Public title:** Know the Plan
- **Purpose:** Help a supporter organize where clinician-provided instructions are located, who should be contacted, what information was voluntarily shared, and what supporter role was agreed.
- **Audience need:** Existing instructions and contact pathways are scattered or unclear, but the supporter must not invent a care or emergency plan.
- **Intended use:** Record location pointers, sources, review dates, agreed nonclinical roles, boundaries, and professional handoff categories.
- **Explicit non-use:** Does not create a care plan, emergency plan, treatment instructions, thresholds, doses, medication changes, device training, legal authority, or an emergency decision engine. It does not import records, connect to apps, retrieve clinician messages, interpret readings, or verify training.
- **Emotional objective:** Move from “I need to know everything” to “I know where current professional guidance is, who owns it, and where my role stops.”
- **Estimated time:** 10 to 15 minutes for a first organizer; 3 to 5 minutes to review.
- **Medical-risk level:** High.
- **Data-sensitivity level:** High.
- **Review status:** Heightened qualified clinical review before external testing focused on medical or emergency use and before public release; also editorial, privacy, accessibility, cultural, emotional-safety, medication-safety, device-safety, and regional review.
- **Applicable global rules:** All shared rules, with particular application of `SCOPE-01` to `SCOPE-10`; `CONSENT-01` to `CONSENT-10`; `PRIVACY-01` to `PRIVACY-15`; `MEDICAL-01` to `MEDICAL-15`; `EMERGENCY-01` to `EMERGENCY-10`; `REGION-01` to `REGION-08`; `CONTENT-04` to `CONTENT-15`; `INTERACTION-01` to `INTERACTION-08`; `STORAGE-02`, `STORAGE-03`, `STORAGE-06`; `PRINT-01` to `PRINT-10`; `REVIEW-01` to `REVIEW-08`.

## 2. Visual identity

Use an open ready-folder or labeled-shelf metaphor. Four persistent text labels organize the space: **Where it is**, **Who to contact**, **My agreed role**, and **What not to attempt**. A thin review-date tab can move from current to needs review without red danger coding. The page should feel sparse and printable, with one open work surface rather than a dashboard or card grid.

Do not show medical values, medication schedules, glucose-entry fields, device-monitoring UI, simulations, urgent countdowns, red page fields, clinical intake styling, or dense spreadsheets. Module 4 language may identify general education, the person's clinician-created plan, and professional or emergency help, but this tool does not reproduce the module's educational sequence.

## 3. Entry, participation checkpoint, and exact copy

**Eyebrow:** PRACTICAL TOOL

**Title:** Know the Plan

**Introduction:** This organizer records where existing clinician-provided information can be found, who should be contacted, and what role the person has asked you to take. It does not create instructions or decide what to do in a specific medical situation.

**Authority notice `CG-T2-N01`:** “This is a reference organizer, not a care plan or emergency plan. Follow current clinician-provided instructions and appropriate professional or emergency guidance. Do not copy another person's plan or use this organizer to improvise treatment.”

**Privacy notice `CG-T2-N02`:** “You can use this tool without saving. If you choose Save on this device, the content stays in this browser on this device. It does not sync to another account or the AI Tutor. Another person using this device may be able to see it, and clearing browser data may remove it.”

**Estimated time:** About 10 to 15 minutes

**Primary action:** Check participation

**Secondary action:** Return to caregiver home

**Urgent action:** Someone may be in immediate danger

**Participation prompt:** “Has the person living with diabetes chosen to share the information you would record here?”

**Options and behavior:**

1. **We are completing this together.** Allow the full organizer. Feedback: “Record only what the person wants included. They can limit or change any item.”
2. **They explicitly shared this information with me.** Allow the full organizer. Feedback: “Record only what they clearly shared for this purpose. This selection is not permanent consent or identity verification.”
3. **I am preparing questions before asking.** Do not show sensitive fields. Open the preparation checklist. Feedback: “Prepare what to ask. Do not fill in answers on their behalf.”
4. **I do not have permission to record this information.** Do not open data entry. Feedback: “Do not create the organizer. You can prepare a respectful request without recording private information.” Actions: **Open What Should I Say?** and **Return to caregiver home**.

The participation selection is session-only and never appears in print, export, or saved content as legal proof.

## 4. Preparation checklist

**Title:** Questions to ask before creating an organizer

**Copy:** “Use these questions in a conversation. This checklist does not record answers.”

- “Would you like a supporter to know where your current clinician-provided plan is stored?”
- “Which contact roles, if any, may be recorded?”
- “What role would you want the supporter to take, and when?”
- “What should the supporter never attempt?”
- “Which documents or supplies may the supporter locate?”
- “How will you tell each other that information or permission has changed?”
- “When should the organizer be reviewed with you or a healthcare professional?”

Actions: **Copy questions** and **Open What Should I Say?** Copying is deliberate and follows the clipboard notice. No answers are stored.

## 5. Finalized fields

All free-text fields are optional unless marked otherwise. Text limits reduce accidental record copying. No field accepts attachments, readings, doses, full clinician messages, or imported records.

| Field ID | Exact label | Control, default, help, and validation |
| --- | --- | --- |
| `CG-T2-F01` | Purpose of this organizer | Read-only: “Locate existing professional instructions, contacts, and an agreed supporter role. This organizer does not create medical instructions.” |
| `CG-T2-F02` | Created or reviewed on | Date field; default today only after learner confirms; future dates invalid |
| `CG-T2-F03` | Region | Controlled region selector; default current configured region when available; never inferred silently |
| `CG-T2-F04` | Person label, optional | 1 to 60 characters; “Use a preferred first name, initials, or a neutral label. A legal name is not required.” |
| `CG-T2-F05` | Primary healthcare contact role | Choices: primary care, diabetes care, pharmacy, other professional role, not recorded; no person required |
| `CG-T2-F06` | How to reach that role | 0 to 160 characters; location or method only; “Record only what was voluntarily shared.” |
| `CG-T2-F07` | After-hours instructions are located | 0 to 160 characters; location pointer, not copied instructions |
| `CG-T2-F08` | Pharmacy contact, optional | 0 to 160 characters; may be left blank |
| `CG-T2-F09` | Emergency contact chosen by the person | 0 to 160 characters; not a substitute for regional emergency help |
| `CG-T2-F10` | Current clinician-created plan is located | 0 to 180 characters; “Prefer a location such as folder, portal section, or cabinet. Do not paste the plan.” |
| `CG-T2-F11` | Who provided the plan | Role or organization, 0 to 100 characters |
| `CG-T2-F12` | Plan last reviewed | Date or **Not known**; future dates invalid |
| `CG-T2-F13` | Permission to view the plan | Choices: Yes for the current agreed purpose; Ask first; No; Not discussed; default **Not discussed** |
| `CG-T2-F14` | If the plan cannot be found | Read-only: “Do not invent or copy another person's instructions. Contact an appropriate healthcare professional. If someone may be in immediate danger, use urgent help without delaying to search.” |
| `CG-T2-F15` | Agreed supporter role | Multi-select from F16 to F23; default none |
| `CG-T2-F16` | Call a chosen contact | Checkbox with optional context, 0 to 100 characters |
| `CG-T2-F17` | Bring the written plan | Checkbox; records role only |
| `CG-T2-F18` | Locate agreed supplies | Checkbox; optional location pointer, 0 to 120 characters |
| `CG-T2-F19` | Provide transportation | Checkbox; optional availability limit, 0 to 120 characters |
| `CG-T2-F20` | Take notes if requested | Checkbox |
| `CG-T2-F21` | Wait nearby | Checkbox |
| `CG-T2-F22` | Help communicate information the person approved | Checkbox; no health detail entry |
| `CG-T2-F23` | No role currently agreed | Exclusive checkbox; clears other roles after confirmation |
| `CG-T2-F24` | Existing instruction for this role is located | 0 to 180 characters; preferred pattern: “Follow the written clinician-provided instruction stored at [location]” |
| `CG-T2-F25` | Do not change medication | Preselected read-only boundary |
| `CG-T2-F26` | Do not interpret readings | Preselected read-only boundary |
| `CG-T2-F27` | Do not use another person's plan | Preselected read-only boundary |
| `CG-T2-F28` | Do not operate an unfamiliar device | Preselected read-only boundary |
| `CG-T2-F29` | Do not delay urgent help | Preselected read-only boundary |
| `CG-T2-F30` | Another boundary, optional | 0 to 160 characters; cannot contain treatment instructions |
| `CG-T2-F31` | Professional handoff categories | Checkboxes: observable change; when it began; what the person's plan says; contact already attempted; information approved for sharing. No current symptom or reading field. |
| `CG-T2-F32` | Supplies and documents locations | Repeatable labeled pointers: written plan, current device instructions, insurance card, identification, agreed supplies, contact list; 0 to 120 characters each |
| `CG-T2-F33` | Review next with | Choices: the person; appropriate healthcare professional; both; not scheduled |
| `CG-T2-F34` | Review date | Optional date; help: “Information may change before this date. A date does not make permission permanent.” |

Optional medication-name entry is not included in the default prototype. If later approved, it must be labeled optional, must never request a dose, and must allow a location pointer instead. Real symptoms and readings are not collected.

## 6. Complete interaction specifications

### `CG-T2-I01` Participation checkpoint

- **Learner-facing title:** Before you record anything
- **Purpose:** Prevent unilateral collection of private information.
- **Cognitive action:** Identify whether participation permits the organizer, only question preparation, or no data entry.
- **Information already known:** The organizer may contain sensitive information.
- **New work required:** Choose the truthful participation state.
- **Exact learner prompt:** “Has the person living with diabetes chosen to share the information you would record here?”
- **Exact controls, choices, or fields:** The four participation options above; **Continue** and **Return without recording**.
- **Defaults:** None.
- **Validation:** One selection required.
- **Response logic:** Full organizer for together/shared; checklist only for preparing; blocked entry for no permission.
- **Exact feedback for every meaningful state:** Exactly the four feedback strings in the entry section. Additional no-selection error: “Choose the option that describes this use. The tool cannot verify identity or permission.”
- **Required or optional:** Required before any organizer field.
- **Progression behavior:** Routes only; does not create or save consent.
- **Can responses be revised:** Yes; changing to preparation/no permission immediately hides fields and asks whether to clear unsaved field content.
- **Keyboard behavior:** Radio group and explicit submit.
- **Screen-reader behavior:** Destination explanation is announced before focus moves.
- **Mobile behavior:** Four stacked rows.
- **Reduced-motion behavior:** Immediate route change.
- **Data collected:** Participation state.
- **Data persisted:** Session-only; excluded from saved document.
- **Data shared:** None.
- **Reset behavior:** Clears checkpoint and all unsaved input after confirmation; saved document remains.
- **Error recovery:** Keeps selection.
- **Applicable global rules:** `CONSENT-01` to `CONSENT-10`; `PRIVACY-01`; `STORAGE-02`, `STORAGE-03`.
- **Acceptance criteria:** No sensitive field is in the DOM for blocked states; selection is not identity or legal verification.

### `CG-T2-I02` Prepare questions

- **Learner-facing title:** Prepare before asking
- **Purpose:** Support permission-seeking without collecting answers.
- **Cognitive action:** Select relevant questions to take into a later conversation.
- **Information already known:** Permission to record is absent or not yet clear.
- **New work required:** Identify which information areas would need discussion.
- **Exact learner prompt:** “Which questions would help clarify whether an organizer is wanted?”
- **Exact controls, choices, or fields:** Seven checklist questions; **Copy selected questions**, **Open What Should I Say?**, **Clear selection**.
- **Defaults:** None selected.
- **Validation:** At least one selection to copy.
- **Response logic:** Copies question text only.
- **Exact feedback for every meaningful state:** Selected: “These questions ask about permission, role, and location without filling in answers.” None: “Select at least one question to copy.” Copy success/failure uses shared clipboard status. Open tool: “Your checklist selection will clear when you leave this session.”
- **Required or optional:** Optional.
- **Progression behavior:** Does not unlock data fields; learner must restart checkpoint after actual participation.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Checkboxes.
- **Screen-reader behavior:** Selection count announced on request, not every change.
- **Mobile behavior:** Simple list.
- **Reduced-motion behavior:** Static.
- **Data collected:** Selected question IDs.
- **Data persisted:** Session-only.
- **Data shared:** None automatically; clipboard only by user action.
- **Reset behavior:** Clears selection.
- **Error recovery:** Manual text selection remains available.
- **Applicable global rules:** `CONSENT-09`; `PRIVACY-01` to `PRIVACY-05`; `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No answer fields, health values, or implied permission.

### `CG-T2-I03` Organize locations and contacts

- **Learner-facing title:** Put the existing information in reach
- **Purpose:** Organize pointers without duplicating medical content.
- **Cognitive action:** Sort voluntarily shared information into source, location, contact, and review status.
- **Information already known:** The tool cannot validate medical correctness.
- **New work required:** Enter or mark unknown for fields `CG-T2-F02` to `CG-T2-F14` and `CG-T2-F32` to `CG-T2-F34`.
- **Exact learner prompt:** “Record where current information can be found. Leave anything blank that was not shared.”
- **Exact controls, choices, or fields:** Listed fields; **Review locations**, **Save on this device**, **Continue without saving**.
- **Defaults:** Permission **Not discussed**; other fields blank except confirmed date/region.
- **Validation:** Dates not future; region must be chosen or marked unavailable; text limits; patterns resembling readings/doses trigger a warning and require removal.
- **Response logic:** Blank is valid. Old or unknown review dates generate “needs verification,” not invalid status.
- **Exact feedback for every meaningful state:** Complete pointer: “This records where information is, not what the instruction says.” Blank: “Blank means not recorded. Do not guess.” Old/unknown: “This information may need review. Do not assume an older plan is current.” Sensitive detail: “Replace copied medical detail with the location of the current official information.” Missing region: exact `CG-T2-N04` below.
- **Required or optional:** Optional fields; interaction may be partially completed.
- **Progression behavior:** No progress impact.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Landmark navigation by organizer section; repeatable location rows have add/remove buttons with names.
- **Screen-reader behavior:** Errors summarize and link to fields; save status announced.
- **Mobile behavior:** One section at a time with persistent text heading, not a wizard that locks prior sections.
- **Reduced-motion behavior:** Immediate section state.
- **Data collected:** Field values.
- **Data persisted:** Only after deliberate local save.
- **Data shared:** None.
- **Reset behavior:** Unsaved reset separate from saved deletion.
- **Error recovery:** Valid values persist after validation failure.
- **Applicable global rules:** `PRIVACY-01` to `PRIVACY-15`; `MEDICAL-01` to `MEDICAL-15`; `REGION-01` to `REGION-08`; `STORAGE-02`, `STORAGE-03`, `STORAGE-06`.
- **Acceptance criteria:** No field asks for symptoms, readings, doses, or full instructions; blank is always allowed.

### `CG-T2-I04` Clarify the agreed role and boundaries

- **Learner-facing title:** Mark the role, then mark its limit
- **Purpose:** Prevent a location organizer from becoming authority.
- **Cognitive action:** Pair each agreed role with its source, context, and boundary.
- **Information already known:** Possible nonclinical roles and universal “do not attempt” boundaries.
- **New work required:** Select only agreed roles and identify where related professional instructions live.
- **Exact learner prompt:** “Which role has the person clearly asked you to take?”
- **Exact controls, choices, or fields:** `CG-T2-F15` to `CG-T2-F30`; **Review my role**, **No role currently agreed**.
- **Defaults:** No role selected; five boundaries visible and preselected.
- **Validation:** “No role” is mutually exclusive; any role suggesting an instruction requires a location pointer or **Not recorded**; treatment-like custom boundary rejected.
- **Response logic:** A selected role is described as limited and revisable. Tool never confirms competence.
- **Exact feedback for every meaningful state:** Role selected: “This records a role, not authority to make medical decisions.” No role: “Knowing where information is can still be useful. Do not add a role that was not agreed.” Missing instruction source: “Record where the existing instruction is kept, or mark it not recorded. Do not write one here.” Device role attempt: “This tool cannot verify training or teach device operation.” Medication action attempt: “Do not record a dose or medication change. Use current clinician-provided and product-specific instructions.”
- **Required or optional:** Optional; no role is valid.
- **Progression behavior:** None.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Checkboxes with conditional fields placed immediately after each option.
- **Screen-reader behavior:** Exclusive clearing is announced and requires confirmation.
- **Mobile behavior:** Roles as labeled rows; universal boundaries follow in a separate section.
- **Reduced-motion behavior:** Conditional fields appear immediately.
- **Data collected:** Role and boundary values.
- **Data persisted:** Local only after deliberate save.
- **Data shared:** None.
- **Reset behavior:** Resets unsaved role choices only.
- **Error recovery:** Preserves valid roles.
- **Applicable global rules:** `AUTONOMY-01` to `AUTONOMY-06`; `MEDICAL-01` to `MEDICAL-15`; `CONSENT-06` to `CONSENT-10`.
- **Acceptance criteria:** A selected role never unlocks clinical actions or suggests qualification.

### `CG-T2-I05` Review currency and completeness

- **Learner-facing title:** Check what is current, missing, or not agreed
- **Purpose:** Make uncertainty visible before reliance.
- **Cognitive action:** Classify each organizer section as recorded, blank, needs verification, or not agreed.
- **Information already known:** Current entries and dates.
- **New work required:** Review every section and mark whether verification is needed.
- **Exact learner prompt:** “Which parts could someone mistakenly assume are current or complete?”
- **Exact controls, choices, or fields:** Review rows for purpose, contacts, plan location, role, boundaries, documents, review status; per-row **Reviewed**, **Needs verification**, **Leave blank**; **Finish review**.
- **Defaults:** Computed suggestions are not selected automatically.
- **Validation:** Every nonblank section requires a review choice before print/export; local save may remain partial.
- **Response logic:** Shows unresolved items prominently without danger colors.
- **Exact feedback for every meaningful state:** Reviewed: “You checked what the organizer says, not whether the medical content is correct.” Needs verification: “Keep this visibly unresolved until checked with the appropriate person or professional.” Blank: “Blank is safer than a guess.” Outdated: exact `CG-T2-N05`.
- **Required or optional:** Required only before print or export.
- **Progression behavior:** Enables preview when complete.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Each row is a fieldset.
- **Screen-reader behavior:** Summary announces counts by text.
- **Mobile behavior:** Stacked labeled groups.
- **Reduced-motion behavior:** Static status.
- **Data collected:** Review states.
- **Data persisted:** Local only after deliberate save.
- **Data shared:** None.
- **Reset behavior:** Clears review marks without deleting fields.
- **Error recovery:** Links directly to unreviewed row.
- **Applicable global rules:** `REGION-05`, `REGION-08`; `MEDICAL-02`; `PRINT-03`, `PRINT-05`, `PRINT-09`.
- **Acceptance criteria:** No “complete” label implies preparedness; unresolved items remain visible.

### `CG-T2-I06` Save, print, or export

- **Learner-facing title:** Choose what leaves this session
- **Purpose:** Make persistence and disclosure deliberate.
- **Cognitive action:** Compare local save, print, export, and continue-without-saving consequences.
- **Information already known:** Organizer content is sensitive and may be incomplete.
- **New work required:** Choose one output behavior after reviewing privacy.
- **Exact learner prompt:** “How, if at all, do you want to keep this organizer?”
- **Exact controls, choices, or fields:** **Save on this device**, **Preview print**, **Preview export**, **Continue without saving**, **Delete from this device**.
- **Defaults:** No action.
- **Validation:** Print/export requires completed `CG-T2-I05`; save permits partial content; regional missing/expired state must remain visible.
- **Response logic:** Save writes local content only after shared-device warning confirmation. Print/export opens a review preview before system dialog or file creation.
- **Exact feedback for every meaningful state:** Save success: “Saved on this device. It does not sync or create a backup.” Save failure: “Save failed. Your current entries remain open but are not stored.” Print ready: “Review the printer and every visible field. Cancel if the destination is shared.” Export ready: “The exported file may be copied, uploaded, or seen by others outside Health Decoded.” Continue: “Your entries will clear when the session ends.” Delete: “Deleted from this device. Printed, exported, copied, or backed-up versions are not removed.”
- **Required or optional:** Optional.
- **Progression behavior:** Does not affect module or section completion.
- **Can responses be revised:** Yes; exported copies do not update automatically.
- **Keyboard behavior:** Preview actions are buttons; focus moves to preview heading; cancel returns to triggering button.
- **Screen-reader behavior:** Save state is announced and always visible; preview has semantic document landmarks.
- **Mobile behavior:** Output actions stack; long preview becomes a continuous document.
- **Reduced-motion behavior:** Immediate preview.
- **Data collected:** Chosen output event; content itself excluded from analytics.
- **Data persisted:** Local organizer only after save; export only after confirmation.
- **Data shared:** Not by product; printing/exporting may expose it under user control.
- **Reset behavior:** Delete requires exact confirmation below.
- **Error recovery:** Failed output keeps organizer and offers retry/cancel; never reports success falsely.
- **Applicable global rules:** `PRIVACY-06` to `PRIVACY-15`; `STORAGE-02`, `STORAGE-03`, `STORAGE-06`; `PRINT-01` to `PRINT-10`; `ACCESSIBILITY-17`, `ACCESSIBILITY-18`.
- **Acceptance criteria:** No background save; preview always precedes export; failure is explicit; exported content excludes prohibited material.

## 7. Storage, save, conflict, and state specifications

### Exact notices

- **Shared-device warning `CG-T2-N03`:** “This device may be shared. Saving here can make names, contacts, and location details visible to another person who uses this browser. Save only if that is acceptable.”
- **Missing-region notice `CG-T2-N04`:** “Regional details are not available or current. You may save the organizer, but print and export will mark regional information as unverified. Do not substitute a guessed service or number.”
- **Outdated notice `CG-T2-N05`:** “This organizer may no longer reflect current instructions, contacts, or permission. Check it with the person living with diabetes and an appropriate healthcare professional before relying on it.”
- **Browser-storage notice `CG-T2-N06`:** “Browser clearing, private-browsing limits, device replacement, or storage restrictions may remove this local copy. Health Decoded does not keep a cloud backup.”
- **Print notice `CG-T2-N07`:** “Printed pages may expose private information. Check the printer, page range, and destination before continuing.”
- **Export notice `CG-T2-N08`:** “An exported file leaves this browser's local storage controls. Delete or protect copies according to your own device and sharing practices.”

### States and exact copy

- **First visit:** “No organizer is stored on this device. Check participation before recording anything.”
- **No permission:** “Do not create the organizer. Prepare a conversation instead.”
- **Preparing questions:** “You are preparing questions only. No private answers are being recorded.”
- **Blank organizer:** Status **Not saved**. “Start with what is known and voluntarily shared. Blank is valid.”
- **Partially completed:** “This organizer is incomplete. It can be saved as a draft, but unresolved parts must remain visible.”
- **Unsaved changes:** Status **Unsaved changes**. “Changes made after the last save are still only in this session.”
- **Saved:** Status **Saved on this device**. Include exact local date and time.
- **Save failed:** Status **Save failed**. “Do not close this page if you want to copy, print, export, or try saving again.”
- **Locally saved document found:** “A Know the Plan organizer saved on this device was last updated **[LOCAL_TIMESTAMP]**. Open it, start a separate local copy, or delete it.”
- **Returning:** “Review the last-updated and regional-verification dates before using this organizer.”
- **Outdated review date:** Use `CG-T2-N05`; actions **Review now** and **Keep marked outdated**.
- **Regional details missing:** Use `CG-T2-N04`; urgent fallback stays separately reachable.
- **Print preview:** “This preview organizes existing information. It does not create medical instructions.”
- **Export preview:** “Review every field before creating a file. Unresolved and unverified areas will remain marked.”
- **Reset confirmation:** “Reset unsaved changes? The open fields will return to the last locally saved version. The saved version will remain.”
- **Deletion confirmation:** “Delete the Know the Plan organizer from this browser on this device? Printed, exported, copied, or backed-up versions will not be deleted.” Actions **Delete from this device** and **Keep organizer**.
- **Deletion success:** Status **Deleted from this device**.
- **Conflicting local version:** “Two local copies have different update times. Health Decoded will not merge or overwrite them automatically.” Show exact timestamps; actions **Open [timestamp A]**, **Open [timestamp B]**, **Cancel**. Saving either as current requires a second confirmation.

### Local persistence model

One active organizer plus, only when conflict recovery requires it, one quarantined conflicting local copy. No background save. First save displays `CG-T2-N03` and `CG-T2-N06`. Later saves display status and timestamp. Local schema includes version, tool ID, content fields, review states, last-updated timestamp, region label, and regional verification date. It excludes participation answer, analytics IDs, progress, quiz results, reflections, AI Tutor history, Self-Check responses, readings, and medication doses.

Deletion removes the active and selected quarantined local organizer after confirmation. The product must not claim permanent deletion beyond browser storage it controls.

## 8. Print and export specification

**File-name pattern:** `care-reference-YYYY-MM-DD.pdf` for PDF export and `care-reference-YYYY-MM-DD.txt` or another approved accessible format. Never include diagnosis, full name, contact, or region in the filename.

**Print/export header:**

> Know the Plan  
> A reference to existing clinician-provided information  
> Person label: [optional]  
> Last updated: [date]  
> Region: [region or “Not verified”]  
> Regional information verified: [date or “Not verified”]

**Purpose statement:** “This document organizes where existing information is located, who may be contacted, and what supporter role is currently agreed. It does not create a care plan, emergency plan, medical instruction, or legal authority.”

**Included sections:** Contacts; clinician-created plan location; permission to view; agreed supporter role; instruction location; do-not-attempt boundaries; professional handoff categories; supplies and document locations; review status; unresolved or unverified items.

**Footer on every page:** “Private reference. Verify that this copy is current. Follow the person's current clinician-provided plan and appropriate professional or emergency guidance. Do not delay urgent help to complete this document.”

**Excluded:** Participation-gate answer, module progress, quiz results, reflections, AI Tutor history, Self-Check content, analytics, medical readings, doses, copied instructions, hidden fields, and deleted content.

Print uses real text, black or high-contrast text on white, semantic headings in exports that support them, page numbers, repeated document title, and page-break control. Links show meaningful text and, when useful on paper, a human-readable destination. Color is never the only marker. Blank and unresolved areas remain labeled. Preview and cancel always precede file generation.

## 9. Medical and safety boundaries

The organizer never decides which service to contact in an individual situation. A visible urgent route interrupts it. It may state where the person's current plan is located and that a role exists, but it does not copy clinical actions. It does not teach an untrained person to administer medication or operate a device. Current FDA-approved labeling or manufacturer instructions may be referenced by location, not rewritten. Missing information stays missing. Know the Plan requires the heightened clinical review in `REVIEW-01` and `REVIEW-02`.

## 10. Observable acceptance criteria

The tool remains distinct from Shared Support Plan; blocked participation states reveal no sensitive fields; no real readings, symptoms, doses, records, or treatment instructions are collected; all fields can be left blank; saving is deliberate and truthful; conflict handling never silently overwrites; every print/export contains purpose, privacy, region, verification, review, and authority language; urgent direction is available before data entry; and the complete flow works at required widths, zoom, keyboard, screen reader, and reduced motion.

# TOOL 3: CAREGIVER SELF-CHECK

## 1. Tool metadata

- **Tool ID:** `CG-T3`
- **Public title:** Caregiver Self-Check
- **Purpose:** Offer a private, nonclinical way for a supporter to notice patterns that may be adding pressure, becoming difficult to sustain, or narrowing the relationship.
- **Audience need:** The supporter senses strain but needs language for what is happening without receiving a diagnosis or score.
- **Intended use:** Answer optional descriptive questions, review up to two current patterns, choose a practical next step, and open support resources.
- **Explicit non-use:** Not a burnout, anxiety, depression, trauma, abuse, or crisis assessment. It does not calculate risk, compare caregivers, diagnose, notify anyone, recommend treatment, or infer emergency status from ordinary answers.
- **Emotional objective:** Move from undifferentiated guilt or exhaustion to one or two specific areas worth discussing or changing.
- **Estimated time:** 4 to 7 minutes.
- **Medical-risk level:** Moderate because urgent support and caregiver wellbeing resources are present.
- **Data-sensitivity level:** High emotional sensitivity.
- **Review status:** Editorial, privacy, accessibility, cultural, emotional-safety, caregiver-wellbeing, clinical-boundary, crisis-route, and regional review required.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-09`; `AUTONOMY-01` to `AUTONOMY-10`; `SUPPORT-01` to `SUPPORT-08`; `PRIVACY-01` to `PRIVACY-05`, `PRIVACY-08`, `PRIVACY-11`, `PRIVACY-12`; `CONTENT-05` to `CONTENT-20`; `INTERACTION-01` to `INTERACTION-08`; `FEEDBACK-01` to `FEEDBACK-08`; `REFLECTION-01` to `REFLECTION-07`; `MEDICAL-01` to `MEDICAL-04`, `MEDICAL-10`, `MEDICAL-14`; `EMERGENCY-01` to `EMERGENCY-10`; `REGION-01` to `REGION-08`; `STORAGE-01`, `STORAGE-06`; `PRINT-01`; `REVIEW-03` to `REVIEW-08`.

## 2. Visual identity

Use a quiet, unscored pattern surface. Six open areas sit on one broad desk: responsibility, checking, practical load, emotional load, recovery and ordinary life, and boundaries and backup. As answers accumulate, thin neutral strands connect related areas. More strands do not mean greater severity. No area fills, rises, turns red, or shows a numeric count to the learner.

Avoid cards, clinical charts, battery or fuel icons, risk colors, score dashboards, warning meters, progress rings, smiley scales, wellness gradients, screening-form styling, and celebratory result states. At mobile widths, the six areas become a labeled sequence. The result view names no more than two primary patterns and offers **Review all areas I answered**.

## 3. Entry experience and exact copy

**Eyebrow:** PRIVATE TOOL

**Title:** Caregiver Self-Check

**Purpose copy:** “This check can help you notice where responsibility, checking, practical work, worry, or lost recovery time may be concentrating. It gives no score and no diagnosis.”

**Nonclinical notice `CG-T3-N01`:** “This is not a mental health, burnout, relationship-safety, or crisis assessment. A result names a pattern worth noticing. It does not determine why the pattern exists or what care you need.”

**Privacy notice `CG-T3-N02`:** “Your answers stay in this browser session. They are not saved to your account, shared with the person you support, sent to the AI Tutor, printed, exported, copied, or used to notify anyone.”

**Session notice `CG-T3-N03`:** “Answers clear when this session ends or when you clear the tool. You may skip any question, choose Prefer not to answer, or leave at any time.”

**Estimated time:** About 4 to 7 minutes

**Primary action:** Start the Self-Check

**Secondary action:** Return to caregiver home

**Reset action:** Clear my responses

**Voluntary urgent route:** I need urgent support right now

**Urgent-route notice `CG-T3-N04`:** “The Self-Check cannot assess danger or crisis. If you or someone else may be in immediate danger, stop here and use the reviewed urgent help for your region. If you want immediate emotional support without completing the check, open the available crisis-support options for your region.”

No question answer triggers this route automatically.

## 4. Questions and response system

**Shared prompt:** “Thinking about the current support arrangement, which response is closest for you right now?”

**Response options:** **Not true for me right now**, **Sometimes true**, **Often true**, **Not sure**, **Prefer not to answer**.

The interface never displays or stores numerical values. **Skip this question** advances without an answer and is distinct from **Prefer not to answer**, which records only that the learner deliberately withheld a response for this session. Neither creates a warning or affects access.

### Responsibility beliefs

- **`CG-T3-Q01`:** “I feel responsible for decisions that belong to the other adult.”
- **`CG-T3-Q02`:** “Resting or stepping away can feel unsafe, even when no current agreement requires me to stay available.”
- **`CG-T3-Q03`:** “I worry that saying no to a request means I am causing harm.”

### Checking and monitoring

- **`CG-T3-Q04`:** “I send another message or ask again because waiting for a response is difficult.”
- **`CG-T3-Q05`:** “I feel pulled to check an app, device, medication, food choice, or routine beyond what was clearly agreed.”
- **`CG-T3-Q06`:** “I keep checking in the same way even after the agreement becomes unclear or changes.”

### Practical load

- **`CG-T3-Q07`:** “Rides, appointments, household tasks, supplies, or paperwork depend mostly on me.”
- **`CG-T3-Q08`:** “If I became unavailable, there is little or no backup for the tasks I currently handle.”

### Emotional load

- **`CG-T3-Q09`:** “I feel resentment or frustration building around the current arrangement.”
- **`CG-T3-Q10`:** “A disagreement about support easily becomes a disagreement about the whole relationship.”

### Recovery and ordinary life

- **`CG-T3-Q11`:** “Sleep, hobbies, time alone, work, school, or other relationships are being squeezed by the support arrangement.”
- **`CG-T3-Q12`:** “Many of our conversations now become diabetes check-ins, even when neither of us planned that.”

### Boundaries and support

- **`CG-T3-Q13`:** “I have difficulty stating what I can and cannot sustainably do.”
- **`CG-T3-Q14`:** “I do not have someone I can ask for practical backup without oversharing private health information.”
- **`CG-T3-Q15`:** “An agreement continues mostly because we have not found a clear way to revisit it.”

## 5. Descriptive pattern logic

Implementation may use internal boolean rules but may not expose weights, scores, totals, severity bands, rankings, or percentage completion. A pattern is eligible when at least two related items are answered **Often true**, or one is **Often true** and at least two related items are **Sometimes true**. **Not sure**, **Prefer not to answer**, and skipped items never count toward eligibility. No single answer surfaces a pattern. Ties use the pattern order below only for stable display, not clinical priority. Show no more than two primary patterns. **Review all areas I answered** may show descriptive area summaries without ranking.

### `CG-T3-R01` Responsibility may be spreading too far

- **Exact explanation:** “Your answers suggest that another adult's choices and your own availability may be blending together. Caring can include reliable help without making you responsible for decisions you do not own.”
- **May surface from:** `Q01`, `Q02`, `Q03`, and `Q13`.
- **Does not mean:** “This does not mean you care too much, caused the arrangement, or should withdraw support.”
- **Practical next step:** “Name one decision that belongs to the person and one action that belongs to you.”
- **Optional conversation prompt:** “I want to clarify what you decide and what help I can realistically offer.”
- **Related module/tool:** The Caregiver Matters Too; What Should I Say?
- **Resource category:** Caregiver support and boundary-planning resources.
- **Privacy reminder:** “This pattern remains in this session and is not shared.”

### `CG-T3-R02` Checking may be replacing an agreement

- **Exact explanation:** “Repeated messages or information checks may be carrying worry that has not been turned into a clear, current agreement. Repetition can add pressure even when each check sounds caring.”
- **May surface from:** `Q04`, `Q05`, `Q06`, and `Q02`.
- **Does not mean:** “This does not identify your motive or label you as controlling.”
- **Practical next step:** “Stop one unagreed check and ask what kind of contact, if any, is wanted.”
- **Optional conversation prompt:** “Does our current check-in still work for you, or should it change?”
- **Related module/tool:** Support Without Taking Over; What Should I Say?
- **Resource category:** Communication and digital-privacy resources.
- **Privacy reminder:** Standard result reminder.

### `CG-T3-R03` The practical arrangement may depend too heavily on you

- **Exact explanation:** “Several recurring tasks may have gathered around one person. A plan that fails when you are unavailable needs a smaller scope, a backup, or both.”
- **May surface from:** `Q07`, `Q08`, `Q14`, and `Q13`.
- **Does not mean:** “This does not determine which tasks should stop or require private information to be shared.”
- **Practical next step:** “Choose one task to reduce, move, or give a permission-limited backup.”
- **Optional conversation prompt:** “Which task needs another option if I cannot do it?”
- **Related module/tool:** The Caregiver Matters Too; Shared Support Plan.
- **Resource category:** Transportation, respite, community, and practical-support resources.
- **Privacy reminder:** Standard result reminder.

### `CG-T3-R04` Recovery and ordinary life may be shrinking

- **Exact explanation:** “The support arrangement may be taking space from sleep, work, interests, other relationships, or conversations that are not about diabetes. Preserving those parts of life is not the same as ignoring health.”
- **May surface from:** `Q11`, `Q12`, `Q02`, and `Q07`.
- **Does not mean:** “This is not a diagnosis of burnout or a measure of how severe your strain is.”
- **Practical next step:** “Protect one specific block of time or one ordinary conversation this week.”
- **Optional conversation prompt:** “Could we keep our next call about ordinary life unless you want something else?”
- **Related module/tool:** The Caregiver Matters Too; What Should I Say?
- **Resource category:** Caregiver wellbeing, peer support, and respite resources.
- **Privacy reminder:** Standard result reminder.

### `CG-T3-R05` Frustration may need a safer conversation

- **Exact explanation:** “Frustration or resentment may be signaling that an arrangement is unclear or difficult to sustain. Hiding it can let pressure build; using it as blame or leverage can make repair harder.”
- **May surface from:** `Q09`, `Q10`, `Q13`, and `Q15`.
- **Does not mean:** “This does not diagnose the relationship or decide who is right.”
- **Practical next step:** “Name the task or agreement that needs to change, rather than judging the person.”
- **Optional conversation prompt:** “This arrangement is becoming hard for me to sustain. Can we revisit this one part?”
- **Related module/tool:** The Caregiver Matters Too; What Should I Say?
- **Resource category:** Relationship communication and caregiver support resources.
- **Privacy reminder:** Standard result reminder.

### `CG-T3-R06` A boundary or backup may need review

- **Exact explanation:** “The current arrangement may be continuing without a clear way to pause it, change it, or involve appropriate backup. An agreement can be revisited before a review date and without anyone being at fault.”
- **May surface from:** `Q08`, `Q13`, `Q14`, and `Q15`.
- **Does not mean:** “This does not create authority to recruit someone or share health information.”
- **Practical next step:** “Choose one boundary or backup question to discuss.”
- **Optional conversation prompt:** “What should happen if either of us needs to pause this arrangement?”
- **Related module/tool:** The Caregiver Matters Too; Shared Support Plan.
- **Resource category:** Backup planning, caregiver navigation, and local support resources.
- **Privacy reminder:** Standard result reminder.

### No dominant pattern

**Title:** No single area stands out

**Copy:** “Your current answers do not form one clear pattern under this tool's descriptive rules. That is not a score or an all-clear. Review the areas you answered, return to a question, or leave without taking a next step.”

## 6. Complete interaction specifications

### `CG-T3-I01` Respond privately

- **Learner-facing title:** Notice what is true right now
- **Purpose:** Gather optional current descriptions without scoring.
- **Cognitive action:** Compare a statement with present experience.
- **Information already known:** There is no diagnosis or score.
- **New work required:** Respond, skip, or prefer not to answer.
- **Exact learner prompt:** Shared prompt plus each exact question.
- **Exact controls, choices, or fields:** Five response options; **Next question**, **Previous question**, **Skip this question**, **Leave the Self-Check**.
- **Defaults:** No response.
- **Validation:** None; skip always allowed.
- **Response logic:** Responses remain invisible in aggregate until the learner selects **See what may be worth noticing** after at least four answered questions. The learner may continue with fewer and receive an insufficiency state.
- **Exact feedback for every meaningful state:** Answered: no evaluative feedback, only “Response noted for this session.” Skipped: “Skipped. You can return before clearing the tool.” Prefer not: “Not answered. No explanation is needed.” Fewer than four answered: “There is not enough information to look for a pattern. You can answer more questions or review the areas yourself.” Partial: “You can see a descriptive result now or continue. Unanswered questions do not count against you.”
- **Required or optional:** Entirely optional.
- **Progression behavior:** No module or section progress.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Radio group; explicit next; no auto-advance.
- **Screen-reader behavior:** Question number is orientation only, not a score; selected response announced.
- **Mobile behavior:** One question visible with previous/next controls and a persistent area label.
- **Reduced-motion behavior:** Immediate question replacement; no slide.
- **Data collected:** Session responses and skip states.
- **Data persisted:** None beyond the current session.
- **Data shared:** None.
- **Reset behavior:** Exact confirmation below.
- **Error recovery:** Keeps already answered questions.
- **Applicable global rules:** `CONTENT-16` to `CONTENT-20`; `REFLECTION-01` to `REFLECTION-07`; `STORAGE-01`; `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No numbers, total, severity, comparison, or diagnosis is exposed.

### `CG-T3-I02` Review patterns

- **Learner-facing title:** What may be worth noticing
- **Purpose:** Convert responses into no more than two descriptive themes.
- **Cognitive action:** Compare surfaced themes with the areas answered and choose whether one is useful.
- **Information already known:** Pattern logic is descriptive and limited.
- **New work required:** Review one or two themes or the no-dominant-pattern state.
- **Exact learner prompt:** “Does either pattern name something useful to reconsider?”
- **Exact controls, choices, or fields:** Up to two `CG-T3-R` patterns; **Review all areas I answered**, **Return to one question**, **Open related module**, **Open What Should I Say?**, **View support resources**, **Clear my responses**.
- **Defaults:** No pattern selected as “mine.”
- **Validation:** None.
- **Response logic:** Eligible themes display by stable logic; no total or rank. Review-all groups answered statements by area using words only.
- **Exact feedback for every meaningful state:** Pattern useful: “You can use the suggested next step without accepting the pattern as a label.” Pattern not useful: “Set it aside. The tool cannot know the full context.” All areas: “This view organizes what you answered. It does not compare areas by severity.” No pattern: exact no-dominant copy.
- **Required or optional:** Optional.
- **Progression behavior:** None.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Result headings precede actions; returning restores focus to selected question.
- **Screen-reader behavior:** “Two patterns shown” or “No single pattern shown” announced without ranking.
- **Mobile behavior:** Results stack with related action immediately after each.
- **Reduced-motion behavior:** Static results.
- **Data collected:** Optional “useful/not useful” session flag only.
- **Data persisted:** None beyond the current session.
- **Data shared:** None.
- **Reset behavior:** Clears all responses and patterns.
- **Error recovery:** If logic fails, show area review without patterns: “A pattern could not be prepared. Your answers remain available in this session.”
- **Applicable global rules:** `CONTENT-16` to `CONTENT-20`; `FEEDBACK-01` to `FEEDBACK-08`; `PRIVACY-01` to `PRIVACY-05`.
- **Acceptance criteria:** No more than two themes; no single answer triggers a theme; all-area view is unscored.

### `CG-T3-I03` Choose support, not assessment

- **Learner-facing title:** Choose the kind of support you want
- **Purpose:** Offer voluntary resource routes without inferring need.
- **Cognitive action:** Select a resource category or urgent route.
- **Information already known:** The Self-Check cannot assess crisis.
- **New work required:** Choose among ordinary support, professional support, immediate emotional support, or emergency help.
- **Exact learner prompt:** “What kind of support are you looking for right now?”
- **Exact controls, choices, or fields:** **Practical caregiver resources**, **Caregiver peer or respite support**, **A healthcare professional for my own health**, **Immediate emotional support**, **Emergency help because someone may be in danger**, **Return to results**.
- **Defaults:** None.
- **Validation:** None.
- **Response logic:** Ordinary categories load controlled regional resources. Immediate emotional support loads reviewed crisis configuration. Emergency help activates shared urgent interruption. Missing data uses regional fallback.
- **Exact feedback for every meaningful state:** Practical: “These resources may help with transportation, backup, navigation, or respite. Availability varies.” Peer: “Peer support can offer shared experience, but it does not replace professional or emergency care.” Own health: “Contact an appropriate healthcare professional for guidance about your own health.” Emotional: “The Self-Check has not assessed your safety. Use the reviewed immediate-support options if you want help now.” Emergency: shared urgent copy. Missing: “Local support details are not available or current. Use an official local directory, an appropriate healthcare professional, or local emergency services as the situation requires.”
- **Required or optional:** Optional and reachable before questions.
- **Progression behavior:** None.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** List of links/buttons with explicit destinations.
- **Screen-reader behavior:** Urgent heading takes focus when selected.
- **Mobile behavior:** One-column links.
- **Reduced-motion behavior:** No progressive reveal for urgent content.
- **Data collected:** Category ID only if nonsensitive analytics are approved; never result or answer context.
- **Data persisted:** None.
- **Data shared:** None.
- **Reset behavior:** Resource navigation does not clear responses unless session ends.
- **Error recovery:** Safe fallback, never a guessed resource.
- **Applicable global rules:** `CONTENT-19`, `CONTENT-20`; `EMERGENCY-01` to `EMERGENCY-10`; `REGION-01` to `REGION-08`.
- **Acceptance criteria:** Ordinary answers never infer crisis; urgent and support routes are always directly available.

## 7. Storage, states, and unsupported behavior

- **Storage model:** Session-only.
- **Local save:** Not supported in this prototype.
- **Account save:** Not supported in this prototype.
- **Print:** Not supported in this prototype.
- **Export:** Not supported in this prototype.
- **Sharing:** Not supported in this prototype.
- **Clipboard copy of results:** Not supported in this prototype.
- **AI Tutor transfer:** Not supported in this prototype.
- **Background analytics of individual answers, patterns, or result actions:** Not supported in this prototype.
- **First visit:** “No answers are stored. Start only if private use on this device feels appropriate.”
- **Partially completed:** “Some questions are unanswered. You may continue, see whether a descriptive pattern is available, or leave.”
- **Result available:** “Up to two patterns are shown. They are not scores, diagnoses, or rankings.”
- **Returning in same session:** “Your answers are still open in this session. They have not been saved to your account.”
- **Returning after session:** “No previous Self-Check is stored.”
- **Reset confirmation:** “Clear all Self-Check responses and results from this session?” Actions **Clear responses** and **Keep responses**.
- **Clear success:** “Responses cleared. No result remains in this session.”
- **Session-ending warning:** “Leaving will clear your answers and results. This tool does not save, print, export, or copy them.”
- **Support-resource route:** Displays source, region, last verification date, and availability limitation.
- **Error state:** “The Self-Check could not prepare a pattern. This does not indicate a result. Review your answered areas, try again, or clear the tool.”

## 8. Observable acceptance criteria

There are 15 exact questions across six areas; every question can be skipped; no numerical values or totals are shown or persisted; no more than two patterns appear; no single answer triggers a result or outreach; urgent routes are voluntary and not inferred; results cannot be saved, printed, exported, shared, copied, or sent to AI; and the full experience works with keyboard, screen reader, reduced motion, 320px, and 200 percent zoom.

# TOOL 4: SHARED SUPPORT PLAN

## 1. Tool metadata

- **Tool ID:** `CG-T4`
- **Public title:** Shared Support Plan
- **Purpose:** Help the person living with diabetes and a chosen supporter record how support is currently wanted, what is not wanted, what information may be shared, and how each arrangement may change.
- **Audience need:** Everyday support preferences are assumed, scattered, or difficult to revisit.
- **Intended use:** Complete together, or record only choices explicitly supplied by the person living with diabetes; review and confirm each agreement area independently.
- **Explicit non-use:** Does not transfer medical or legal authority, create an advance directive, medical order, permanent consent, treatment instructions, legal signature, identity verification, account link, or unilateral supporter control. It does not include Self-Check results, module progress, reflections, readings, doses, or private AI history.
- **Emotional objective:** Move from one broad idea of “helping” to a set of current, independent, changeable preferences, including unresolved areas and supporter limits.
- **Estimated time:** 15 to 25 minutes initially; 5 to 10 minutes for a focused review.
- **Medical-risk level:** High because medication, appointments, devices, private information, and safety-plan locations appear within strict boundaries.
- **Data-sensitivity level:** High.
- **Review status:** Editorial, clinical-boundary, privacy, consent, accessibility, cultural, emotional-safety, legal-boundary, print/export, and regional review required.
- **Applicable global rules:** All shared rules, particularly `SCOPE-01` to `SCOPE-10`; `AUTONOMY-01` to `AUTONOMY-10`; `CONSENT-01` to `CONSENT-15`; `SUPPORT-01` to `SUPPORT-08`; `PRIVACY-01` to `PRIVACY-15`; `MEDICAL-01` to `MEDICAL-15`; `EMERGENCY-01` to `EMERGENCY-10`; `REGION-01` to `REGION-08`; `CONTENT-01` to `CONTENT-15`; `INTERACTION-01` to `INTERACTION-08`; `STORAGE-02` to `STORAGE-06`; `PRINT-01` to `PRINT-10`; `REVIEW-03` to `REVIEW-08`.

## 2. Visual identity

Use a shared planning table with twelve labeled areas along one open surface. The person living with diabetes is visually primary through first reading position, wording order, and confirmation control. The supporter remains visible through separate capacity and boundary controls. Unresolved areas remain open with a neutral outline and the text **Not agreed yet**. Agreement is not green; disagreement is not red.

Do not use legal paper, signatures, seals, locks, medical chart styling, compatibility scores, permanent consent banners, celebratory animation, or a card grid. Side-by-side perspectives are allowed only where DOM order reads the person living with diabetes first and mobile conversion remains clear. At 320px, every area becomes: preference prompt, person's choice, supporter capacity, current status, notes, review.

## 3. Entry experience and participation gate

**Eyebrow:** SHARED TOOL

**Title:** Shared Support Plan

**Introduction:** “Use this plan to record how everyday support is wanted now. Each area can be accepted, limited, left unresolved, changed, or withdrawn on its own.”

**Authority notice `CG-T4-N01`:** “The person living with diabetes remains the decision-maker. This plan does not create medical authority, legal authority, an advance directive, a medical order, or permanent consent. Saving, printing, or exporting does not increase its authority.”

**Privacy notice `CG-T4-N02`:** “You can use this tool without saving. If you deliberately save it, the plan stays in this browser on this device and does not sync to another account or the AI Tutor. Another person using this device may be able to see it. Printed and exported copies may be seen outside this device.”

**Consent notice `CG-T4-N03`:** “A preference applies only to the action, information, people, purpose, and situation described. It can be changed or withdrawn before any review date.”

**Estimated time:** About 15 to 25 minutes

**Primary action:** Check participation

**Secondary action:** Return to caregiver home

**Participation prompt:** “How is the person living with diabetes participating in this plan?”

1. **I am the person living with diabetes.** Allow full plan. Feedback: “Your choices lead each area. A supporter can state what they can offer, but cannot turn a declined action into permission.”
2. **We are completing this together.** Allow full plan. Feedback: “Review each area separately. Either person may pause, leave an area unresolved, or stop.”
3. **The person living with diabetes explicitly asked me to record their choices.** Allow full plan with a persistent reminder: “Record only preferences they clearly supplied. Do not interpret silence, a past yes, or general access as approval.”
4. **I am a supporter preparing for a future conversation.** Do not create a plan. Open the preparation worksheet.
5. **I do not have their participation or approval.** Do not create a plan. Feedback: “Do not record a Shared Support Plan without their participation or explicit approval.” Actions **Open What Should I Say?**, **Open Support Without Taking Over**, and **Return to caregiver home**.

The selection is session-only, not identity verification, legal proof, or a printed/exported field.

### Preparation worksheet

**Title:** Prepare questions, not a plan

**Copy:** “Choose areas you want to discuss. This worksheet records no answers and cannot be saved as a Shared Support Plan.”

Question pattern for each area: “Would you like to discuss how **[AREA]** should work, what should not happen, and how either person can change the arrangement?”

Actions: **Copy selected questions**, **Open What Should I Say?**, **Leave without creating a plan**. No health information fields appear.

## 4. Shared preference states and field behavior

Every preference defaults to **Not discussed**. Allowed states:

- **Support wanted:** The named support is wanted in the described context.
- **Ask first each time:** No action until permission is requested for that instance.
- **Not wanted:** Do not offer or perform this action unless the person later reopens it.
- **Depends on the situation:** Details must identify the context; without details, treat as **Needs discussion**.
- **Needs discussion:** No agreement or permission exists yet.
- **Not discussed:** The area has not been addressed and is not permission.

Each preference row contains:

1. **Person's current preference** with the states above.
2. **Supporter's capacity:** **I can offer this**, **I can offer this with limits**, **I cannot offer this**, **I need to check**, default **I need to check**.
3. **Context or wording, optional:** 0 to 240 characters.
4. **How this may change:** **Either person may ask to review**, always visible and not removable.
5. **Current status:** Computed as **Currently agreed**, **Not agreed yet**, **Declined by the person**, **Supporter unavailable**, or **Not discussed**. Computation never chooses who is right.

An area is **Currently agreed** only when the person's preference is **Support wanted** or a fully specified **Depends on the situation**, the supporter can offer it, and both independently mark that area reviewed in the confirmation view. **Ask first each time** is a current agreement only to ask, never permission to perform the action.

## 5. Agreement areas and exact content

### `CG-T4-A01` How to offer help

**Purpose copy:** “Agree on how offers should arrive and how no will be accepted.”

Preference rows:

- “Ask before helping”
- “Offer one specific action”
- “Preferred way to check in” with optional choices in person, call, text, another stated method
- “Times or settings to avoid”
- “After no, stop the offer without asking for a reason”

**Boundary copy:** “A polite offer can still become pressure when it repeats after no or silence.”

### `CG-T4-A02` Communication

**Purpose copy:** “Separate listening, practical help, advice, space, and repair.”

Preference rows:

- “Listen without adding advice”
- “Offer practical help”
- “Give advice only when requested”
- “Leave space without repeated questions”
- “Return to a paused conversation”
- “Words or topics to avoid, optional”
- “Preferred way to repair after an overstep”

**Boundary copy:** “The tool cannot predict how a sentence will be received. A request to pause remains valid even if the conversation feels unfinished.”

### `CG-T4-A03` Meals and groceries

**Purpose copy:** “Record household help without creating a meal plan or policing food.”

Preference rows:

- “Plan shared meals together”
- “Help with groceries from a list”
- “Discuss family or cultural food preferences privately”
- “Do not comment on another person's plate”
- “Discuss food privately rather than in front of others”
- “Review meal support when routines change”

**Fixed boundary:** “No food policing, meal prescription, moral labels, or guessed emergency treatment. Individual nutrition decisions belong with the person and qualified care team.”

### `CG-T4-A04` Movement and routines

**Purpose copy:** “Record invitations, company, transportation, or routine help without turning them into treatment.”

Preference rows:

- “Invite me to an ordinary activity”
- “Join me if I ask for company”
- “Offer transportation”
- “Help with a stated routine”
- “Do not prescribe exercise”
- “Do not pressure movement based on a reading”

**Fixed boundary:** “This plan does not prescribe activity or use movement to correct a reading or symptom.”

### `CG-T4-A05` Medication reminders

**Purpose copy:** “Record whether a reminder is wanted and the narrow context in which it applies.”

Preference choices:

- “No reminders”
- “Ask before any reminder”
- “One reminder is requested in the context below”
- “Needs discussion”
- “Not discussed”

Required when one reminder is requested:

- **Exact agreed context:** 1 to 160 characters; may describe ordinary context but must not include a dose.
- **How either person pauses or changes reminders:** 1 to 160 characters.

**Fixed boundary:** “A reminder does not authorize access to medication information, adherence tracking, dose entry, schedule changes, or handling medication. This plan records no dose.”

### `CG-T4-A06` Appointments

**Purpose copy:** “Attendance, transportation, and speaking are separate permissions.”

Preference rows:

- “Offer transportation”
- “Attend the appointment”
- “Wait nearby or outside”
- “Take notes if requested”
- “Speak only when the person asks”
- “Bring questions chosen by the person”
- “Share only the information approved below”
- “Permission may change in the room”

**Approved-information field:** Optional category labels only, 0 to 160 characters. Help: “Do not paste medical records or clinician messages.”

**Fixed boundary:** “Attendance does not authorize speaking. The person may change the supporter's role during the appointment.”

### `CG-T4-A07` Glucose, devices, and private health information

**Purpose copy:** “Record whether any access exists without entering readings.”

Preference choices:

- “No access”
- “Information is shared directly by the person when they choose”
- “Ask before each access or discussion”
- “A limited agreed alert exists”
- “A specific temporary agreement exists”
- “Needs discussion”
- “Not discussed”

For limited or temporary agreement, require:

- **What type of information or alert:** Category only, 1 to 120 characters; no reading.
- **Who may receive it:** 1 to 100 characters.
- **Purpose and situation:** 1 to 160 characters.
- **When it ends or is reviewed:** date or situation.
- **How to withdraw it:** 1 to 120 characters.

**Fixed boundary:** “No secret access, continuous surveillance, reading entry, or interpretation by this tool. Shared passwords or device access do not create permission.”

### `CG-T4-A08` Family and social privacy

**Purpose copy:** “Decide what may be shared, with whom, and where diabetes should not be discussed.”

Preference rows:

- “People who may know” with optional role/name labels
- “Information that may be shared”
- “Settings where diabetes should not be discussed”
- “No public comments about food, medication, readings, or appointments”
- “Family updates require specific permission”
- “At social gatherings, the person decides what to disclose”

**Fixed boundary:** “Family relationship, shared housing, or past disclosure does not create standing permission.”

### `CG-T4-A09` Practical responsibilities

**Purpose copy:** “Name concrete tasks and keep them within the supporter's real availability.”

Preference rows:

- “Rides”
- “Errands”
- “Supply pickup”
- “Household tasks”
- “Appointment logistics”
- “Backup supporter”

Each active task requires **What is included**, **What is not included**, **When it applies**, and **Backup if unavailable**, each 0 to 160 characters.

**Fixed boundary:** “No task assumes the supporter is always available. Share only the information a backup needs and the person has approved.”

### `CG-T4-A10` Supporter boundaries

**Purpose copy:** “Record what the supporter can offer without using help as leverage.”

Boundary rows:

- “Availability and work hours”
- “Transportation limits”
- “Financial limits”
- “Emotional availability”
- “Tasks I cannot perform”
- “When backup is needed”
- “How I will communicate a changed limit”

**Fixed boundary:** “A boundary states what the supporter will or will not do. It must not punish, threaten, or force a medical decision or disclosure.”

### `CG-T4-A11` When something feels wrong

**Purpose copy:** “Record where reviewed guidance is kept and who may be contacted. Do not create instructions here.”

Allowed fields:

- “Clinician-created plan is stored at”
- “Chosen contact role”
- “Supporter role currently agreed”
- “Regional information verified at”
- “Regional verification date”

**Fixed boundary:** “This area does not generate emergency instructions, doses, glucose thresholds, medical actions, or symptom interpretation. Do not delay urgent help to search for or finish the plan.”

### `CG-T4-A12` Review and change

**Purpose copy:** “Make every area changeable without turning a review date into an expiration or guarantee.”

Fields:

- “Plan last updated”
- “Suggested review date, optional”
- “How either person can request a change”
- “Areas to revisit first”

**Fixed statements:**

- “Preferences can change before the review date.”
- “Each area can change independently.”
- “Participation or approval may be withdrawn.”
- “An updated plan does not retroactively authorize a past action.”
- “Old printed or exported copies should be destroyed or clearly marked outdated.”

## 6. Disagreement and change behavior

- **Person selects Needs discussion:** Status **Not agreed yet**. Copy: “This area is not agreed yet. Do not treat it as permission. You may leave it unresolved and return later.”
- **The two people disagree:** “The plan will not choose who is correct or force a compromise. Record each limit, leave the area not agreed, or stop this area.” Actions **Leave unresolved**, **Return to the question**, **Stop this plan for now**.
- **Person declines proposed support:** Status **Declined by the person**. “Do not perform or repeat this proposed action. The person may reopen it later.”
- **Supporter cannot provide requested help:** Status **Supporter unavailable**. “The request does not require the supporter to agree. Consider a smaller task, approved backup, or leave it unresolved.”
- **Boundary changes:** “This boundary changed on **[date]**. Review affected areas. The prior version should not be treated as current.”
- **Recurring arrangement paused:** Status **Paused, not permission**. “Do not continue the arrangement until a new agreement is recorded.”
- **One person wants to stop:** “Stop here. No one must finish the plan. Unsaved entries can be cleared; saved content remains only if the user deliberately saves it.”
- **Plan remains incomplete:** “An incomplete plan can be saved as a draft. Blank, not discussed, and needs discussion areas remain visibly unresolved.”

Disagreement never blocks urgent help.

## 7. Complete interaction specifications

### `CG-T4-I01` Participation gate

- **Learner-facing title:** Confirm how the person is participating
- **Purpose:** Prevent a supporter-created plan from being presented as shared.
- **Cognitive action:** Identify participation, preparation, or lack of approval.
- **Information already known:** A Shared Support Plan requires direct participation or explicit approval.
- **New work required:** Select the truthful participation state.
- **Exact learner prompt:** “How is the person living with diabetes participating in this plan?”
- **Exact controls, choices, or fields:** Five options above; **Continue**, **Leave without creating a plan**.
- **Defaults:** None.
- **Validation:** One selection required.
- **Response logic:** Full plan for first three; worksheet for preparation; blocked plan for no approval.
- **Exact feedback for every meaningful state:** Exactly the five feedback strings in the participation section; no selection: “Choose the current participation state. This tool cannot verify identity, consent, or legal authority.”
- **Required or optional:** Required before plan creation.
- **Progression behavior:** Routing only; gate answer never becomes saved evidence.
- **Can responses be revised:** Yes. Downgrading participation hides plan fields and requires a choice to clear or return.
- **Keyboard behavior:** Radio group.
- **Screen-reader behavior:** Route and authority limitation announced.
- **Mobile behavior:** Stacked options.
- **Reduced-motion behavior:** Immediate route.
- **Data collected:** Participation-gate state.
- **Data persisted:** Session-only; never printed or exported.
- **Data shared:** None.
- **Reset behavior:** Clears gate and unsaved content after confirmation.
- **Error recovery:** Preserves selection.
- **Applicable global rules:** `CONSENT-11` to `CONSENT-15`; `STORAGE-04`, `STORAGE-05`; `PRIVACY-01`.
- **Acceptance criteria:** Plan controls do not load for preparation or no-approval states.

### `CG-T4-I02` Prepare a future conversation

- **Learner-facing title:** Choose what to discuss
- **Purpose:** Help a supporter prepare without drafting answers.
- **Cognitive action:** Select agreement areas needing a conversation.
- **Information already known:** The supporter cannot create the plan alone.
- **New work required:** Choose topics and copy neutral questions.
- **Exact learner prompt:** “Which areas would you like to ask about?”
- **Exact controls, choices, or fields:** Twelve area labels; **Copy selected questions**, **Open What Should I Say?**, **Clear selection**.
- **Defaults:** None.
- **Validation:** One area required to copy.
- **Response logic:** Copies question pattern and authority reminder only.
- **Exact feedback for every meaningful state:** Selected: “These are conversation questions, not recorded preferences.” None: “Select at least one area.” Copy success/failure uses shared clipboard copy.
- **Required or optional:** Optional.
- **Progression behavior:** Does not unlock plan.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Checkboxes.
- **Screen-reader behavior:** Count and copied status announced.
- **Mobile behavior:** Simple list.
- **Reduced-motion behavior:** Static.
- **Data collected:** Selected area IDs.
- **Data persisted:** Session-only.
- **Data shared:** None automatically; copied only by user action.
- **Reset behavior:** Clears worksheet.
- **Error recovery:** Manual selection available.
- **Applicable global rules:** `CONSENT-09`, `CONSENT-11`, `CONSENT-12`; `PRIVACY-01` to `PRIVACY-05`.
- **Acceptance criteria:** No preference values or person data appear.

### `CG-T4-I03` Set one area's current preferences

- **Learner-facing title:** Work through one area
- **Purpose:** Record the person's preference and supporter's capacity independently.
- **Cognitive action:** Compare desired support, permission boundary, context, and capacity.
- **Information already known:** All preferences default to Not discussed and can change.
- **New work required:** Complete or intentionally leave one area unresolved.
- **Exact learner prompt:** “What is wanted in this area now, and what can the supporter actually offer?”
- **Exact controls, choices, or fields:** Area-specific rows; shared preference states; supporter capacity; context; **Save area as draft**, **Leave unresolved**, **Review this area**.
- **Defaults:** Person **Not discussed**; supporter **I need to check**.
- **Validation:** Situation-specific choice requires context; no dose/reading; limited data access requires recipient, purpose, end/review, and withdrawal; medication reminder requires context/change language; active task requires scope and limit.
- **Response logic:** Computes textual status. A decline overrides a proposed supporter action. Supporter unavailable prevents “Currently agreed.” Ask-first yields agreement only to ask.
- **Exact feedback for every meaningful state:** Support wanted + capacity: “This may become a current agreement after both people review this area.” Ask first: “The agreement is to ask. It is not permission to act before an answer.” Not wanted: “Do not perform or repeat this action unless the person reopens it.” Situation-specific complete: “This applies only in the context written here.” Situation-specific incomplete: “Without a clear context, treat this as Needs discussion.” Needs discussion: exact unresolved copy. Supporter cannot: “A requested action is not an obligation. Leave it unresolved or discuss another option.” Medical detail: “Remove readings, doses, or treatment instructions. Record a preference or location instead.”
- **Required or optional:** Every area optional; at least one may be worked for meaningful tool use.
- **Progression behavior:** No learning progress; supports plan review.
- **Can responses be revised:** Yes, individually.
- **Keyboard behavior:** Each preference row is a fieldset; conditional fields follow trigger.
- **Screen-reader behavior:** Computed status announced after explicit **Review this area**, not each keystroke.
- **Mobile behavior:** Person choice first, supporter capacity second, status third.
- **Reduced-motion behavior:** Immediate status.
- **Data collected:** Preference, capacity, context, status.
- **Data persisted:** Only after deliberate local save.
- **Data shared:** None by product.
- **Reset behavior:** Reset one unsaved area or all unsaved changes; saved deletion separate.
- **Error recovery:** Preserves valid fields and links to errors.
- **Applicable global rules:** `AUTONOMY-01` to `AUTONOMY-10`; `CONSENT-01` to `CONSENT-15`; `SUPPORT-01` to `SUPPORT-08`; `MEDICAL-01` to `MEDICAL-15`.
- **Acceptance criteria:** The person living with diabetes remains first in reading and logic; unresolved is valid; no state implies standing authority.

### `CG-T4-I04` Handle disagreement or change

- **Learner-facing title:** Leave room for a real disagreement
- **Purpose:** Prevent forced compromise and silent overwrite.
- **Cognitive action:** Choose whether to leave unresolved, narrow scope, record a limit, pause, or stop.
- **Information already known:** Current person preference and supporter capacity conflict or changed.
- **New work required:** Choose an honest status without declaring a winner.
- **Exact learner prompt:** “There is no current agreement in this area. What should the plan record?”
- **Exact controls, choices, or fields:** **Leave unresolved**, **Narrow the proposed action**, **Record the supporter limit**, **Pause a recurring arrangement**, **Stop this area**, **Stop the plan for now**.
- **Defaults:** Leave unresolved is visually first but not preselected.
- **Validation:** Narrowed action returns to area fields; pause requires effective date but no explanation.
- **Response logic:** Never produces agreement without independent confirmation.
- **Exact feedback for every meaningful state:** Leave unresolved: exact unresolved copy. Narrow: “A smaller proposal still requires the person's choice and the supporter's capacity.” Limit: “A limit is recorded without changing the person's medical decision.” Pause: “The prior arrangement is paused and is not current permission.” Stop area: “This area remains Not discussed or Not agreed yet.” Stop plan: “No one must complete this plan.”
- **Required or optional:** Required only when learner tries to confirm conflicting values.
- **Progression behavior:** Returns to area or plan.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Radio group and submit.
- **Screen-reader behavior:** Conflict explanation and status announced without color terms.
- **Mobile behavior:** Stacked options.
- **Reduced-motion behavior:** Static.
- **Data collected:** Resolution status.
- **Data persisted:** Local only after deliberate save.
- **Data shared:** None.
- **Reset behavior:** Reverts to last saved status.
- **Error recovery:** Keeps both original perspectives.
- **Applicable global rules:** `AUTONOMY-02`, `AUTONOMY-04`, `AUTONOMY-06`; `CONSENT-07`, `CONSENT-13`, `CONSENT-14`; `FEEDBACK-01` to `FEEDBACK-08`.
- **Acceptance criteria:** Tool never chooses who is correct, forces compromise, or recodes disagreement as noncompliance.

### `CG-T4-I05` Confirm each area independently

- **Learner-facing title:** Review the plan one area at a time
- **Purpose:** Prevent one global checkbox from creating broad consent.
- **Cognitive action:** Verify the exact scope and status of each area.
- **Information already known:** Current values and unresolved states.
- **New work required:** Independently review every nonblank area.
- **Exact learner prompt:** “For each area, confirm that the visible status accurately records the current preference and supporter capacity.”
- **Exact controls, choices, or fields:** Per area: **Person's review: Accurate / Change it / Not reviewing now**; **Supporter's review: Accurate / Change it / Not reviewing now**; **Leave unresolved**. Participant labels adapt when the person records explicitly supplied choices: **Recorded as explicitly supplied** replaces simulated second-person confirmation, and status cannot imply joint live review.
- **Defaults:** No review selections.
- **Validation:** No global checkbox. Print/export may include unreviewed areas only if clearly marked **Not independently reviewed**. “Currently agreed” requires the applicable independent reviews defined above.
- **Response logic:** Computes final area status and last-reviewed timestamp.
- **Exact feedback for every meaningful state:** Both accurate: “This area records a current preference, not permanent consent.” One changes: “Return to this area. Do not treat the earlier wording as agreed.” Not reviewing: “This area remains unreviewed and should not be treated as permission.” Unresolved: standard unresolved copy. Explicitly supplied: “This records what the person asked you to enter. It does not verify identity or prevent them from changing it.”
- **Required or optional:** Required for an area to display **Currently agreed** and before unqualified print/export presentation.
- **Progression behavior:** Enables final preview; does not affect course completion.
- **Can responses be revised:** Yes.
- **Keyboard behavior:** Each area is a fieldset; summary links return to exact area.
- **Screen-reader behavior:** Area title, status, and each perspective announced in order.
- **Mobile behavior:** Sequential areas; no side-by-side dependency.
- **Reduced-motion behavior:** Immediate status.
- **Data collected:** Review selections and timestamps.
- **Data persisted:** Local only after save.
- **Data shared:** None.
- **Reset behavior:** Clears unsaved review selections.
- **Error recovery:** Review summary lists incomplete areas and preserves completed ones.
- **Applicable global rules:** `CONSENT-11` to `CONSENT-15`; `STORAGE-04`, `STORAGE-05`; `ACCESSIBILITY-01` to `ACCESSIBILITY-18`.
- **Acceptance criteria:** No single “agree to all”; each area remains independently revisable; print/save cannot increase authority.

### `CG-T4-I06` Save, print, or export the plan

- **Learner-facing title:** Review what this copy can and cannot do
- **Purpose:** Make persistence and disclosure deliberate without legal framing.
- **Cognitive action:** Compare local save, print, export, and no-save behavior.
- **Information already known:** Plan authority and privacy risks.
- **New work required:** Review all areas and choose an output.
- **Exact learner prompt:** “How, if at all, do you want to keep this current plan?”
- **Exact controls, choices, or fields:** **Save on this device**, **Preview print**, **Preview export**, **Continue without saving**, **Delete from this device**.
- **Defaults:** No action.
- **Validation:** Review view must show every area. Unresolved, Not discussed, and unreviewed areas remain permitted but explicitly marked.
- **Response logic:** First save requires shared-device and browser-storage confirmation. Print/export requires preview and current-copy confirmation.
- **Exact feedback for every meaningful state:** Save success: “Plan updated. Saved on this device at **[timestamp]**. It remains changeable and does not sync.” Save failure: “Save failed. The open plan has not been stored.” Print: “A printed copy may become outdated immediately if a preference changes.” Export: “An exported copy does not update when this plan changes.” No save: “The open plan will clear when this session ends.” Delete: “Deleted from this device. Other copies are not removed.”
- **Required or optional:** Optional.
- **Progression behavior:** Successful changed save may set the tool-only state **Plan updated**. Tool remains optional for section completion.
- **Can responses be revised:** Yes; older outputs do not update.
- **Keyboard behavior:** Preview focus management as `CG-T2-I06`.
- **Screen-reader behavior:** Authority, unresolved count, region, and save state announced.
- **Mobile behavior:** Continuous preview and stacked actions.
- **Reduced-motion behavior:** Immediate preview.
- **Data collected:** Output event; no content analytics.
- **Data persisted:** Plan only after save; file only after export.
- **Data shared:** None automatically.
- **Reset behavior:** Separate unsaved reset and saved deletion.
- **Error recovery:** Keeps plan and reports failure truthfully.
- **Applicable global rules:** `PRIVACY-06` to `PRIVACY-15`; `CONSENT-15`; `PROGRESS-06`; `STORAGE-02` to `STORAGE-06`; `PRINT-01` to `PRINT-10`.
- **Acceptance criteria:** Saving/printing/exporting never changes permission or status; all unresolved areas remain visible.

## 8. Final confirmation language

Displayed before save, print, or export:

**Heading:** Current preferences, not permanent authority

**Copy:** “Review every area before keeping a copy. Preferences apply only as written and may be changed or withdrawn. The person living with diabetes remains the decision-maker. The supporter may also change what they can offer. This plan does not create medical authority, legal authority, an advance directive, a medical order, or permanent consent. Saving, printing, or exporting does not increase its authority. Revisit the plan whenever circumstances or preferences change, even before the suggested review date.”

There is no digital signature. Participant labels are optional and use preferred first name, initials, relationship label, or neutral label. No legal name is required.

## 9. Storage, save, conflict, and exact states

### Notices

- **Shared-device warning `CG-T4-N04`:** “This plan may contain names, boundaries, and private preferences. Another person who uses this browser may be able to see a locally saved copy.”
- **Unresolved notice `CG-T4-N05`:** “Unresolved means no agreement. Do not treat it as permission.”
- **Outdated notice `CG-T4-N06`:** “This copy may no longer reflect current preferences. Check with the person living with diabetes before relying on it. Do not use an older copy when a newer preference has been stated.”
- **Regional notice `CG-T4-N07`:** “Regional safety details are missing, expired, or unverified. This plan does not replace local emergency or professional guidance.”
- **Print notice `CG-T4-N08`:** “Check the printer and every page. Printed copies may be seen by others and do not update when preferences change.”
- **Export notice `CG-T4-N09`:** “The file may be copied or uploaded outside Health Decoded. It remains a record of preferences at one time, not ongoing authority.”

### Exact states

- **First visit:** “No Shared Support Plan is stored on this device. Confirm participation before beginning.”
- **Participation not confirmed:** “Plan fields are unavailable until direct participation or explicit approval is present.”
- **Blank plan:** Status **Not saved**. “Every area begins Not discussed. Not discussed is not permission.”
- **Partially completed:** “Some areas remain Not discussed, Needs discussion, or unreviewed. They will stay visibly unresolved.”
- **Unresolved areas:** “There are **[count]** unresolved areas. The plan can remain incomplete.”
- **Unsaved changes:** Status **Unsaved changes**.
- **Saved:** Status **Saved on this device** and exact timestamp.
- **Save failure:** Status **Save failed**. “Keep this page open to try again, print, export, or continue without saving.”
- **Saved plan found:** “A Shared Support Plan saved on this device was last updated **[timestamp]**. Review whether it is still current before opening.”
- **Plan updated:** Approved progress label **Plan updated** only after a deliberate changed save succeeds.
- **Outdated plan:** Use `CG-T4-N06`; actions **Review now**, **Open marked outdated**, **Delete from this device**.
- **Review date reached:** “The suggested review date has arrived. Preferences may already have changed. Review each relevant area; do not assume permission continued until today.”
- **Reset:** “Reset unsaved changes to the last saved version? This will not delete the saved plan.”
- **Delete:** “Delete this Shared Support Plan from this browser on this device? Printed, exported, copied, or backed-up versions will not be deleted.”
- **Print preview:** Shows all areas, including blank and unresolved.
- **Export preview:** Shows all included content and exclusions before creation.
- **Browser-storage warning:** Same meaning as shared Know the Plan behavior.
- **Returning:** “Start by checking what changed, not by assuming the saved plan remains current.”
- **Conflicting local version:** “Two local plans have different update times. Health Decoded will not merge or overwrite them automatically.” Show both timestamps and optional neutral participant labels; actions **Open older copy**, **Open newer copy**, **Cancel**. “Older/newer” describes timestamp only, not correctness.
- **Regional details missing:** Use `CG-T4-N07` and controlled fallback.

### Persistence model

One active local plan plus one quarantined conflict copy when needed. No autosave, cloud sync, cross-account sync, hidden merge, or account linking. Save schema contains tool/version ID, optional participant labels, area values/statuses, independent review states, last-updated and review dates, region and verification date. It excludes gate answer as proof, readings, doses, medical records, module progress, quizzes, reflections, AI history, Self-Check results, analytics IDs, and deleted content.

## 10. Print and export behavior

**Privacy-preserving filename:** `shared-support-preferences-YYYY-MM-DD.pdf` or approved accessible equivalent. No name, diagnosis, region, or relationship in filename.

**Document header:**

> Shared Support Plan  
> Current preferences for everyday support  
> Person living with diabetes: [optional label]  
> Supporter: [optional label]  
> Last updated: [date and local time]  
> Suggested review date: [date or “Not set”]  
> Region: [label or “Not verified”]  
> Regional information verified: [date or “Not verified”]

**Purpose statement:** “This document records current, revisable support preferences. It does not create medical or legal authority, an advance directive, a medical order, permanent consent, or treatment instructions.”

Include all twelve agreement areas; exact preference and capacity; context; current status; independent review state; unresolved areas clearly labeled; privacy reminder; current-preferences reminder; region and verification; last updated and review date.

Exclude module progress, quiz results, reflections, AI Tutor history, Self-Check responses, analytics, participation gate as proof, medical values, doses, readings, hidden fields, and internal scoring or logic.

**Outdated-copy notice on every page:** “This copy may no longer reflect current preferences. Check with the person living with diabetes before relying on it. A newer verbal or recorded preference replaces this copy for the relevant action.”

**Footer:** “Private, nonmedical, and nonlegal support reference. Consent may be withdrawn. Saving or printing does not increase this document's authority.”

Print/export uses real text, semantic headings where supported, page numbers, repeating document title, clear area boundaries without relying on color, and controlled page breaks. Preview and cancel precede output. Old exported copies are never silently overwritten.

## 11. Medical, privacy, and authority boundaries

The plan contains no treatment content, meal plan, exercise prescription, medication dose, glucose reading, symptom interpretation, device operation, or emergency instruction. `CG-T4-A11` records only locations, contacts, role, region, and verification. The urgent route interrupts normal flow. Health Decoded does not verify identity, legal authority, capacity, training, safety, or correctness of entered information. The plan cannot create permission from silence, co-residence, family role, shared password, previous access, print, export, or save.

## 12. Observable acceptance criteria

All twelve areas exist with exact defaults and boundaries; participation or explicit approval is required before fields load; each area is independently reviewable and changeable; no global agreement checkbox or signature exists; disagreement remains unresolved without red/green coding; person preference precedes supporter capacity in logic and reading order; local save is deliberate and reversible; conflicts never silently merge; print/export carries all authority and outdated notices; and every function works at required widths, zoom, keyboard, screen reader, and reduced motion.

# FINAL CAREGIVER COMPLETION EXPERIENCE

## 1. Experience metadata

- **Experience ID:** `CG-COMPLETE`
- **Entry requirement:** All five modules are Completed under the corrected module-completion interpretation recorded in `CG-TOOL-ISSUE-001`, and one personal next-step category is selected.
- **Tools:** Optional. No tool opening, completion, save, print, or export is required.
- **Explicitly not required:** Quiz score, reflection, saved plan, printed document, account sharing, patient approval, learner medical review, or certification.
- **Purpose:** Quietly consolidate what was practiced, keep autonomy and limits visible, and record one current next-step category.
- **Emotional objective:** Move from a finish-line expectation to one practical, revisable action.
- **Medical-risk level:** Moderate because one option references clinician-created plan location and professional boundaries.
- **Data sensitivity:** Low for category; optional custom detail is private and session-only.
- **Review status:** Editorial, clinical-boundary, privacy, accessibility, cultural, and emotional-safety review required.
- **Applicable global rules:** `SCOPE-01` to `SCOPE-05`; `AUTONOMY-01` to `AUTONOMY-10`; `CONSENT-01` to `CONSENT-10`; `SUPPORT-01` to `SUPPORT-08`; `PRIVACY-01` to `PRIVACY-05`; `MEDICAL-01` to `MEDICAL-15`; `CONTENT-05` to `CONTENT-15`; `PROGRESS-01` to `PROGRESS-08`; `VISUAL-01` to `VISUAL-10`; `MOTION-01` to `MOTION-08`; `RESPONSIVE-01` to `RESPONSIVE-09`; `ACCESSIBILITY-01` to `ACCESSIBILITY-20`.

## 2. Visual identity

Use an open-path metaphor: five thin learned paths return to one shared table or open route, where one movable text marker holds the current next step. There is no end point. A small **Change next step** action makes revision visible.

Avoid finish lines, medals, certificates, mastery scores, completion rings, trophies, confetti, fireworks, glowing badges, or sacrifice imagery. Completion motion, if present, is one 250 to 400 millisecond path convergence that does not imply success. Reduced motion displays the final arrangement immediately.

## 3. Complete learner-facing copy

**Eyebrow:** FIVE MODULES REVIEWED

**Heading:** Keep one next step in view.

**Summary:** “You practiced noticing before interpreting, asking permission, offering practical help, using existing professional guidance, and keeping support sustainable. These ideas remain useful only when they respond to the person and situation in front of you.”

**What was practiced:**

- “Stay uncertain about what another person's reaction means.”
- “Separate offered support from pressure, monitoring, and assumed access.”
- “Make help specific and easy to decline.”
- “Use the person's current clinician-created plan and appropriate professional or emergency help without improvising treatment.”
- “State supporter limits and build backup without using help as leverage.”

**What completion does not mean:** “Completed records participation. It does not mean you are medically trained, prepared for every emergency, responsible for another adult's decisions, or guaranteed to communicate well. Support preferences and circumstances can change.”

**Next-step heading:** “What is one current next step?”

**Chosen next-step label:** “Current next step”

**Change action:** Change next step

**Return action:** Return to a module

**Tools action:** Open practical tools

**Home action:** Return to caregiver home

**Revisit-later state:** “No next step is permanent. Return when the situation changes or when an agreement needs review.”

The screen never uses *Congratulations*, *You did it*, *Great work*, *You are now prepared*, *You are an amazing caregiver*, *Journey completed*, *mastered*, or *ready for anything*.

## 4. `CG-COMPLETE-I01` Select one current next step

- **Learner-facing title:** Choose one current next step
- **Purpose:** Convert broad learning into one bounded action without collecting private detail.
- **Cognitive action:** Select the type of action most relevant now.
- **Information already known:** Completion is participation, not competence; preferences change.
- **New work required:** Choose one category and optionally phrase a private detail.
- **Exact learner prompt:** “Which kind of next step fits what is happening now?”
- **Exact controls, choices, or fields:**
  1. **Ask permission for one conversation.**
  2. **Clarify one practical support task.**
  3. **Locate the clinician-created plan, if the person has shared it.**
  4. **Set or revise one supporter boundary.**
  5. **Ask about one approved backup option.**
  6. **Revisit one current support agreement.**
  7. **Open one practical tool.**
  8. **Choose another specific next step.**
  
  Optional field: **Private detail for this session, optional**, 0 to 160 characters. Help: “Do not enter readings, doses, medical records, or details you need saved. Only the category can be stored with your private progress.”
  
  Actions: **Keep this next step**, **Change choice**, **Skip for now and return to modules**.
- **Defaults:** No category and blank detail.
- **Validation:** One category is required to complete the caregiver section. Custom category requires a 3 to 80 character neutral label; optional detail never required.
- **Response logic:** Save category ID to private learner progress after deliberate submission. Keep custom text in session only. Do not send either to AI Tutor or another account.
- **Exact feedback for every meaningful state:**  
  Permission conversation: “Choose one topic and make no or not now a usable answer.”  
  Practical support: “Name one task, its limit, and whether it is actually wanted.”  
  Locate plan: “Record where the person's current clinician-created plan is kept only if they chose to share it. Do not copy or create instructions.”  
  Boundary: “State what you can offer or sustain. Do not make help conditional on a medical decision or disclosure.”  
  Backup: “Ask what backup is acceptable and what minimum information, if any, may be shared.”  
  Revisit agreement: “Treat the existing arrangement as changeable. An old yes does not settle the current question.”  
  Open tool: “Tools are optional. Choose the tool that fits the task, and review its privacy behavior before entering anything.”  
  Other: “Keep it specific, nonmedical, and within your role.”  
  No choice: “Choose one category to record a current next step. You may return to a module before choosing.”  
  Saved: “This category is now your current next step. It can be changed later. Any private detail remains only in this session.”
- **Required or optional:** Category required for caregiver-section completion; optional detail is optional and non-gating.
- **Progression behavior:** When all five modules are Completed and category save succeeds, caregiver section becomes Completed. If save fails, do not report completion.
- **Can responses be revised:** Yes. Changing the category updates private progress without erasing module completion.
- **Keyboard behavior:** Semantic radio group; optional field follows Other or may be opened for any choice; explicit submit; no auto-advance.
- **Screen-reader behavior:** On success, announce selected category, revise action, and noncredentialing completion meaning.
- **Mobile behavior:** Options are full-width ruled rows; no completion ring.
- **Reduced-motion behavior:** Immediate marker update.
- **Data collected:** Category ID and optional session text.
- **Data persisted:** Category ID only in private progress.
- **Data shared:** None; no AI Tutor or cross-account access.
- **Reset behavior:** **Clear current next step** removes category from section progress after confirmation but does not erase module completion. Exact copy: “Clear the current next-step category? The five module completion states will remain, but the caregiver section will no longer show Completed until another next step is selected.”
- **Error recovery:** “Your next step could not be saved, so the caregiver section has not been marked Completed. Your choice remains visible in this session. Try again or return without changing module progress.”
- **Applicable global rules:** `SCOPE-03`; `PRIVACY-01` to `PRIVACY-05`; `PROGRESS-01` to `PROGRESS-08`; `MEDICAL-01` to `MEDICAL-15`; `ACCESSIBILITY-01` to `ACCESSIBILITY-15`.
- **Acceptance criteria:** No praise, score, credential, tool requirement, or patient-outcome claim; only category persists; custom text remains session-only.

## 5. Completion states

- **Eligible, no next step:** “Five modules are completed. Choose one current next step when you want to complete this section.”
- **Completed:** “Completed. This records participation and one current next step, not medical competence.”
- **Next step changed:** “Current next step updated. Module completion is unchanged.”
- **Revisit:** “Marked to revisit. Completion is unchanged.”
- **Tool unopened:** No warning or incomplete indicator.
- **Save failure:** Exact `CG-COMPLETE-I01` recovery copy.
- **Returning:** “Your current next-step category is **[CATEGORY]**. Keep it, change it, return to a module, or open a tool.”
- **Print/export:** Not supported in this prototype.
- **Certificate/badge:** Not supported in this prototype.

# TOOL-WIDE SOURCE TABLE

All sources were checked on 2026-07-29. A source supports educational framing but does not validate final product wording, result logic, safety configuration, storage implementation, or accessibility behavior. All claims remain `not-reviewed`.

| Claim ID | Educational claim | Source | Publication or review date | Exact tool location | Uncertainty or limitation | Required review | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CG-TOOL-CLAIM-001` | Support should begin by asking and listening; reminders or assistance may or may not be wanted, and needs can change. | [CDC, Helping Friends and Family With Diabetes](https://www.cdc.gov/diabetes/caring/index.html) | 2024-05-15 | `CG-T1`, `CG-T4-A01`, `CG-T4-A02` | General public guidance; does not define consent law or validate exact scripts | Editorial, clinical-boundary, cultural | not-reviewed |
| `CG-TOOL-CLAIM-002` | Diabetes management and treatment plans are individual; family support should not substitute generic assumptions for the person's plan. | [CDC, Helping Friends and Family With Diabetes](https://www.cdc.gov/diabetes/caring/index.html) | 2024-05-15 | `CG-T2` authority boundary; `CG-T4-A11` | High-level guidance; product still requires qualified clinical review | Qualified clinical, editorial | not-reviewed |
| `CG-TOOL-CLAIM-003` | Diabetes self-management education and support can provide practical skills and support across the course of diabetes. | [CDC, Living with Diabetes](https://www.cdc.gov/diabetes/living-with/index.html) | Page dated 2026-01-01 | `CG-T3-I03` and resource categories | Availability and eligibility vary; no outcome claim is made in tool | Clinical, regional-resource, editorial | not-reviewed |
| `CG-TOOL-CLAIM-004` | Current prescription medicine Instructions for Use may provide product-specific steps for patients or caregivers when use is detailed or complex. | [FDA, Frequently Asked Questions about Labeling for Prescription Medicines](https://www.fda.gov/drugs/fdas-labeling-resources-human-prescription-drugs/frequently-asked-questions-about-labeling-prescription-medicines) | 2024-04-01 | `CG-T2-F24`, `CG-T2-I04`, `CG-T4-A11` | Not every document has the same regulatory status; specific product labeling must be verified | Qualified clinical, medication-safety | not-reviewed |
| `CG-TOOL-CLAIM-005` | Diabetes-device users and caregivers should follow manufacturer instructions for device installation, setup, and updates. | [FDA, Diabetes Smartphone Device Alert Settings Safety Communication](https://www.fda.gov/medical-devices/safety-communications/fda-alerts-patients-regularly-check-diabetes-related-smartphone-device-alert-settings-especially) | 2025-02-05 | `CG-T2` device boundary; `CG-T4-A07` | Safety communication addresses specific smartphone-connected risks; does not authorize supporter access | Device-safety, clinical, privacy | not-reviewed |
| `CG-TOOL-CLAIM-006` | Preparedness includes keeping important paperwork, supplies, and prescriptions organized for emergencies. | [CDC, Diabetes Care During Emergencies](https://www.cdc.gov/diabetes/articles/diabetes-care-emergencies.html) | 2024-05-15 | `CG-T2-F32` | Disaster preparedness is broader than an individual acute event; tool does not create treatment instructions | Qualified clinical, emergency, editorial | not-reviewed |
| `CG-TOOL-CLAIM-007` | Shared decision-making keeps the patient in a leading role while incorporating evidence and professional expertise. | [AHRQ, About Shared Decision Making](https://www.ahrq.gov/sdm/about/index.html) | Accessed 2026-07-29 | `CG-T4` authority and confirmation; `CG-COMPLETE` | Clinical shared decision-making is not identical to an informal support plan; used only for autonomy framing | Clinical-boundary, autonomy, editorial | not-reviewed |
| `CG-TOOL-CLAIM-008` | Patients have control interests in personal health information, and health-information use and release require boundaries. | [HHS, Standards for Privacy of Individually Identifiable Health Information](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/standards-privacy-individually-identifiable-health-information/index.html) | 2013-07-26 | `CG-T1-SC06`, `CG-T1-SC07`, `CG-T2`, `CG-T4-A07`, `CG-T4-A08` | Health Decoded must not imply HIPAA applies directly to every informal supporter or to this product; this is ethical/product privacy framing, not legal advice | Privacy, legal-boundary, editorial | not-reviewed |
| `CG-TOOL-CLAIM-009` | Caregiver wellbeing can be supported by sleep, time away, social connection, and seeking help. | [National Institute on Aging, Taking Care of Yourself: Tips for Caregivers](https://www.nia.nih.gov/health/caregiving/taking-care-yourself-tips-caregivers) | 2023-10-12 | `CG-T3-Q11`, `CG-T3-R04`, resource categories | General caregiver guidance, often oriented to heavier care roles; does not validate a Self-Check or diagnose strain | Caregiver-wellbeing, emotional-safety, clinical-boundary | not-reviewed |
| `CG-TOOL-CLAIM-010` | Family caregiving can involve sustained practical and emotional strain. | [Schulz and Sherwood, Physical and Mental Health Effects of Family Caregiving](https://pmc.ncbi.nlm.nih.gov/articles/PMC2791523/) | 2008; accessed 2026-07-29 | `CG-T3` question domains and result explanations | Older review and not diabetes-specific; supports only broad strain domains, not algorithmic validity | Peer-review/methodology, emotional-safety | not-reviewed |
| `CG-TOOL-CLAIM-011` | The U.S. 988 Lifeline provides immediate crisis support by call, text, and chat; emergency danger requires emergency services. | [988 Suicide & Crisis Lifeline](https://988lifeline.org/), [988 Contact Guidance](https://988lifeline.org/contact-us/) | Accessed 2026-07-29 | `CG-T3-I03`; controlled U.S. crisis configuration | Availability, access modes, and language services require current regional verification; numbers must come from configuration, not curriculum copy | Crisis, regional, accessibility, clinical | not-reviewed |
| `CG-TOOL-CLAIM-012` | Remote family support may help with everyday tasks, but distance and worry do not determine what support is wanted. | [CDC, Helping a Loved One With Diabetes When You Live Far Away](https://www.cdc.gov/diabetes/caring/help-diabetes-when-you-live-apart.html) | 2024-05-15 | `CG-T1-SC01`, `CG-T1-SC08`, `CG-T3-R02` | CDC supports family involvement but does not specifically validate the product's surveillance boundary; that boundary follows approved consent/privacy rules | Editorial, privacy, cultural | not-reviewed |

# TOOL-WIDE REVIEW REQUIREMENTS

| Review ID | Scope | Required reviewer qualification or perspective | Must verify | Release gate | Status |
| --- | --- | --- | --- | --- | --- |
| `CG-TOOL-REV-001` | All `CG-T1-SC01` to `SC12` scenarios | Editorial plus adults living with Type 2 diabetes and varied supporters | Natural dialogue, ambiguity, no stereotypes, no reused module scenarios, no hidden medical advice | Before content lock | not-reviewed |
| `CG-TOOL-REV-002` | What Should I Say? medical/privacy boundaries | Qualified diabetes clinician and privacy reviewer | No adherence pressure, dose, interpretation, or unauthorized disclosure normalization | Before external testing | not-reviewed |
| `CG-TOOL-REV-003` | Know the Plan medical and emergency boundaries | Qualified diabetes clinician with emergency-content competence | Location-only approach, no instructions, no delay, product-specific labeling limits | Before medical/emergency testing and public release | not-reviewed |
| `CG-TOOL-REV-004` | Know the Plan local storage | Privacy and security reviewer with implementation evidence | Deliberate save, no hidden logs, conflict handling, deletion scope, truthful claims | Before external testing with real entries | not-reviewed |
| `CG-TOOL-REV-005` | Know the Plan print/export | Privacy, accessibility, clinical, and editorial reviewers | Required notices, exclusions, readable output, no copied instructions | Before enabling output | not-reviewed |
| `CG-TOOL-REV-006` | Self-Check questions `Q01` to `Q15` | Caregiver researcher/clinician, emotional-safety reviewer, and caregivers | Nonclinical wording, construct boundaries, no coercive assumptions, cultural range | Before external testing | not-reviewed |
| `CG-TOOL-REV-007` | Self-Check result logic `R01` to `R06` | Methodologist plus mental-health/caregiver professional | No score/diagnosis, no single-response trigger, tie behavior, false certainty risks | Before external testing | not-reviewed |
| `CG-TOOL-REV-008` | Self-Check support-resource categories | Regional resource owner and caregiver-services expert | Eligibility, accessibility, availability, neutral descriptions | Before public release | not-reviewed |
| `CG-TOOL-REV-009` | Urgent-support route across tools | Qualified clinical, crisis, emergency, regional, and accessibility reviewers | Action-first content, correct configuration, safe fallback, focus order, no delay | Before any external testing involving urgent routes | not-reviewed |
| `CG-TOOL-REV-010` | Shared Support Plan participation gate | Consent/privacy reviewer and adults living with Type 2 diabetes | Direct participation, explicit approval, preparation-only route, no identity claim | Before external testing | not-reviewed |
| `CG-TOOL-REV-011` | Shared Support Plan area and consent logic | Consent, autonomy, clinical-boundary, and legal-boundary reviewers | Independent areas, withdrawal, ask-first semantics, disagreement, no legal effect | Before external testing | not-reviewed |
| `CG-TOOL-REV-012` | Shared Support Plan local storage | Privacy/security reviewer with implementation evidence | Save truth, local conflict, timestamps, deletion, shared-device risk | Before external testing with real preferences | not-reviewed |
| `CG-TOOL-REV-013` | Shared Support Plan print/export | Privacy, accessibility, consent, legal-boundary, clinical reviewers | Outdated-copy notice, unresolved states, exclusions, no signature simulation | Before output release | not-reviewed |
| `CG-TOOL-REV-014` | Final completion language and state | Editorial, autonomy, clinical-boundary, emotional-safety reviewers | No credential, sacrifice, outcome claim, or tool requirement | Before content lock | not-reviewed |
| `CG-TOOL-REV-015` | All regional information | Named regional owner with review cadence and expiry policy | Region label, dates, agencies, fallback, translation context | Before any public release | not-reviewed |
| `CG-TOOL-REV-016` | All accessibility behavior | Accessibility specialist and disabled usability participants | WCAG 2.2 AA, keyboard, screen reader, focus, zoom, print/export | Before release | not-reviewed |
| `CG-TOOL-REV-017` | All cultural scenarios and family-role assumptions | Cultural review panel and representative users | No stereotypes, assumed authority, food blame, or translation harm | Before content lock | not-reviewed |
| `CG-TOOL-REV-018` | All emotional-safety language | Trauma-informed/emotional-safety reviewer without turning tool into therapy | Guilt, resentment, repair, coercion, conflict, crisis, and stop behaviors | Before external testing | not-reviewed |

A source does not replace any review. Any changed safety claim returns to `in-review` under `REVIEW-06`. No entry may become `reviewed` without verified reviewer identity, relevant qualification, scope, and date.

# CROSS-DOCUMENT ISSUE REGISTER

| Issue ID | Documents and affected IDs | Conflict or risk | Recommended correction | What Codex must do before correction | Document ultimately patched | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `CG-TOOL-ISSUE-001` | `01-CAREGIVER-CONTENT.md`: `CG-M1-I01` to `I03`, `CG-M2-I01` to `I05`, `CG-M3-I01` to `I04`, `CG-M4-I01` to `I05`, `CG-M5-I01` to `I05`; each module completion section | Several individual interactions say **Required**, while module completion says only one meaningful submitted interaction is required. Requiring every marked interaction would contradict approved completion logic; allowing any one without naming the core leaves implementation ambiguous. | For each module, designate one clearly named **core application required for module completion**. Mark remaining activities **optional practice** or **required only to complete that individual interaction sequence**. Preserve all approved educational content. | Do not implement module completion gates from the conflicting labels. In Prompt 4, report the conflict, propose the exact core interaction per module, obtain product approval, then apply the approved correction. | `01-CAREGIVER-CONTENT.md`, then referenced precisely in `03-CAREGIVER-CODEX-BUILD.md` | Open, blocking Prompt 4 completion logic |
| `CG-TOOL-ISSUE-002` | `00-CAREGIVER-SYSTEM.md` unresolved decision 4; `CG-T2`, `CG-T4` | Exact local-device protection, retention, and migration behavior remains unresolved. This document finalizes user-visible truth and conflict behavior but cannot claim encryption, retention duration, or migration support without repository evidence. | Prompt 4 must inspect the storage architecture and either specify verified behavior within these privacy limits or leave unsupported capabilities explicitly disabled. | Inspect repository and browser-storage implementation; privacy/security review; no medical or preference data in logs. | `03-CAREGIVER-CODEX-BUILD.md`; patch this document only if approved behavior changes learner-facing copy | Open |
| `CG-TOOL-ISSUE-003` | `00-CAREGIVER-SYSTEM.md` unresolved decisions 5 and 6; `CG-T2`, `CG-T3`, `CG-T4` | Final export format, regional owner, cadence, expiry window, and translated fallback are not assigned. | Prompt 4 must name supported export formats and configuration contract, or mark export/regional features unavailable. No hardcoded numbers in curriculum. | Obtain governance owner and implementation evidence; conduct privacy, accessibility, clinical, and localization reviews. | `03-CAREGIVER-CODEX-BUILD.md`; controlled regional source | Open, release-blocking |
| `CG-TOOL-ISSUE-005` | `CG-T3-I03`; controlled regional source | The line between immediate emotional support and emergency help requires exact U.S. configuration and localized future variants. | Keep the two routes distinct; never infer either from answers; require named crisis and regional review. | Verify current official resources, access modes, language support, expiry, and fallback. | Controlled regional source and Prompt 4 | Open, release-blocking |

No additional contradiction was found between the approved purposes of Know the Plan and Shared Support Plan. Their separation is preserved: one organizes existing professional guidance; the other records everyday relational preferences.

# FINAL TOOL CONSISTENCY AUDIT

## Cross-tool distinctness table

| Experience | Emotionally distinct | Visually distinct | Mechanically distinct | Practically distinct | Data behavior |
| --- | --- | --- | --- | --- | --- |
| What Should I Say? | Uncertainty to conversational readiness | Drafting table and intention/impact strip | Scenario and sentence rehearsal | Produces one bounded preparation sheet | Session-only; deliberate clipboard; no print or export |
| Know the Plan | Unpreparedness to organized restraint | Ready-folder and labeled shelf | Location/contact/role organizer with currency review | Finds existing instructions and limits role | Deliberate local save; print/export; highest medical sensitivity |
| Caregiver Self-Check | Diffuse strain to specific noticing | Open unscored pattern surface | Optional questions and descriptive pattern matching | Identifies up to two areas worth reconsidering | Session-only; no copy, save, print, export, or share |
| Shared Support Plan | Assumption to revisable clarity | Shared table with person-first reading order | Independent preference/capacity negotiation and confirmation | Records current everyday support agreements | Deliberate local save; print/export; area-level consent and conflict state |
| Final completion | Closure pressure to open-ended focus | Open path with movable marker | One next-step category selection | Records what to revisit next without credentialing | Category only persists privately; custom detail session-only |

## Audit findings and revisions

- **Repeated purpose:** Removed. T1 prepares speech; T2 organizes professional-reference locations; T3 notices supporter patterns; T4 negotiates relational preferences; completion selects one next action.
- **Repeated scenarios:** T1's twelve scenarios do not reuse the main module scenes involving Mira's unanswered call, Leah opening Andre's phone, Nia changing Cam's kitchen, Celeste on the stairs, or Elena's 6:10 call. Related domains recur only to practice distinct communication tasks.
- **Repeated mechanics:** Avoided. The two local tools both use fields because the task requires a durable reference, but T2 is source-location organization and T4 is two-perspective agreement. Their review logic differs.
- **Repeated visual metaphors:** Avoided: drafting table, ready folder, pattern desk, shared planning table, and open path.
- **Generic AI language:** Prohibited clichés, praise, perfect scripts, and bot framing were removed.
- **Excessive cards:** All tools use open work surfaces, ruled sections, and sequential mobile groups.
- **Medical advice and patient data:** No readings, doses, symptom diagnosis, thresholds, treatment changes, patient import, or clinician-message retrieval.
- **Save and deletion:** Session tools state that save is unsupported. Local tools have deliberate save, visible state, failure, reset, deletion, conflict, and shared-device language.
- **Security language:** No encryption, HIPAA compliance, secure sync, backup, protected storage, or permanent deletion claim.
- **Consent and authority:** Every T4 area defaults Not discussed, confirmation is independent, and print/save never increase authority.
- **Clinical scoring:** T3 has no numeric representation, total, severity, diagnosis, comparison, or automated outreach.
- **Emergency delay:** Urgent direction precedes inputs and uses controlled regional fallback.
- **Print privacy:** T2 and T4 outputs carry purpose, privacy, review, region, verification, outdated, and authority notices and exclude private learning data.
- **Accessibility:** Every interaction has keyboard, screen-reader, mobile, reduced-motion, error, and focus behavior; final implementation still requires specialist and user verification.
- **Tool/module overlap:** Every overlap is identified in the cross-tool inventory and performs a new practical task.
- **Completion credentialing:** No celebration, badge, certificate, mastery, readiness, outcome, or moral praise.

## Remaining unresolved tool decisions

1. Select and verify the exact local-storage mechanism, protection, retention, schema migration, and quota behavior for T2 and T4.
2. Approve export formats. Accessible PDF plus a structured text or HTML format is preferable, but not finalized.
3. Assign the regional configuration owner, review cadence, expiration interval, and translation review workflow.
4. Decide whether local tools support multiple separate documents. This prototype specifies one active copy plus one conflict-recovery copy; multiple profiles remain unapproved.
5. Name all reviewers and complete the review table. No content is currently reviewed.
6. Validate T3 questions and pattern logic with adults supporting people with Type 2 diabetes. The current logic is descriptive product logic, not a validated instrument.
7. Run cultural review of all twelve T1 scenarios and all T4 agreement areas.
8. Finalize exact caregiver design tokens after repository inspection. The supplied UI supports warm ivory, editorial serif, forest, terracotta, and muted blue-green, but token values remain implementation-stage work.
9. Prompt 4 must resolve `CG-TOOL-ISSUE-001` before specifying module completion code.

## Readiness for Prompt 4

This document is ready to control Prompt 4 after the user approves this stage. It supplies finalized learner-facing content and observable behavior for the four tools and final completion experience. Prompt 4 must not silently resolve the issue register, invent regional content, claim reviews, or implement module completion until `CG-TOOL-ISSUE-001` is corrected through product approval.

## End-of-document control index

The required final control material is complete:

1. **Tool ID index:** [Tool ID Index](#tool-id-index)
2. **Cross-tool interaction inventory:** [Cross-Tool Interaction Inventory](#cross-tool-interaction-inventory)
3. **Tool-wide source table:** [Tool-Wide Source Table](#tool-wide-source-table)
4. **Required-review list:** [Tool-Wide Review Requirements](#tool-wide-review-requirements)
5. **Cross-document issue register:** [Cross-Document Issue Register](#cross-document-issue-register)
6. **Cross-tool distinctness table:** [Cross-tool distinctness table](#cross-tool-distinctness-table)
7. **Remaining unresolved tool decisions:** [Remaining unresolved tool decisions](#remaining-unresolved-tool-decisions)
8. **Prompt 4 control confirmation:** [Readiness for Prompt 4](#readiness-for-prompt-4)
