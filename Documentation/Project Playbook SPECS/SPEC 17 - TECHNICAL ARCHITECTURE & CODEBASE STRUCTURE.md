Purpose
This specification defines how the Health Decoded codebase should be organized.
The goal is to produce a codebase that is:
Easy to understand
Easy to expand
Easy to debug
Easy to maintain
Easy for AI coding agents to work on
The architecture should prioritize clarity over cleverness.
Every folder should have one responsibility.
Every file should have one purpose.
Every feature should be isolated.
The prototype should look like a production application rather than a hackathon project.

Technology Stack
Frontend
Next.js 15
React 19
TypeScript
App Router
Tailwind CSS
Framer Motion
Lucide Icons
shadcn/ui

Backend
Supabase
PostgreSQL
Authentication
Storage
Edge Functions

AI
Google Gemini API
Streaming Responses
Server-side prompts only

Payments
Stripe Checkout
Stripe Customer Portal

Deployment
Vercel
Supabase Cloud
GitHub

Architecture Philosophy
The application follows five principles.
1. Feature First
Files should be grouped by feature.
Never by file type.
Bad
/components

/hooks

/pages

/utils
Good
/features

    journey

    ai

    medications

    caregiver

    profile
Every feature owns its components.

2. Reusable UI
Generic UI belongs in one place.
Examples
Button
Card
Modal
Input
Badge
Progress Bar
Dialog
Skeleton
Everything else belongs inside its feature.

3. Business Logic Never Lives Inside Components
React components should display information.
They should not contain complicated logic.
Instead
Component

↓

Hook

↓

Service

↓

Supabase
Every layer has one responsibility.

4. Server First
Use Server Components whenever possible.
Only use Client Components when interaction requires it.
Examples
Lesson Page
Server Component
Confidence Check
Client Component
AI Chat
Client Component
Medication Page
Server Component

5. Simple State
Most state belongs in the database.
Avoid unnecessary global state.

Folder Structure
app/

components/

features/

services/

hooks/

lib/

types/

styles/

public/
Nothing else at the root.

App Directory
Contains routes only.
Example
/

login

onboarding

journey

lesson

ai

medications

caregiver

profile

settings
Routes should stay extremely small.
They assemble features.
They do not implement them.

Components
Contains reusable interface components.
Examples
Button

Card

Input

Badge

Dialog

Header

BottomNavigation

Skeleton

ProgressRing

XPAnimation
These components should never know anything about diabetes.

Features
Every major application feature has its own folder.
journey/

lesson/

activity/

ai/

medication/

caregiver/

profile/

auth/

settings/
Inside each feature
components/

hooks/

services/

types/

constants/
Each feature should be understandable without reading the rest of the project.

Services
Services communicate with external systems.
Examples
supabase.ts

gemini.ts

stripe.ts
No React code belongs here.

Hooks
Reusable logic only.
Examples
useJourney()

useLesson()

useConfidence()

useAI()

useMedication()
Hooks coordinate data.
They do not perform rendering.

Types
Every interface belongs here.
Examples
Lesson

Medication

Activity

Story

CaregiverLesson

Reflection

AIConversation
Avoid inline types whenever possible.

Styling
Tailwind only.
No CSS files except globals.
Avoid inline styles.
No component-specific CSS.

Data Flow
Every screen follows the same pattern.
User

↓

Route

↓

Feature

↓

Hook

↓

Service

↓

Supabase

↓

Service

↓

Hook

↓

Feature

↓

UI
No shortcuts.
No component should directly query the database.

AI Flow
Every AI request follows one pipeline.
Question

↓

Safety Check

↓

Retrieve Context

↓

Build Prompt

↓

Google Gemini API

↓

Stream Response

↓

Store Conversation

↓

Return Answer
No frontend prompt engineering.
Everything happens server-side.

Authentication Flow
Login

↓

Supabase Auth

↓

Session

↓

Profile

↓

Journey

↓

Application
Authentication should remain invisible after login.

Payment Flow
Upgrade

↓

Stripe Checkout

↓

Webhook

↓

Subscription Updated

↓

Premium Content Unlocked
Stripe is always the source of truth.

Error Handling
Errors should be handled at three levels.
User
Friendly messages.
Never technical.

Developer
Console logs.
Stack traces.

Monitoring
Future support for Sentry.
Not required in prototype.

Environment Variables
Only the server accesses secrets.
Examples
SUPABASE_URL

SUPABASE_KEY

GEMINI_API_KEY

STRIPE_SECRET_KEY
Never expose private keys to the client.

Caching
Cache educational content aggressively.
Lessons rarely change.
Medication pages rarely change.
AI responses are never cached.
User progress should always be fresh.

Performance Targets
Home screen
< 1.5 seconds
Lesson
< 1 second
Medication
< 1 second
AI first token
< 2 seconds
Animations
60 FPS
The application should always feel responsive.

Accessibility
Every feature must support:
Keyboard navigation
Screen readers
Reduced motion
Focus states
High contrast
Semantic HTML
Accessibility is a default requirement, not a later enhancement.

Logging
Only log information useful for debugging.
Never log:
Passwords
API keys
Private reflections
AI prompts containing personal information
Medical details that are not necessary for troubleshooting
Privacy takes priority over analytics.

Analytics
The prototype should collect only high-level product events.
Examples
Lesson Started
Lesson Completed
AI Question Asked
Medication Page Viewed
Confidence Check Submitted
Subscription Started
Avoid tracking unnecessary user behavior.
The purpose is product improvement, not surveillance.

Testing Strategy
The prototype should include:
Basic unit tests for utility functions
Integration tests for authentication and lesson progression
Manual testing for AI interactions
Responsive testing on mobile and desktop
Comprehensive end-to-end testing is not required for the prototype but the architecture should support it later.

Deployment Pipeline
Developer

↓

GitHub

↓

Vercel Preview

↓

Review

↓

Merge

↓

Production
Every pull request should generate a preview deployment.
Never deploy directly to production.

Prototype Scope
Included:
Authentication
Journey
Lessons
Activities
AI Tutor
Medication Library
Caregiver Companion
Profile
Settings
Stripe
Supabase
Responsive Design
Excluded:
Microservices
Kubernetes
Docker
Redis
Message queues
Event buses
Multi-region deployments
Offline synchronization beyond basic caching
The architecture should remain intentionally lightweight.

Code Quality Standards
Every function should do one thing.
Every component should solve one problem.
Avoid files longer than approximately 300 lines whenever practical.
Prefer composition over inheritance.
Prefer explicit code over abstraction.
Write code that a new developer can understand in five minutes.
Consistency is more valuable than cleverness.

Success Criteria
The architecture succeeds when a new developer, or an AI coding agent, can clone the repository, understand the project structure within minutes, and confidently add a new feature without restructuring the codebase.
Every feature should feel isolated.
Every layer should have a clear purpose.
Every dependency should flow in one direction.
As the application grows from a prototype into a production product, the architecture should remain stable rather than requiring a major rewrite.

Engineering Notes
The frontend should be built as a collection of independent feature modules communicating through well-defined services rather than tightly coupled components. Database access, AI requests, and payment operations should all be abstracted behind service layers, allowing implementation details to change without affecting the user interface. The project should favor explicitness over abstraction, making it easy for both human developers and AI coding agents to locate functionality, understand data flow, and implement new features without introducing inconsistencies.

The Guiding Principle
If there is one sentence that should guide every engineering decision, it is this:
The codebase should be organized so clearly that the next developer, or the next AI coding agent, can predict where any piece of code belongs before they even search for it.
