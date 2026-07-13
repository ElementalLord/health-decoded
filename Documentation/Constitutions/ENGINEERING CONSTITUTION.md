You are building Health Decoded.
Health Decoded is not a generic healthcare app.
It is an educational platform designed to guide people through the first 90 days after a new Type 2 diabetes diagnosis.
The objective is not to maximize features.
The objective is to reduce fear.
Every engineering decision should support that mission.
When in doubt, choose simplicity.

Source of Truth
The Health Decoded specifications are the single source of truth.
If implementation details conflict with assumptions, always follow the specifications.
Do not invent new features.
Do not redesign workflows.
Do not rename concepts unless explicitly instructed.
If information is missing, stop and ask instead of guessing.

Development Philosophy
Health Decoded should feel like one carefully designed product.
Not a collection of pages.
Every screen should look like it belongs to the same application.
Every interaction should reinforce the same calm, educational experience.
Consistency is more important than novelty.

Core Mission
Every feature must help users accomplish one of these goals:
Understand something.
Feel more confident.
Feel less overwhelmed.
Navigate their learning journey.
If a feature does not improve one of these outcomes, it probably should not exist.

Product Principles
The application should always feel:
Calm
Friendly
Modern
Professional
Warm
Accessible
Simple
Never:
Clinical
Complicated
Gamified for the sake of engagement
Overstimulating
Fear-based
Judgmental

UI Principles
Every screen should have one primary action.
Whitespace is intentional.
Typography is more important than decoration.
Animations should reduce cognitive load.
Cards should organize information.
The interface should disappear.
Learning should become the focus.
Never create clutter simply because there is empty space.

Coding Principles
Prefer readability over cleverness.
Prefer explicit code over abstraction.
Prefer reusable components over duplicated code.
Prefer composition over inheritance.
Avoid premature optimization.
Avoid unnecessary libraries.
Do not build for hypothetical future requirements.

Scope Control
This is a prototype.
Do not add features that are not documented.
Examples of features that should never be added without approval:
Community
Forums
Messaging
Blood sugar tracking
Food logging
Charts
Clinician dashboards
AI diagnoses
Treatment recommendations
Social features
Leaderboards
If unsure, ask.

Content Rules
Educational content is data.
Not code.
Lessons must never be hardcoded inside React components.
Medication information must come from the database.
Patient stories must come from the database.
Activities must come from the database.
The frontend renders content.
It does not contain educational material.

AI Rules
The AI Tutor is an educator.
Not a physician.
Not a search engine.
Not ChatGPT.
Never allow the AI to:
Diagnose.
Recommend medications.
Interpret laboratory values.
Replace clinician advice.
The AI teaches.
Nothing more.

Engineering Standards
Every feature should satisfy the following before completion:
Responsive
Accessible
Reusable
Connected to Supabase
Type-safe
Error handled
Loading state included
Empty state included
No console errors
No placeholder buttons
No unused code
No duplicate logic

Design Standards
Only use the approved design system.
Do not introduce:
Random colors
New button styles
New spacing systems
Additional fonts
Different icon libraries
Health Decoded should have one visual identity.

File Organization
Every file should have one responsibility.
Business logic belongs in services.
Rendering belongs in components.
State belongs in hooks or the backend.
Database queries should never exist inside UI components.

Performance Standards
The application should always feel fast.
Prioritize:
Server Components
Code splitting
Lazy loading
Minimal JavaScript
Optimized images
Avoid unnecessary re-renders.

Accessibility Standards
Accessibility is mandatory.
Every interactive element must support:
Keyboard navigation
Screen readers
Visible focus
Reduced motion
WCAG AA contrast
Minimum touch target sizes
Accessibility is never optional.

Code Review Checklist
Before completing any feature, verify:
Does it match the specifications?
Does it introduce unnecessary complexity?
Can the code be simplified?
Is every component reusable?
Is every animation purposeful?
Would another engineer understand this quickly?
Would another AI coding agent understand this quickly?
If the answer to any question is "no," improve the implementation before continuing.

Handling Missing Information
Never invent product decisions.
If implementation requires information that is not documented:
Stop.
Explain what is missing.
Offer two or three reasonable implementation options.
Wait for a decision.
Never guess.

Handling Conflicts
If two specifications appear to conflict:
The order of precedence is:
Engineering Constitution
↓
Newest specification
↓
Older specification
↓
General engineering best practices
If uncertainty remains, ask for clarification.

Definition of Done
A feature is complete only when:
It matches the specifications.
It functions correctly.
It is responsive.
It is accessible.
It follows the design system.
It uses reusable architecture.
It has no obvious bugs.
It includes loading, empty, and error states.
It requires no placeholder content.

Communication Style
While implementing:
Be concise.
Explain important architectural decisions.
Avoid long essays.
Do not repeatedly restate the specifications.
When a decision is required, clearly present the tradeoffs.
Otherwise, continue building.

Final Principle
Health Decoded is not trying to become the biggest diabetes platform.
It is trying to become the most reassuring first experience someone has after hearing the words:
"You have Type 2 diabetes."
Every line of code should move the product closer to that goal.

Final Instruction
When implementing Health Decoded:
Never optimize for speed of completion. Optimize for clarity, consistency, and quality.
Build the product as if it will eventually be used by thousands of newly diagnosed patients who may be scared, overwhelmed, and looking for guidance. Every engineering decision should earn their trust.
