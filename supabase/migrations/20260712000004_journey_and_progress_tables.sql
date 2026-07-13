create table public.user_journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  journey_id uuid not null references public.journeys (id) on delete restrict,
  current_journey_lesson_id uuid references public.journey_lessons (id) on delete restrict,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_journeys_unique_user_journey unique (user_id, journey_id),
  constraint user_journeys_completion_after_start check (completed_at is null or completed_at >= started_at)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_journey_id uuid not null references public.user_journeys (id) on delete cascade,
  journey_lesson_id uuid not null references public.journey_lessons (id) on delete restrict,
  status text not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_progress_status_check check (status in ('not_started', 'in_progress', 'completed')),
  constraint lesson_progress_xp_awarded_nonnegative check (xp_awarded >= 0),
  constraint lesson_progress_completion_timestamp check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed')
  ),
  constraint lesson_progress_completion_after_start check (
    completed_at is null or started_at is null or completed_at >= started_at
  ),
  constraint lesson_progress_unique_user_journey_lesson unique (user_journey_id, journey_lesson_id)
);

create table public.activity_progress (
  id uuid primary key default gen_random_uuid(),
  lesson_progress_id uuid not null references public.lesson_progress (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete restrict,
  status text not null default 'not_started',
  result_summary jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_progress_status_check check (status in ('not_started', 'in_progress', 'completed')),
  constraint activity_progress_result_summary_object check (
    result_summary is null or jsonb_typeof(result_summary) = 'object'
  ),
  constraint activity_progress_completion_timestamp check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed')
  ),
  constraint activity_progress_unique_lesson_progress_activity unique (lesson_progress_id, activity_id)
);

create table public.confidence_check_ins (
  id uuid primary key default gen_random_uuid(),
  lesson_progress_id uuid not null references public.lesson_progress (id) on delete cascade,
  confidence_level text not null,
  created_at timestamptz not null default now(),
  constraint confidence_check_ins_level_check check (
    confidence_level in ('not_yet', 'somewhat', 'confident')
  )
);

create table public.reflection_entries (
  id uuid primary key default gen_random_uuid(),
  lesson_progress_id uuid not null references public.lesson_progress (id) on delete cascade,
  reflection text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reflection_entries_length check (char_length(reflection) between 1 and 300)
);

create trigger user_journeys_set_updated_at before update on public.user_journeys
for each row execute function public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress
for each row execute function public.set_updated_at();
create trigger activity_progress_set_updated_at before update on public.activity_progress
for each row execute function public.set_updated_at();
create trigger reflection_entries_set_updated_at before update on public.reflection_entries
for each row execute function public.set_updated_at();

comment on table public.activity_progress is
  'Ownership is derived from activity_progress to lesson_progress to user_journeys to auth.users.';
comment on table public.reflection_entries is
  'User-owned optional reflections. Entries are hard-deleted immediately when removed.';
