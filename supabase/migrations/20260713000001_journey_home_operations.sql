alter table public.confidence_check_ins
  add constraint confidence_check_ins_unique_lesson_progress
  unique (lesson_progress_id);

create function public.initialize_current_user_journey()
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
  v_journey_lesson_id pg_catalog.uuid;
  v_user_journey_id pg_catalog.uuid;
  v_lesson_progress_id pg_catalog.uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  select public.journeys.id
  into v_journey_id
  from public.journeys
  where public.journeys.slug = 'type-2-first-14-days'
    and public.journeys.status = 'published'
    and public.journeys.published_at is not null
  limit 1;

  if v_journey_id is null then
    raise exception using errcode = 'P0002', message = 'Journey unavailable.';
  end if;

  select public.journey_lessons.id
  into v_journey_lesson_id
  from public.journey_lessons
  join public.lessons
    on public.lessons.id = public.journey_lessons.lesson_id
  where public.journey_lessons.journey_id = v_journey_id
    and public.journey_lessons.status = 'published'
    and public.journey_lessons.published_at is not null
    and public.lessons.status = 'published'
    and public.lessons.published_at is not null
  order by public.journey_lessons.display_order asc
  limit 1;

  if v_journey_lesson_id is null then
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
    v_journey_lesson_id
  )
  on conflict on constraint user_journeys_unique_user_journey do nothing;

  select public.user_journeys.id
  into v_user_journey_id
  from public.user_journeys
  where public.user_journeys.user_id = v_user_id
    and public.user_journeys.journey_id = v_journey_id;

  update public.user_journeys
  set current_journey_lesson_id = v_journey_lesson_id
  where public.user_journeys.id = v_user_journey_id
    and public.user_journeys.current_journey_lesson_id is null;

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

  select public.lesson_progress.id
  into v_lesson_progress_id
  from public.lesson_progress
  where public.lesson_progress.user_journey_id = v_user_journey_id
    and public.lesson_progress.journey_lesson_id = v_journey_lesson_id;

  return query
  select v_user_journey_id, v_lesson_progress_id, v_journey_lesson_id;
end;
$$;

comment on function public.initialize_current_user_journey() is
  'SECURITY DEFINER is required because direct writes to journey progress are denied. The function derives auth.uid(), selects only the stable published prototype journey, and performs narrowly scoped idempotent initialization.';

revoke all on function public.initialize_current_user_journey() from public;
revoke all on function public.initialize_current_user_journey() from anon;
grant execute on function public.initialize_current_user_journey() to authenticated;

create function public.upsert_confidence_check_in(
  p_lesson_progress_id pg_catalog.uuid,
  p_confidence_level pg_catalog.text
)
returns table (
  confidence_check_in_id pg_catalog.uuid,
  saved_confidence_level pg_catalog.text
)
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

  if p_confidence_level not in ('not_yet', 'somewhat', 'confident') then
    raise exception using errcode = '22023', message = 'Invalid confidence value.';
  end if;

  if not exists (
    select 1
    from public.lesson_progress
    join public.user_journeys
      on public.user_journeys.id = public.lesson_progress.user_journey_id
    where public.lesson_progress.id = p_lesson_progress_id
      and public.user_journeys.user_id = v_user_id
  ) then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  return query
  insert into public.confidence_check_ins as confidence_check_in (
    lesson_progress_id,
    confidence_level
  )
  values (
    p_lesson_progress_id,
    p_confidence_level
  )
  on conflict on constraint confidence_check_ins_unique_lesson_progress
  do update set confidence_level = excluded.confidence_level
  returning confidence_check_in.id, confidence_check_in.confidence_level;
end;
$$;

comment on function public.upsert_confidence_check_in(pg_catalog.uuid, pg_catalog.text) is
  'SECURITY DEFINER is required because direct confidence writes are denied. The function derives auth.uid(), verifies lesson-progress ownership, validates the allowed value, and upserts one record per lesson context.';

revoke all on function public.upsert_confidence_check_in(pg_catalog.uuid, pg_catalog.text) from public;
revoke all on function public.upsert_confidence_check_in(pg_catalog.uuid, pg_catalog.text) from anon;
grant execute on function public.upsert_confidence_check_in(pg_catalog.uuid, pg_catalog.text) to authenticated;
