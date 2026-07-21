Purpose
The Design System exists to ensure every screen in Health Decoded feels like it belongs to the same product.
Users should never notice the interface.
Instead, they should notice how calm they feel while using it.
The interface should reduce anxiety before the first word is read.
Every visual decision should communicate one message:
"You're safe. Take your time."
Health Decoded is not a hospital portal.
It is not a medical dashboard.
It is not a productivity app.
It is a learning companion.

Brand Personality
Every visual decision should reinforce these five traits.
Calm
Nothing competes for attention.
No loud colors.
No flashing animations.
No visual clutter.

Human
The app should feel like it was designed by people who understand patients.
Not by engineers.

Modern
Minimal.
Elegant.
Confident.
Never sterile.

Encouraging
Celebrate understanding.
Never pressure progress.

Trustworthy
Everything should look medically credible without feeling clinical.
Imagine:
Apple Health


Headspace


Notion


A modern healthcare startup.
Not Duolingo.
Not a hospital EMR.

First Impression
When a user opens Health Decoded for the first time,
they should immediately think:
This feels peaceful.
Not
This feels like diabetes.
The diagnosis should never become the visual identity.
Learning should.

Design Principles
Every screen follows seven principles.
1. White Space Is a Feature
Never fill empty space simply because it exists.
Large margins reduce stress.
Content breathes.
Nothing feels crowded.

2. One Primary Focus
Every screen has one obvious action.
Never compete for attention.
If everything is important,
nothing is important.

3. Cards Over Pages
Almost everything should exist inside rounded cards.
Lessons.
Stories.
Medication summaries.
AI suggestions.
Progress.
Cards make large applications feel approachable.

4. Rounded Everything
Sharp edges subconsciously feel technical.
Rounded interfaces feel approachable.
Border Radius
Large cards
24 px
Buttons
18 px
Input fields
16 px
Badges
Full pill radius
Consistency matters more than exact numbers.

5. Typography Leads the Experience
The interface is mostly reading.
Typography is therefore the primary design element.
Not illustrations.
Not animations.

6. Motion Has Meaning
Every animation teaches orientation or provides reassurance.
Nothing moves simply because it looks impressive.

7. Less But Better
Every screen should feel intentionally incomplete.
If something isn't helping today's learning,
hide it.

Color System
Health Decoded intentionally avoids traditional medical colors.
No bright red.
No hospital green.
No alarming orange.
The palette should feel warm and optimistic.
Primary
Soft Blue
Used for:
Primary buttons
Selected states
Progress
Links

Secondary
Warm Teal
Used sparingly for:
Positive moments
Confidence updates
Interactive highlights

Accent
Soft Amber
Used only for:
Tiny celebrations
Unlocked content
Achievement moments
Never use bright yellow.

Success
Muted Green
Used only for:
Completed lessons
Correct interactions
Never for large backgrounds.

Error
Warm Coral
Never aggressive red.
Only used when something genuinely needs attention.

Background
Off White
Not pure white.
Pure white feels clinical.

Surface
White
Cards.
Modals.
Input fields.

Text
Dark Charcoal
Never black.
Reading should feel softer.

Typography
One font family.
No mixing.
Preferred:
Inter
or
Geist
Both are modern,
highly readable,
and work beautifully across web.

Heading Scale
H1
32
H2
26
H3
22
Section
18
Body
16
Caption
14
Small Labels
13
Anything below 13 should not exist.
Many users are older.
Readability wins.

Iconography
Icons should be:
Rounded
Outlined
Simple
Consistent stroke width
Never filled by default.
Preferred icon families
Lucide
or
Phosphor
Never mix icon libraries.

Illustration Style
Illustrations should never resemble medical textbooks.
Instead,
they should depict everyday life.
Examples
Walking outside
Preparing dinner
Shopping
Talking with family
Reading
Cooking
Relaxing
Occasionally include simplified body illustrations only when they directly improve understanding.
Medical diagrams should be educational,
not decorative.

Component Library
The prototype should rely on a very small set of reusable components.
Primary Button
Filled.
Rounded.
Full width on mobile.
Auto width on desktop.
Contains one clear action.
Examples
Continue
Ask AI
Start Lesson

Secondary Button
Outlined.
Used for optional actions.
Never visually compete with the primary button.

Cards
Every card follows the same spacing.
Title
↓
Description
↓
Action
Nothing more.
No dense information.

Input Fields
Rounded.
Large touch target.
Placeholder text in plain language.
Example
Instead of
Type message...
Use
Ask anything about diabetes...

Progress Chips
Small pill-shaped labels.
Examples
Day 4
New
Completed
Unlocked
Never use large banners for status.

Spacing System
Use an 8-point spacing grid.
Primary spacing values
8
16
24
32
48
64
Nothing should be randomly positioned.

Corner Radius
Small
12
Medium
18
Large
24
Extra Large
32
Avoid mixing too many values.
Consistency creates polish.

Shadows
Use one subtle shadow system.
Cards should appear slightly elevated.
Never floating dramatically.
The interface should feel soft.
Not glossy.

Animations
Animations should rarely exceed 300 milliseconds.
Fast enough to feel responsive.
Slow enough to feel intentional.
Preferred transitions
Fade
Slide
Scale (very subtle)
Avoid
Bounce
Shake
Spin
Elastic movement
Animations should lower stress,
not increase stimulation.

Haptic Equivalents
Even though the prototype is web-based,
design interactions as if haptics will exist later.
Example
Lesson Complete
↓
Tiny pulse animation.
Button Press
↓
Subtle scale.
Card Unlock
↓
Soft fade.

Loading States
Never show blank screens.
Use skeleton loaders.
Example
Medication card
↓
Grey placeholder
↓
Content fades in.
The app should always appear responsive.

Empty States
Every empty state should teach or reassure.
Never display:
"No Data"
Instead
"No lessons unlocked yet. Tomorrow's lesson will appear here."

Accessibility
This is mandatory.
Minimum contrast ratio compliant with WCAG AA.
Large tap targets (minimum 44×44 px).
Keyboard navigation supported.
Screen-reader labels for every interactive element.
No interaction should rely solely on color.
Animations should respect reduced-motion preferences.
Body text should never be smaller than 16 px.
The app should remain usable for older adults and users experiencing stress or cognitive overload.

Responsive Design
The prototype is mobile-first.
Everything should work perfectly on phones before expanding to desktop.
Target widths
Mobile
375–430 px
Tablet
768 px
Desktop
1280 px+
Desktop layouts should simply provide more breathing room.
Do not redesign screens for desktop.

Dark Mode
Not included in the prototype.
A carefully designed light theme will produce a stronger first version.
Dark mode can be added after usability testing.

Visual Consistency Rules
Every page should answer yes to these questions:
Can I identify the primary action in under two seconds?
Does the page contain only one visual focal point?
Would removing an element make the page clearer?
Could a first-time user understand the layout without instructions?
Does this page feel calm?
If the answer to any question is "no," simplify the design.

Things Explicitly Excluded
The prototype intentionally excludes:
Glassmorphism
Neumorphism
Complex gradients
3D graphics
Heavy illustrations
Animated backgrounds
Floating action buttons
Parallax scrolling
Decorative charts
Excessive badges
Gamified confetti
Overlapping cards
Dense dashboards
These trends may look impressive but often reduce clarity, accessibility, and trust.

Success Criteria
The design system succeeds when users stop noticing the interface and start focusing entirely on learning.
A successful design makes difficult information feel approachable.
It creates confidence through simplicity, not decoration.
If a user opens Health Decoded after a stressful doctor's appointment and instinctively slows down rather than feeling overwhelmed, then the design system has achieved its purpose.

Engineering Notes
The design system should be implemented as reusable design tokens and shared UI components. Colors, typography, spacing, border radii, shadows, and animation durations should all be centralized so every screen remains visually consistent. Components such as buttons, cards, inputs, badges, headers, and lesson layouts should be built once and reused throughout the application. The goal is for new features to inherit the Health Decoded identity automatically rather than requiring custom styling for each page.

The Guiding Principle
If there is one sentence that should guide every visual decision, it is this:
The interface should disappear. The user's confidence should not.
A beautiful interface isn't one that attracts attention, it's one that quietly helps people feel capable. That should be the defining visual characteristic of Health Decoded.
