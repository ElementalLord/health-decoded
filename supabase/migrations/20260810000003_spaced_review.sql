create table public.user_spaced_review_state (
  user_id pg_catalog.uuid not null references auth.users (id) on delete cascade,
  challenge_id pg_catalog.text not null,
  learned_at pg_catalog.timestamptz not null,
  last_reviewed_at pg_catalog.timestamptz,
  last_verdict pg_catalog.text,
  successful_review_count pg_catalog.int4 not null default 0,
  next_due_at pg_catalog.timestamptz not null,
  last_prompted_at pg_catalog.timestamptz,
  dismissed_until pg_catalog.timestamptz,
  automatic_prompt_history pg_catalog.timestamptz[] not null default '{}',
  last_result_token pg_catalog.uuid,
  last_example_session_id pg_catalog.uuid,
  last_prompt_token pg_catalog.uuid,
  created_at pg_catalog.timestamptz not null default pg_catalog.now(),
  updated_at pg_catalog.timestamptz not null default pg_catalog.now(),
  constraint user_spaced_review_state_pkey primary key (user_id, challenge_id),
  constraint user_spaced_review_challenge_valid check (challenge_id = any (array[
    'blood-glucose','insulin','insulin-resistance','type-2-diabetes','a1c','a1c-vs-glucose',
    'carbohydrates','serving-size','total-vs-added-sugars','total-carbohydrate'
  ]::pg_catalog.text[])),
  constraint user_spaced_review_verdict_valid check (
    last_verdict is null or last_verdict = any (array['got_it','almost_there','try_again']::pg_catalog.text[])
  ),
  constraint user_spaced_review_count_valid check (successful_review_count >= 0),
  constraint user_spaced_review_schedule_valid check (next_due_at >= learned_at),
  constraint user_spaced_review_prompt_history_bounded check (pg_catalog.cardinality(automatic_prompt_history) <= 3)
);

create index user_spaced_review_due_idx
on public.user_spaced_review_state (user_id, next_due_at);

alter table public.user_spaced_review_state enable row level security;

create policy "users read own spaced review state"
on public.user_spaced_review_state for select to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.initialize_spaced_review_from_lessons()
returns pg_catalog.int4
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_inserted pg_catalog.int4 := 0;
begin
  if v_user_id is null then raise exception using errcode = '42501', message = 'Not authorized.'; end if;

  with review_mapping(challenge_id, lesson_id) as (
    values
      ('blood-glucose', '20000000-0000-0000-0000-000000000002'::pg_catalog.uuid),
      ('blood-glucose', '20000000-0000-0000-0000-000000000003'::pg_catalog.uuid),
      ('insulin', '20000000-0000-0000-0000-000000000002'::pg_catalog.uuid),
      ('insulin-resistance', '20000000-0000-0000-0000-000000000002'::pg_catalog.uuid),
      ('type-2-diabetes', '20000000-0000-0000-0000-000000000002'::pg_catalog.uuid),
      ('a1c', '20000000-0000-0000-0000-000000000003'::pg_catalog.uuid),
      ('a1c-vs-glucose', '20000000-0000-0000-0000-000000000003'::pg_catalog.uuid),
      ('carbohydrates', '20000000-0000-0000-0000-000000000004'::pg_catalog.uuid),
      ('total-carbohydrate', '20000000-0000-0000-0000-000000000004'::pg_catalog.uuid)
  ), learned as (
    select review_mapping.challenge_id, min(progress.completed_at) as learned_at
    from review_mapping
    join public.journey_lessons as assignment on assignment.lesson_id = review_mapping.lesson_id
    join public.lesson_progress as progress on progress.journey_lesson_id = assignment.id
    join public.user_journeys as user_journey on user_journey.id = progress.user_journey_id
    where user_journey.user_id = v_user_id
      and progress.status = 'completed'
      and progress.completed_at is not null
    group by review_mapping.challenge_id
  )
  insert into public.user_spaced_review_state (user_id, challenge_id, learned_at, next_due_at)
  select v_user_id, learned.challenge_id, learned.learned_at, learned.learned_at + interval '3 days'
  from learned
  on conflict (user_id, challenge_id) do update
  set learned_at = least(public.user_spaced_review_state.learned_at, excluded.learned_at),
      next_due_at = case
        when public.user_spaced_review_state.last_reviewed_at is null
          then least(public.user_spaced_review_state.next_due_at, excluded.next_due_at)
        else public.user_spaced_review_state.next_due_at
      end,
      updated_at = pg_catalog.clock_timestamp();

  get diagnostics v_inserted = row_count;
  return v_inserted;
end;
$$;

create or replace function public.record_explain_it_back_learning(p_challenge_id pg_catalog.text)
returns pg_catalog.bool
language plpgsql
security definer
set search_path = ''
as $$
declare v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then raise exception using errcode = '42501', message = 'Not authorized.'; end if;
  if p_challenge_id <> all (array['blood-glucose','insulin','insulin-resistance','type-2-diabetes','a1c','a1c-vs-glucose','carbohydrates','serving-size','total-vs-added-sugars','total-carbohydrate']::pg_catalog.text[]) then
    raise exception using errcode = '22023', message = 'Unknown review challenge.';
  end if;
  insert into public.user_spaced_review_state (user_id, challenge_id, learned_at, next_due_at)
  values (v_user_id, p_challenge_id, pg_catalog.clock_timestamp(), pg_catalog.clock_timestamp() + interval '3 days')
  on conflict (user_id, challenge_id) do nothing;
  return true;
end;
$$;

create or replace function public.record_spaced_review_result(
  p_challenge_id pg_catalog.text,
  p_verdict pg_catalog.text,
  p_had_retry pg_catalog.bool,
  p_example_viewed pg_catalog.bool,
  p_result_token pg_catalog.uuid
)
returns pg_catalog.bool
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_state public.user_spaced_review_state%rowtype;
  v_interval pg_catalog.interval;
  v_increment pg_catalog.int4 := 0;
begin
  if v_user_id is null then raise exception using errcode = '42501', message = 'Not authorized.'; end if;
  if p_verdict <> all (array['got_it','almost_there','try_again']::pg_catalog.text[]) then raise exception using errcode = '22023', message = 'Invalid review verdict.'; end if;
  if p_result_token is null then raise exception using errcode = '22023', message = 'Result token is required.'; end if;

  select * into v_state from public.user_spaced_review_state
  where user_id = v_user_id and challenge_id = p_challenge_id for update;
  if not found then raise exception using errcode = '22023', message = 'Review challenge is not eligible.'; end if;
  if v_state.last_result_token = p_result_token then return false; end if;

  if p_example_viewed then v_interval := interval '1 day';
  elsif p_verdict = 'try_again' then v_interval := interval '1 day';
  elsif p_verdict = 'almost_there' then v_interval := interval '2 days';
  elsif p_had_retry then v_interval := interval '4 days';
  else
    v_interval := case v_state.successful_review_count
      when 0 then interval '7 days'
      when 1 then interval '14 days'
      when 2 then interval '30 days'
      else interval '60 days'
    end;
    v_increment := 1;
  end if;

  update public.user_spaced_review_state set
    last_reviewed_at = pg_catalog.clock_timestamp(),
    last_verdict = p_verdict,
    successful_review_count = successful_review_count + v_increment,
    next_due_at = pg_catalog.clock_timestamp() + v_interval,
    last_result_token = p_result_token,
    updated_at = pg_catalog.clock_timestamp()
  where user_id = v_user_id and challenge_id = p_challenge_id;
  return true;
end;
$$;

create or replace function public.record_spaced_review_example(p_challenge_id pg_catalog.text, p_session_id pg_catalog.uuid)
returns pg_catalog.bool language plpgsql security definer set search_path = '' as $$
declare v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then raise exception using errcode = '42501', message = 'Not authorized.'; end if;
  update public.user_spaced_review_state set
    next_due_at = pg_catalog.clock_timestamp() + interval '1 day',
    last_example_session_id = p_session_id,
    updated_at = pg_catalog.clock_timestamp()
  where user_id = v_user_id and challenge_id = p_challenge_id
    and last_example_session_id is distinct from p_session_id;
  return found;
end;
$$;

create or replace function public.record_spaced_review_prompt(p_challenge_id pg_catalog.text, p_prompt_token pg_catalog.uuid)
returns pg_catalog.bool language plpgsql security definer set search_path = '' as $$
declare v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then raise exception using errcode = '42501', message = 'Not authorized.'; end if;
  update public.user_spaced_review_state set
    last_prompted_at = pg_catalog.clock_timestamp(),
    automatic_prompt_history = array(
      select prompted_at from unnest(automatic_prompt_history || pg_catalog.clock_timestamp()) prompted_at
      where prompted_at >= pg_catalog.clock_timestamp() - interval '7 days'
      order by prompted_at desc limit 3
    ),
    last_prompt_token = p_prompt_token,
    updated_at = pg_catalog.clock_timestamp()
  where user_id = v_user_id and challenge_id = p_challenge_id
    and last_prompt_token is distinct from p_prompt_token;
  return found;
end;
$$;

create or replace function public.snooze_spaced_review_prompts(p_challenge_id pg_catalog.text)
returns pg_catalog.bool language plpgsql security definer set search_path = '' as $$
declare v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then raise exception using errcode = '42501', message = 'Not authorized.'; end if;
  update public.user_spaced_review_state set dismissed_until = pg_catalog.clock_timestamp() + interval '72 hours', updated_at = pg_catalog.clock_timestamp()
  where user_id = v_user_id and challenge_id = p_challenge_id;
  return found;
end;
$$;

revoke all on table public.user_spaced_review_state from anon, authenticated;
grant select on table public.user_spaced_review_state to authenticated;
revoke all on function public.initialize_spaced_review_from_lessons() from public;
revoke all on function public.record_explain_it_back_learning(pg_catalog.text) from public;
revoke all on function public.record_spaced_review_result(pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.bool, pg_catalog.uuid) from public;
revoke all on function public.record_spaced_review_example(pg_catalog.text, pg_catalog.uuid) from public;
revoke all on function public.record_spaced_review_prompt(pg_catalog.text, pg_catalog.uuid) from public;
revoke all on function public.snooze_spaced_review_prompts(pg_catalog.text) from public;
grant execute on function public.initialize_spaced_review_from_lessons() to authenticated;
grant execute on function public.record_explain_it_back_learning(pg_catalog.text) to authenticated;
grant execute on function public.record_spaced_review_result(pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.bool, pg_catalog.uuid) to authenticated;
grant execute on function public.record_spaced_review_example(pg_catalog.text, pg_catalog.uuid) to authenticated;
grant execute on function public.record_spaced_review_prompt(pg_catalog.text, pg_catalog.uuid) to authenticated;
grant execute on function public.snooze_spaced_review_prompts(pg_catalog.text) to authenticated;
