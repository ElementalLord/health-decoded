Purpose
The Journey is not a progress tracker.
It is the emotional backbone of Health Decoded.
Most educational apps answer the question:
"How much have I completed?"
Health Decoded answers a different question:
"What do I understand now that I didn't understand before?"
Every lesson should remove one fear.
Every lesson should answer one question.
Every lesson should replace uncertainty with confidence.
The Journey is simply a visual representation of that transformation.
When users open this page, they should immediately think:
"I've already learned more than I realized."

Product Philosophy
A diabetes diagnosis often feels like standing at the bottom of a mountain.
There are medications.
Food.
Blood sugar.
Exercise.
Complications.
Appointments.
Numbers.
Everything feels impossible.
Health Decoded intentionally hides the mountain.
Instead, it shows the next step.
The Journey is therefore not measured by distance.
It is measured by understanding.

Core Principle
Instead of showing users what they have left...
show them what they have already gained.
Every completed lesson permanently becomes something they now understand.
Example:
Instead of
✓ Lesson 6 Complete
the interface becomes
✓ I understand what blood sugar is.
That subtle wording changes the entire emotional experience.

Information Architecture
The Journey page contains five sections.
Header

↓

Today's Focus

↓

Learning Journey

↓

Confidence Snapshot

↓

Weekly Reflection
Nothing else.
No advertisements.
No statistics dashboard.
No distracting widgets.
Every element should reinforce learning.

Header
The page begins with one calming sentence.
Examples:
Every lesson answers one question people commonly have after diagnosis.
or
You don't have to learn everything today.
or
Keep learning at your own pace.
This text changes occasionally but always reinforces the philosophy of gradual learning.
Below it:
Your Journey

14 Questions

7 Answered
Notice what is not displayed.
No percentage.
No XP.
No streak.
The focus is understanding.

Today's Focus
Immediately below the header is the next lesson.
Only one lesson is emphasized.
Never show multiple primary actions.
Example
TODAY

Understanding Blood Sugar

6 minutes

Continue →
Below the card:
Small supporting text
Most people wonder this during their first week.
This reassures users that the lesson is relevant.

The Learning Journey
This is the heart of the page.
Instead of looking like Duolingo's map, it resembles a clean vertical pathway.
Each lesson represents one real question.
Example
●

What is Type 2 Diabetes?

↓

●

What Happened Inside My Body?

↓

⭐

What Is Blood Sugar?

↓

○

How Does Insulin Work?

↓

○

Why Was I Prescribed Metformin?
The visual language is intentionally calm.
Completed lessons become brighter.
Future lessons remain muted.
Current lesson gently pulses.
No excessive animation.

Lesson Cards
Every stop on the Journey is represented by a card.
Each card contains only four things.
Lesson title.
Estimated time.
Status.
Small illustration.
Nothing else.
No percentages.
No XP.
No timestamps.
The purpose is clarity.

Card States
Completed
The title changes.
Instead of
Understanding Blood Sugar
it now reads
✓ I understand blood sugar.
The illustration becomes fully colored.
The connecting line behind it softly fills.
The user subconsciously sees confusion turning into understanding.

Current Lesson
The current lesson gently breathes.
Animation:
Scale
100%
↓
102%
↓
100%
Duration:
3 seconds.
This subtle movement naturally attracts attention without feeling distracting.

Future Lesson
Future lessons remain visible.
Users can tap them.
Instead of opening the lesson, a preview appears.
Example
Tomorrow

How Insulin Works

You'll learn why insulin is often called a key.

Estimated time

5 minutes.
This creates curiosity without overwhelming the user.

No Artificial Locks
This is an important product decision.
Health Decoded does not force users to wait until tomorrow.
If someone wants to continue learning,
they should be allowed to.
Instead, after completing today's lesson,
display
Nice work.

Today's recommended lesson is complete.

Would you like to stop here,

or continue learning?
Buttons
Continue Tomorrow
Continue Now
Education should never be artificially restricted.

Confidence Snapshot
The confidence section intentionally avoids scores.
Instead, it answers one question.
How comfortable am I becoming?
The visualization is simple.
Confidence

●●●○○○○
Seven circles.
Each filled circle represents meaningful progress through the early learning journey.
Below it
You're beginning to understand
the basics of diabetes.
As confidence grows
the description changes.
Examples
Getting Started
↓
Building Understanding
↓
Feeling More Confident
↓
Ready for Everyday Decisions
These labels describe emotional progress rather than achievement.

Tiny Celebrations
Celebrations occur rarely.
Because of that,
they feel meaningful.
Examples
First Lesson
Great start.

You answered your first important question.
Week One
One week ago,

this diagnosis probably felt overwhelming.

Look how much you've learned.
Halfway
You're beginning to make everyday decisions
with more confidence.
No confetti.
No fireworks.
No achievement badges.
The words themselves are the reward.

Weekly Reflection
After Day 7,
the Journey pauses.
Instead of immediately pushing another lesson,
users see
Take a moment.

Think back to Day 1.

What's one thing that feels less confusing now?
Optional text box.
Maximum
250 characters.
Users can skip it.
The purpose isn't journaling.
It's helping users recognize their own growth.

Returning Users
This interaction is critical.
Many users will disappear for several days.
When they return,
never mention missed days.
Never say
"You've been gone."
Never mention streaks.
Instead
Welcome back.

Your next lesson is ready whenever you are.
This removes guilt.

Visual Language
As the Journey progresses,
the interface slowly becomes more colorful.
Completed lessons brighten.
Illustrations gain color.
The pathway fills.
Nothing dramatic.
The page should subconsciously communicate
"I'm making progress."

Motion Design
Motion always communicates meaning.
Lesson completed
↓
Checkmark draws itself.
↓
Path softly fills.
↓
Card brightens.
↓
Next lesson becomes active.
Duration
Approximately
800ms.
No motion should feel decorative.
Every animation communicates progress.

Prototype Scope
The prototype includes
14 Journey cards.
Confidence Snapshot.
Weekly Reflection.
Tiny Celebrations.
Lesson previews.
Current lesson highlighting.
Completed lesson transformations.
No additional mechanics.

Things Explicitly Excluded
The Journey intentionally excludes
Leaderboards.
Daily streaks.
Friends.
Competitions.
Badges.
Avatar customization.
Coins.
Lives.
Daily login rewards.
Experience boosts.
Share buttons.
Social feeds.
Health Decoded should never pressure users to engage through artificial gamification.
Understanding is the motivation.

User Success Criteria
After using the Journey for two weeks,
users should be able to scroll back to Day 1 and immediately recognize how much uncertainty has disappeared.
The Journey succeeds if users stop measuring progress by the number of lessons completed and instead begin measuring progress by the number of questions they no longer need to ask.

Engineering Notes
The Journey should be implemented as a reusable timeline component driven entirely by structured lesson metadata rather than hardcoded screens. Each lesson card should derive its title, estimated time, illustration, status, preview text, and completion state from a central lesson configuration. This allows the entire 90-day experience to scale simply by adding new lesson data instead of creating new UI components. Animations should be declarative, lightweight, and consistent across all lesson states so the experience remains polished without increasing implementation complexity.
