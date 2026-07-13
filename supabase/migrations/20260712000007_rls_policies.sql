alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.journeys enable row level security;
alter table public.lessons enable row level security;
alter table public.journey_lessons enable row level security;
alter table public.activities enable row level security;
alter table public.activity_answer_keys enable row level security;
alter table public.medications enable row level security;
alter table public.patient_stories enable row level security;
alter table public.caregiver_content enable row level security;
alter table public.user_journeys enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.activity_progress enable row level security;
alter table public.confidence_check_ins enable row level security;
alter table public.reflection_entries enable row level security;

create policy "authenticated users read published journeys"
on public.journeys for select to authenticated
using (status = 'published' and published_at is not null);

create policy "authenticated users read published lessons"
on public.lessons for select to authenticated
using (status = 'published' and published_at is not null);

create policy "authenticated users read published journey lessons"
on public.journey_lessons for select to authenticated
using (
  status = 'published'
  and published_at is not null
  and exists (
    select 1 from public.journeys
    where journeys.id = journey_lessons.journey_id
      and journeys.status = 'published'
      and journeys.published_at is not null
  )
  and exists (
    select 1 from public.lessons
    where lessons.id = journey_lessons.lesson_id
      and lessons.status = 'published'
      and lessons.published_at is not null
  )
);

create policy "authenticated users read published activities"
on public.activities for select to authenticated
using (
  status = 'published'
  and published_at is not null
  and exists (
    select 1 from public.lessons
    where lessons.id = activities.lesson_id
      and lessons.status = 'published'
      and lessons.published_at is not null
  )
);

create policy "authenticated users read published medications"
on public.medications for select to authenticated
using (status = 'published' and published_at is not null);

create policy "authenticated users read published patient stories"
on public.patient_stories for select to authenticated
using (status = 'published' and published_at is not null);

create policy "authenticated users read published caregiver content"
on public.caregiver_content for select to authenticated
using (
  status = 'published'
  and published_at is not null
  and (
    journey_lesson_id is null
    or exists (
      select 1 from public.journey_lessons
      where journey_lessons.id = caregiver_content.journey_lesson_id
        and journey_lessons.status = 'published'
        and journey_lessons.published_at is not null
    )
  )
);

create policy "users read own profile"
on public.profiles for select to authenticated
using (id = auth.uid());
create policy "users update own profile"
on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy "users read own settings"
on public.user_settings for select to authenticated
using (user_id = auth.uid());
create policy "users create own settings"
on public.user_settings for insert to authenticated
with check (user_id = auth.uid());
create policy "users update own settings"
on public.user_settings for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users delete own settings"
on public.user_settings for delete to authenticated
using (user_id = auth.uid());

create policy "users read own journeys"
on public.user_journeys for select to authenticated
using (user_id = auth.uid());

create policy "users read own lesson progress"
on public.lesson_progress for select to authenticated
using (
  exists (
    select 1 from public.user_journeys
    where user_journeys.id = lesson_progress.user_journey_id
      and user_journeys.user_id = auth.uid()
  )
);

create policy "users read own activity progress"
on public.activity_progress for select to authenticated
using (
  exists (
    select 1
    from public.lesson_progress
    join public.user_journeys on user_journeys.id = lesson_progress.user_journey_id
    where lesson_progress.id = activity_progress.lesson_progress_id
      and user_journeys.user_id = auth.uid()
  )
);

create policy "users read own confidence check ins"
on public.confidence_check_ins for select to authenticated
using (
  exists (
    select 1
    from public.lesson_progress
    join public.user_journeys on user_journeys.id = lesson_progress.user_journey_id
    where lesson_progress.id = confidence_check_ins.lesson_progress_id
      and user_journeys.user_id = auth.uid()
  )
);

create policy "users read own reflections"
on public.reflection_entries for select to authenticated
using (
  exists (
    select 1
    from public.lesson_progress
    join public.user_journeys on user_journeys.id = lesson_progress.user_journey_id
    where lesson_progress.id = reflection_entries.lesson_progress_id
      and user_journeys.user_id = auth.uid()
  )
);
create policy "users create own reflections"
on public.reflection_entries for insert to authenticated
with check (
  exists (
    select 1
    from public.lesson_progress
    join public.user_journeys on user_journeys.id = lesson_progress.user_journey_id
    where lesson_progress.id = reflection_entries.lesson_progress_id
      and user_journeys.user_id = auth.uid()
  )
);
create policy "users update own reflections"
on public.reflection_entries for update to authenticated
using (
  exists (
    select 1
    from public.lesson_progress
    join public.user_journeys on user_journeys.id = lesson_progress.user_journey_id
    where lesson_progress.id = reflection_entries.lesson_progress_id
      and user_journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.lesson_progress
    join public.user_journeys on user_journeys.id = lesson_progress.user_journey_id
    where lesson_progress.id = reflection_entries.lesson_progress_id
      and user_journeys.user_id = auth.uid()
  )
);
create policy "users delete own reflections"
on public.reflection_entries for delete to authenticated
using (
  exists (
    select 1
    from public.lesson_progress
    join public.user_journeys on user_journeys.id = lesson_progress.user_journey_id
    where lesson_progress.id = reflection_entries.lesson_progress_id
      and user_journeys.user_id = auth.uid()
  )
);

comment on policy "users read own activity progress" on public.activity_progress is
  'Ownership is derived through lesson_progress and user_journeys; client supplied user IDs are never trusted.';
comment on table public.user_journeys is
  'Direct writes are intentionally denied. Future server-controlled operations must validate unlock and XP rules.';
comment on table public.lesson_progress is
  'Direct writes are intentionally denied. Future server-controlled operations must validate prerequisite completion and XP.';
comment on table public.activity_progress is
  'Direct writes are intentionally denied. Future server-controlled operations must validate results before completion.';
comment on table public.confidence_check_ins is
  'Direct writes are intentionally denied pending a validated server-side operation.';
