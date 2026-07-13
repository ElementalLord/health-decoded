Purpose
The backend exists for one reason:
Remember where every user is in their journey and deliver the right content at the right time.
Health Decoded is not a social platform.
It is not a fitness tracker.
It is not an EMR.
The backend should remain intentionally lightweight.
Every piece of stored data should directly improve the user's learning experience.

Technology Stack
Backend
Supabase
Database
PostgreSQL
Authentication
Supabase Auth
Storage
Supabase Storage
Security
Row Level Security (RLS)
Server Logic
Supabase Edge Functions (only when necessary)
Payments
Stripe
AI
Claude API
The prototype should avoid unnecessary microservices.
Everything should live inside Supabase unless there is a strong reason not to.

Core Backend Principles
The backend follows six principles.
1. Content Driven
The frontend should never contain lesson text.
Every lesson comes from the database.
This allows clinicians to update lessons without deploying new code.

2. Progress Driven
Nothing is hardcoded.
Every unlocked lesson depends on user progress.

3. Modular
Lessons
Stories
Medications
Activities
Reflections
AI prompts
should all be independent.
Nothing should depend on another table unnecessarily.

4. Read Heavy
Users mostly read.
They rarely write.
Optimize for reading content quickly.

5. Future Proof
The database should support:
Type 2
Prediabetes
Type 1
Hypertension
Heart disease
without redesigning the schema.

6. Simple
Only store data that the application actually needs.

Database Architecture
The prototype consists of twelve primary tables.
auth.users
        │
        ▼
profiles
        │
        ├───────────────┐
        ▼               ▼
user_progress      user_settings
        │
        ▼
lesson_progress
        │
        ▼
confidence_history

lessons
activities
medications
patient_stories
caregiver_lessons

ai_conversations

reflection_entries
Each table has one clear responsibility.

Table 1 — Profiles
Stores user information.
Columns
id (UUID)

full_name

email

diagnosis_date

created_at

updated_at
Future fields
Diagnosis type
Preferred language
Timezone
Never store medical values like A1C in the prototype.

Table 2 — Lessons
Stores every educational lesson.
Columns
id

day_number

title

subtitle

lesson_type

estimated_minutes

unlock_order

body_content

summary

activity_type

medical_reviewed

published

created_at
Example
Day 1

I'm Scared

5 minutes

Reflection

Activity:
Confidence Check

Table 3 — Activities
Every lesson references one activity.
Columns
id

lesson_id

activity_type

configuration

correct_answers

explanation

created_at
Activity types
Match Pair
Plate Builder
Body Builder
Boss Level
Reflection
Myth Buster
Explain It Yourself
The frontend renders the activity based on the type.

Table 4 — Lesson Progress
Tracks completion.
Columns
id

user_id

lesson_id

completed

completed_at

xp_awarded

confidence_before

confidence_after
This table determines
Unlocked lessons
Journey progress
Confidence Map
Completion percentage

Table 5 — User Progress
Stores overall journey state.
Columns
user_id

current_day

current_lesson

lessons_completed

confidence_xp

last_active

journey_started

journey_completed
This table powers the Home screen.

Table 6 — Medications
Stores medication content.
Columns
id

generic_name

brand_names

category

purpose

plain_language

how_it_works

common_side_effects

when_to_call_doctor

questions_for_doctor

medical_reviewed
Each medication page is entirely database-driven.

Table 7 — Patient Stories
Stores weekly stories.
Columns
id

week_number

title

story_body

key_takeaway

published
Stories can easily be replaced without changing code.

Table 8 — Caregiver Lessons
Stores caregiver content.
Columns
id

linked_day

title

lesson_body

support_tip

conversation_prompt

published
Every patient lesson can optionally reference a caregiver lesson.

Table 9 — Reflection Entries
Stores optional reflections.
Columns
id

user_id

lesson_id

reflection

created_at
Maximum length
300 characters.
No sentiment analysis.
No emotional scoring.

Table 10 — Confidence History
Stores confidence check-ins.
Columns
id

user_id

lesson_id

confidence_level

created_at
Values
Not Yet
Somewhat
Confident
This powers the Confidence Map.

Table 11 — AI Conversations
Stores AI history.
Columns
id

user_id

created_at

conversation_title
Messages should live in a separate child table.

AI Messages
Columns
id

conversation_id

role

content

timestamp
This mirrors modern chat applications and allows conversations to scale efficiently.

Table 12 — User Settings
Stores preferences.
Columns
user_id

notifications_enabled

preferred_font_size

reduced_motion

dark_mode

language

timezone
Dark mode remains disabled in the prototype but the field allows future expansion.

Authentication Flow
Only three authentication methods are required.
Email + Password
Google Sign-In
Magic Link (optional)
After registration:
Create user in auth.users.
Create profile record.
Initialize user_progress.
Unlock Day 1.
Redirect to onboarding.

Lesson Unlock Logic
This is intentionally simple.
A lesson unlocks when:
The previous lesson is completed.
Or the required waiting period has passed (if using timed unlocks).
The backend should expose a simple API:
GET /journey

↓

Returns

Current lesson

Completed lessons

Next lesson

Progress
The frontend never calculates unlock logic.

AI Permissions
The AI never accesses:
Passwords
Payments
Authentication tokens
Private clinician notes
The AI only receives:
Lesson context (optional)
Medication content
User question
Previous conversation (current thread only)
This minimizes privacy risks and token usage.

Stripe Integration
Only store the minimum billing information.
Fields
user_id

stripe_customer_id

subscription_status

plan

renewal_date
Never store credit card information.
Stripe remains the source of truth.

Storage
Supabase Storage is used only for:
Illustrations
Patient story images
Medication icons
Future downloadable PDFs
User uploads are not part of the prototype.

Row Level Security
Every user can:
Read their own progress.
Read published lessons.
Read medications.
Read caregiver content.
Create reflections.
Update their own profile.
They cannot:
Read another user's data.
Modify published content.
Access admin-only tables.
Every table should have RLS enabled by default.

Performance
The app should minimize database requests.
Preferred loading sequence:
Fetch profile.
Fetch current journey.
Fetch today's lesson.
Lazy-load optional sections (stories, medications, caregiver).
The home screen should render almost immediately, with secondary content loading afterward.

Content Management
Although the prototype doesn't include an admin dashboard, all educational content should be editable directly in the database.
Future clinicians should be able to:
Publish a lesson.
Update a medication.
Edit a patient story.
Replace an activity.
Without modifying frontend code.

Backup Strategy
Supabase automated backups.
Version-controlled seed data.
Migration files for schema changes.
Never manually edit production tables without migrations.

Prototype Scope
Included:
Authentication
User profiles
Lessons
Progress tracking
Confidence tracking
Medication library
AI conversations
Reflections
Caregiver lessons
Stripe subscriptions
Published content
Excluded:
Community posts
Notifications
Push messaging
Clinician dashboards
File uploads
Health device integrations
Blood glucose tracking
Appointment scheduling
Analytics dashboards
These belong in future versions.

Success Criteria
The backend succeeds when the frontend becomes almost entirely content-driven.
Adding a new lesson should require:
One new lesson record.
One activity record.
Optional caregiver content.
Optional patient story linkage.
No frontend code changes.
The database should make Health Decoded feel like a living educational platform rather than a collection of hardcoded pages.

Engineering Notes
The backend should be organized around stable content models rather than application screens. Lessons, activities, medications, stories, and caregiver content should be reusable objects that multiple frontend components can consume. Database relationships should remain shallow and predictable, avoiding deeply nested dependencies that complicate queries. Use Supabase's generated TypeScript types to maintain type safety across the application, and encapsulate all database access through a small service layer so the frontend never contains raw SQL or complex query logic.

The Guiding Principle
If there is one sentence that should guide every backend decision, it is this:
The backend should remember the user's journey so the frontend can focus entirely on teaching it.
A clean backend isn't measured by how many tables it has—it's measured by how little the frontend needs to know about how the data is stored. That separation will make Health Decoded easier to build now and far easier to expand after the prototype.
