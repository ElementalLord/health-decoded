alter table public.lesson_progress
  add column last_viewed_block integer not null default -1,
  add constraint lesson_progress_last_viewed_block_minimum
    check (last_viewed_block >= -1);

create function public.begin_or_resume_current_lesson(
  p_day pg_catalog.integer
)
returns table (
  authorized_lesson_progress_id pg_catalog.uuid,
  authorized_lesson_status pg_catalog.text,
  authorized_last_viewed_block pg_catalog.integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_user_journey_id pg_catalog.uuid;
  v_current_journey_lesson_id pg_catalog.uuid;
  v_requested_journey_lesson_id pg_catalog.uuid;
  v_existing_status pg_catalog.text;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  if p_day is null or p_day < 1 then
    raise exception using errcode = '22023', message = 'Invalid lesson.';
  end if;

  select public.user_journeys.id, public.user_journeys.current_journey_lesson_id
  into v_user_journey_id, v_current_journey_lesson_id
  from public.user_journeys
  join public.journeys
    on public.journeys.id = public.user_journeys.journey_id
  where public.user_journeys.user_id = v_user_id
    and public.journeys.slug = 'type-2-first-14-days'
    and public.journeys.status = 'published'
    and public.journeys.published_at is not null
  limit 1;

  if v_user_journey_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  select public.journey_lessons.id
  into v_requested_journey_lesson_id
  from public.journey_lessons
  join public.lessons
    on public.lessons.id = public.journey_lessons.lesson_id
  where public.journey_lessons.journey_id = (
      select public.user_journeys.journey_id
      from public.user_journeys
      where public.user_journeys.id = v_user_journey_id
    )
    and public.journey_lessons.day_number = p_day
    and public.journey_lessons.status = 'published'
    and public.journey_lessons.published_at is not null
    and public.lessons.status = 'published'
    and public.lessons.published_at is not null;

  if v_requested_journey_lesson_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  select public.lesson_progress.status
  into v_existing_status
  from public.lesson_progress
  where public.lesson_progress.user_journey_id = v_user_journey_id
    and public.lesson_progress.journey_lesson_id = v_requested_journey_lesson_id;

  if v_requested_journey_lesson_id is distinct from v_current_journey_lesson_id
    and coalesce(v_existing_status, 'not_started') not in ('in_progress', 'completed') then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  return query
  insert into public.lesson_progress as lesson_progress (
    user_journey_id,
    journey_lesson_id,
    status,
    started_at,
    last_viewed_block,
    xp_awarded
  )
  values (
    v_user_journey_id,
    v_requested_journey_lesson_id,
    'in_progress',
    pg_catalog.now(),
    -1,
    0
  )
  on conflict on constraint lesson_progress_unique_user_journey_lesson
  do update set
    status = case
      when lesson_progress.status = 'completed' then 'completed'
      else 'in_progress'
    end,
    started_at = coalesce(lesson_progress.started_at, pg_catalog.now())
  returning
    lesson_progress.id,
    lesson_progress.status,
    lesson_progress.last_viewed_block;
end;
$$;

comment on function public.begin_or_resume_current_lesson(pg_catalog.integer) is
  'SECURITY DEFINER is required because direct lesson-progress writes are denied. The function derives auth.uid(), validates the published active journey lesson by day, and begins or resumes only an authorized lesson without completing or unlocking content.';

revoke all on function public.begin_or_resume_current_lesson(pg_catalog.integer) from public;
revoke all on function public.begin_or_resume_current_lesson(pg_catalog.integer) from anon;
grant execute on function public.begin_or_resume_current_lesson(pg_catalog.integer) to authenticated;

create function public.save_lesson_block_position(
  p_lesson_progress_id pg_catalog.uuid,
  p_block_index pg_catalog.integer
)
returns table (
  saved_lesson_progress_id pg_catalog.uuid,
  saved_last_viewed_block pg_catalog.integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_block_count pg_catalog.integer;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  if p_block_index is null or p_block_index < 0 then
    raise exception using errcode = '22023', message = 'Invalid lesson position.';
  end if;

  select pg_catalog.jsonb_array_length(public.lessons.content_blocks)
  into v_block_count
  from public.lesson_progress
  join public.user_journeys
    on public.user_journeys.id = public.lesson_progress.user_journey_id
  join public.journeys
    on public.journeys.id = public.user_journeys.journey_id
  join public.journey_lessons
    on public.journey_lessons.id = public.lesson_progress.journey_lesson_id
  join public.lessons
    on public.lessons.id = public.journey_lessons.lesson_id
  where public.lesson_progress.id = p_lesson_progress_id
    and public.lesson_progress.status = 'in_progress'
    and public.user_journeys.user_id = v_user_id
    and public.journeys.slug = 'type-2-first-14-days'
    and public.journeys.status = 'published'
    and public.journeys.published_at is not null
    and public.journey_lessons.status = 'published'
    and public.journey_lessons.published_at is not null
    and public.lessons.status = 'published'
    and public.lessons.published_at is not null;

  if v_block_count is null or p_block_index >= v_block_count then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  return query
  update public.lesson_progress
  set last_viewed_block = p_block_index
  where public.lesson_progress.id = p_lesson_progress_id
  returning public.lesson_progress.id, public.lesson_progress.last_viewed_block;
end;
$$;

comment on function public.save_lesson_block_position(pg_catalog.uuid, pg_catalog.integer) is
  'SECURITY DEFINER is required because direct lesson-progress writes are denied. The function derives auth.uid(), verifies active-journey ownership and publication state, and saves only an in-range non-completed block position.';

revoke all on function public.save_lesson_block_position(pg_catalog.uuid, pg_catalog.integer) from public;
revoke all on function public.save_lesson_block_position(pg_catalog.uuid, pg_catalog.integer) from anon;
grant execute on function public.save_lesson_block_position(pg_catalog.uuid, pg_catalog.integer) to authenticated;
