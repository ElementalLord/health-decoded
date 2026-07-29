# Health Decoded Caregiver System

**Document:** `00-CAREGIVER-SYSTEM.md`  
**Status:** Binding product specification  
**Public-facing section name:** Support Someone You Care About  
**Central promise:** Help without taking over.  
**Prototype market:** United States, with regional safety content designed for future localization  
**Prototype audience:** People supporting an adult with Type 2 diabetes who generally retains decision-making capacity

## 1. Purpose and authority

This document is the global source of truth for every caregiver page, module, tool, interaction, reflection, completion state, content specification, and Codex prompt.

It converts the approved Phase 1 architecture into stable system rules without replacing it. It contains no finalized landing-page, module, or tool copy, and no code.

The caregiver experience is relationship support, not a diabetes course, professional training, certification, medical dashboard, monitoring service, or article collection. It should help a supporter become respectful, useful, prepared, and sustainable while keeping the person living with diabetes in control.

The term *caregiver* may remain in internal labels. Learner-facing language should more often use *supporter*, *partner*, *family member*, *friend*, or *someone you care about*. A user need not adopt the caregiver identity.

### 1.1 Binding interpretation

- `SCOPE-01` The person living with Type 2 diabetes is the primary decision-maker.
- `SCOPE-02` Relationship support is the product center. Diabetes education appears only when it enables safer support.
- `SCOPE-03` Completion represents participation and reflection, never medical competence.
- `SCOPE-04` The prototype must not create or imply patient monitoring, caregiver surveillance, or linked-account oversight.
- `SCOPE-05` When two requirements conflict, immediate safety outranks ordinary educational flow. Autonomy, consent, privacy, and accessibility outrank visual preference and implementation convenience.

## 2. Product scope and audience

The experience is for spouses, partners, parents of adult children, adult children supporting parents, relatives, friends, roommates, chosen family, informal supporters, and people who help without identifying as caregivers.

The experience must accommodate differences in proximity, diagnosis stage, support intensity, health literacy, relationship quality, desired involvement, cultural expectations, and digital comfort.

The prototype covers support for an adult with Type 2 diabetes who generally retains decision-making capacity. It must acknowledge that minors, guardianship, dementia, cognitive impairment, loss of capacity, and professional caregiving require different guidance. Those circumstances are not small variations of this prototype.

- `SCOPE-06` Do not determine legal authority or decision-making capacity.
- `SCOPE-07` Do not imply that family relationship, co-residence, financial support, or past consent creates present authority.
- `SCOPE-08` Do not frame declined help as noncompliance, irresponsibility, or lack of appreciation.
- `SCOPE-09` Do not assume a safe, close, or mutually trusting relationship.
- `SCOPE-10` United States emergency and professional-support content must be isolated from globally reusable educational content.

## 3. Approved experience architecture

### 3.1 Guided learner order

1. What They May Be Feeling
2. Support Without Taking Over
3. Everyday Support That Actually Helps
4. When Something Feels Wrong
5. The Caregiver Matters Too

This order moves from interpretation to permission, practical support, safety, and sustainability. The order is recommended and visible, but not enforced. After reaching the landing page, users may open any module.

### 3.2 Independently accessible tools

1. What Should I Say?
2. Know the Plan
3. Caregiver Self-Check
4. Shared Support Plan

Tools must remain available without completing modules. Modules may recommend a tool when useful, but must not lock it behind progress, scores, account setup, reflection, or another tool.

Know the Plan and Shared Support Plan remain separate:

- **Know the Plan** organizes where clinician-provided instructions are located and clarifies an agreed supporter role.
- **Shared Support Plan** records revisable relational preferences about how support should work.

Neither tool creates medical instructions or legal authority.

### 3.3 Production order

1. Create the global system.
2. Create the landing page.
3. Create Module 2 as the prototype.
4. Implement and evaluate Module 2.
5. Revise shared standards if evidence from the prototype requires it.
6. Create Module 1.
7. Create Module 3.
8. Create Module 4.
9. Create Module 5.
10. Create the practical tools.
11. Create the completion experience.
12. Conduct the final audit.
13. Create the final Codex build document.

Module 2 is produced first because permission, privacy, autonomy, support versus control, consent, role boundaries, and information-sharing boundaries must govern all later work.

- `CONTENT-01` Later documents may specify content within this architecture but may not reorder modules, merge tools, add prerequisites, or change their purpose without explicit product approval.
- `CONTENT-02` Each module must apply earlier principles in a new context rather than repeat them.
- `CONTENT-03` A module recommendation may deep-link to a tool, but the user must retain a clear return path.
- `CONTENT-04` Immediate-help routes must remain reachable in no more than two intentional actions from any caregiver area.

## 4. Completion and progress

Use only these progress states:

- Not started
- In progress
- Completed
- Revisit
- Plan updated

A module becomes Completed only after the learner:

1. reaches the central educational idea
2. completes at least one meaningful application
3. reviews the practical takeaway

Reflection participation and quiz accuracy do not affect completion. A knowledge check may identify an idea worth revisiting, but it must not reverse completion or force repetition.

Section completion requires:

- all five modules completed
- one personal next step selected

Practical tools remain optional. A learner does not need to open, complete, save, print, or export a tool to complete the section.

Progress is private to the learner. It must not be visible to the person living with diabetes, another supporter, a linked account, or the AI Tutor unless a future sharing design receives separate approval. Completion may not imply readiness, expertise, qualification, certification, or moral approval.

- `PROGRESS-01` No XP, points, streaks, ranks, trophies, public comparisons, or badges implying expertise.
- `PROGRESS-02` No passing score is required.
- `PROGRESS-03` `moduleCompleted` and `keyIdeaUnderstood` are separate states.
- `PROGRESS-04` A learner may have `moduleCompleted = true` and `keyIdeaUnderstood = false`.
- `PROGRESS-05` Revisit does not erase or reduce completion.
- `PROGRESS-06` Plan updated applies only after a learner deliberately saves a changed plan.
- `PROGRESS-07` No guilt-based reminders or language suggesting that delay harms the person being supported.
- `PROGRESS-08` Completion screens use calm consolidation, not celebration or credentialing.

## 5. Product responsibility boundaries

### 5.1 Health Decoded may

Health Decoded may explain common emotional and relational challenges without diagnosing feelings; teach permission-based communication and support-versus-control distinctions; help supporters prepare respectful questions; organize voluntarily shared information; explain the purpose of a clinician-created plan; recognize product limits; direct users to professional or emergency help; support nonmedical planning, repair, boundaries, and wellbeing; and encourage qualified diabetes education and support.

### 5.2 Health Decoded may not

Health Decoded may not diagnose symptoms or emotions; interpret readings; generate targets; explain an individual result; recommend medication changes or doses; recommend food, movement, or medication as emergency treatment; replace clinicians or emergency services; create a medical plan; override the person; determine legal authority or capacity; certify competence; or imply that completion qualifies someone to manage diabetes.

- `MEDICAL-01` Medical restraint applies to narrative, scenarios, feedback, quiz explanations, tools, AI handoffs, exports, and implementation-generated copy.
- `MEDICAL-02` A missing medical detail must be reported as missing, not inferred.
- `MEDICAL-03` General education must never be formatted so that it resembles an individualized instruction.
- `MEDICAL-04` The product must not use adherence, glucose, medication, weight, or acceptance of help as success measures.

## 6. Autonomy and consent system

Autonomy is not a single disclaimer. It must shape the information architecture, wording, interaction logic, storage model, and visual hierarchy.

### 6.1 Ownership

- `AUTONOMY-01` The person living with diabetes owns their health decisions.
- `AUTONOMY-02` The person may accept, limit, pause, change, or decline support.
- `AUTONOMY-03` The person may speak for themselves in appointments and family conversations.
- `AUTONOMY-04` A supporter may disagree while still respecting the person's authority.
- `AUTONOMY-05` Caring, worry, proximity, family role, or past involvement does not automatically create access.
- `AUTONOMY-06` A supporter may set their own limits, but boundaries must not be framed as punishment, coercion, or withdrawal designed to force compliance.

### 6.2 Permission

- `CONSENT-01` Ask permission before offering hands-on help when permission has not already been agreed for that situation.
- `CONSENT-02` Ask before discussing medication, readings, food choices, exercise, appointments, clinician messages, or other health information.
- `CONSENT-03` Ask before attending an appointment.
- `CONSENT-04` Attendance does not authorize speaking during the appointment.
- `CONSENT-05` Ask before sharing health information with relatives, friends, employers, clinicians, or digital services.
- `CONSENT-06` Consent must be specific to the action, information, person, purpose, and situation.
- `CONSENT-07` Consent may be temporary and may be withdrawn.
- `CONSENT-08` Silence, lack of objection, account access, shared housing, or a previous yes must not be treated as current consent.
- `CONSENT-09` When a preference is uncertain, the product should guide the supporter to ask, not guess.
- `CONSENT-10` In a suspected immediate emergency, the product directs the user to urgent help without attempting legal interpretation.

### 6.3 Protected information

Caring about someone does not automatically grant access to readings, medication information, appointments, reflections, AI Tutor conversations, quiz results, lesson progress, goals, clinician messages, account data, devices, or location.

- `AUTONOMY-07` Family privacy must be treated as real privacy.
- `AUTONOMY-08` Remote supporters may not use distance or uncertainty to justify constant checking or digital surveillance.
- `AUTONOMY-09` Cultural expectations may be explored as context, never used to assume authority.
- `AUTONOMY-10` Repair after overstepping should include naming the action, acknowledging possible impact, apologizing without demanding reassurance, clarifying future permission, and allowing the other person to respond or not respond.

## 7. Support versus control framework

All later content should evaluate support through nine questions: Was permission given? Is the action specific, proportional, and freely declinable? Does it expose private information? Does it reduce burden or add pressure? Is this an emergency or fear? Does an agreed plan cover it? Can the arrangement change?

### 7.1 Action categories

| Category | Definition | Product treatment |
| --- | --- | --- |
| Invited support | The person directly requests a specific action | Confirm scope when needed and do only what was requested |
| Offered support | The supporter proposes an action that can be freely declined | Make refusal easy and avoid repeated offers |
| Negotiated support | Both people agree on a recurring or situational arrangement | Clarify conditions, limits, review, and withdrawal |
| Assumed support | The supporter acts without current permission because help seems expected | Prompt a pause and permission check |
| Repeated reminders | An offer continues after no, silence, or no agreement | Explain how repetition can become pressure |
| Pressure | Consequences, guilt, persistence, or emotional leverage make refusal difficult | Identify impact and support repair |
| Monitoring | The supporter routinely checks behavior or information | Require a specific, revisable agreement and data minimization |
| Surveillance | Secret, continuous, coercive, or unauthorized access or observation | Prohibit and redirect toward conversation or professional support |
| Coercion | Threats, punishment, manipulation, or forced disclosure remove meaningful choice | Do not normalize as care; prioritize safety and appropriate human support |
| Emergency action | Immediate action when someone may be in danger | Direct to regional emergency help and the person's plan without legal conclusions |
| Healthy boundary | The supporter names what they can and cannot sustainably do | Keep the boundary about the supporter's action, not control of the other person |

- `SUPPORT-01` Support must be permission-based, specific, proportional, and revisable.
- `SUPPORT-02` Repetition can change an offer into pressure even when each sentence sounds polite.
- `SUPPORT-03` Monitoring requires a clear agreement. Secret access is not support.
- `SUPPORT-04` Food, movement, medication, readings, appointments, transportation, supplies, routines, family conversations, and social situations all use the same framework.
- `SUPPORT-05` A caregiver intention may be understandable while the impact still requires change or repair.
- `SUPPORT-06` Do not label every mistake as abuse or malicious behavior.
- `SUPPORT-07` Fear, love, responsibility beliefs, uncertainty, or cultural expectations may explain behavior but do not erase impact.
- `SUPPORT-08` Emergency action must not be used to justify ordinary ongoing control.

## 8. Voice and tone

The voice is warm, direct, specific, emotionally intelligent, calm, practical, respectful, medically restrained, culturally aware, and nonjudgmental.

It is not generic, constantly poetic, sentimental, patronizing, accusatory, legalistic, robotic, overly cheerful, or clinical.

### 8.1 Binding voice rules

- `CONTENT-05` Use plain language and concrete situations.
- `CONTENT-06` Use contractions in dialogue when natural.
- `CONTENT-07` Do not use em dashes.
- `CONTENT-08` Do not diagnose feelings. Use *may be feeling*, *could be experiencing*, *one possible explanation*, *worth asking about*, *may have been received as*, or *may be adding pressure*.
- `CONTENT-09` Do not present a single emotional interpretation as fact.
- `CONTENT-10` Avoid generic motivational language and praise.
- `CONTENT-11` Do not make reassurance larger than the situation supports.
- `CONTENT-12` Emergency language becomes short and direct. Relational language stays calm and non-shaming.
- `CONTENT-13` Write conflict with more than one plausible perspective.
- `CONTENT-14` Name impact without assigning a permanent identity to the person who overstepped.
- `CONTENT-15` Boundaries should sound usable, not like therapy scripts.

### 8.2 Prohibited generic phrases and better patterns

Do not use:

- You are not alone on this journey.
- Every step matters.
- Progress, not perfection.
- Knowledge is power.
- Take a moment to reflect.
- Let's explore.
- This powerful moment.
- Great job.
- You've got this.
- Supporting someone can be a beautiful journey.
- Caregiving is an act of love.

Use situation-linked alternatives:

- Fear: “You may be trying to prevent the next problem before you know what help is wanted.”
- Guilt: “Having a limit does not require you to stop caring. It requires a clearer agreement.”
- Anger: “The frustration may be real. It does not tell you, by itself, what the other person intended.”
- Resentment: “If the arrangement is becoming hard to sustain, that is information worth discussing.”
- Exhaustion: “A plan that depends on one person always being available needs backup.”
- Conflict: “You do not have to settle the whole disagreement in one conversation.”
- Uncertainty: “When you do not know, ask what has been agreed and where professional guidance belongs.”
- Silence: “Silence can mean many things. Avoid filling it with a diagnosis.”
- Embarrassment: “Private information shared in front of others can change a helpful moment into exposure.”
- Overstepping: “A clear apology can name the action without asking the other person to make you feel better.”
- Repair: “Ask what would make future help feel more respectful.”
- Boundaries: “Name what you can offer and what you cannot sustain.”
- Urgency: “Stop here and use the person's plan or emergency help for your region.”

## 9. Scenario system

Scenarios are original illustrative learning material. They are not testimonials and must not imply that a fictional account is a real patient story.

### 9.1 Required scenario components

Every scenario must separate the observable event, possible interpretations, supporter intention, possible impact, and information the learner cannot know.

### 9.2 Binding scenario rules

- `SCENARIO-01` Use placeholder names and original situations.
- `SCENARIO-02` Include imperfect, speakable conversation.
- `SCENARIO-03` Include more than one plausible perspective.
- `SCENARIO-04` Do not create a villain or a perfect supporter.
- `SCENARIO-05` Do not resolve every conflict.
- `SCENARIO-06` Do not use dramatic overnight transformation.
- `SCENARIO-07` Avoid cultural, racial, gender, age, disability, or family-role stereotypes.
- `SCENARIO-08` Vary relationships, living arrangements, support intensity, diagnosis stage, health literacy, financial context, language context, work schedules, transportation, mobility, and food access across the full inventory.
- `SCENARIO-09` Include both remote and in-person support.
- `SCENARIO-10` Include family-food variation without turning food into blame.
- `SCENARIO-11` Keep most dialogue turns under 30 words.
- `SCENARIO-12` Do not make characters explain their feelings with implausible precision.
- `SCENARIO-13` Keep scenarios concise enough for interaction while preserving relevant ambiguity.
- `SCENARIO-14` Use the label “Illustrative scenario” when a scenario could reasonably be mistaken for a real account, testimonial, or documented case.
- `SCENARIO-15` A verified real account requires documented consent, privacy review, editorial review, sourcing, and an explicit disclosure. It is outside the default prototype.

## 10. Interaction system

Core rule: Narrative explains what happened. Interaction asks the learner to do something new with the situation.

Interactions may ask the learner to interpret, predict, compare, organize, prioritize, choose, rewrite, practice, map consequences, prepare a conversation, identify a boundary, apply a principle, or build a plan.

### 10.1 Approval test

An interaction is acceptable only when removing it would reduce learning; it asks for new cognitive work; feedback deepens interpretation; the mechanic fits the task; it remains operable with keyboard, screen reader, reduced motion, and at 320px; and it collects no unnecessary data.

### 10.2 Prohibited interaction patterns

- repeating the preceding paragraph as a question
- hiding essential narrative behind a click
- revealing dialogue the learner already read
- restating the same emotional conclusion
- decorative activity without learning value
- duplicating the final knowledge check
- relying on tap-to-reveal boxes
- drag-only controls
- using the same mechanic across modules without a learning reason
- requiring personal glucose values, medication details, symptoms, names, or clinical history
- auto-advancing before the learner can review their choice
- using color alone for correctness or state

### 10.3 Required interaction specification

Every interaction must include:

| Field | Requirement |
| --- | --- |
| Interaction ID | Stable ID such as `CG-M2-I01` or `CG-T3-I02` |
| Title | Short learner-facing name |
| Purpose | One observable learning function |
| Learner task | What the learner does |
| Exact prompt | Final learner-facing prompt |
| Controls or choices | Exact labels, order, defaults, and constraints |
| Response logic | State changes and conditional behavior |
| Feedback | Exact response for every meaningful choice |
| Learning point | One concise idea not already stated verbatim |
| Status | Required or optional |
| Progression | What, if anything, blocks progression |
| Keyboard alternative | Complete operation without pointer or drag |
| Screen-reader behavior | Names, roles, states, order, and announcements |
| Mobile behavior | Reflow, target sizing, scrolling, and virtual-keyboard behavior |
| Reduced motion | Equivalent state change without motion |
| Data storage | What is collected, saved, shared, logged, and cleared |

- `INTERACTION-01` Narrative and interaction must perform different educational jobs.
- `INTERACTION-02` No required interaction may depend on drag, hover, gesture, precision, sound, animation, or time.
- `INTERACTION-03` Feedback appears only after deliberate submission when a choice has consequences.
- `INTERACTION-04` Private reflection content never gates progression.
- `INTERACTION-05` An urgent-help direction appears before any educational interaction.
- `INTERACTION-06` The correct option must not be identifiable only because it is longer, warmer, or more polished.
- `INTERACTION-07` Controls must allow review and correction before submission.
- `INTERACTION-08` Mechanical variation must follow learning purpose, not novelty alone.

### 10.4 Interaction inventory template

| Area | Emotional arc | Dominant cognitive action | Dominant mechanic | Supporting mechanics | Visual concept | Rhythm | IDs used | Repetition reason | Accessibility verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Landing page | Unassigned | Unassigned | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Module 1 | Unassigned | Interpret | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Module 2 | Unassigned | Distinguish and choose | Unassigned | Unassigned | Unassigned | Unassigned | None | First prototype | No |
| Module 3 | Unassigned | Match and plan | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Module 4 | Unassigned | Prioritize and escalate | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Module 5 | Unassigned | Map and rehearse | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Tool 1 | Unassigned | Rewrite and prepare | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Tool 2 | Unassigned | Organize | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Tool 3 | Unassigned | Notice and prioritize | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |
| Tool 4 | Unassigned | Negotiate and document | Unassigned | Unassigned | Unassigned | Unassigned | None | N/A | No |

## 11. Feedback system

Feedback explains likely impact, respects understandable intentions, adds new understanding, remains concise, avoids shame, distinguishes relational concern from medical danger, and identifies how autonomy is preserved or pressure increased.

- `FEEDBACK-01` Explain consequence, not just correctness.
- `FEEDBACK-02` Acknowledge understandable intention without excusing harmful impact.
- `FEEDBACK-03` Avoid praise, scolding, sarcasm, mind reading, and identity labels.
- `FEEDBACK-04` Acknowledge gray areas when more than one reaction is understandable.
- `FEEDBACK-05` Keep ordinary feedback concise, usually 25 to 70 words.
- `FEEDBACK-06` Emergency feedback is shorter, direct, and action-first.
- `FEEDBACK-07` Never imply that one answer proves someone is a good or bad caregiver.
- `FEEDBACK-08` When a choice oversteps, include a repair or permission-based alternative when appropriate.

| Unacceptable feedback | Revised natural feedback | Principle |
| --- | --- | --- |
| “Correct! Communication is key.” | “This asks about one specific kind of help and leaves room for no. That makes the offer easier to understand and decline.” | Explain impact |
| “Wrong. Never do that.” | “The reminder may come from concern, but repeating it after they declined turns an offer into pressure. Ask whether a reminder agreement would help.” | Intention does not erase impact |
| “Great job showing empathy.” | “This acknowledges what you noticed without deciding what they feel. The next question lets them choose whether to talk.” | Avoid praise and mind reading |
| “That is controlling behavior.” | “Opening their health app without permission removes privacy and choice. Concern does not create access.” | Name the action, not the person |
| “Perfect!” | “This keeps the person in the lead while offering one concrete action.” | Specific consequence |
| “Not quite. Try again.” | “This offers help, but it assumes the appointment is shared. Ask whether they want you involved before deciding your role.” | Add the missing distinction |
| “A good caregiver respects boundaries.” | “Respect the boundary even if you disagree. You can name what you can sustain without taking over their decision.” | No moral identity labels |
| “Do not panic.” | “Stop here. Use the person's emergency plan and contact emergency help for your region if someone may be in immediate danger.” | Direct emergency action |
| “Their blood sugar is dangerously low.” | “The app cannot interpret an individual's reading. Follow the person's clinician-created plan or contact professional help.” | Do not interpret readings |
| “Healthy choices are always best.” | “Food support works better when it is agreed and practical. Labels such as good or bad can turn a shared meal into monitoring.” | Avoid food policing |
| “You should have known better.” | “The impact still matters even if you meant to help. A direct apology and a clearer agreement can support repair.” | Shame-free repair |
| “They are just overwhelmed.” | “Overwhelm is one possibility, but this moment does not confirm it. Ask what they want before deciding what the silence means.” | Preserve uncertainty |
| “Correct. Call the doctor.” | “The agreed plan is unclear, so professional guidance is the next layer. Contact the appropriate member of the care team instead of improvising treatment.” | Explain escalation |
| “Incorrect. Give them space.” | “Space may help, but disappearing without checking can feel abrupt. Ask whether they want quiet, company, or practical help.” | Recognize multiple needs |
| “Amazing work. You completed it!” | “Module completed. You can revisit this idea or choose what would be useful next.” | Separate completion from praise |

## 12. Knowledge-check system

Each module should normally contain three questions. A fourth or fifth question requires a clear learning reason. Questions test interpretation, application, boundaries, safety distinctions, or practical judgment rather than recall of exact wording.

- `QUIZ-01` No required passing score.
- `QUIZ-02` No points, timers, lives, streaks, grades, certification, confetti, red failure screens, or loud green success screens.
- `QUIZ-03` Use plausible distractors tied to identifiable misunderstandings.
- `QUIZ-04` Avoid trick wording, double negatives, “all of the above,” and “none of the above.”
- `QUIZ-05` At least one question should test a realistic gray area.
- `QUIZ-06` The quiz must use a new context, not repeat the module interaction.
- `QUIZ-07` Permit answer changes before submission.
- `QUIZ-08` After submission, explain the selected answer and make other explanations available.
- `QUIZ-09` A missed question may offer “Review this idea” and “Continue.”
- `QUIZ-10` Review opens the relevant section and does not force the whole module.
- `QUIZ-11` A missed answer may set `keyIdeaUnderstood = false` but must not set `moduleCompleted = false`.
- `QUIZ-12` Use “Review complete,” not a numeric score or mastery claim.

Knowledge checks must use semantic choice groups, retain the selected answer, avoid automatic progression, move focus to feedback only after explicit submission, and announce result plus explanation without relying on color.

## 13. Reflection system

Reflections are optional, private, short, specific, nonclinical, skippable, and editable while saved. They must not request unnecessary medication, glucose, symptom, or identifying information.

- `REFLECTION-01` A reflection never blocks progression or completion.
- `REFLECTION-02` Skipping carries no warning, penalty, or reduced progress.
- `REFLECTION-03` Show the privacy notice before the response field.
- `REFLECTION-04` Do not automatically send reflection text to the AI Tutor.
- `REFLECTION-05` Do not use reflections in analytics, clinical labels, caregiver profiles, or cross-account personalization.
- `REFLECTION-06` Do not frame disclosure as proof of honesty, effort, or care.
- `REFLECTION-07` If session-only handling cannot be guaranteed, replace free text with a private mental prompt.

### 13.1 Persistence by context

| Context | Default persistence | User control | Prohibited behavior |
| --- | --- | --- | --- |
| Module reflection | Session-only | Edit, delete, skip, clear | Account save, automatic sharing, analytics use |
| What Should I Say? | Session-only | Edit and copy before leaving | Automatic draft saving or AI Tutor transfer |
| Caregiver Self-Check | Session-only | Review and clear | Clinical labeling, scoring, sharing, account persistence |
| Know the Plan | Deliberate local-device save may be offered | Save, update, print, export, reset | Automatic account sync or imported patient data |
| Shared Support Plan | Deliberate local-device save may be offered | Save, update, print, export, reset | Cross-account sync or permanent-consent framing |

## 14. Medical-safety system

High-risk content must use three visible layers:

1. **General education:** Broad information that does not interpret an individual situation.
2. **The person's clinician-created plan:** The individualized source for agreed instructions and supporter role.
3. **Professional or emergency help:** The appropriate next layer when a situation is urgent, unclear, outside the plan, or beyond the product.

### 14.1 General medical rules

- `MEDICAL-05` Glucose content may explain that readings have context, but must not interpret a value or request real readings.
- `MEDICAL-06` Universal ranges may not be presented as personal targets or action thresholds.
- `MEDICAL-07` Medication content may support respectful conversation and plan location, not dosing, timing changes, replacement, or adherence surveillance.
- `MEDICAL-08` Food content may discuss practical support and consent, not moral labels, policing, or emergency treatment.
- `MEDICAL-09` Movement content may discuss ordinary invited support, not exercise as correction for a reading or symptom.
- `MEDICAL-10` Symptom content may support broad recognition that urgent help may be needed, not diagnosis.
- `MEDICAL-11` Device content may explain permission and plan location, not device operation beyond approved general education or unauthorized data access.
- `MEDICAL-12` Appointment preparation may help organize questions, preferences, and roles, but not speak over the person or generate treatment demands.
- `MEDICAL-13` Never copy another person's plan or convert an example into an instruction.
- `MEDICAL-14` Never delay help so a user can finish content, log in, enter data, answer a quiz, or complete a form.
- `MEDICAL-15` Never store real health readings in the caregiver section.

### 14.2 Emergency interruption

- `EMERGENCY-01` When someone may be in immediate danger, urgent direction interrupts the normal educational flow.
- `EMERGENCY-02` Show the action first, followed by only the information needed to act.
- `EMERGENCY-03` Do not require interaction, login, consent form, quiz, module completion, account creation, or data entry before urgent direction.
- `EMERGENCY-04` Do not animate or progressively reveal urgent instructions.
- `EMERGENCY-05` Provide a visible region label and a safe fallback when regional data is unavailable.
- `EMERGENCY-06` Direct the learner to the person's clinician-created plan when accessible, but never let plan-finding delay emergency contact.
- `EMERGENCY-07` Do not recommend emergency treatment, determine legal authority, or assess decision-making capacity.
- `EMERGENCY-08` Preserve a clear exit from educational content to emergency or professional help.
- `EMERGENCY-09` Screen-reader focus must move to the urgent heading, with the action and region announced immediately after it.
- `EMERGENCY-10` Emergency direction must remain readable at 200 percent zoom and 320px without horizontal scrolling.

## 15. Region and localization system

Globally reusable content includes autonomy, permission, privacy, support-versus-control principles, product limitations, general encouragement to use an individualized plan, and the distinction between emergency and professional help.

Regional configuration must own:

- emergency service name and number
- crisis service name and number
- poison, urgent, or professional-support contacts when included
- country or region label
- terminology for emergency departments and local care pathways
- operating hours, eligibility, language availability, and access limitations
- source, verification date, expiration date, and reviewer
- localized disclaimer and fallback text

- `REGION-01` Do not scatter phone numbers, agency names, or region-specific instructions through curriculum copy.
- `REGION-02` A single controlled regional source must provide safety strings to pages, tools, exports, and print layouts.
- `REGION-03` Missing regional data must fail safely.
- `REGION-04` Safe failure means showing a plain statement that local details are unavailable, directing the user to local emergency services or an appropriate healthcare professional, and never substituting a guessed number.
- `REGION-05` Printed and exported tools must include the region label, verification date, and a reminder to verify local details.
- `REGION-06` Localization may change terminology, numbers, agencies, disclaimers, and support resources without changing global autonomy and safety rules.
- `REGION-07` Translation must receive contextual review. Literal translation alone is insufficient for emergency language.
- `REGION-08` Expired or unverified regional content must not appear as current.

## 16. Privacy and storage system

The prototype has:

- no linked caregiver account
- no automatic patient-data access
- no automatic glucose access
- no medication-monitoring access
- no location data
- no adherence tracking
- no access to private reflections
- no AI Tutor history access
- no automatic plan syncing
- no hidden background sharing

Health-related information is treated as sensitive as a matter of trust and design. Do not claim that the product is or is not covered by HIPAA.

### 16.1 Binding privacy rules

- `PRIVACY-01` Collect the minimum information needed for the immediate learning task.
- `PRIVACY-02` Module progress may persist privately to the learner's account.
- `PRIVACY-03` Reflections and session-only tool responses must not persist to the account.
- `PRIVACY-04` No cross-account sharing exists in the prototype.
- `PRIVACY-05` AI Tutor access requires a separate, explicit user action and may not include private drafts by default.
- `PRIVACY-06` Local-device saving must be deliberate, visible, and reversible.
- `PRIVACY-07` Local-save tools must display “Not saved,” “Saved on this device,” or “Unsaved changes.”
- `PRIVACY-08` Reset and deletion controls must state what will be removed and act without dark patterns.
- `PRIVACY-09` Shared-device risk must be explained before local save, print, or export.
- `PRIVACY-10` Browser storage must not contain real glucose readings, medication logs, clinician messages, or imported patient records.
- `PRIVACY-11` No hidden logging of free text, self-check answers, plan content, or drafted dialogue.
- `PRIVACY-12` Sensitive information must not appear in URLs, page titles, notifications, analytics labels, or error reports.
- `PRIVACY-13` A failure to save must be plainly disclosed. Never imply that content is stored when it is not.
- `PRIVACY-14` Clearing browser data may remove local plans. Explain this before first save and near export options.
- `PRIVACY-15` Future cloud persistence requires separate privacy, security, consent, and retention reviews.

### 16.2 Exact privacy-notice patterns

**Session-only tool**

> Private for this session. Your responses are not saved to your account or shared with another person. They will clear when this session ends or when you reset the tool.

**Local-save tool**

> Saved only on this device when you choose Save. It does not sync to another account. Anyone using this device may be able to see it.

**Print or export**

> This document may contain sensitive information. Store it carefully, share it only with permission, and verify that emergency details are current.

**Optional private reflection**

> This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.

### 16.3 Storage requirements

- `STORAGE-01` What Should I Say? and Caregiver Self-Check are session-only by default.
- `STORAGE-02` Know the Plan and Shared Support Plan may support deliberate local-device saving.
- `STORAGE-03` Local plans do not sync automatically and do not import patient information.
- `STORAGE-04` The person living with diabetes directly participates in or explicitly approves every Shared Support Plan.
- `STORAGE-05` Saved consent preferences remain revisable and do not become standing authority.
- `STORAGE-06` A user must be able to reset session data and delete locally saved content.

## 17. Shared Support Plan authority

Every Shared Support Plan must state:

- preferences can change
- consent can be specific
- consent can be temporary
- support may be declined
- approval can be withdrawn
- one approved action does not authorize future or unrelated involvement
- the document does not transfer medical authority
- the document is not a legal authorization
- the document is not an advance directive
- the document is not a clinician-created care plan
- declined support must not be described as noncompliance

- `CONSENT-11` The person living with diabetes must directly participate in or explicitly approve the plan.
- `CONSENT-12` A supporter may not create a unilateral plan and present it as shared.
- `CONSENT-13` Each preference must be reviewable independently.
- `CONSENT-14` The plan must include a review point without implying that consent lasts until that date.
- `CONSENT-15` Print, export, or local save does not increase the document's authority.

## 18. Caregiver Self-Check system

The Self-Check may help a person notice:

- emotional load
- practical load
- sleep and recovery
- resentment
- conflict
- checking behavior
- difficulty stepping away
- isolation
- lack of backup support
- responsibility beliefs

It must not diagnose burnout, anxiety, depression, abuse, or any mental-health condition. It must not assign a clinical risk score, claim to measure mental health, store responses as medical data, contact another person, or share results.

- `CONTENT-16` Use descriptive result language such as *worth noticing*, *may be adding pressure*, *may be difficult to sustain*, *could be useful to discuss*, or *one area to reconsider*.
- `CONTENT-17` Do not rank the learner against other supporters.
- `CONTENT-18` Do not turn a descriptive pattern into a clinical label.
- `CONTENT-19` No single response triggers a diagnosis or automated outreach.
- `CONTENT-20` When a response suggests immediate danger or crisis, provide region-appropriate urgent support without claiming to assess risk.

Approved follow-up resource categories are:

- general caregiver support
- primary healthcare support
- counseling or mental-health support
- diabetes education and support
- community or respite support
- urgent crisis support when immediate danger or crisis is indicated

Exact current resources must be researched and reviewed later.

## 19. Visual design system

The caregiver section must feel warmer and more relational than Lessons, and more practical than Stories. It must remain distinct from Lessons, Stories, Resources, Profile, and Dashboard.

The supplied UI establishes an editorial language: warm ivory, dark serif display type, readable sans-serif text, muted terracotta and sage, fine rules, restrained environmental imagery, natural whitespace, and minimal shadow. The caregiver system extends it without copying patient-facing composition.

### 19.1 Color and material roles

| Role | Direction | Use |
| --- | --- | --- |
| Canvas | Warm cream or ivory | Primary page field |
| Primary ink | Deep forest green or warm charcoal | Headings and body copy |
| Relational accent | Restrained terracotta | Human emphasis, active path, relational consequence |
| Support accent | Soft sage | Planning, calm confirmation, agreed support |
| Information tint | Muted blue-green | Neutral privacy and educational notes |
| Safety accent | Deep brick red | Urgent safety only, always paired with text |
| Raised surface | Slightly lighter warm neutral | Focused tools and contained interactions |
| Focus indicator | High-contrast outline | Keyboard focus, distinct from selection and error |

Exact tokens must be reconciled with the repository during implementation. All combinations must meet WCAG 2.2 AA contrast. Color may never be the only state indicator.

### 19.2 Typography and spacing

- Use an editorial serif selectively for major headings.
- Use a readable sans-serif for body text, controls, forms, metadata, privacy notices, and safety instructions.
- Keep body text generally equivalent to 16 to 18 CSS pixels with comfortable line height.
- Keep ordinary reading width near 45 to 75 characters.
- Avoid very light weights for essential text.
- Use uppercase micro-labels sparingly.
- Keep labels, controls, feedback, and save state visually close.
- Prefer open layouts, fine dividers, tonal shifts, and purposeful whitespace over containers.
- Use soft, intentional edges. Do not round every element.

### 19.3 Composition

- `VISUAL-01` Do not use a hero followed by an identical card grid for every module.
- `VISUAL-02` Vary scene-led, dialogue-led, sequence, comparison, workspace, and quiet-reflection compositions according to learning purpose.
- `VISUAL-03` Use connected-path motifs to show relationship, choice, sequence, or shared planning.
- `VISUAL-04` Environmental concepts may clarify privacy, boundaries, distance, planning, or burden.
- `VISUAL-05` Avoid stock photos of smiling families, generic caregiver avatars, heart icons, purple wellness gradients, repeated decorative waves, and icons used only to fill space.
- `VISUAL-06` Avoid walls of cards, nested cards, repeated three-column grids, excessive pills, hard borders, heavy shadows, giant empty hero areas, and text placed over faces.
- `VISUAL-07` People and environments must vary without coding personality or behavior by identity.
- `VISUAL-08` Decorative imagery has empty alternative text. Meaningful imagery has concise alternative text.
- `VISUAL-09` Progress is quiet, text-labeled, and never styled like health progress or mastery.
- `VISUAL-10` Tools feel like focused workspaces, not lesson cards.
- `VISUAL-11` Safety content interrupts normal rhythm with high contrast, a clear action, and no hidden details.

### 19.4 Subtle module identity

Each module may receive:

- one restrained secondary accent
- one environmental or relational motif
- one distinct compositional rhythm
- one dominant interaction family
- one emotional transition

The shared canvas, typography, navigation, focus behavior, privacy treatment, safety interruption, and progress language remain consistent. Module identity must not become a theme park or abandon product cohesion.

## 20. Motion system

Motion may communicate relationship, state change, sequence, consequence, comparison, planning, or progress.

Allowed examples include connecting a choice to likely impact, moving support inside an agreed boundary, organizing a plan, shifting perspective, or updating progress.

- `MOTION-01` Motion must have an educational or state-communication purpose.
- `MOTION-02` Ordinary state transitions should generally complete in 150 to 250 milliseconds.
- `MOTION-03` Larger spatial transitions should generally complete in 250 to 400 milliseconds.
- `MOTION-04` Motion must not delay reading, feedback, navigation, or urgent information.
- `MOTION-05` Do not use continuous bouncing, spinning, pulsing, 3D flips, card turns, page curls, dramatic zooms, or ambient motion in every module.
- `MOTION-06` Reduced motion replaces travel, scale, and path animation with immediate state changes or brief opacity changes.
- `MOTION-07` Reduced-motion users receive the same information, order, focus, and completion behavior.
- `MOTION-08` No motion should imply medical improvement, emotional success, or moral correctness.

## 21. Responsive and accessibility system

Target WCAG 2.2 AA. Accessibility is designed into content and interactions before implementation, not added after visual approval.

### 21.1 Responsive requirements

- `RESPONSIVE-01` Verify at 320px, 375px, 768px, 1024px, and 1440px.
- `RESPONSIVE-02` Verify at 200 percent zoom.
- `RESPONSIVE-03` Do not depend on desktop-only side-by-side layouts.
- `RESPONSIVE-04` Reading order must remain logical when columns stack.
- `RESPONSIVE-05` Long text and future translations may wrap without clipping, overlap, truncation, or hidden controls.
- `RESPONSIVE-06` Controls remain near the prompt and feedback they affect.
- `RESPONSIVE-07` Sticky elements must not obscure content or focus.
- `RESPONSIVE-08` Virtual keyboards must not hide focused fields or primary actions.
- `RESPONSIVE-09` Tables must reflow, scroll with clear context, or convert to labeled groups without losing relationships.
- `RESPONSIVE-10` Print layouts must not depend on viewport-only navigation or color backgrounds.

### 21.2 Interaction accessibility

- `ACCESSIBILITY-01` All functions must work with keyboard only.
- `ACCESSIBILITY-02` Use semantic headings in a logical hierarchy.
- `ACCESSIBILITY-03` Every form control needs a persistent programmatic label.
- `ACCESSIBILITY-04` Focus is clearly visible and not indicated only by color.
- `ACCESSIBILITY-05` Focus order follows reading and task order.
- `ACCESSIBILITY-06` After deliberate submission, move or announce focus to concise feedback without losing the selected answer.
- `ACCESSIBILITY-07` Do not auto-advance.
- `ACCESSIBILITY-08` Do not impose time limits.
- `ACCESSIBILITY-09` Do not use unexpected audio or require sound.
- `ACCESSIBILITY-10` Drag interactions require a complete click, tap, and keyboard alternative.
- `ACCESSIBILITY-11` Pointer targets must meet WCAG 2.2 AA target-size expectations and use larger practical targets where space allows.
- `ACCESSIBILITY-12` Instructions, errors, correctness, save state, and urgency may not rely on color alone.
- `ACCESSIBILITY-13` Errors identify the affected field, explain how to recover, and preserve valid input.
- `ACCESSIBILITY-14` Status messages and feedback use appropriate programmatic announcements without repeated interruption.
- `ACCESSIBILITY-15` Reduced-motion preferences are honored.
- `ACCESSIBILITY-16` Urgent-help headings and actions are announced first.
- `ACCESSIBILITY-17` Local-save state is available visually and programmatically.
- `ACCESSIBILITY-18` Print and export content uses real text, clear headings, sufficient contrast, and understandable reading order.
- `ACCESSIBILITY-19` Privacy notices are not hidden in tooltips, accordions, hover states, or icons.
- `ACCESSIBILITY-20` Decorative images are ignored by assistive technology.

## 22. Print and export system

- `PRINT-01` Printing and exporting are optional capabilities only for Know the Plan and Shared Support Plan unless later approved.
- `PRINT-02` Printed and exported materials include the privacy reminder.
- `PRINT-03` Include document purpose, owner or participants when voluntarily entered, last updated date, region label, and regional verification date when relevant.
- `PRINT-04` State that a Shared Support Plan is not medical instruction, legal authorization, an advance directive, or permanent consent.
- `PRINT-05` State that Know the Plan organizes existing clinician-provided information and does not create instructions.
- `PRINT-06` Do not include module progress, quiz results, AI Tutor history, reflections, or Self-Check responses.
- `PRINT-07` Remove navigation-only elements and preserve headings, labels, blank fields, and page breaks.
- `PRINT-08` Do not rely on colored backgrounds, animation, hover, or interaction state to communicate meaning.
- `PRINT-09` Allow a user to preview and cancel before generating an export.
- `PRINT-10` A generated file name must not expose more sensitive information than necessary.

## 23. Source and review system

Before writing medical, emergency, safety, or health-related claims, later Work tasks must research current official or primary sources. Priority sources are CDC, NIDDK, NIH, FDA, official American Diabetes Association guidance, official NHS guidance when useful, and peer-reviewed caregiver research when official guidance is insufficient.

### 23.1 Source table

Every later content section must include:

| Claim ID | Educational claim | Source | Publication or review date | Use location | Uncertainty or limitation | Required review | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Unassigned | Unassigned | Unassigned | Unassigned | Unassigned | Unassigned | Unassigned | not-reviewed |

Allowed content statuses:

- `not-reviewed`
- `in-review`
- `reviewed`

Use `reviewed` only when verified reviewer identity, relevant qualification, review scope, and review date exist.

### 23.2 Required review types

| Review | Required for |
| --- | --- |
| Editorial | All finalized learner-facing content |
| Clinical | Medical, glucose, medication, symptom, movement, nutrition, device, plan, urgent, and emergency content |
| Privacy | Data collection, persistence, exports, AI handoffs, shared-device behavior, and plan authority |
| Accessibility | Every page, interaction, form, tool, safety interruption, print view, and export |
| Cultural | Scenarios, family roles, food contexts, authority assumptions, translations, and support resources |
| Emotional safety | Conflict, guilt, resentment, coercion, crisis, overstepping, repair, and caregiver strain |

- `REVIEW-01` Module 4 and Know the Plan require qualified clinical review before external user testing focused on medical or emergency content.
- `REVIEW-02` Module 4 and Know the Plan require qualified clinical review before public release.
- `REVIEW-03` No “medically reviewed” claim may appear without verified reviewer information.
- `REVIEW-04` A source does not replace clinical review.
- `REVIEW-05` Clinical review does not replace privacy, accessibility, cultural, or emotional-safety review.
- `REVIEW-06` Changed safety claims must return to in-review.
- `REVIEW-07` Regional resources need an owner, verification date, review cadence, expiration rule, and fallback.
- `REVIEW-08` Uncertainty and source limitations must be recorded, not edited away.

## 24. Codex handoff system

Every future Codex prompt must state that approved caregiver specifications are the source of truth.

Codex must:

- inspect the repository first
- report relevant architecture
- propose an implementation plan
- stop for approval before code changes
- preserve unrelated application areas
- use existing design tokens where appropriate
- create a distinct caregiver visual system
- implement responsive, keyboard, screen-reader, and reduced-motion behavior
- implement persistence exactly as specified
- add relevant tests
- run TypeScript, lint, tests, available accessibility checks, and the production build
- report every file changed
- report missing content instead of inventing it

Codex must not:

- rewrite, summarize, or “improve” approved copy
- expand medical content
- invent missing guidance
- add features outside scope
- create patient-data access
- change privacy rules for convenience
- merge the two plans
- make every module use one layout
- replace meaningful interactions with generic cards
- hardcode regional information throughout the app

- `CODEX-01` Repository conventions are subordinate to medical safety, autonomy, consent, privacy, accessibility, and approved content.
- `CODEX-02` Missing copy or logic is a blocker to report, not permission to generate.
- `CODEX-03` No code changes occur before the repository report and implementation plan receive approval.
- `CODEX-04` Unrelated application areas remain unchanged.
- `CODEX-05` Acceptance includes responsive, keyboard, screen-reader, reduced-motion, persistence, test, lint, type, and build evidence.
- `CODEX-06` Every changed file and unresolved limitation must be reported.

## 25. Source-of-truth hierarchy

Use this hierarchy:

1. Approved and audited learner-facing content
2. Medical, emergency, autonomy, consent, and privacy rules
3. `00-CAREGIVER-SYSTEM.md`
4. The relevant section of `01-CAREGIVER-CONTENT.md`
5. The relevant section of `02-CAREGIVER-TOOLS.md`
6. `03-CAREGIVER-CODEX-BUILD.md`
7. Existing repository conventions
8. Codex assumptions

Conflict resolution:

1. Stop when a lower source contradicts a higher source.
2. Preserve the safer medical, privacy, consent, autonomy, or accessibility behavior.
3. Document the exact conflict.
4. Request product approval when wording or intended behavior remains ambiguous.
5. Update the lower-level source after approval.
6. Never silently resolve a conflict through implementation convenience.

No repository convention, visual preference, analytics request, or schedule pressure may override medical, privacy, consent, autonomy, emergency, or accessibility requirements.

## 26. Binding decision summary

- The public section is **Support Someone You Care About**.
- The central promise is **Help without taking over.**
- The prototype serves supporters of adults with Type 2 diabetes who generally retain decision-making capacity.
- The prototype is United States-focused and localization-ready.
- The five-module learner order is fixed, recommended, and not enforced.
- All four tools are independently accessible and optional.
- Module 2 is the first content prototype.
- Completion requires all five modules plus one personal next step.
- Quiz accuracy and reflection participation do not determine completion.
- Progress is private and non-credentialing.
- The prototype has no linked caregiver account or patient-data access.
- Reflections, What Should I Say?, and Caregiver Self-Check are session-only by default.
- Know the Plan and Shared Support Plan may be deliberately saved on the local device, printed, or exported.
- Every Shared Support Plan requires direct participation or explicit approval by the person living with diabetes.
- The two planning tools remain distinct.
- Emergency direction interrupts education and never waits for interaction.
- Module 4 and Know the Plan require qualified clinical review before medical or emergency user testing and public release.
- The visual system extends the supplied editorial UI while making the caregiver area warmer, relational, practical, and distinct.

## 27. Rule-ID index

| Category | Range | Governs |
| --- | --- | --- |
| SCOPE | `SCOPE-01` to `SCOPE-10` | Audience, prototype limits, product identity |
| AUTONOMY | `AUTONOMY-01` to `AUTONOMY-10` | Decision ownership, privacy, remote support, repair |
| CONSENT | `CONSENT-01` to `CONSENT-15` | Permission, information sharing, plan authority |
| SUPPORT | `SUPPORT-01` to `SUPPORT-08` | Support versus control |
| PRIVACY | `PRIVACY-01` to `PRIVACY-15` | Data minimization, sharing, device risk |
| MEDICAL | `MEDICAL-01` to `MEDICAL-15` | Medical boundaries and three-layer safety |
| EMERGENCY | `EMERGENCY-01` to `EMERGENCY-10` | Urgent interruption and access |
| REGION | `REGION-01` to `REGION-08` | Localization and safe fallback |
| CONTENT | `CONTENT-01` to `CONTENT-20` | Architecture, voice, language, Self-Check |
| SCENARIO | `SCENARIO-01` to `SCENARIO-15` | Illustrative scenarios and dialogue |
| INTERACTION | `INTERACTION-01` to `INTERACTION-08` | Learning value and behavior |
| FEEDBACK | `FEEDBACK-01` to `FEEDBACK-08` | Response quality and tone |
| QUIZ | `QUIZ-01` to `QUIZ-12` | Knowledge checks |
| REFLECTION | `REFLECTION-01` to `REFLECTION-07` | Optional private reflection |
| PROGRESS | `PROGRESS-01` to `PROGRESS-08` | Completion and revisit |
| VISUAL | `VISUAL-01` to `VISUAL-11` | Visual composition and identity |
| MOTION | `MOTION-01` to `MOTION-08` | Purposeful and reduced motion |
| RESPONSIVE | `RESPONSIVE-01` to `RESPONSIVE-10` | Breakpoints, reflow, zoom, print |
| ACCESSIBILITY | `ACCESSIBILITY-01` to `ACCESSIBILITY-20` | WCAG 2.2 AA behavior |
| STORAGE | `STORAGE-01` to `STORAGE-06` | Persistence by tool |
| PRINT | `PRINT-01` to `PRINT-10` | Print and export |
| REVIEW | `REVIEW-01` to `REVIEW-08` | Research and multidisciplinary review |
| CODEX | `CODEX-01` to `CODEX-06` | Implementation handoff |

Future documents must cite these IDs instead of repeating full global rules. A local restatement may clarify application but must not weaken or alter the referenced rule.

## 28. Risks to test in the Module 2 prototype

1. **Permission feels repetitive.** Test whether learners can distinguish different permission contexts without receiving the same lesson repeatedly.
2. **Control is softened into care.** Test whether feedback respects understandable worry while clearly naming pressure, monitoring, and privacy impact.
3. **Autonomy sounds like disengagement.** Test whether learners understand that stepping back from control can coexist with concrete, reliable help.
4. **Boundaries become punishment.** Test whether supporter boundaries remain about sustainable actions rather than leverage over the person.
5. **Cultural duty becomes assumed authority.** Test scenarios with different family expectations without stereotyping or weakening consent.
6. **The “right” dialogue sounds artificial.** Test all dialogue aloud with supporters and adults living with Type 2 diabetes.
7. **Privacy is treated as a disclaimer.** Test whether privacy affects choices, feedback, data flow, and visible save behavior.
8. **Emergency fear distorts ordinary choices.** Test whether learners can distinguish a real urgent interruption from fear-driven monitoring without the app diagnosing.
9. **Interactions repeat narrative.** Apply the interaction value test to every prototype activity.
10. **The module becomes a wall of cards.** Test a relational composition with open space, environmental context, and meaningful consequence mapping.
11. **Mobile stacking breaks meaning.** Verify comparison, dialogue, feedback, and connected-path concepts at 320px and 375px.
12. **Keyboard and screen-reader alternatives feel secondary.** Test equivalent operation before visual polish is approved.
13. **Progress implies mastery.** Test whether users interpret Completed as participation rather than qualification.
14. **Repair is too neat.** Test scenarios where an apology does not immediately resolve tension.
15. **Remote support becomes surveillance.** Test digital checking, repeated messages, and distance-related anxiety.
16. **Learners confuse the two plans.** Even though tools are not built in Module 2, verify that references preserve the difference between relational agreement and clinician-created instruction.

## 29. Remaining unresolved decisions

The following decisions genuinely require repository inspection, governance assignment, clinical review, or prototype evidence:

1. Exact caregiver color, typography, spacing, radius, shadow, and focus tokens after reconciliation with the existing repository.
2. Final Module 2 emotional arc, environmental metaphor, interaction mechanics, and scene rhythm.
3. Whether future module reflections remain strictly session-only or later gain an explicit private-save option. The prototype default remains session-only.
4. Exact local-device protection, retention, and migration behavior for saved plans.
5. Final print and export formats after privacy and accessibility review.
6. Regional configuration owner, review cadence, expiration window, and translated fallback governance.
7. Named editorial, clinical, privacy, accessibility, cultural, and emotional-safety reviewers.
8. Whether multiple supporter profiles are ever needed. They are not approved for the prototype.
9. Cross-account sharing. It is not approved for the prototype.
10. Final analytics boundaries. Free text, self-check responses, plan content, health information, and private reflections remain excluded.

These open items do not block Prompt 2 unless Prompt 2 attempts to finalize behavior that depends on one of them.

# CAREGIVER RELEASE CHECKLIST

## Scope and audience

- [ ] The page or feature serves supporters of an adult with Type 2 diabetes who generally retains decision-making capacity.
- [ ] Situations outside prototype scope are acknowledged without pretending to provide complete guidance.
- [ ] Language includes people who do not identify as caregivers.
- [ ] The experience remains a practical relationship guide rather than a simplified diabetes course.

## Autonomy, consent, and privacy

- [ ] The person living with diabetes remains the primary decision-maker.
- [ ] Every support action is checked for permission, specificity, proportionality, privacy, and ability to decline.
- [ ] Consent is presented as specific, temporary, and withdrawable.
- [ ] Appointment attendance is not treated as authority to speak.
- [ ] Declined support is not labeled noncompliance.
- [ ] No automatic patient-data, glucose, medication, location, adherence, reflection, AI Tutor, or progress access exists.
- [ ] Session-only, local-save, print, export, reset, and deletion behavior is accurately disclosed.
- [ ] Shared-device and accidental-disclosure risks are visible.
- [ ] The Shared Support Plan requires direct participation or explicit approval from the person living with diabetes.

## Support, emotion, and language

- [ ] Support is clearly distinguished from pressure, monitoring, surveillance, coercion, emergency action, and healthy boundaries.
- [ ] Understandable intention is acknowledged without excusing harmful impact.
- [ ] Emotional interpretations remain possible, not diagnosed.
- [ ] Scenarios include more than one plausible perspective and no villain.
- [ ] Dialogue sounds natural when read aloud.
- [ ] Generic AI phrasing, motivational clichés, moral praise, and em dashes are absent.
- [ ] Repair is realistic and does not guarantee immediate resolution.
- [ ] Cultural and family expectations are represented without assumed authority or stereotypes.

## Medical and emergency safety

- [ ] No symptom diagnosis, reading interpretation, treatment target, dose, medication change, or emergency treatment appears.
- [ ] No interaction asks for real glucose values or stores health readings.
- [ ] General education, the person's clinician-created plan, and professional or emergency help remain distinct.
- [ ] Urgent direction appears before education, forms, login, quiz, or interaction.
- [ ] Regional information comes from the controlled configuration.
- [ ] Missing or expired regional content fails safely.
- [ ] Module 4 and Know the Plan have the required qualified clinical review.

## Interactions, quizzes, and reflections

- [ ] Every interaction performs cognitive work not already done by the narrative.
- [ ] Removing the interaction would reduce learning or practice.
- [ ] Every meaningful choice has specific, non-shaming feedback.
- [ ] Mechanics are distinct across the inventory or repetition is justified.
- [ ] No drag-only, hover-only, gesture-only, sound-only, motion-only, or timed interaction exists.
- [ ] Knowledge checks test transfer, application, boundaries, or judgment.
- [ ] Quiz accuracy remains separate from completion.
- [ ] Reflections are optional, private, short, nonclinical, editable within their allowed storage period, and skippable.
- [ ] Reflection content is not sent to AI Tutor, analytics, another account, or a clinical record.

## Progress, storage, print, and export

- [ ] Only approved progress terms are used.
- [ ] No XP, streaks, ranks, badges implying expertise, certificates, or guilt-based reminders appear.
- [ ] Completion requires the approved participation behavior and never implies competence.
- [ ] Tools remain optional and independently accessible.
- [ ] Save state is visible and truthful.
- [ ] Reset and deletion controls work and explain their effect.
- [ ] Print and export include privacy, purpose, authority, region, and review reminders as applicable.
- [ ] Printed material excludes reflections, quiz results, progress, AI Tutor history, and Self-Check responses.

## Visual, responsive, and accessible quality

- [ ] The caregiver area is warm, relational, practical, and visually distinct.
- [ ] The page avoids excessive cards, nested cards, repeated three-column grids, generic gradients, heavy shadows, and decorative icon filler.
- [ ] Environmental imagery and asymmetry support meaning.
- [ ] Layout and reading order work at 320px, 375px, 768px, 1024px, 1440px, and 200 percent zoom.
- [ ] Long and translated text does not clip or obscure controls.
- [ ] Keyboard-only use is complete.
- [ ] Screen-reader names, roles, states, order, and announcements are verified.
- [ ] Focus is visible and managed intentionally.
- [ ] Target sizes, labels, errors, and status messages meet accessibility requirements.
- [ ] Reduced motion preserves the same information and task.
- [ ] Urgent help, local saving, printing, and export remain accessible.

## Sources, review, and Codex acceptance

- [ ] Every medical, emergency, safety, or health claim has a current official or primary source.
- [ ] Claim IDs, dates, use locations, limitations, required review, and status are recorded.
- [ ] Editorial, clinical, privacy, accessibility, cultural, and emotional-safety reviews are complete where required.
- [ ] No unverified “reviewed” or “medically reviewed” claim appears.
- [ ] Codex inspected the repository and received approval for its implementation plan before changes.
- [ ] Approved copy was implemented without rewriting or expansion.
- [ ] Persistence and regional behavior match the specification.
- [ ] Relevant tests, TypeScript, lint, accessibility checks, and production build pass.
- [ ] Every changed file, missing input, and unresolved limitation is reported.

## 30. Readiness for Prompt 2

This document is ready to control Prompt 2. It establishes the binding global system while intentionally leaving complete landing-page copy, complete module content, complete tool content, and the final Codex build prompt for their approved production stages.
