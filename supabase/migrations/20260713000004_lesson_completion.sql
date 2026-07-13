create function public.complete_current_lesson(
  p_lesson_progress_id pg_catalog.uuid
)
returns table (
  first_time_completion pg_catalog.boolean,
  xp_awarded pg_catalog.integer,
  total_xp_awarded pg_catalog.integer,
  journey_completed pg_catalog.boolean,
  next_day pg_catalog.integer,
  next_route pg_catalog.text,
  lesson_completed_at pg_catalog.timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_user_journey_id pg_catalog.uuid;
  v_journey_id pg_catalog.uuid;
  v_current_journey_lesson_id pg_catalog.uuid;
  v_journey_lesson_id pg_catalog.uuid;
  v_lesson_id pg_catalog.uuid;
  v_lesson_status pg_catalog.text;
  v_existing_xp pg_catalog.integer;
  v_existing_completed_at pg_catalog.timestamptz;
  v_last_viewed_block pg_catalog.integer;
  v_block_count pg_catalog.integer;
  v_display_order pg_catalog.integer;
  v_prerequisite_journey_lesson_id pg_catalog.uuid;
  v_next_journey_lesson_id pg_catalog.uuid;
  v_next_day pg_catalog.integer;
  v_next_prerequisite_journey_lesson_id pg_catalog.uuid;
  v_journey_completed pg_catalog.boolean := false;
begin
  if v_user_id is null or p_lesson_progress_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  select
    public.user_journeys.id,
    public.user_journeys.journey_id,
    public.user_journeys.current_journey_lesson_id,
    public.lesson_progress.journey_lesson_id,
    public.lesson_progress.status,
    public.lesson_progress.xp_awarded,
    public.lesson_progress.completed_at,
    public.lesson_progress.last_viewed_block,
    public.journey_lessons.lesson_id,
    public.journey_lessons.display_order,
    public.journey_lessons.prerequisite_journey_lesson_id,
    pg_catalog.jsonb_array_length(public.lessons.content_blocks)
  into
    v_user_journey_id,
    v_journey_id,
    v_current_journey_lesson_id,
    v_journey_lesson_id,
    v_lesson_status,
    v_existing_xp,
    v_existing_completed_at,
    v_last_viewed_block,
    v_lesson_id,
    v_display_order,
    v_prerequisite_journey_lesson_id,
    v_block_count
  from public.lesson_progress
  join public.user_journeys
    on public.user_journeys.id = public.lesson_progress.user_journey_id
  join public.profiles
    on public.profiles.id = public.user_journeys.user_id
  join public.journeys
    on public.journeys.id = public.user_journeys.journey_id
  join public.journey_lessons
    on public.journey_lessons.id = public.lesson_progress.journey_lesson_id
  join public.lessons
    on public.lessons.id = public.journey_lessons.lesson_id
  where public.lesson_progress.id = p_lesson_progress_id
    and public.user_journeys.user_id = v_user_id
    and public.profiles.onboarding_completed_at is not null
    and public.journeys.slug = 'type-2-first-14-days'
    and public.journeys.status = 'published'
    and public.journeys.published_at is not null
    and public.journey_lessons.status = 'published'
    and public.journey_lessons.published_at is not null
    and public.lessons.status = 'published'
    and public.lessons.published_at is not null
  for update of public.lesson_progress, public.user_journeys;

  if v_user_journey_id is null or v_block_count is null or v_block_count < 1 then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  if v_lesson_status = 'completed' then
    select public.user_journeys.completed_at is not null
    into v_journey_completed
    from public.user_journeys
    where public.user_journeys.id = v_user_journey_id;

    if not v_journey_completed and v_current_journey_lesson_id is not null then
      select public.journey_lessons.day_number
      into v_next_day
      from public.journey_lessons
      join public.lessons on public.lessons.id = public.journey_lessons.lesson_id
      where public.journey_lessons.id = v_current_journey_lesson_id
        and public.journey_lessons.journey_id = v_journey_id
        and public.journey_lessons.status = 'published'
        and public.journey_lessons.published_at is not null
        and public.lessons.status = 'published'
        and public.lessons.published_at is not null;
    end if;

    return query
    select
      false,
      0,
      v_existing_xp,
      v_journey_completed,
      v_next_day,
      case when v_next_day is null then null else '/lessons/' || v_next_day::pg_catalog.text end,
      v_existing_completed_at;
    return;
  end if;

  if v_journey_lesson_id is distinct from v_current_journey_lesson_id then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  if v_last_viewed_block < v_block_count - 1 then
    raise exception using errcode = 'P0001', message = 'Completion requirements are not met.';
  end if;

  if v_prerequisite_journey_lesson_id is not null and not exists (
    select 1
    from public.lesson_progress
    where public.lesson_progress.user_journey_id = v_user_journey_id
      and public.lesson_progress.journey_lesson_id = v_prerequisite_journey_lesson_id
      and public.lesson_progress.status = 'completed'
  ) then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  if exists (
    select 1
    from public.activities
    where public.activities.lesson_id = v_lesson_id
      and public.activities.status = 'published'
      and public.activities.published_at is not null
      and not exists (
        select 1
        from public.activity_progress
        where public.activity_progress.lesson_progress_id = p_lesson_progress_id
          and public.activity_progress.activity_id = public.activities.id
          and public.activity_progress.status = 'completed'
      )
  ) then
    raise exception using errcode = 'P0001', message = 'Completion requirements are not met.';
  end if;

  update public.lesson_progress
  set
    status = 'completed',
    completed_at = pg_catalog.now(),
    xp_awarded = 75
  where public.lesson_progress.id = p_lesson_progress_id;

  select
    public.journey_lessons.id,
    public.journey_lessons.day_number,
    public.journey_lessons.prerequisite_journey_lesson_id
  into
    v_next_journey_lesson_id,
    v_next_day,
    v_next_prerequisite_journey_lesson_id
  from public.journey_lessons
  join public.lessons on public.lessons.id = public.journey_lessons.lesson_id
  where public.journey_lessons.journey_id = v_journey_id
    and public.journey_lessons.status = 'published'
    and public.journey_lessons.published_at is not null
    and public.lessons.status = 'published'
    and public.lessons.published_at is not null
    and public.journey_lessons.display_order > v_display_order
  order by public.journey_lessons.display_order asc
  limit 1;

  if v_next_journey_lesson_id is not null then
    if v_next_prerequisite_journey_lesson_id is not null and not exists (
      select 1
      from public.lesson_progress
      where public.lesson_progress.user_journey_id = v_user_journey_id
        and public.lesson_progress.journey_lesson_id = v_next_prerequisite_journey_lesson_id
        and public.lesson_progress.status = 'completed'
    ) then
      raise exception using errcode = '42501', message = 'Not authorized.';
    end if;

    insert into public.lesson_progress (
      user_journey_id,
      journey_lesson_id,
      status,
      xp_awarded
    )
    values (
      v_user_journey_id,
      v_next_journey_lesson_id,
      'not_started',
      0
    )
    on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

    update public.user_journeys
    set current_journey_lesson_id = v_next_journey_lesson_id,
      last_active_at = pg_catalog.now()
    where public.user_journeys.id = v_user_journey_id;
  elsif not exists (
    select 1
    from public.journey_lessons
    join public.lessons on public.lessons.id = public.journey_lessons.lesson_id
    where public.journey_lessons.journey_id = v_journey_id
      and public.journey_lessons.status = 'published'
      and public.journey_lessons.published_at is not null
      and public.lessons.status = 'published'
      and public.lessons.published_at is not null
      and not exists (
        select 1
        from public.lesson_progress
        where public.lesson_progress.user_journey_id = v_user_journey_id
          and public.lesson_progress.journey_lesson_id = public.journey_lessons.id
          and public.lesson_progress.status = 'completed'
      )
  ) then
    update public.user_journeys
    set completed_at = coalesce(completed_at, pg_catalog.now()),
      last_active_at = pg_catalog.now()
    where public.user_journeys.id = v_user_journey_id;
    v_journey_completed := true;
    v_next_day := null;
  else
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  return query
  select
    true,
    75,
    75,
    v_journey_completed,
    v_next_day,
    case when v_next_day is null then null else '/lessons/' || v_next_day::pg_catalog.text end,
    pg_catalog.now();
end;
$$;

comment on function public.complete_current_lesson(pg_catalog.uuid) is
  'SECURITY DEFINER is required because direct lesson-progress and journey writes are denied. The function derives auth.uid(), validates owned published active-journey completion requirements, atomically awards one standard 75 Confidence XP reward, and safely advances one journey assignment.';

revoke all on function public.complete_current_lesson(pg_catalog.uuid) from public;
revoke all on function public.complete_current_lesson(pg_catalog.uuid) from anon;
grant execute on function public.complete_current_lesson(pg_catalog.uuid) to authenticated;
