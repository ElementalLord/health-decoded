Purpose
This specification defines every screen in the prototype and how users move between them.
The goal is not to describe individual features.
Those have already been defined.
The purpose of this document is to define how the entire application feels as one continuous experience.
Every screen should answer one question.
Every button should have one purpose.
Every transition should feel intentional.
If a first-time user can navigate the application without instructions, this specification has succeeded.

Navigation Philosophy
Health Decoded should never feel like browsing a website.
It should feel like progressing through a guided journey.
Every screen should naturally lead to another.
There should never be dead ends.
Whenever a user finishes something,
the application immediately answers
"What should I do next?"

Complete Screen Map
The prototype contains only twelve primary screens.
Nothing else.
Authentication

↓

Onboarding

↓

Journey (Home)

↓

Daily Lesson

↓

Interactive Activity

↓

Lesson Complete

↓

Ask AI

↓

Medication Library

↓

Medication Detail

↓

Caregiver Companion

↓

Profile

↓

Settings
Everything in the application branches from these screens.
No hidden pages.
No secondary dashboards.
No unnecessary complexity.

Screen 1 — Authentication
Purpose
Allow users to securely access their journey.

Components
Health Decoded logo
Welcome message
Email field
Password field
Continue button
Google Sign-In
Forgot password
Create account

Primary Action
Continue

Secondary Actions
Google Sign-In
Forgot Password
Create Account

Success Flow
Login

↓

Profile Found

↓

Journey

Screen 2 — Onboarding
Shown only once.
Purpose:
Understand enough about the user to personalize their experience.
Nothing more.

Questions
When were you diagnosed?
Who are you using Health Decoded for?
Myself
Someone I care about
Both
Preferred name
Notification preference
That's it.
No health questionnaires.
No weight.
No A1C.
No medications.
The onboarding should take less than two minutes.

Completion
Finish

↓

Day One unlocked

↓

Journey

Screen 3 — Journey (Home)
This is the heart of the application.
Users always return here.

Layout
Top greeting
Today's lesson card
Confidence Map preview
Continue Learning button
Quick Ask AI card
Weekly Story preview
Medication shortcut (only if relevant)
Bottom navigation

Primary Action
Continue today's lesson.
Nothing should visually compete with this button.

Dynamic Content
The Journey changes based on progress.
Week One looks different than Week Six.
The interface quietly grows with the user.

Screen 4 — Daily Lesson
Every lesson follows exactly the same structure.

Layout
Lesson title
Estimated time
Progress indicator
Educational cards
Interactive example
Summary
Continue button

No scrolling walls of text.
Every section fits comfortably on the screen.

Navigation
Continue
↓
Interactive Activity

Screen 5 — Interactive Activity
One activity.
One learning objective.
No distractions.

Layout
Activity title
Instructions
Activity
Feedback
Continue

Supported activities
Match Pair
Body Builder
Plate Builder
Myth Buster
Confidence Check
Boss Level
Reflection
Explain It Yourself

Completion
↓
Lesson Complete

Screen 6 — Lesson Complete
This is one of the most emotionally important screens.
Purpose:
Pause.
Celebrate.
Preview tomorrow.

Layout
Checkmark animation
Tiny celebration
Confidence XP
One sentence summary
Tomorrow's preview
Return Home

This screen should last less than fifteen seconds.

Screen 7 — Ask AI
The AI receives its own dedicated experience.
Not a popup.
Not a floating widget.

Layout
Conversation list
Current conversation
Suggested questions
Input box
Explain Differently button
Safety disclaimer

Empty State
Example questions
What is A1C?
Can I eat pizza?
What does Metformin do?
Why am I still tired?

The empty state teaches users how to use the AI.

Screen 8 — Medication Library
Purpose
Simple explanations.
Not prescriptions.

Layout
Search
Medication categories
Recently viewed
Alphabetical list

Every medication card includes
Name
Purpose
Short description

Opening one
↓
Medication Detail

Screen 9 — Medication Detail
Purpose
Answer every question someone commonly asks about one medication.

Sections
What it does
Why you take it
How it works
Common side effects
Questions for your doctor
When to seek medical care
Related AI questions

No dosage calculators.
No personalized advice.

Screen 10 — Caregiver Companion
Purpose
Help loved ones support the patient.

Layout
Today's caregiver lesson
How to help
What not to say
Conversation starter
Weekly caregiver story

Should feel shorter than the patient experience.

Screen 11 — Profile
Purpose
Show progress.
Nothing else.

Layout
Profile picture
Journey progress
Lessons completed
Confidence XP
Achievements
Settings shortcut

No charts.
No statistics overload.

Screen 12 — Settings
Purpose
Simple personalization.

Options
Notifications
Reduced motion
Font size
Language
Privacy
Subscription
Log out

Nothing unrelated to the user experience.

Global Components
Every screen shares these components.
Navigation bar
Page header
Primary button
Secondary button
Card
Modal
Loading skeleton
Toast notification
Bottom sheet
Confirmation dialog
No screen creates its own unique components unless absolutely necessary.

Global Button Rules
Every screen has exactly one primary button.
Examples
Continue
Start Lesson
Ask AI
Finish
Begin
Everything else is secondary.
Users should never hesitate about what to tap.

Screen Transitions
Transitions communicate progress.
Authentication
↓
Fade
Journey → Lesson
↓
Slide left
Lesson → Activity
↓
Slide left
Activity → Complete
↓
Fade
Complete → Journey
↓
Slide right
Modal
↓
Slide up
Close
↓
Slide down
Animations never exceed 300 ms.

Loading States
Every screen defines a loading state.
Journey
↓
Skeleton lesson card
Lesson
↓
Skeleton content cards
Medication
↓
Skeleton medication card
AI
↓
Typing indicator
Users should never see blank pages.

Error States
Errors should always explain what happened.
Instead of
Error 500
Use
We couldn't load today's lesson. Please try again in a moment.
Always provide one recovery action.
Retry.
Return Home.
Ask AI.
Never trap the user.

Offline Behavior
The prototype should gracefully handle temporary network loss.
If offline:
Previously loaded lessons remain readable.
AI displays that it requires an internet connection.
Progress syncs automatically when the connection returns.
The app should never lose completed lesson progress because of a brief disconnect.

Accessibility
Every screen must support:
Keyboard navigation.
Screen readers.
Large touch targets.
Reduced motion.
High contrast.
Consistent focus order.
No interaction should require precise gestures.

Prototype Scope
Included:
Authentication
Onboarding
Journey
Daily Lesson
Interactive Activities
Lesson Complete
Ask AI
Medication Library
Medication Detail
Caregiver Companion
Profile
Settings
Excluded:
Community
Push notifications
Blood glucose tracking
Clinician portal
File uploads
Appointment scheduling
Social sharing
Leaderboards
Messaging
The prototype intentionally remains focused.

Success Criteria
The application flow succeeds when users stop thinking about screens and begin thinking about their journey.
Every transition should feel obvious.
Every button should feel expected.
Every completed lesson should naturally lead to the next meaningful action.
A successful Health Decoded prototype feels less like navigating software and more like being guided by a thoughtful companion.

Engineering Notes
The application should be implemented using a route-based architecture where each primary screen corresponds to a top-level route, while reusable layouts, cards, buttons, and navigation components are shared throughout the application. Screen state should be driven by backend data rather than hardcoded logic, allowing content updates without frontend changes. Navigation should be predictable, animations should remain consistent across all screens, and every new feature added in the future should fit into this existing flow rather than introducing entirely new navigation patterns.

The Guiding Principle
If there is one sentence that should guide every frontend implementation, it is this:
Every screen should answer one question, every interaction should teach one idea, and every transition should make the next step feel obvious.
