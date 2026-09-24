-- Lesson milestones are derived from durable progress. Keep the derived rows in
-- sync inside Postgres so a dropped browser request can never leave a learner's
-- completed work showing as locked.

create or replace function public.reconcile_lesson_milestones_for_user(
  p_user_id pg_catalog.uuid
)
returns pg_catalog.text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted_ids pg_catalog.text[];
begin
  if p_user_id is null then
    return array[]::pg_catalog.text[];
  end if;

  with completed_lessons as (
    select
      public.lesson_progress.journey_lesson_id,
      pg_catalog.min(public.lesson_progress.completed_at) as completed_at,
      pg_catalog.bool_or(public.journeys.slug = 'type-2-first-14-days') as is_foundation
    from public.lesson_progress
    join public.user_journeys
      on public.user_journeys.id = public.lesson_progress.user_journey_id
    join public.journey_lessons
      on public.journey_lessons.id = public.lesson_progress.journey_lesson_id
    join public.journeys
      on public.journeys.id = public.journey_lessons.journey_id
    where public.user_journeys.user_id = p_user_id
      and public.lesson_progress.status = 'completed'
      and public.lesson_progress.completed_at is not null
    group by public.lesson_progress.journey_lesson_id
  ),
  ordered_lessons as (
    select
      completed_lessons.*,
      pg_catalog.row_number() over (
        order by completed_lessons.completed_at, completed_lessons.journey_lesson_id
      ) as completion_number
    from completed_lessons
  ),
  reflected_lessons as (
    select
      public.lesson_progress.id as lesson_progress_id,
      pg_catalog.min(public.reflection_entries.created_at) as reflected_at
    from public.reflection_entries
    join public.lesson_progress
      on public.lesson_progress.id = public.reflection_entries.lesson_progress_id
    join public.user_journeys
      on public.user_journeys.id = public.lesson_progress.user_journey_id
    where public.user_journeys.user_id = p_user_id
      and public.lesson_progress.status = 'completed'
    group by public.lesson_progress.id
  ),
  ordered_reflections as (
    select
      reflected_lessons.*,
      pg_catalog.row_number() over (
        order by reflected_lessons.reflected_at, reflected_lessons.lesson_progress_id
      ) as reflection_number
    from reflected_lessons
  ),
  candidates(milestone_id, unlocked_at) as (
    select
      case ordered_lessons.completion_number
        when 1 then 'MILESTONE-FIRST-STEP'
        when 3 then 'MILESTONE-BUILDING-RHYTHM'
        when 7 then 'MILESTONE-WEEK-OF-LEARNING'
        when 10 then 'MILESTONE-LEARNING-IN-MOTION'
      end,
      ordered_lessons.completed_at
    from ordered_lessons
    where ordered_lessons.completion_number in (1, 3, 7, 10)

    union all

    select
      'MILESTONE-FOUNDATION-COMPLETE',
      pg_catalog.max(ordered_lessons.completed_at)
    from ordered_lessons
    where ordered_lessons.is_foundation
    having pg_catalog.count(*) >= 14

    union all

    select
      'MILESTONE-THOUGHTFUL-REFLECTION',
      ordered_reflections.reflected_at
    from ordered_reflections
    where ordered_reflections.reflection_number = 3
  ),
  inserted as (
    insert into public.user_milestones (user_id, milestone_id, unlocked_at)
    select p_user_id, candidates.milestone_id, candidates.unlocked_at
    from candidates
    where candidates.milestone_id is not null
      and candidates.unlocked_at is not null
    on conflict on constraint user_milestones_pkey do nothing
    returning public.user_milestones.milestone_id
  )
  select coalesce(
    pg_catalog.array_agg(inserted.milestone_id order by inserted.milestone_id),
    array[]::pg_catalog.text[]
  )
  into v_inserted_ids
  from inserted;

  return v_inserted_ids;
end;
$$;

revoke all on function public.reconcile_lesson_milestones_for_user(pg_catalog.uuid) from public;
revoke all on function public.reconcile_lesson_milestones_for_user(pg_catalog.uuid) from anon;
revoke all on function public.reconcile_lesson_milestones_for_user(pg_catalog.uuid) from authenticated;

create or replace function public.reconcile_current_user_lesson_milestones()
returns pg_catalog.text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required.';
  end if;

  return public.reconcile_lesson_milestones_for_user(v_user_id);
end;
$$;

revoke all on function public.reconcile_current_user_lesson_milestones() from public;
revoke all on function public.reconcile_current_user_lesson_milestones() from anon;
grant execute on function public.reconcile_current_user_lesson_milestones() to authenticated;

create or replace function public.reconcile_milestones_after_lesson_progress()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid;
begin
  select public.user_journeys.user_id
  into v_user_id
  from public.user_journeys
  where public.user_journeys.id = new.user_journey_id;

  perform public.reconcile_lesson_milestones_for_user(v_user_id);
  return new;
end;
$$;

revoke all on function public.reconcile_milestones_after_lesson_progress() from public;
revoke all on function public.reconcile_milestones_after_lesson_progress() from anon;
revoke all on function public.reconcile_milestones_after_lesson_progress() from authenticated;

drop trigger if exists lesson_progress_reconcile_milestones on public.lesson_progress;
create trigger lesson_progress_reconcile_milestones
after insert or update of status, completed_at on public.lesson_progress
for each row
when (new.status = 'completed')
execute function public.reconcile_milestones_after_lesson_progress();

create or replace function public.reconcile_milestones_after_reflection()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid;
begin
  select public.user_journeys.user_id
  into v_user_id
  from public.lesson_progress
  join public.user_journeys
    on public.user_journeys.id = public.lesson_progress.user_journey_id
  where public.lesson_progress.id = new.lesson_progress_id;

  perform public.reconcile_lesson_milestones_for_user(v_user_id);
  return new;
end;
$$;

revoke all on function public.reconcile_milestones_after_reflection() from public;
revoke all on function public.reconcile_milestones_after_reflection() from anon;
revoke all on function public.reconcile_milestones_after_reflection() from authenticated;

drop trigger if exists reflection_entries_reconcile_milestones on public.reflection_entries;
create trigger reflection_entries_reconcile_milestones
after insert or update of lesson_progress_id on public.reflection_entries
for each row
execute function public.reconcile_milestones_after_reflection();

-- Repair every account that completed qualifying work before this migration.
do $$
declare
  v_user record;
begin
  for v_user in
    select distinct public.user_journeys.user_id
    from public.user_journeys
  loop
    perform public.reconcile_lesson_milestones_for_user(v_user.user_id);
  end loop;
end;
$$;

comment on function public.reconcile_current_user_lesson_milestones() is
  'Idempotently repairs lesson and reflection milestone rows from durable progress owned by auth.uid().';
