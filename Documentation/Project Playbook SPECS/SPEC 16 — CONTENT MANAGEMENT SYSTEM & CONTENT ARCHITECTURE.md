Purpose
Health Decoded is a content-first application.
The software exists to deliver educational content in the right order, at the right time, in the right format.
The content should never be tightly coupled to the frontend.
Instead, every lesson, activity, medication page, patient story, and caregiver lesson should exist as independent content that the frontend renders dynamically.
This architecture allows clinicians, educators, and future team members to improve educational material without modifying application code.

Core Philosophy
Every piece of educational content answers one question.
Not ten.
One.
A lesson should never attempt to explain an entire topic.
Instead, it should leave the user with one new piece of understanding.
This mirrors how people naturally learn during periods of stress.

Content Hierarchy
All educational content follows a predictable hierarchy.
Program

↓

Journey

↓

Week

↓

Day

↓

Lesson

↓

Section

↓

Interactive Activity

↓

Summary

↓

Reflection

↓

Completion
Every lesson uses this exact structure.
Nothing is optional except the reflection.

Educational Content Types
The prototype contains five primary content types.
1. Daily Lessons
Purpose
Teach one concept.
Examples
"I'm scared."
"What is diabetes?"
"Why did this happen?"
"Can I still eat normal food?"
These are the foundation of the application.

2. Medication Pages
Purpose
Explain one medication.
Not prescribe it.
Not compare it.
Only explain it.
Each page should answer every common patient question in plain English.

3. Patient Stories
Purpose
Normalize experiences.
Patient stories should never provide medical advice.
Instead, they should help users think:
"Someone else felt this way too."
Stories are released weekly.

4. Caregiver Lessons
Purpose
Teach supporters.
These lessons are intentionally shorter than patient lessons.
Every caregiver lesson should answer one question.
Example
How can I help without becoming the diabetes police?

5. Interactive Activities
Purpose
Transform passive reading into active learning.
Every lesson contains exactly one activity.
The activity reinforces today's learning objective.
Not tomorrow's.
Not last week's.

Lesson Template
Every lesson follows the exact same template.
Lesson Title

↓

Estimated Time

↓

Learning Objective

↓

Educational Sections

↓

Interactive Activity

↓

Key Takeaway

↓

Reflection (Optional)

↓

Completion Screen
Consistency reduces cognitive load.
Users should always know what comes next.

Educational Sections
Each lesson contains between three and five educational sections.
Each section follows this structure.
Heading

↓

Short explanation

↓

Visual

↓

Example or analogy

↓

Continue
No section should exceed approximately one minute of reading.

Reading Rules
Every lesson must follow these writing rules.
Average reading level:
Grade 6–8.
Average sentence length:
15–20 words.
Average paragraph:
2–4 sentences.
Avoid:
Medical jargon.
Passive voice.
Long lists.
Walls of text.
Assume no prior medical knowledge.
If a medical term must be introduced, define it immediately.

Lesson Metadata
Every lesson includes metadata used by the application.
Lesson ID

Journey Day

Week

Title

Subtitle

Estimated Time

Primary Topic

Learning Objective

Activity Type

Difficulty

Medical Review Status

Publication Status

Version Number
This metadata allows lessons to be filtered, updated, and versioned without changing the frontend.

Activity Template
Every activity follows the same content model.
Activity Title

↓

Instructions

↓

Interactive Exercise

↓

Feedback

↓

Explanation

↓

Continue
Activities should require less than two minutes to complete.

Supported Activity Types
The prototype supports only eight activity formats.
Match the Pair
Plate Builder
Body Builder
Myth Buster
Confidence Check
Boss Level
Reflection
Explain It Yourself
No additional activity types should be introduced until after usability testing.

Medication Page Template
Every medication page follows one consistent order.
Medication Name

↓

Why You Take It

↓

How It Works

↓

What You Might Notice

↓

Common Side Effects

↓

When to Contact Your Doctor

↓

Questions You Can Ask Your Doctor

↓

Ask AI About This Medication
Every medication page should be understandable in less than five minutes.

Patient Story Template
Every patient story follows the same format.
Title

↓

Short Introduction

↓

Patient Story

↓

What Helped

↓

Key Takeaway

↓

Reflection Prompt
Stories should feel authentic and conversational.
Avoid dramatic language or unrealistic success stories.

Caregiver Lesson Template
Every caregiver lesson contains five sections.
Today's Topic

↓

What Your Loved One May Be Feeling

↓

How You Can Help

↓

What Not To Say

↓

Conversation Starter
The caregiver journey should complement the patient journey, not duplicate it.

Content Release Logic
Users never see all content at once.
Instead:
Day 1 unlocks immediately.
Completing a lesson unlocks the next lesson according to the journey schedule.
Weekly stories unlock at the start of each new week.
Medication pages remain available at all times.
Caregiver lessons unlock alongside the linked patient lesson.
This gradual release reinforces learning and reduces overwhelm.

Versioning
Educational content should support versioning.
When a lesson is updated:
Increment the version number.
Preserve previous versions for audit purposes.
Record the review date.
Record the reviewer.
This supports future clinical review without losing history.

Clinical Review Workflow
Every piece of educational content has one of four statuses.
Draft
In Review
Approved
Published
Only published content should be visible to users.
The prototype does not require a review interface, but the data model should support this workflow.

Content Relationships
Lessons may reference:
Related medications.
Related glossary terms.
Related caregiver lessons.
Related patient stories.
Related AI prompts.
These references should be stored as IDs rather than hardcoded links, allowing relationships to evolve over time.

Search Strategy
The prototype includes a simple search experience.
Users can search:
Lesson titles.
Medication names.
Common questions.
Glossary terms.
Search should prioritize clarity over advanced filtering.

Localization
Although English is the only supported language in the prototype, all content should be stored separately from presentation so future translations require only new content records rather than frontend changes.

Future Content Types
The architecture should allow additional content without redesigning the system.
Examples include:
Prediabetes lessons.
Type 1 diabetes journeys.
Hypertension education.
Heart health modules.
Downloadable guides.
Short educational videos.
Audio lessons.
These should fit naturally into the existing content hierarchy.

Prototype Scope
Included:
Daily lessons
Interactive activities
Medication pages
Patient stories
Caregiver lessons
Lesson metadata
Search
Versioning support
Clinical review status
Excluded:
Rich text editors
AI-generated lesson creation
Video hosting
User-generated content
Community posts
Commenting
Lesson ratings
Content recommendations based on machine learning
The prototype focuses on delivering high-quality, clinician-reviewed educational content.

Success Criteria
The content architecture succeeds when adding a new educational lesson requires only creating structured content rather than writing new frontend code.
Every lesson should feel familiar in structure while remaining unique in subject matter.
Clinicians should be able to improve educational material without needing engineering support.
Most importantly, users should experience a calm, predictable learning journey where every lesson builds naturally on the one before it.

Engineering Notes
Educational content should be represented as structured JSON objects stored in the database rather than raw HTML. Each lesson should consist of reusable section blocks (text, image, callout, activity, summary) that the frontend renders dynamically. This block-based architecture minimizes hardcoded layouts, ensures consistency across all lessons, and makes future expansion—such as adding videos or interactive diagrams—possible without rewriting the rendering engine. The frontend should treat every content type as data, allowing the same rendering components to be reused across lessons, medication pages, caregiver content, and future educational modules.

The Guiding Principle
If there is one sentence that should guide every content decision, it is this:
The software should not know what it is teaching—it should only know how to teach it.
By separating educational content from application logic, Health Decoded becomes far easier to maintain, clinically review, and expand. The application becomes an educational platform rather than a collection of hardcoded pages, ensuring that future improvements can focus on helping patients learn rather than rebuilding the software itself.
