1. Purpose
The Lesson Experience is the core product of Health Decoded. It is the reason the application exists.
Unlike traditional diabetes education, which often relies on long PDFs, brochures, or hour-long appointments, Health Decoded teaches one small concept at a time through a sequence of short, interactive screens. Every lesson is designed to feel more like completing a Duolingo session than reading an online article.
The objective is not to finish information quickly. The objective is to help users understand, remember, and feel confident enough to apply what they learned in everyday life.
Every lesson should leave users thinking:
"That actually made sense."

2. Design Principles
Every lesson follows six principles.
1. One Concept
A lesson teaches exactly one major idea.
Examples:
What is diabetes?
What is blood sugar?
What is insulin?
Why was I prescribed metformin?
Never combine unrelated concepts into the same lesson.

2. One Screen = One Thought
No screen should attempt to explain multiple ideas.
Good example:
Blood sugar is simply sugar that travels
through your bloodstream.
Bad example:
Blood sugar comes from carbohydrates,
insulin moves it into cells, the pancreas
produces insulin, A1C measures average
blood sugar...
If the user has to reread the screen, there is too much information.

3. Interaction Every Minute
Users should never read for more than approximately one minute without interacting.
Possible interactions:
Tap
Drag
Match
Choose
Reveal
Swipe
Build
Learning happens through participation.

4. Immediate Feedback
Every interaction immediately explains why an answer is correct or incorrect.
Never simply display:
❌ Incorrect
Instead:
Almost.

Blood sugar isn't bad.

Your body actually needs it.

The problem is when too much stays
in your bloodstream.
Users should feel taught rather than graded.

5. No Failure
Lessons cannot be failed.
Quizzes exist to reinforce learning.
Unlimited retries.
Wrong answers become learning opportunities.

6. Small Wins
Every lesson should contain several moments that make users feel successful.
Examples:
✓ Correct answer
✓ Body animation completes
✓ Progress bar advances
✓ Confidence XP increases
Tiny successes create motivation.

3. Lesson Length
Every lesson should take approximately:
5–8 minutes
Average breakdown:
Section
Time
Introduction
30 sec
Learning
2 min
Interaction
2 min
Quiz
2 min
Reflection
30 sec

No lesson should exceed ten minutes.

4. Lesson Structure
Every lesson follows exactly the same structure.
Welcome

↓

Question

↓

Explain

↓

Interaction

↓

Explain

↓

Mini Challenge

↓

Knowledge Check

↓

Reflection

↓

Celebration

↓

Return Home
Users should recognize this rhythm after two or three lessons.

5. Opening Screen
Every lesson begins with a calm introduction.
Example:
DAY 4

Understanding Blood Sugar

⏱ 6 minutes

Today you'll learn what blood sugar
actually is and why everyone has it.

[ Start ]
No scrolling.
One button.

6. Curiosity Hook
Every lesson starts with a question.
Examples:
If sugar is bad...

Why does everyone have blood sugar?
or
Why would your doctor prescribe
metformin?
The answer is intentionally withheld for one or two screens.
Curiosity increases engagement.

7. Educational Screens
Educational screens follow one format.
Large illustration

↓

One sentence headline

↓

Short explanation

↓

Continue
Example:
Blood sugar is your body's fuel.

Just like a car needs gasoline,
your body needs sugar for energy.
Maximum:
Two short paragraphs.
Never exceed roughly 80–100 words on one screen.

8. "Can You Explain It Simpler?"
Every educational screen contains a small secondary button.
Can you explain that differently?
When tapped, the explanation rewrites itself using simpler language.
Example:
Original:
Insulin allows glucose to enter cells.
Simplified:
Think of insulin like a key.

It unlocks your cells so sugar can
go inside and be used for energy.
This is one of the signature features of Health Decoded.

9. Interactive Learning
Every lesson contains at least one major interactive activity.
The prototype supports six activity types.
Match the Pair
Match:
Blood Sugar → Energy
Insulin → Key
Pancreas → Makes insulin

Drag & Drop
Drag sugar into the bloodstream.
Then drag insulin to unlock the cell.

Build the Body
Tap organs to discover what each one does.
Only the relevant organs appear.
No anatomical complexity.

Interactive Story
Example:
Meet Sarah.

She just finished lunch.

What happens next?
Users make choices.
The story responds.

Scenario Card
You forgot one dose of metformin.

What should you do?
The answer teaches rather than tests.

Reveal Cards
Tap to reveal myths.
"Myth"
↓
"Fact"

10. Animations
Animations should teach.
Example:
Instead of reading:
"Insulin moves sugar into cells."
Users watch:
Sugar enters bloodstream.
↓
Insulin appears.
↓
Cell unlocks.
↓
Sugar moves inside.
↓
Energy icon appears.
The animation lasts about 5–7 seconds and can be replayed.
Animations should explain concepts that are difficult to visualize with words alone.

11. Knowledge Check
Instead of presenting a traditional five-question quiz on one page, the knowledge check should feel like a continuation of the lesson. Questions appear one at a time, each with generous spacing and large tap targets.
Each question follows the same flow:
Question

↓

Choose Answer

↓

Immediate Explanation

↓

Next Question
The explanation is always shown, even when the answer is correct, because the purpose is reinforcement rather than assessment.
Questions should use realistic situations whenever possible instead of asking users to memorize definitions.

12. Reflection
Reflection should be optional and intentionally brief.
Instead of asking users to write a journal entry, prompt them with one simple question:
What is one thing that surprised you today?
or
What's one idea you'll remember from today's lesson?
The reflection box is limited to 250 characters and can be skipped without penalty.

13. Lesson Completion
Completing a lesson should feel rewarding but mature.
The completion screen includes:
A green checkmark animation
Confidence XP earned
Three key takeaways
A preview of tomorrow's lesson
Example:
✓ Lesson Complete

+200 Confidence XP

Today you learned:

• What blood sugar is.
• Why everyone has it.
• Why high blood sugar matters.

Tomorrow:

How insulin works.

[ Continue ]
The celebration lasts no more than two seconds and avoids confetti or exaggerated effects.

14. Prototype Constraints
To maintain a focused MVP, each lesson should include:
One learning objective
Five to ten educational screens
One major interactive activity
Three to five knowledge-check questions
One optional reflection
One completion screen
No lesson should introduce more than one new interaction type unless it clearly improves understanding.

15. Acceptance Criteria
The Lesson Experience is complete when:
A user can finish any lesson in under eight minutes.
Every lesson follows a consistent rhythm and structure.
Educational content is broken into digestible screens rather than long pages.
Users interact frequently enough to stay engaged.
Incorrect answers always teach rather than punish.
The "Can You Explain It Simpler?" feature is available on every educational screen.
Lesson completion feels satisfying without relying on excessive gamification.
Users leave each lesson understanding one key concept and feeling more confident than when they started.

Developer Notes
The Lesson Experience should be built as a reusable engine rather than fourteen individually coded pages. Each lesson should be driven by structured content (JSON or Markdown) that defines the sequence of screens, interactions, animations, and quizzes. This allows the engineering team to create a single lesson renderer that can display any lesson by interpreting its content structure. Doing so dramatically reduces maintenance, keeps the user experience consistent, and makes expanding from a 14-day prototype to a 90-day program straightforward without rewriting the application.
