1. Purpose
Health Decoded is a responsive web application designed to guide adults through the first 14 days after a new Type 2 diabetes diagnosis. The prototype demonstrates that structured, gradual education delivered through short interactive lessons can reduce confusion and increase confidence during one of the most overwhelming periods of a patient's life.
The application is not intended to replace physicians, diabetes educators, dietitians, or emergency medical services. It does not provide diagnoses, treatment recommendations, medication adjustments, or blood glucose interpretation. Instead, it explains diabetes using plain language, interactive learning, and AI-assisted education.
The prototype should feel approachable, modern, calm, and trustworthy. Every screen should help users feel more confident than they did before opening the application.

2. Prototype Objectives
The prototype is designed to validate the following hypotheses.
Newly diagnosed patients prefer learning through short daily lessons rather than long educational articles.
Interactive learning improves understanding and retention compared to passive reading.
Patients are more likely to continue learning when education is delivered progressively rather than all at once.
An educational AI assistant reduces confusion by answering questions immediately after lessons.
Patients value confidence and understanding more than additional health tracking tools during the first weeks after diagnosis.
The prototype is considered successful if users complete multiple lessons, report increased confidence, and express interest in continuing beyond the initial 14-day journey.

3. Product Scope
The prototype intentionally focuses on education. Features unrelated to the educational experience are excluded.
Included
User authentication
Four-step onboarding
Dashboard
Fourteen structured lessons
Interactive learning activities
Knowledge quizzes
Reflection journal
Confidence XP
Confidence Map
Educational AI assistant
Medication Library
User profile
Excluded
Blood glucose tracking
Food logging
Carbohydrate counting
Medication reminders
Push notifications
Social features
Caregiver mode
Community forums
Premium subscriptions
Admin dashboard
Clinician accounts
HealthKit or Google Fit integration
Wearables
Analytics dashboards
The prototype should demonstrate one exceptional experience instead of many incomplete ones.

4. Product Principles
Every feature added to Health Decoded must follow these principles.
Principle 1, One Goal Per Screen
Every screen should answer one primary question or ask the user to complete one primary action.
Examples:
Dashboard → Continue today's lesson.
Lesson → Learn one concept.
Quiz → Check understanding.
Medication Library → Learn about one medication.
The interface should never ask users to choose between several equally important actions.

Principle 2, One Concept Per Lesson
Each lesson teaches one major concept.
For example:
Day 1
What is Type 2 diabetes?
Day 2
What happens inside my body?
Day 3
What is blood sugar?
Not:
"What is diabetes, blood sugar, A1C, insulin resistance, medications, exercise, complications, and nutrition?"
Learning should feel manageable.

Principle 3, Learning Through Interaction
Users should interact approximately every 30–60 seconds.
Reading alone is not enough.
Every lesson should alternate between:
Reading
↓
Interaction
↓
Explanation
↓
Question
↓
Animation
↓
Reflection
This rhythm keeps attention high and prevents long blocks of text.

Principle 4, No Punishment
Health Decoded never punishes users.
No streaks.
No losing XP.
No guilt messages.
No "You're behind."
If a user returns after three weeks, they simply continue where they left off.

Principle 5, Every Animation Has Purpose
Animations exist only to improve understanding.
Examples include:
Showing glucose entering the bloodstream.
Demonstrating insulin unlocking a cell.
Showing progress through a lesson.
Confirming a correct answer.
Animations should never exist solely because they look attractive.

5. Overall Information Architecture
The application contains five primary destinations.
Home

Journey

Ask AI

Library

Profile
Every page in the application belongs to one of these destinations.

Home
Purpose:
Show the user's next step.
Contains:
Greeting
Today's Lesson
Confidence Progress
Quick Actions

Journey
Purpose:
Visualize progress through the fourteen-day learning journey.
Contains:
Lesson roadmap
Completed lessons
Locked lessons
Confidence XP

Ask AI
Purpose:
Allow users to ask educational questions.
Contains:
Chat interface
Suggested questions
Previous conversations

Library
Purpose:
Provide educational reference material.
Prototype includes:
Medication Library only.
Future versions may include:
Nutrition
Exercise
Glossary
Myth Busters

Profile
Purpose:
Display user information and application settings.
Contains:
Name
Current day
XP
Completed lessons
Settings
Logout

6. Complete User Journey
Every new user experiences the application in the following order.
Landing Page
      │
      ▼
Create Account
      │
      ▼
Onboarding
      │
      ▼
Dashboard
      │
      ▼
Today's Lesson
      │
      ▼
Interactive Activity
      │
      ▼
Knowledge Quiz
      │
      ▼
Reflection
      │
      ▼
Lesson Complete
      │
      ▼
Dashboard
Every future visit begins at the Dashboard.
The Dashboard always tells the user exactly what to do next.

7. Core Systems
The prototype consists of six independent systems.
1. Authentication System
Responsible for user accounts and secure login.
Does not contain educational content.

2. Lesson Engine
The heart of the application.
Loads lessons from structured JSON.
Controls lesson progression.
Tracks completion.
Unlocks future lessons.
Awards XP.

3. Interactive Learning System
Provides reusable learning components.
Instead of creating fourteen unique lessons, every lesson is assembled from reusable interactive blocks.
Supported interactions:
Multiple Choice
Match the Pair
Drag and Drop
Interactive Diagram
Scenario Question
These five interaction types are sufficient for the prototype.

4. AI Assistant
Educational chatbot.
Capabilities:
Explain concepts.
Simplify difficult language.
Explain medications.
Answer lesson questions.
Restrictions:
No diagnosis.
No treatment advice.
No medication changes.
No emergency guidance beyond directing users to seek medical care.

5. Progress System
Tracks educational progress.
Measures:
Current lesson
Completed lessons
XP
Confidence Level
Does not track:
Blood sugar
Weight
Exercise
Calories
Medication adherence

6. Medication Library
Educational reference.
Each medication page contains:
What it is
Why is it prescribed
How it works
Common side effects
Questions to ask your doctor
When to seek medical attention
All explanations are written in plain English.

8. Prototype Design Goals
The application should feel closer to Duolingo than a hospital portal.
Characteristics:
Bright but not childish.
Modern.
Highly interactive.
Minimal text per screen.
Rounded cards.
Large touch targets.
Smooth transitions.
Immediate feedback.
Simple illustrations.
Consistent layouts.
Every screen should feel lightweight.
No page should resemble a PDF or textbook.

9. Success Criteria
The prototype is complete when a user can:
Create an account.
Finish onboarding.
Complete all fourteen lessons.
Interact with quizzes and activities.
Ask educational questions using AI.
Learn about common medications.
Review completed lessons.
Track progress using the Journey page.
Return later and continue where they left off.
If users consistently say,
"I wish I had this when I was diagnosed."
Then the prototype has achieved its objective.
10. Navigation Philosophy
Health Decoded should never make users wonder where to go next.
Unlike traditional healthcare portals, users should not be presented with a dashboard full of unrelated widgets, graphs, menus, or notifications. Every page should naturally guide them toward the next meaningful action.
The navigation is intentionally minimal. There are only five permanent destinations, and each one has a distinct purpose.
Navigation
Purpose
Frequency
Home
Continue today's lesson
Every visit
Journey
View learning progress
Occasionally
Ask AI
Ask educational questions
Frequently
Library
Look up medications
Occasionally
Profile
Account settings and progress
Rarely

There should never be nested menus or dropdown navigation in the prototype.

11. Global Layout
Every authenticated page uses the same layout structure.
Desktop
+---------------------------------------------------------------+
| Logo                          Profile                         |
+---------------------------------------------------------------+
| Sidebar |                                            Content   |
|         |                                                      |
| Home    |                                                      |
| Journey |                                                      |
| AI      |                                                      |
| Library |                                                      |
| Profile |                                                      |
|         |                                                      |
+---------------------------------------------------------------+
Mobile
+----------------------------------+

Header

Main Content

Bottom Navigation

Home  Journey  AI  Library  Profile

+----------------------------------+
The navigation should never change position between pages. Users should build muscle memory quickly.

12. Design Language
The interface should communicate reassurance before information.
Think:
Headspace
Duolingo
Notion
Apple Health
Not:
Epic MyChart
Hospital patient portals
Insurance websites
The design should feel warm without becoming playful.
Visual Characteristics
Rounded cards
Soft shadows
Plenty of white space
Large readable text
One primary accent color
Friendly illustrations
Smooth animations
Clear hierarchy
Minimal borders
Avoid gradients, glassmorphism, or overly decorative effects. Simplicity builds trust.

13. Color System
The prototype should use a restrained color palette.
Primary Color
A calming blue-green (teal) is used for primary buttons, progress indicators, and active navigation.
Secondary Color
Soft blue for informational elements.
Success
Green for completed lessons and correct answers.
Warning
Amber for reminders or important notices.
Error
Muted red used only when necessary.
Neutral Colors
Several shades of gray for backgrounds, borders, and secondary text.
Bright red should never dominate the interface. The application should never feel alarming.

14. Typography
The application should prioritize readability over branding.
Recommended fonts:
Inter
Geist
SF Pro (Apple devices)
Heading Sizes
Page Title
32px
Section Heading
24px
Card Heading
20px
Lesson Heading
18px
Body Text
16px
Small Labels
14px
Never use body text smaller than 14px.
Paragraphs should rarely exceed four lines before being broken up.

15. Spacing System
Every screen should feel spacious.
Use an 8-point spacing system throughout the application.
Common spacing values:
8px
16px
24px
32px
48px
Cards should have generous internal padding to make reading comfortable on both desktop and mobile.

16. Component Hierarchy
Every screen should follow the same visual hierarchy.
Primary Action – The most important thing the user should do next.
Supporting Information – Context that helps them make a decision.
Secondary Actions – Helpful but optional actions.
Background Information – Details that can be ignored without affecting progress.
For example, on the Dashboard:
Continue Today's Lesson
Progress Summary
Ask AI / Medication Library
Reflection History
This hierarchy should remain consistent throughout the app.

17. Animation Philosophy
Animations should make the interface feel alive without slowing it down.
Principles
Short (150–300ms)
Smooth
Purposeful
Never block interaction
Examples:
Cards fade into view when loaded.
Buttons slightly scale down when tapped.
Progress bars animate smoothly when XP changes.
Lesson completion triggers a brief success animation.
Correct quiz answers animate with a subtle checkmark.
Avoid long transitions, bouncing effects, or excessive motion.

18. Global Components
The prototype uses a small library of reusable components.
Primary Button
Used for the main action on every screen.
Examples:
Continue Lesson
Complete Lesson
Create Account
Only one primary button should appear on most screens.

Secondary Button
Used for optional actions.
Examples:
Review Lesson
Ask AI
Learn More

Information Card
Displays educational content, progress, or summaries.
Every card includes:
Title
Supporting text
Optional icon
Optional action button
Cards should maintain consistent styling throughout the application.

Progress Bar
Used in lessons and the Journey page.
Always accompanied by text (e.g., "Day 4 of 14") so users do not rely on color alone.

Modal
Used sparingly.
Only for:
Confirm logout
Exit lesson
Important warnings
Avoid stacking multiple modals.

19. Loading Experience
Users should always know that something is happening.
Use skeleton placeholders instead of loading spinners whenever possible.
Examples:
Lesson cards
Dashboard sections
Medication pages
The only acceptable full-screen loading state is immediately after login.

20. Empty States
The application should never display a blank screen.
Every empty state should explain what the user can do next.
Example:
No reflections yet.
"You haven't written a reflection yet. After today's lesson, you'll have a chance to write one."
Every empty state should include a helpful next step.

21. Error Handling Philosophy
Error messages should be calm, clear, and actionable.
Good example:
We couldn't load today's lesson. Please check your internet connection and try again.
Bad example:
Error 500: Internal Server Error.
Never expose technical errors to users.

22. Accessibility Standards
Although this is a prototype, accessibility should be built in from the beginning.
Requirements:
Keyboard navigation for all interactive elements.
High color contrast.
Screen reader labels for buttons and inputs.
Minimum touch target of 44 × 44 pixels.
Visible focus states.
Icons paired with text labels where needed.
Accessibility should not be treated as a future enhancement.

23. Prototype Constraints
To keep development focused, the following rules apply:
No feature should require more than three taps from the Dashboard.
Every lesson should be complete in under eight minutes.
Every page should have one clear primary action.
No page should scroll endlessly.
The interface should feel calm rather than feature-rich.
New features should only be added if they directly improve learning or confidence.
When in doubt, choose simplicity over completeness.
