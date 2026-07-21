HEALTH DECODED PRODUCT SPECIFICATION
SPEC 02, DESIGN SYSTEM & COMPONENT LIBRARY
Version 1.0 (Prototype)
Status: Frozen

1. Purpose
The Design System defines every reusable visual component in Health Decoded. Instead of designing each page independently, every screen is assembled from a shared set of components that maintain consistent spacing, typography, colors, interactions, and animations.
The design system has one primary goal:
Reduce cognitive load.
Many healthcare applications overwhelm users with dense layouts, excessive information, and inconsistent interfaces. Health Decoded should do the opposite. Every screen should feel predictable, calm, and easy to navigate, especially for users who may be experiencing stress after a recent diagnosis.
A user should never have to relearn how to use the application when navigating between pages.

2. Overall Design Direction
The interface should feel somewhere between Duolingo, Notion, and Apple Health.
It should communicate trust without feeling clinical.
It should communicate warmth without feeling childish.
Every design decision should support learning.
The interface should never compete with the educational content.
If the user remembers the interface more than what they learned, the design has failed.

3. Visual Identity
Health Decoded should be recognizable through consistency rather than decoration.
Characteristics:
Rounded corners
Soft shadows
White backgrounds
Clean typography
Large touch targets
Gentle animations
Friendly illustrations
Minimal icon usage
Consistent spacing
Avoid:
Neon colors
Heavy gradients
Glassmorphism
Sharp corners
Busy backgrounds
Decorative patterns
Excessive icons
Multiple accent colors

4. Layout Philosophy
Every page follows the same visual rhythm.
Page Title

↓

Primary Content

↓

Interactive Content

↓

Supporting Information

↓

Primary Button
Users should naturally read from top to bottom.
Nothing should interrupt that flow.

5. Grid System
Desktop
Maximum content width:
1100px
Lesson content width:
760px
The interface should never stretch across the entire monitor.
Reading becomes uncomfortable when line lengths are too long.

Tablet
Content width automatically reduces.
Cards remain centered.

Mobile
Everything becomes a single column.
No horizontal scrolling.
No two-column layouts.
Buttons span the available width.

6. Spacing System
Health Decoded uses an 8-point spacing system.
Common values:
4px

8px

16px

24px

32px

48px

64px
Cards should never feel cramped.
Whitespace is treated as an interface element rather than empty space.

7. Typography
The application should prioritize readability.
Recommended Font
Inter
Fallback
System UI

Hierarchy
Page Title
32px
Section Title
24px
Card Title
20px
Lesson Heading
18px
Body Text
16px
Supporting Text
14px
Caption
12px

Rules
Maximum paragraph length:
Four lines.
Break long explanations into smaller chunks.
Never justify text.
Always left align.

8. Color Palette
The prototype intentionally limits the number of colors.
Primary
Soft teal.
Used for:
Buttons
Progress
Links
Active navigation

Secondary
Soft blue.
Used for:
Informational cards
Tips
AI responses

Success
Green.
Used only for:
Completed lessons
Correct answers
XP rewards

Warning
Amber.
Used sparingly.
Examples:
Medication reminder.
Important note.

Error
Muted red.
Used only when necessary.
Examples:
Failed login.
Missing internet.
Never use bright red as a primary interface color.

Background
Almost white.
Very light gray page backgrounds.
Pure white cards.

9. Icons
Use a single icon family.
Recommended:
Lucide Icons.
Icons should support content rather than replace text.
Examples:
Home
Book
Message
Medication
Profile
Journey
Checkmark
Lightbulb
Question Mark
Heart
Every icon should have a matching text label.

10. Cards
Cards are the foundation of the interface.
Every major feature exists inside a card.
Cards include:
Lesson cards
Progress cards
Medication cards
AI suggestions
Reflection cards
Cards should have:
Rounded corners (16–20px)
Soft shadow
White background
Comfortable padding
Clear hierarchy
Cards should never contain excessive information.

11. Buttons
The application uses three button styles.

Primary Button
Purpose:
Main action.
Examples:
Continue Lesson
Complete Lesson
Ask AI
Style:
Filled.
Large.
Rounded.
Full width on mobile.
Only one primary button should appear on a screen.

Secondary Button
Purpose:
Supporting actions.
Examples:
Review Lesson
Retry Quiz
Learn More
Outlined.

Text Button
Purpose:
Low-priority actions.
Examples:
Skip Reflection
Back
Cancel
Minimal styling.

12. Input Fields
Inputs should feel approachable.
Used for:
Login
Reflection
AI Chat
Characteristics:
Rounded corners.
Large touch targets.
Visible focus state.
Placeholder examples.
Generous spacing.

13. Progress Indicators
The application contains three types of progress.

Lesson Progress
Displayed during lessons.
Represents completion within a lesson.

Journey Progress
Displayed on Journey page.
Represents completed days.

Confidence XP
Represents cumulative learning.
XP should never imply health improvement.
It only measures educational progress.

14. Animations
Animations should feel smooth and intentional.
Button Press
Scale:
98%
Duration:
120ms

Card Appearance
Fade up.
200ms.

Navigation
Slide.
200ms.

Progress Bar
Animate width.
400ms.

Lesson Completion
Checkmark appears.
XP counter increases.
Confetti does not appear.
Celebration should feel satisfying but mature.

15. Illustrations
Illustrations are educational.
Not decorative.
Examples:
Insulin unlocking a cell.
Blood sugar entering bloodstream.
Healthy plate.
Medication working.
Body organs.
Illustrations should use flat colors.
Avoid cartoon characters.
Avoid mascots.
Avoid clip art.

16. Empty States
Every empty state explains what happens next.
Example:
Reflection
"You haven't written anything yet."
Button
Write Reflection
Example:
Medication Library
"No medications saved yet."
Button
Browse Library

17. Loading States
Avoid loading spinners whenever possible.
Instead use skeleton placeholders.
Examples:
Lesson cards.
Medication pages.
Dashboard.
AI responses may display a typing indicator.

18. Success States
Small celebrations increase motivation.
Examples:
Lesson Complete
A checkmark animates into view.
XP increases.
Confidence bar fills slightly.
The next lesson card becomes visible on the Journey page.
Celebrations should last less than two seconds.

19. Error States
Error messages should always answer three questions.
What happened?
Why?
What can I do now?
Example:
"We couldn't load today's lesson.
Please check your connection and try again."
Provide Retry button.

20. Responsive Behavior
Desktop
Sidebar navigation.
Centered content.
Maximum width.
Tablet
Reduced spacing.
Bottom navigation optional.
Mobile
Bottom navigation always visible.
Cards become full width.
Buttons expand to full width.
No horizontal scrolling.

21. Accessibility
Minimum touch target:
44px.
Keyboard navigation supported.
Screen readers supported.
High color contrast.
Animations respect reduced motion preferences.
Images include descriptive alt text.
Color is never the only indicator of meaning.

22. Component Inventory
The prototype includes the following reusable components:
Primary Button
Secondary Button
Text Button
Lesson Card
Progress Card
XP Card
Confidence Bar
Navigation Bar
Sidebar
AI Chat Bubble
Chat Message
Reflection Input
Quiz Card
Match Pair Card
Drag-and-Drop Area
Scenario Card
Medication Card
Information Banner
Success Dialog
Error Dialog
Loading Skeleton
Empty State
Tooltip
Badge
Progress Ring
Every screen in the prototype should be built exclusively from these reusable components.

23. Prototype Constraints
To maintain a polished MVP, avoid adding new UI components unless they solve a real user problem. Reuse existing components whenever possible to create consistency and reduce development complexity. If a new feature can be built using existing cards, buttons, dialogs, or layouts, that approach should always be preferred over introducing a new design pattern.

24. Acceptance Criteria
The design system is considered complete when:
Every screen shares the same visual language.
Components behave consistently across the application.
Users can recognize primary actions immediately.
Navigation remains consistent on desktop and mobile.
Animations enhance, rather than distract from, learning.
The interface feels modern, calm, and trustworthy.
A new screen can be assembled entirely from the predefined component library without creating additional UI patterns.

Developer Notes
This design system should be implemented using reusable React components with shared styling tokens for spacing, typography, colors, border radius, and animations. Avoid hardcoding styles inside individual pages. Every screen should be composed from this shared library so that visual updates can be made centrally and the application maintains a cohesive, handcrafted feel rather than appearing as a collection of unrelated templates.
