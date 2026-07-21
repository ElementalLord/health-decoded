1. Purpose
The Dashboard is the heart of the Health Decoded experience. It is the page users will visit more than any other, and it sets the emotional tone for the entire application.
Unlike a traditional healthcare dashboard, its purpose is not to summarize health metrics, display charts, or overwhelm users with options. Instead, it should immediately answer three questions:
What should I do today?
How am I progressing?
Where can I go if I have a question?
Within five seconds of opening the app, the user should understand exactly what to do next.
The Dashboard should feel calm, personal, and encouraging. It should never feel like homework.

2. Design Philosophy
The Dashboard is designed around one primary action.
Everything else is secondary.
When a user opens the app, they should instinctively tap Continue Today's Lesson without needing to think.
Every other feature exists to support that journey, not distract from it.
If two elements compete for attention, the design has failed.

3. User Goals
When users open the Dashboard, they are usually trying to do one of the following:
Continue today's lesson.
See how far they've come.
Ask a question that's been bothering them.
Quickly look up a medication.
Feel reassured that they're making progress.
The Dashboard should support these goals in exactly that order.

4. Screen Layout
The Dashboard consists of six sections displayed vertically.
──────────────────────────────────────

☀️ Good Morning, Sarah

Day 4 of your journey

──────────────────────────────────────

TODAY'S LESSON

Understanding Blood Sugar

6 minutes

[ Continue Learning ]

──────────────────────────────────────

Confidence

████████░░░░

640 XP

"You're making great progress."

──────────────────────────────────────

Quick Actions

🤖 Ask AI

💊 Medication Library

🗺 Journey

──────────────────────────────────────

Daily Confidence Check

"How confident do you feel today?"

🙂 😐 😟

──────────────────────────────────────

Tiny Celebration (if applicable)

──────────────────────────────────────

Bottom Navigation

Home Journey AI Library Profile

──────────────────────────────────────
No advertisements.
No notifications.
No promotional banners.
No feature announcements.

5. Greeting Section
The greeting is intentionally simple.
It should make the app feel personal without wasting screen space.
Display:
Good Morning
Good Afternoon
Good Evening
Followed by the user's first name.
Example:
Good Morning, Sarah

Day 4 of your journey.
Avoid motivational quotes.
Avoid random facts.
Avoid "Tip of the Day."
The greeting should occupy less than 15% of the screen.

6. Today's Lesson Card
This is the centerpiece of the Dashboard.
It should immediately attract the user's attention.
The card contains:
Day number
Lesson title
Estimated time
Progress (if partially completed)
Continue button
Example:
DAY 4

Understanding Blood Sugar

⏱ 6 minutes

Continue →
Card States
Not Started
Button:
Start Lesson

In Progress
Button:
Resume Lesson
Progress indicator:
"About halfway done"

Completed
Button:
Review Lesson
Small badge:
Completed ✓

Locked
Only visible when previewing future lessons in the Journey page, never on the Dashboard.

7. Confidence Card
This replaces traditional streaks or gamification.
Instead of rewarding daily logins, it celebrates learning.
The card includes:
Current Confidence XP
Confidence Level
Short encouraging message
Example:
Confidence

640 XP

Level 3

"You've completed four lessons."

The wording should describe progress, not achievement.
Avoid phrases like:
"You're crushing it!"
"Keep the streak alive!"
Instead use calm language.
Examples:
"You've learned something new every day this week."
"You're building a strong foundation."
"Every lesson makes future decisions a little easier."

8. Daily Confidence Check
This feature appears once per day.
Purpose:
Help users recognize emotional progress.
Prompt:
How confident do you feel today?
Options:
😟 Not very confident
😐 Getting there
🙂 Pretty confident
Users select one option.
No right answer exists.
The response updates a confidence trend visible later in the Journey page.
Users may skip this question.

9. Quick Actions
Quick Actions provide immediate access to frequently used features without distracting from the primary lesson.
Three cards appear in a single row (desktop) or stack (mobile).

Ask AI
Icon:
Chat bubble
Description:
"Ask any diabetes question."
Action:
Opens AI chat.

Medication Library
Icon:
Medication bottle
Description:
"Learn about your medication."
Action:
Opens Medication Library.

Journey
Icon:
Map
Description:
"See your learning journey."
Action:
Opens Journey page.

These cards should be equal in size and visually secondary to Today's Lesson.

10. Tiny Celebrations
Health Decoded celebrates learning without feeling childish.
Tiny Celebrations appear only after meaningful milestones.
Examples:
First lesson completed.
First quiz passed.
First week completed.
Five AI questions asked.
A celebration appears once and then disappears permanently.
Example:
🎉 Nice work!

You've completed your first lesson.

One step at a time.
Animation:
The card fades in and gently slides upward.
Duration:
Approximately 2 seconds.
No confetti.
No fireworks.
No loud sounds.

11. Empty Dashboard State
Brand-new users see a simplified Dashboard.
Welcome!

Today you'll begin learning what Type 2 diabetes actually is.

The lesson takes about five minutes.

[ Start My Journey ]
Nothing else appears.
No XP.
No confidence.
No Journey.
Everything unlocks naturally after Lesson 1.

12. Returning User Experience
If the user returns after several days:
Never display guilt.
Never mention missed days.
Instead display:
Welcome back.

Your next lesson is ready whenever you are.
This reinforces that progress happens at the user's pace.

13. Microinteractions
The Dashboard should feel responsive and polished.
Lesson Card
On hover (desktop):
Slight elevation.
On tap:
Scales to 98%.

Continue Button
Hover:
Slight color darkening.
Tap:
Small scale animation.

Confidence Bar
Animates smoothly when XP changes.
Duration:
400ms.

Quick Action Cards
Hover:
Soft shadow increase.
Tap:
Quick scale animation.

Daily Confidence Check
Selected emoji enlarges slightly.
Other emojis fade slightly.
Selection animates instantly.

14. Loading State
Instead of spinners, display skeleton placeholders.
Skeletons include:
Greeting
Lesson card
Confidence card
Quick actions
Confidence check
Loading should feel nearly instantaneous.

15. Error State
If Dashboard data cannot be loaded:
Display:
We couldn't load your progress.

Please try again.
Provide:
Retry button.
Do not expose technical details.

16. Accessibility
All Dashboard features must support:
Keyboard navigation
Screen readers
Visible focus states
Minimum 44×44 touch targets
High color contrast
Reduced motion settings
Emoji confidence buttons should also include descriptive text for assistive technologies.

17. Data Required
The Dashboard requires:
User
Name
Current lesson
Current day
Progress
XP
Confidence level
Lessons completed
Confidence Check
Today's response
Historical responses
Celebration State
Milestones already shown

18. API Requirements
On page load:
GET /me

GET /dashboard

GET /progress

GET /confidence-check
On confidence selection:
POST /confidence-check
No additional network requests should occur until the user interacts with the page.

19. Prototype Constraints
To keep the Dashboard focused, the following features are intentionally excluded:
Health charts
Blood glucose graphs
Calories
Weight tracking
Medication reminders
Notifications
Calendar views
Community feed
Achievement badges
Leaderboards
Streak counters
These features distract from the educational mission and increase cognitive load.

20. Acceptance Criteria
The Dashboard is complete when:
Users immediately understand their next step.
The lesson card is the most visually prominent element.
Confidence XP updates automatically after lesson completion.
Users can access AI, the Journey, and the Medication Library in one tap.
Returning users are welcomed without guilt or pressure.
The Dashboard remains usable on desktop, tablet, and mobile.
The interface feels calm, modern, and intentionally minimal.

Product Design Notes
The Dashboard should feel like opening a trusted guidebook rather than logging into a medical portal. Every design decision should reduce anxiety and increase clarity. Users should leave this screen with the feeling that they know exactly what to do next. If a usability test participant can describe the Dashboard as "simple," "calm," and "easy to understand" after only a few seconds, then the design has achieved its goal.
