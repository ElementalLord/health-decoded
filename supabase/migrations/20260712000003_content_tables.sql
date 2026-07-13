create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  duration_days integer not null,
  version integer not null default 1,
  status text not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journeys_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint journeys_duration_days_positive check (duration_days > 0),
  constraint journeys_version_positive check (version > 0),
  constraint journeys_status_check check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  constraint journeys_publication_timestamp check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  primary_topic text not null,
  learning_objective text not null,
  estimated_minutes smallint not null,
  content_blocks jsonb not null default '[]'::jsonb,
  key_takeaway text,
  version integer not null default 1,
  status text not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint lessons_estimated_minutes_positive check (estimated_minutes > 0),
  constraint lessons_content_blocks_array check (jsonb_typeof(content_blocks) = 'array'),
  constraint lessons_version_positive check (version > 0),
  constraint lessons_status_check check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  constraint lessons_publication_timestamp check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create table public.journey_lessons (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete restrict,
  lesson_id uuid not null references public.lessons (id) on delete restrict,
  day_number integer not null,
  display_order integer not null,
  prerequisite_journey_lesson_id uuid references public.journey_lessons (id) on delete restrict,
  version integer not null default 1,
  status text not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journey_lessons_day_number_positive check (day_number > 0),
  constraint journey_lessons_display_order_positive check (display_order > 0),
  constraint journey_lessons_version_positive check (version > 0),
  constraint journey_lessons_status_check check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  constraint journey_lessons_publication_timestamp check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  ),
  constraint journey_lessons_not_self_prerequisite check (id <> prerequisite_journey_lesson_id),
  constraint journey_lessons_unique_day unique (journey_id, day_number),
  constraint journey_lessons_unique_display_order unique (journey_id, display_order),
  constraint journey_lessons_unique_lesson unique (journey_id, lesson_id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete restrict,
  display_order integer not null,
  activity_type text not null,
  title text not null,
  instructions text not null,
  configuration jsonb not null default '{}'::jsonb,
  explanation text,
  version integer not null default 1,
  status text not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activities_display_order_positive check (display_order > 0),
  constraint activities_type_check check (
    activity_type in (
      'match_pair',
      'plate_builder',
      'body_builder',
      'myth_buster',
      'confidence_check',
      'boss_level',
      'reflection',
      'explain_it_yourself'
    )
  ),
  constraint activities_configuration_object check (jsonb_typeof(configuration) = 'object'),
  constraint activities_version_positive check (version > 0),
  constraint activities_status_check check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  constraint activities_publication_timestamp check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  ),
  constraint activities_unique_display_order unique (lesson_id, display_order)
);

create table public.medications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  generic_name text not null,
  brand_names text[] not null default '{}',
  category text not null,
  content_blocks jsonb not null default '[]'::jsonb,
  search_text text not null default '',
  search_vector tsvector generated always as (
    to_tsvector('english', generic_name || ' ' || category || ' ' || search_text)
  ) stored,
  version integer not null default 1,
  status text not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint medications_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint medications_content_blocks_array check (jsonb_typeof(content_blocks) = 'array'),
  constraint medications_version_positive check (version > 0),
  constraint medications_status_check check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  constraint medications_publication_timestamp check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create table public.patient_stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  introduction text,
  content_blocks jsonb not null default '[]'::jsonb,
  key_takeaway text,
  journey_week integer,
  version integer not null default 1,
  status text not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint patient_stories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint patient_stories_content_blocks_array check (jsonb_typeof(content_blocks) = 'array'),
  constraint patient_stories_journey_week_positive check (journey_week is null or journey_week > 0),
  constraint patient_stories_version_positive check (version > 0),
  constraint patient_stories_status_check check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  constraint patient_stories_publication_timestamp check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create table public.caregiver_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  journey_lesson_id uuid references public.journey_lessons (id) on delete restrict,
  title text not null,
  content_blocks jsonb not null default '[]'::jsonb,
  support_tip text,
  what_not_to_say text,
  conversation_prompt text,
  version integer not null default 1,
  status text not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint caregiver_content_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint caregiver_content_blocks_array check (jsonb_typeof(content_blocks) = 'array'),
  constraint caregiver_content_version_positive check (version > 0),
  constraint caregiver_content_status_check check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  constraint caregiver_content_publication_timestamp check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create trigger journeys_set_updated_at before update on public.journeys
for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons
for each row execute function public.set_updated_at();
create trigger journey_lessons_set_updated_at before update on public.journey_lessons
for each row execute function public.set_updated_at();
create trigger activities_set_updated_at before update on public.activities
for each row execute function public.set_updated_at();
create trigger medications_set_updated_at before update on public.medications
for each row execute function public.set_updated_at();
create trigger patient_stories_set_updated_at before update on public.patient_stories
for each row execute function public.set_updated_at();
create trigger caregiver_content_set_updated_at before update on public.caregiver_content
for each row execute function public.set_updated_at();

comment on table public.activities is
  'Client-safe activity definitions only. Protected scoring data is isolated in activity_answer_keys.';
comment on table public.caregiver_content is
  'Authenticated educational content only; it does not represent a caregiver account or patient-data relationship.';
