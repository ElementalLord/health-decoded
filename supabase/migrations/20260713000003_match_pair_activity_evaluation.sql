create function public.evaluate_match_pair_activity(
  p_lesson_progress_id pg_catalog.uuid,
  p_activity_id pg_catalog.uuid,
  p_response pg_catalog.jsonb
)
returns table (
  is_correct pg_catalog.boolean,
  is_complete pg_catalog.boolean,
  feedback_message pg_catalog.text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_configuration pg_catalog.jsonb;
  v_answer_config pg_catalog.jsonb;
  v_explanation pg_catalog.text;
  v_is_correct pg_catalog.boolean;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  if p_response is null
    or pg_catalog.pg_column_size(p_response) > 8192
    or pg_catalog.jsonb_typeof(p_response) <> 'object'
    or pg_catalog.jsonb_typeof(p_response -> 'pairs') <> 'object'
    or (select count(*) from pg_catalog.jsonb_each(p_response -> 'pairs')) < 1
    or (select count(*) from pg_catalog.jsonb_each(p_response -> 'pairs')) > 6 then
    raise exception using errcode = '22023', message = 'Invalid activity response.';
  end if;

  select
    public.activities.configuration,
    public.activity_answer_keys.answer_config,
    public.activities.explanation
  into v_configuration, v_answer_config, v_explanation
  from public.lesson_progress
  join public.user_journeys
    on public.user_journeys.id = public.lesson_progress.user_journey_id
  join public.journeys
    on public.journeys.id = public.user_journeys.journey_id
  join public.journey_lessons
    on public.journey_lessons.id = public.lesson_progress.journey_lesson_id
  join public.lessons
    on public.lessons.id = public.journey_lessons.lesson_id
  join public.activities
    on public.activities.lesson_id = public.lessons.id
  join public.activity_answer_keys
    on public.activity_answer_keys.activity_id = public.activities.id
  where public.lesson_progress.id = p_lesson_progress_id
    and public.lesson_progress.status = 'in_progress'
    and public.user_journeys.user_id = v_user_id
    and public.journeys.slug = 'type-2-first-14-days'
    and public.journeys.status = 'published'
    and public.journeys.published_at is not null
    and public.journey_lessons.status = 'published'
    and public.journey_lessons.published_at is not null
    and public.lessons.status = 'published'
    and public.lessons.published_at is not null
    and public.activities.id = p_activity_id
    and public.activities.activity_type = 'match_pair'
    and public.activities.status = 'published'
    and public.activities.published_at is not null;

  if v_answer_config is null
    or pg_catalog.jsonb_typeof(v_answer_config) <> 'object'
    or pg_catalog.jsonb_typeof(v_answer_config -> 'pairs') <> 'object'
    or (select count(*) from pg_catalog.jsonb_each(v_answer_config -> 'pairs')) < 1
    or (select count(*) from pg_catalog.jsonb_each(v_answer_config -> 'pairs')) > 6 then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  v_is_correct := (p_response -> 'pairs') = (v_answer_config -> 'pairs');

  return query
  insert into public.activity_progress as activity_progress (
    lesson_progress_id,
    activity_id,
    status,
    result_summary,
    completed_at
  )
  values (
    p_lesson_progress_id,
    p_activity_id,
    case when v_is_correct then 'completed' else 'in_progress' end,
    pg_catalog.jsonb_build_object('completed', v_is_correct),
    case when v_is_correct then pg_catalog.now() else null end
  )
  on conflict on constraint activity_progress_unique_lesson_progress_activity
  do update set
    status = case
      when activity_progress.status = 'completed' or v_is_correct then 'completed'
      else 'in_progress'
    end,
    result_summary = case
      when activity_progress.status = 'completed' then activity_progress.result_summary
      else pg_catalog.jsonb_build_object('completed', v_is_correct)
    end,
    completed_at = case
      when activity_progress.status = 'completed' then activity_progress.completed_at
      when v_is_correct then pg_catalog.now()
      else null
    end
  returning
    v_is_correct,
    activity_progress.status = 'completed',
    case
      when v_is_correct then coalesce(v_configuration -> 'feedback' ->> 'correct', v_explanation)
      else coalesce(v_configuration -> 'feedback' ->> 'retry', v_explanation)
    end;
end;
$$;

comment on function public.evaluate_match_pair_activity(pg_catalog.uuid, pg_catalog.uuid, pg_catalog.jsonb) is
  'SECURITY DEFINER is required because protected answer keys and direct activity-progress writes are denied. The function derives auth.uid(), validates owned in-progress lesson access, evaluates only match_pair mappings, stores aggregate completion, and returns safe public feedback.';

revoke all on function public.evaluate_match_pair_activity(pg_catalog.uuid, pg_catalog.uuid, pg_catalog.jsonb) from public;
revoke all on function public.evaluate_match_pair_activity(pg_catalog.uuid, pg_catalog.uuid, pg_catalog.jsonb) from anon;
grant execute on function public.evaluate_match_pair_activity(pg_catalog.uuid, pg_catalog.uuid, pg_catalog.jsonb) to authenticated;
