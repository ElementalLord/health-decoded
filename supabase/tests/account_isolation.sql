-- Real PostgreSQL/RLS adversarial checks. Run only against disposable local Supabase:
--   supabase start && supabase db reset && npm run security:db
-- All fixtures are synthetic and the transaction is rolled back.
begin;
select plan(1);

do $$
declare
  account_a constant pg_catalog.uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  account_b constant pg_catalog.uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  instance constant pg_catalog.uuid := '00000000-0000-0000-0000-000000000000';
  journey pg_catalog.uuid;
  assignment pg_catalog.uuid;
  user_journey_a pg_catalog.uuid;
  user_journey_b pg_catalog.uuid;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at
  ) values
    (instance, account_a, 'authenticated', 'authenticated', 'security-a@example.invalid', '', now(), now(), now()),
    (instance, account_b, 'authenticated', 'authenticated', 'security-b@example.invalid', '', now(), now(), now());

  update public.profiles set display_name = 'Security Test A' where id = account_a;
  update public.profiles set display_name = 'Security Test B' where id = account_b;

  select jl.journey_id, jl.id into journey, assignment
  from public.journey_lessons jl
  join public.journeys j on j.id = jl.journey_id
  where j.status = 'published' and jl.status = 'published'
  order by jl.display_order limit 1;
  if journey is null or assignment is null then
    raise exception 'Security fixtures require seeded published journey content';
  end if;

  insert into public.user_journeys (id, user_id, journey_id, current_journey_lesson_id)
  values
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0101', account_a, journey, assignment),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0101', account_b, journey, assignment);
  select id into user_journey_a from public.user_journeys where user_id = account_a and journey_id = journey;
  select id into user_journey_b from public.user_journeys where user_id = account_b and journey_id = journey;

  insert into public.lesson_progress (id, user_journey_id, journey_lesson_id, status, started_at, last_viewed_block)
  values
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0201', user_journey_a, assignment, 'in_progress', now(), 1),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0201', user_journey_b, assignment, 'in_progress', now(), 2);

  insert into public.user_milestones (user_id, milestone_id)
  values (account_a, 'MILESTONE-FIRST-STEP'), (account_b, 'MILESTONE-MYTH-CHECKER');
  insert into public.user_learning_streaks (user_id, current_streak, longest_streak)
  values (account_a, 1, 1), (account_b, 7, 7);
  insert into public.user_spaced_review_state (
    user_id, challenge_id, learned_at, next_due_at, successful_review_count
  ) values
    (account_a, 'a1c', now() - interval '10 days', now() - interval '1 day', 0),
    (account_b, 'a1c', now() - interval '20 days', now() - interval '1 day', 9);
end;
$$;

set local role authenticated;
select pg_catalog.set_config('request.jwt.claim.role', 'authenticated', true);
select pg_catalog.set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);

do $$
declare
  account_a constant pg_catalog.uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  account_b constant pg_catalog.uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  b_progress pg_catalog.uuid;
  affected pg_catalog.int4;
  changed pg_catalog.bool;
begin
  if (select count(*) from public.profiles) <> 1
    or not exists (select 1 from public.profiles where id = account_a) then
    raise exception 'A must read A profile and no other profile';
  end if;
  if exists (select 1 from public.profiles where id = account_b) then
    raise exception 'A read B profile';
  end if;

  update public.profiles set display_name = 'ATTACKED' where id = account_b;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'A updated B profile'; end if;
  begin
    update public.profiles set id = account_b where id = account_a;
    raise exception 'A changed profile ownership';
  exception when insufficient_privilege or unique_violation then null; end;

  if (select count(*) from public.lesson_progress) <> 1 then
    raise exception 'A broad-read exposed B lesson progress';
  end if;
  select lp.id into b_progress
  from public.lesson_progress lp
  join public.user_journeys uj on uj.id = lp.user_journey_id
  where uj.user_id = account_b;
  if b_progress is not null then raise exception 'A selected B lesson progress'; end if;
  update public.lesson_progress set last_viewed_block = 99
  where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0201';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'A updated B lesson progress'; end if;
  delete from public.lesson_progress
  where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0201';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'A deleted B lesson progress'; end if;
  begin
    insert into public.lesson_progress (
      user_journey_id, journey_lesson_id, status, started_at, last_viewed_block
    ) values (
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0101',
      (select id from public.journey_lessons order by display_order limit 1),
      'in_progress', now(), 3
    );
    raise exception 'A inserted lesson progress for B';
  exception when insufficient_privilege or unique_violation then null; end;

  begin
    perform public.save_lesson_block_position(
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0201', 3
    );
    raise exception 'A invoked progress RPC against B';
  exception when insufficient_privilege then null; end;

  if exists (select 1 from public.user_spaced_review_state where user_id = account_b)
    or (select count(*) from public.user_spaced_review_state) <> 1 then
    raise exception 'A read B Spaced Review state';
  end if;
  if exists (select 1 from public.user_milestones where user_id = account_b) then
    raise exception 'A read B milestone state';
  end if;
  if exists (select 1 from public.user_learning_streaks where user_id = account_b) then
    raise exception 'A read B streak state';
  end if;

  begin
    insert into public.user_spaced_review_state (user_id, challenge_id, learned_at, next_due_at)
    values (account_b, 'insulin', now(), now());
    raise exception 'A inserted B Spaced Review state';
  exception when insufficient_privilege then null; end;

  begin
    update public.user_spaced_review_state set successful_review_count = 99999 where user_id = account_b;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'A updated B Spaced Review state'; end if;
  exception when insufficient_privilege then null; end;

  changed := public.record_spaced_review_result(
    'a1c', 'got_it', false, false, 'aaaaaaaa-0000-4000-8000-000000000001'
  );
  if changed is not true then raise exception 'A valid due review was not recorded'; end if;
  changed := public.record_spaced_review_result(
    'a1c', 'got_it', false, false, 'aaaaaaaa-0000-4000-8000-000000000002'
  );
  if changed is not false then raise exception 'Fresh-token early replay advanced review state'; end if;
  changed := public.record_spaced_review_example(
    'a1c', 'aaaaaaaa-0000-4000-8000-000000000006'
  );
  if changed is not false then raise exception 'Forged example session advanced a future due date'; end if;

  begin
    perform public.record_spaced_review_result(
      'unknown', 'got_it', false, false, 'aaaaaaaa-0000-4000-8000-000000000003'
    );
    raise exception 'Unknown review challenge was accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.record_spaced_review_result(
      'a1c', 'forged', false, false, 'aaaaaaaa-0000-4000-8000-000000000004'
    );
    raise exception 'Forged review verdict was accepted';
  exception when invalid_parameter_value then null; end;
end;
$$;

reset role;

do $$
begin
  if (select display_name from public.profiles where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb') <> 'Security Test B' then
    raise exception 'Trusted verification found B profile modified';
  end if;
  if (select successful_review_count from public.user_spaced_review_state
      where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' and challenge_id = 'a1c') <> 9 then
    raise exception 'Trusted verification found B review state modified';
  end if;
  if not exists (
    select 1 from public.lesson_progress
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0201'
      and status = 'in_progress'
      and last_viewed_block = 2
  ) then
    raise exception 'Trusted verification found B lesson progress modified or deleted';
  end if;
end;
$$;

set local role anon;
select pg_catalog.set_config('request.jwt.claim.role', 'anon', true);
select pg_catalog.set_config('request.jwt.claim.sub', '', true);

do $$
begin
  begin
    if exists (select 1 from public.profiles) then
      raise exception 'Anonymous caller read private profiles';
    end if;
  exception when insufficient_privilege then null; end;
  begin
    if exists (select 1 from public.lesson_progress) then
      raise exception 'Anonymous caller read private lesson progress';
    end if;
  exception when insufficient_privilege then null; end;
  begin
    if exists (select 1 from public.user_spaced_review_state) then
      raise exception 'Anonymous caller read private Spaced Review state';
    end if;
  exception when insufficient_privilege then null; end;
  begin
    perform public.record_spaced_review_result(
      'a1c', 'got_it', false, false, 'aaaaaaaa-0000-4000-8000-000000000005'
    );
    raise exception 'Anonymous caller executed protected review RPC';
  exception when insufficient_privilege then null; end;
end;
$$;

reset role;
select pass('real Account A/B and anonymous RLS attacks passed');
select * from finish();
rollback;
