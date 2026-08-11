-- Security hardening found during the pre-tester account-isolation audit.
-- A review result token is only an idempotency key; it is never authorization.
-- Prevent a browser caller from using fresh UUIDs to advance a review repeatedly
-- before the database-controlled due time.
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
  v_now pg_catalog.timestamptz := pg_catalog.clock_timestamp();
  v_interval pg_catalog.interval;
  v_increment pg_catalog.int4 := 0;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;
  if p_challenge_id <> all (array[
    'blood-glucose','insulin','insulin-resistance','type-2-diabetes','a1c','a1c-vs-glucose',
    'carbohydrates','serving-size','total-vs-added-sugars','total-carbohydrate'
  ]::pg_catalog.text[]) then
    raise exception using errcode = '22023', message = 'Unknown review challenge.';
  end if;
  if p_verdict <> all (array['got_it','almost_there','try_again']::pg_catalog.text[]) then
    raise exception using errcode = '22023', message = 'Invalid review verdict.';
  end if;
  if p_had_retry is null or p_example_viewed is null or p_result_token is null then
    raise exception using errcode = '22023', message = 'Invalid review result.';
  end if;

  select * into v_state
  from public.user_spaced_review_state
  where user_id = v_user_id and challenge_id = p_challenge_id
  for update;

  if not found then
    raise exception using errcode = '22023', message = 'Review challenge is not eligible.';
  end if;
  if v_state.last_result_token = p_result_token then return false; end if;
  if v_state.next_due_at > v_now then return false; end if;

  if p_example_viewed or p_verdict = 'try_again' then v_interval := interval '1 day';
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
    last_reviewed_at = v_now,
    last_verdict = p_verdict,
    successful_review_count = successful_review_count + v_increment,
    next_due_at = v_now + v_interval,
    last_result_token = p_result_token,
    updated_at = v_now
  where user_id = v_user_id and challenge_id = p_challenge_id;
  return true;
end;
$$;

revoke all on function public.record_spaced_review_result(
  pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.bool, pg_catalog.uuid
) from public, anon;
grant execute on function public.record_spaced_review_result(
  pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.bool, pg_catalog.uuid
) to authenticated;

comment on function public.record_spaced_review_result(
  pg_catalog.text, pg_catalog.text, pg_catalog.bool, pg_catalog.bool, pg_catalog.uuid
) is
  'Records one due review for auth.uid(). Caller UUIDs are idempotency only; ownership and eligibility are database-derived.';

-- Viewing an example may shorten the interval only for a review that was already
-- due. A caller-generated session UUID cannot pull an arbitrary future due date
-- forward by invoking the RPC directly.
create or replace function public.record_spaced_review_example(
  p_challenge_id pg_catalog.text,
  p_session_id pg_catalog.uuid
)
returns pg_catalog.bool
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_now pg_catalog.timestamptz := pg_catalog.clock_timestamp();
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;
  if p_session_id is null then
    raise exception using errcode = '22023', message = 'Invalid review session.';
  end if;

  update public.user_spaced_review_state set
    next_due_at = v_now + interval '1 day',
    last_example_session_id = p_session_id,
    updated_at = v_now
  where user_id = v_user_id
    and challenge_id = p_challenge_id
    and next_due_at <= v_now
    and last_example_session_id is distinct from p_session_id;
  return found;
end;
$$;

revoke all on function public.record_spaced_review_example(
  pg_catalog.text, pg_catalog.uuid
) from public, anon;
grant execute on function public.record_spaced_review_example(
  pg_catalog.text, pg_catalog.uuid
) to authenticated;
