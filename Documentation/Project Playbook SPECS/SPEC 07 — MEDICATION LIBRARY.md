Purpose
The Medication Library is not a drug database.
It is a translation layer between a prescription label and a real person.
Its purpose is to answer the question nearly every newly diagnosed patient asks after leaving the pharmacy:
"Okay...but what does this actually do?"
The Medication Library explains medications in plain English, addresses common concerns, normalizes expected side effects, and helps users prepare better questions for their healthcare team.
It never replaces professional medical advice or tells users to start, stop, or adjust medication.

Product Philosophy
Most medication websites focus on chemistry.
Health Decoded focuses on understanding.
Instead of teaching pharmacology, every medication page should answer five questions:
Why was I prescribed this?
What is it doing inside my body?
What should I expect?
What should I watch for?
What should I ask my doctor next?
If those five questions are answered well, users will leave feeling more confident rather than more anxious.

Information Architecture
The Medication Library contains two experiences.
Medication Library

↓

Browse Medications

↓

Medication Page
The prototype should support the most common medications prescribed during the first few months after diagnosis.
Examples:
Metformin
Ozempic (Semaglutide)
Rybelsus
Jardiance
Farxiga
Januvia
Glipizide
Glyburide
Pioglitazone
Mounjaro (Tirzepatide)
Basal insulin (educational overview only)
The list should be expandable in the future.

Browse Experience
The browse page should feel simple.
Not like an online pharmacy.
Each medication appears as a clean card.
────────────────────────────

Metformin

Most commonly prescribed first medication

→

────────────────────────────

Ozempic

Helps lower blood sugar and appetite

→

────────────────────────────
Cards include:
Medication name
One-line description
Illustration
Arrow
Nothing else.
No dosage.
No warnings.
No prices.

Medication Page
Every medication follows the exact same structure.
Users should know where information lives before they even scroll.

Section 1
Why Was I Prescribed This?
This is the first thing users care about.
Example:
Metformin
Metformin helps lower blood sugar by making your body respond better to insulin and by reducing the amount of sugar your liver releases.
Below it:
In simple words

It helps your body use sugar more effectively.
Every medication page begins this way.

Section 2
What Is It Doing Inside My Body?
Instead of a paragraph,
use animation.
Example
Liver
↓
Produces sugar
↓
Metformin slows that process
↓
Blood sugar decreases
The animation should last under ten seconds.
Users can replay it.

Section 3
What Should I Expect?
This section answers:
When does it start working?
Will I feel anything?
Does it work immediately?
Example
Most people don't "feel"
Metformin working.

Instead,

it quietly helps improve
blood sugar over time.
This prevents unnecessary anxiety.

Section 4
Common Side Effects
This section should be designed carefully.
The goal is education.
Not fear.
Instead of listing twenty possible reactions,
only display common side effects first.
Example
Metformin
• Upset stomach
• Nausea
• Diarrhea
• Less appetite
Each includes:
Why it happens.
Whether it's common.
Whether it usually improves.
Example
Upset stomach

Very common.

Many people notice this
during the first few weeks.

It often improves with time.
Rare side effects should be collapsed under:
Learn about rare side effects
This keeps the page approachable.

Section 5
Tips That Often Help
Examples
Take with food.
Drink enough water.
Take it at the same time each day.
These are educational tips only.
No personalized advice.

Section 6
Questions You Might Want To Ask
Instead of giving medical recommendations,
the app helps users prepare for appointments.
Examples
Should I take this with food?
How long will I stay on this?
Should I check my blood sugar at home?
Are there medications that work differently?
Can this interact with my other medicines?
These can be copied into the user's notes.

Section 7
Myth Busters
Every medication page ends with myths.
Example
Myth
Taking Metformin means my diabetes is severe.
Fact
Metformin is usually the first medication doctors prescribe. Many people start with it because it has been studied for many years and works well for many patients.

Section 8
Remember This
Every medication ends with one sentence.
Example
Metformin doesn't cure diabetes.

It helps your body manage
blood sugar more effectively.
This is the takeaway users should remember.

"Explain It Another Way"
Every medication page supports the same teaching styles introduced in the AI experience.
Users can switch between:
Everyday analogy
Step-by-step
Visual explanation
Everyday story
This keeps the experience consistent across the entire application.

Interactive Features
Medication pages include one lightweight interaction.
Example
True or False
"I should stop taking Metformin if I have mild nausea."
After answering,
the app explains the reasoning in plain English and reminds users to speak with their healthcare team before making changes to prescribed medication.
The goal is reinforcement—not testing.

Search
The search experience should be forgiving.
Searching:
"met"
should find
Metformin.
Searching
"shot"
should suggest
Ozempic
and
Mounjaro.
Searching
"stomach medicine"
should still surface relevant educational content when appropriate.

Safety Boundaries
The Medication Library never:
Suggests medication changes.
Recommends doses.
Compares medications for treatment decisions.
Predicts individual outcomes.
Encourages stopping prescribed medications.
Whenever a question enters clinical decision-making, users are directed back to their healthcare team.

Visual Language
Every medication has a consistent visual identity.
Instead of photographs of pills,
use simple illustrations.
Examples:
Tablet
Injection pen
Liver
Bloodstream
Cell
Animations explain mechanisms.
Illustrations explain concepts.
Photos should be avoided to keep the design timeless and consistent.

Prototype Scope
The prototype includes:
Browse page
Search
Individual medication pages
Simple mechanism animations
Common side effects
Educational tips
Myth Busters
Appointment questions
"Explain It Another Way"
One interactive reinforcement activity per medication
No medication comparison tool.
No refill reminders.
No dosage tracking.
No prescription management.
No pharmacy integration.

Success Criteria
The Medication Library succeeds when a user finishes reading a medication page and feels less anxious than when they started.
Users should leave understanding:
Why they were prescribed the medication.
What it is trying to accomplish.
What common experiences are normal.
What questions they should ask at their next appointment.
When they should seek medical guidance instead of guessing.
The experience should consistently replace uncertainty with clarity.

Engineering Notes
The Medication Library should be built using a reusable content template so every medication follows the same educational structure. Each page should be driven by structured data that includes explanations, animations, common side effects, myths, questions, and key takeaways. This allows new medications to be added without redesigning the interface and ensures every page remains visually and educationally consistent. Mechanism animations should be reusable components that can display different organs, pathways, and medication effects by changing only the underlying data rather than creating custom animations for each medication.
