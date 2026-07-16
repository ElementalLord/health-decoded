-- Keep profile and settings creation atomic for every new authentication identity.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

comment on function public.handle_new_user() is
  'Creates the minimal profile and default settings rows in the same transaction as a new auth identity. User metadata is intentionally ignored.';

insert into public.user_settings (user_id)
select auth_user.id
from auth.users as auth_user
left join public.user_settings as settings on settings.user_id = auth_user.id
where settings.user_id is null
on conflict (user_id) do nothing;

-- Onboarding is a single transaction and is the only user-facing path that may set
-- onboarding_completed_at. Ordinary profile edits can change only display_name.
create function public.complete_onboarding(
  p_display_name pg_catalog.text,
  p_locale pg_catalog.text,
  p_preferred_text_scale pg_catalog.text,
  p_reduced_motion pg_catalog.bool,
  p_timezone pg_catalog.text
)
returns pg_catalog.bool
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  if p_display_name is null
    or pg_catalog.char_length(pg_catalog.btrim(p_display_name)) not between 1 and 100
    or p_locale is distinct from 'en'
    or p_preferred_text_scale not in ('default', 'large')
    or p_reduced_motion is null
    or p_timezone is null
    or pg_catalog.char_length(p_timezone) not between 1 and 64
  then
    raise exception using errcode = '22023', message = 'Invalid onboarding values.';
  end if;

  insert into public.user_settings as settings (
    user_id,
    reduced_motion,
    preferred_text_scale,
    locale,
    timezone
  )
  values (
    v_user_id,
    p_reduced_motion,
    p_preferred_text_scale,
    p_locale,
    p_timezone
  )
  on conflict (user_id) do update set
    reduced_motion = excluded.reduced_motion,
    preferred_text_scale = excluded.preferred_text_scale,
    locale = excluded.locale,
    timezone = excluded.timezone;

  update public.profiles
  set display_name = pg_catalog.btrim(p_display_name),
    onboarding_completed_at = coalesce(onboarding_completed_at, pg_catalog.now())
  where id = v_user_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'Profile unavailable.';
  end if;

  return true;
end;
$$;

comment on function public.complete_onboarding(pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.text) is
  'Atomically validates and saves the authenticated user onboarding profile and accessibility settings.';

revoke all on function public.complete_onboarding(pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.text) from public;
revoke all on function public.complete_onboarding(pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.text) from anon;
grant execute on function public.complete_onboarding(pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.text) to authenticated;

revoke update on table public.profiles from authenticated;
grant update (display_name) on table public.profiles to authenticated;

drop policy if exists "users delete own settings" on public.user_settings;
revoke delete on table public.user_settings from authenticated;

-- Reconcile the user's pointer with the first incomplete published assignment on
-- every initialization. This safely reopens a completed journey when reviewed
-- curriculum is published later and repairs a stale current-lesson pointer.
create or replace function public.initialize_current_user_journey()
returns table (
  initialized_user_journey_id pg_catalog.uuid,
  initialized_lesson_progress_id pg_catalog.uuid,
  initialized_journey_lesson_id pg_catalog.uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_journey_id pg_catalog.uuid;
  v_first_journey_lesson_id pg_catalog.uuid;
  v_journey_lesson_id pg_catalog.uuid;
  v_user_journey_id pg_catalog.uuid;
  v_lesson_progress_id pg_catalog.uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  select journey.id
  into v_journey_id
  from public.journeys as journey
  where journey.slug = 'type-2-first-14-days'
    and journey.status = 'published'
    and journey.published_at is not null
  limit 1;

  if v_journey_id is null then
    raise exception using errcode = 'P0002', message = 'Journey unavailable.';
  end if;

  select assignment.id
  into v_first_journey_lesson_id
  from public.journey_lessons as assignment
  join public.lessons as lesson on lesson.id = assignment.lesson_id
  where assignment.journey_id = v_journey_id
    and assignment.status = 'published'
    and assignment.published_at is not null
    and lesson.status = 'published'
    and lesson.published_at is not null
  order by assignment.display_order asc
  limit 1;

  if v_first_journey_lesson_id is null then
    raise exception using errcode = 'P0002', message = 'Journey unavailable.';
  end if;

  insert into public.user_journeys (
    user_id,
    journey_id,
    current_journey_lesson_id
  )
  values (
    v_user_id,
    v_journey_id,
    v_first_journey_lesson_id
  )
  on conflict on constraint user_journeys_unique_user_journey do nothing;

  select user_journey.id
  into v_user_journey_id
  from public.user_journeys as user_journey
  where user_journey.user_id = v_user_id
    and user_journey.journey_id = v_journey_id
  for update;

  select assignment.id
  into v_journey_lesson_id
  from public.journey_lessons as assignment
  join public.lessons as lesson on lesson.id = assignment.lesson_id
  where assignment.journey_id = v_journey_id
    and assignment.status = 'published'
    and assignment.published_at is not null
    and lesson.status = 'published'
    and lesson.published_at is not null
    and not exists (
      select 1
      from public.lesson_progress as progress
      where progress.user_journey_id = v_user_journey_id
        and progress.journey_lesson_id = assignment.id
        and progress.status = 'completed'
    )
  order by assignment.display_order asc
  limit 1;

  if v_journey_lesson_id is null then
    select assignment.id
    into v_journey_lesson_id
    from public.journey_lessons as assignment
    join public.lessons as lesson on lesson.id = assignment.lesson_id
    where assignment.journey_id = v_journey_id
      and assignment.status = 'published'
      and assignment.published_at is not null
      and lesson.status = 'published'
      and lesson.published_at is not null
    order by assignment.display_order desc
    limit 1;

    update public.user_journeys
    set current_journey_lesson_id = v_journey_lesson_id,
      completed_at = coalesce(completed_at, pg_catalog.now())
    where id = v_user_journey_id
      and (
        current_journey_lesson_id is distinct from v_journey_lesson_id
        or completed_at is null
      );
  else
    insert into public.lesson_progress (
      user_journey_id,
      journey_lesson_id,
      status,
      xp_awarded
    )
    values (
      v_user_journey_id,
      v_journey_lesson_id,
      'not_started',
      0
    )
    on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

    update public.user_journeys
    set current_journey_lesson_id = v_journey_lesson_id,
      completed_at = null
    where id = v_user_journey_id
      and (
        current_journey_lesson_id is distinct from v_journey_lesson_id
        or completed_at is not null
      );
  end if;

  select progress.id
  into v_lesson_progress_id
  from public.lesson_progress as progress
  where progress.user_journey_id = v_user_journey_id
    and progress.journey_lesson_id = v_journey_lesson_id;

  if v_lesson_progress_id is null then
    raise exception using errcode = 'P0002', message = 'Lesson progress unavailable.';
  end if;

  return query
  select v_user_journey_id, v_lesson_progress_id, v_journey_lesson_id;
end;
$$;

comment on function public.initialize_current_user_journey() is
  'Initializes or reconciles the authenticated user journey with the first incomplete reviewed assignment using narrowly scoped definer writes.';

revoke all on function public.initialize_current_user_journey() from public;
revoke all on function public.initialize_current_user_journey() from anon;
grant execute on function public.initialize_current_user_journey() to authenticated;

-- Preserve the validated atomic completion operation privately, while the public
-- wrapper returns the user's actual cumulative Confidence XP.
create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

alter function public.complete_current_lesson(pg_catalog.uuid) set schema private;

revoke all on function private.complete_current_lesson(pg_catalog.uuid) from public;
revoke all on function private.complete_current_lesson(pg_catalog.uuid) from anon;
revoke all on function private.complete_current_lesson(pg_catalog.uuid) from authenticated;

create function public.complete_current_lesson(
  p_lesson_progress_id pg_catalog.uuid
)
returns table (
  first_time_completion pg_catalog.bool,
  xp_awarded pg_catalog.int4,
  total_xp_awarded pg_catalog.int4,
  journey_completed pg_catalog.bool,
  next_day pg_catalog.int4,
  next_route pg_catalog.text,
  lesson_completed_at pg_catalog.timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_first_time_completion pg_catalog.bool;
  v_xp_awarded pg_catalog.int4;
  v_total_xp pg_catalog.int4;
  v_journey_completed pg_catalog.bool;
  v_next_day pg_catalog.int4;
  v_next_route pg_catalog.text;
  v_lesson_completed_at pg_catalog.timestamptz;
begin
  select
    completion.first_time_completion,
    completion.xp_awarded,
    completion.journey_completed,
    completion.next_day,
    completion.next_route,
    completion.lesson_completed_at
  into
    v_first_time_completion,
    v_xp_awarded,
    v_journey_completed,
    v_next_day,
    v_next_route,
    v_lesson_completed_at
  from private.complete_current_lesson(p_lesson_progress_id) as completion;

  select coalesce(pg_catalog.sum(progress.xp_awarded), 0)::pg_catalog.int4
  into v_total_xp
  from public.lesson_progress as progress
  join public.user_journeys as user_journey on user_journey.id = progress.user_journey_id
  where user_journey.user_id = auth.uid();

  return query
  select
    v_first_time_completion,
    v_xp_awarded,
    v_total_xp,
    v_journey_completed,
    v_next_day,
    v_next_route,
    v_lesson_completed_at;
end;
$$;

comment on function public.complete_current_lesson(pg_catalog.uuid) is
  'Runs the validated atomic lesson-completion operation and returns the authenticated user cumulative Confidence XP.';

revoke all on function public.complete_current_lesson(pg_catalog.uuid) from public;
revoke all on function public.complete_current_lesson(pg_catalog.uuid) from anon;
grant execute on function public.complete_current_lesson(pg_catalog.uuid) to authenticated;

delete from public.activities
where id = '40000000-0000-0000-0000-000000000001'
  and status = 'archived';
