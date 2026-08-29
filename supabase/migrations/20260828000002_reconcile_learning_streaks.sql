alter table public.user_learning_streaks
  add column last_continuity_date pg_catalog.date;

update public.user_learning_streaks
set last_continuity_date = last_qualified_date
where last_continuity_date is null;

comment on column public.user_learning_streaks.last_continuity_date is
  'Last calendar day accounted for by qualifying activity or an automatically consumed streak freeze.';

create or replace function public.initialize_learning_streak()
returns table (
  current_streak pg_catalog.int4,
  longest_streak pg_catalog.int4,
  freeze_balance pg_catalog.int4,
  last_qualified_date pg_catalog.date,
  timezone pg_catalog.text,
  pending_notice pg_catalog.text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_timezone pg_catalog.text;
  v_today pg_catalog.date;
  v_continuity_date pg_catalog.date;
  v_current pg_catalog.int4;
  v_longest pg_catalog.int4;
  v_freezes pg_catalog.int4;
  v_missed pg_catalog.int4;
  v_notice pg_catalog.text;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;

  select settings.timezone into v_timezone
  from public.user_settings as settings where settings.user_id = v_user_id;
  if v_timezone is null or not exists (
    select 1 from pg_catalog.pg_timezone_names where name = v_timezone
  ) then v_timezone := 'UTC'; end if;
  v_today := (pg_catalog.clock_timestamp() at time zone v_timezone)::pg_catalog.date;

  insert into public.user_learning_streaks (user_id, timezone)
  values (v_user_id, v_timezone) on conflict (user_id) do nothing;

  select streak.current_streak, streak.longest_streak, streak.freeze_balance,
         coalesce(streak.last_continuity_date, streak.last_qualified_date),
         streak.pending_notice
  into v_current, v_longest, v_freezes, v_continuity_date, v_notice
  from public.user_learning_streaks as streak
  where streak.user_id = v_user_id for update;

  if v_current > 0 and v_continuity_date is not null then
    -- Today is still available for learning. Only completed, missed calendar days
    -- are reconciled here.
    v_missed := greatest(v_today - v_continuity_date - 1, 0);
    if v_missed > 0 then
      if v_missed <= v_freezes then
        v_current := v_current + v_missed;
        v_longest := greatest(v_longest, v_current);
        v_freezes := v_freezes - v_missed;
        v_continuity_date := v_continuity_date + v_missed;
        v_notice := 'freeze_used';
      else
        v_current := 0;
        v_continuity_date := null;
        v_notice := 'streak_reset';
      end if;
    end if;
  end if;

  update public.user_learning_streaks as streak set
    current_streak = v_current,
    longest_streak = v_longest,
    freeze_balance = v_freezes,
    last_continuity_date = v_continuity_date,
    timezone = v_timezone,
    pending_notice = v_notice,
    updated_at = pg_catalog.clock_timestamp()
  where streak.user_id = v_user_id;

  return query select streak.current_streak, streak.longest_streak, streak.freeze_balance,
    streak.last_qualified_date, streak.timezone, streak.pending_notice
  from public.user_learning_streaks as streak where streak.user_id = v_user_id;
end;
$$;

create or replace function public.record_learning_activity(p_event_type pg_catalog.text)
returns table (
  current_streak pg_catalog.int4,
  longest_streak pg_catalog.int4,
  freeze_balance pg_catalog.int4,
  last_qualified_date pg_catalog.date,
  timezone pg_catalog.text,
  pending_notice pg_catalog.text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid(); v_timezone pg_catalog.text; v_activity_date pg_catalog.date;
  v_previous_date pg_catalog.date; v_current pg_catalog.int4; v_longest pg_catalog.int4;
  v_freezes pg_catalog.int4; v_missed pg_catalog.int4; v_inserted pg_catalog.int4 := 0; v_notice pg_catalog.text := null;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if p_event_type <> all (array['lesson_completed','myth_round_completed','myth_replay_completed','appointment_summary_completed','caregiver_module_completed','verified_support_resource_opened','milestone_earned','ai_learning_exchange_completed','clinician_questions_prepared']::pg_catalog.text[]) then raise exception 'Unsupported learning activity'; end if;
  select settings.timezone into v_timezone from public.user_settings as settings where settings.user_id = v_user_id;
  if v_timezone is null or not exists (select 1 from pg_catalog.pg_timezone_names where name = v_timezone) then v_timezone := 'UTC'; end if;
  v_activity_date := (pg_catalog.clock_timestamp() at time zone v_timezone)::pg_catalog.date;
  if p_event_type = 'lesson_completed' and not exists (select 1 from public.lesson_progress as progress join public.user_journeys as user_journey on user_journey.id = progress.user_journey_id where user_journey.user_id = v_user_id and progress.status = 'completed' and (progress.completed_at at time zone v_timezone)::pg_catalog.date = v_activity_date) then raise exception 'No completed lesson received today'; end if;
  if p_event_type = 'milestone_earned' and not exists (select 1 from public.user_milestones as milestone where milestone.user_id = v_user_id and milestone.milestone_id <> 'MILESTONE-PERSONAL-TOOLKIT' and (milestone.unlocked_at at time zone v_timezone)::pg_catalog.date = v_activity_date) then raise exception 'No meaningful milestone received today'; end if;
  insert into public.user_learning_streaks (user_id, timezone) values (v_user_id, v_timezone) on conflict (user_id) do nothing;
  select streak.current_streak, streak.longest_streak, streak.freeze_balance, coalesce(streak.last_continuity_date, streak.last_qualified_date) into v_current, v_longest, v_freezes, v_previous_date from public.user_learning_streaks as streak where streak.user_id = v_user_id for update;
  insert into public.user_learning_activity_days (user_id, activity_date, qualifying_event_type) values (v_user_id, v_activity_date, p_event_type) on conflict (user_id, activity_date) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted > 0 and (v_previous_date is null or v_activity_date > v_previous_date) then
    if v_previous_date is null or v_current = 0 then v_current := 1;
    else v_missed := v_activity_date - v_previous_date - 1;
      if v_missed <= v_freezes then v_current := v_current + v_missed + 1; v_freezes := v_freezes - v_missed; if v_missed > 0 then v_notice := 'freeze_used'; end if;
      else v_current := 1; v_notice := 'streak_reset'; end if;
    end if;
    v_longest := greatest(v_longest, v_current); v_previous_date := v_activity_date;
  end if;
  update public.user_learning_streaks as streak set current_streak = v_current, longest_streak = v_longest, freeze_balance = v_freezes, last_qualified_date = case when v_inserted > 0 then v_activity_date else streak.last_qualified_date end, last_continuity_date = v_previous_date, timezone = v_timezone, pending_notice = case when v_inserted > 0 then v_notice else streak.pending_notice end, updated_at = pg_catalog.clock_timestamp() where streak.user_id = v_user_id;
  return query select streak.current_streak, streak.longest_streak, streak.freeze_balance, streak.last_qualified_date, streak.timezone, streak.pending_notice from public.user_learning_streaks as streak where streak.user_id = v_user_id;
end;
$$;
