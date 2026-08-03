create table public.user_learning_streaks (
  user_id pg_catalog.uuid primary key references auth.users(id) on delete cascade,
  current_streak pg_catalog.int4 not null default 0,
  longest_streak pg_catalog.int4 not null default 0,
  freeze_balance pg_catalog.int4 not null default 2,
  last_qualified_date pg_catalog.date,
  timezone pg_catalog.text not null default 'UTC',
  pending_notice pg_catalog.text,
  created_at pg_catalog.timestamptz not null default pg_catalog.now(),
  updated_at pg_catalog.timestamptz not null default pg_catalog.now(),
  constraint user_learning_streaks_counts_valid check (
    current_streak >= 0 and longest_streak >= current_streak and freeze_balance between 0 and 2
  ),
  constraint user_learning_streaks_notice_valid check (
    pending_notice is null or pending_notice = any (array['freeze_used', 'streak_reset']::pg_catalog.text[])
  )
);

create table public.user_learning_activity_days (
  user_id pg_catalog.uuid not null references auth.users(id) on delete cascade,
  activity_date pg_catalog.date not null,
  qualifying_event_type pg_catalog.text not null,
  created_at pg_catalog.timestamptz not null default pg_catalog.now(),
  constraint user_learning_activity_days_pkey primary key (user_id, activity_date),
  constraint user_learning_activity_days_event_valid check (
    qualifying_event_type = any (array[
      'lesson_completed',
      'myth_round_completed',
      'myth_replay_completed',
      'appointment_summary_completed',
      'caregiver_module_completed',
      'verified_support_resource_opened',
      'milestone_earned'
    ]::pg_catalog.text[])
  )
);

create table public.user_next_step_preferences (
  user_id pg_catalog.uuid primary key references auth.users(id) on delete cascade,
  last_rule_id pg_catalog.text not null,
  last_action pg_catalog.text not null default 'dismissed',
  last_action_date pg_catalog.date not null,
  updated_at pg_catalog.timestamptz not null default pg_catalog.now(),
  constraint user_next_step_action_valid check (last_action = 'dismissed'),
  constraint user_next_step_rule_valid check (
    last_rule_id ~ '^(continue|start)-lesson-([1-9]|1[0-4])$'
    or last_rule_id = any (array[
      'myth-check', 'appointment-prep', 'trusted-resource', 'medical-glossary'
    ]::pg_catalog.text[])
  )
);

alter table public.user_learning_streaks enable row level security;
alter table public.user_learning_activity_days enable row level security;
alter table public.user_next_step_preferences enable row level security;

create policy "users read own learning streak"
on public.user_learning_streaks for select to authenticated
using (user_id = auth.uid());

create policy "users read own learning activity days"
on public.user_learning_activity_days for select to authenticated
using (user_id = auth.uid());

create policy "users read own next step preferences"
on public.user_next_step_preferences for select to authenticated
using (user_id = auth.uid());

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
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select settings.timezone into v_timezone
  from public.user_settings as settings where settings.user_id = v_user_id;
  if v_timezone is null or not exists (
    select 1 from pg_catalog.pg_timezone_names where name = v_timezone
  ) then v_timezone := 'UTC'; end if;
  insert into public.user_learning_streaks (user_id, timezone)
  values (v_user_id, v_timezone) on conflict (user_id) do nothing;
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
  v_user_id pg_catalog.uuid := auth.uid();
  v_timezone pg_catalog.text;
  v_activity_date pg_catalog.date;
  v_previous_date pg_catalog.date;
  v_current pg_catalog.int4;
  v_longest pg_catalog.int4;
  v_freezes pg_catalog.int4;
  v_missed pg_catalog.int4;
  v_inserted pg_catalog.int4 := 0;
  v_notice pg_catalog.text := null;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if p_event_type <> all (array[
    'lesson_completed', 'myth_round_completed', 'myth_replay_completed',
    'appointment_summary_completed', 'caregiver_module_completed',
    'verified_support_resource_opened', 'milestone_earned'
  ]::pg_catalog.text[]) then
    raise exception 'Unsupported learning activity';
  end if;

  select settings.timezone into v_timezone
  from public.user_settings as settings where settings.user_id = v_user_id;
  if v_timezone is null or not exists (
    select 1 from pg_catalog.pg_timezone_names where name = v_timezone
  ) then v_timezone := 'UTC'; end if;
  v_activity_date := (pg_catalog.clock_timestamp() at time zone v_timezone)::pg_catalog.date;

  if p_event_type = 'lesson_completed' and not exists (
    select 1
    from public.lesson_progress as progress
    join public.user_journeys as user_journey on user_journey.id = progress.user_journey_id
    where user_journey.user_id = v_user_id
      and progress.status = 'completed'
      and (progress.completed_at at time zone v_timezone)::pg_catalog.date = v_activity_date
  ) then
    raise exception 'No completed lesson received today';
  end if;

  if p_event_type = 'milestone_earned' and not exists (
    select 1 from public.user_milestones as milestone
    where milestone.user_id = v_user_id
      and milestone.milestone_id <> 'MILESTONE-PERSONAL-TOOLKIT'
      and (milestone.unlocked_at at time zone v_timezone)::pg_catalog.date = v_activity_date
  ) then
    raise exception 'No meaningful milestone received today';
  end if;

  insert into public.user_learning_streaks (user_id, timezone)
  values (v_user_id, v_timezone) on conflict (user_id) do nothing;

  select streak.current_streak, streak.longest_streak, streak.freeze_balance,
         streak.last_qualified_date
  into v_current, v_longest, v_freezes, v_previous_date
  from public.user_learning_streaks as streak
  where streak.user_id = v_user_id for update;

  insert into public.user_learning_activity_days (user_id, activity_date, qualifying_event_type)
  values (v_user_id, v_activity_date, p_event_type)
  on conflict (user_id, activity_date) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted > 0 and (v_previous_date is null or v_activity_date > v_previous_date) then
    if v_previous_date is null or v_current = 0 then
      v_current := 1;
    else
      v_missed := v_activity_date - v_previous_date - 1;
      if v_missed <= v_freezes then
        v_current := v_current + v_missed + 1;
        v_freezes := v_freezes - v_missed;
        if v_missed > 0 then v_notice := 'freeze_used'; end if;
      else
        v_current := 1;
        v_notice := 'streak_reset';
      end if;
    end if;
    v_longest := greatest(v_longest, v_current);
    v_previous_date := v_activity_date;
  end if;

  update public.user_learning_streaks as streak set
    current_streak = v_current,
    longest_streak = v_longest,
    freeze_balance = v_freezes,
    last_qualified_date = v_previous_date,
    timezone = v_timezone,
    pending_notice = case when v_inserted > 0 then v_notice else streak.pending_notice end,
    updated_at = pg_catalog.clock_timestamp()
  where streak.user_id = v_user_id;

  return query select streak.current_streak, streak.longest_streak, streak.freeze_balance,
    streak.last_qualified_date, streak.timezone, streak.pending_notice
  from public.user_learning_streaks as streak where streak.user_id = v_user_id;
end;
$$;

create or replace function public.dismiss_next_step(p_rule_id pg_catalog.text)
returns pg_catalog.void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_timezone pg_catalog.text;
  v_today pg_catalog.date;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if not (
    p_rule_id ~ '^(continue|start)-lesson-([1-9]|1[0-4])$'
    or p_rule_id = any (array[
      'myth-check', 'appointment-prep', 'trusted-resource', 'medical-glossary'
    ]::pg_catalog.text[])
  ) then raise exception 'Unsupported recommendation'; end if;
  select settings.timezone into v_timezone
  from public.user_settings as settings where settings.user_id = v_user_id;
  if v_timezone is null or not exists (
    select 1 from pg_catalog.pg_timezone_names where name = v_timezone
  ) then v_timezone := 'UTC'; end if;
  v_today := (pg_catalog.clock_timestamp() at time zone v_timezone)::pg_catalog.date;
  insert into public.user_next_step_preferences
    (user_id, last_rule_id, last_action, last_action_date, updated_at)
  values (v_user_id, p_rule_id, 'dismissed', v_today, pg_catalog.clock_timestamp())
  on conflict (user_id) do update set
    last_rule_id = excluded.last_rule_id,
    last_action = excluded.last_action,
    last_action_date = excluded.last_action_date,
    updated_at = excluded.updated_at;
end;
$$;

create or replace function public.acknowledge_learning_streak_notice()
returns pg_catalog.void
language sql
security definer
set search_path = ''
as $$
  update public.user_learning_streaks
  set pending_notice = null, updated_at = pg_catalog.clock_timestamp()
  where user_id = auth.uid() and pending_notice is not null;
$$;

revoke all on function public.record_learning_activity(pg_catalog.text) from public;
revoke all on function public.dismiss_next_step(pg_catalog.text) from public;
revoke all on function public.acknowledge_learning_streak_notice() from public;
revoke all on function public.initialize_learning_streak() from public;
grant execute on function public.record_learning_activity(pg_catalog.text) to authenticated;
grant execute on function public.dismiss_next_step(pg_catalog.text) to authenticated;
grant execute on function public.acknowledge_learning_streak_notice() to authenticated;
grant execute on function public.initialize_learning_streak() to authenticated;

comment on table public.user_learning_activity_days is
  'One minimal, controlled qualifying learning category per user-local calendar day.';
comment on table public.user_learning_streaks is
  'Engagement continuity only; not a measure of health, treatment adherence, or clinical progress.';
comment on column public.user_learning_streaks.timezone is
  'IANA timezone active when the most recent qualifying activity was received. A settings change applies to later events and never rewrites prior activity dates.';
