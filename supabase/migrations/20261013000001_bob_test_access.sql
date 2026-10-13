-- The shared Bob identity is intentionally non-personal and exists only to power
-- the public testing-access button. Provision it in migrations as well as local
-- seed data so preview and production databases behave consistently.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  'b0b00000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  'bob@testing.healthdecoded.local',
  extensions.crypt('Bob-Testing-Access-2026!', extensions.gen_salt('bf')),
  pg_catalog.now(),
  '{"provider":"email","providers":["email"]}'::pg_catalog.jsonb,
  '{}'::pg_catalog.jsonb,
  pg_catalog.now(),
  pg_catalog.now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = excluded.updated_at;

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  'b0b00000-0000-4000-8000-000000000002',
  'b0b00000-0000-4000-8000-000000000001',
  'b0b00000-0000-4000-8000-000000000001',
  '{"sub":"b0b00000-0000-4000-8000-000000000001","email":"bob@testing.healthdecoded.local","email_verified":true}'::pg_catalog.jsonb,
  'email',
  pg_catalog.now(),
  pg_catalog.now(),
  pg_catalog.now()
)
on conflict (provider_id, provider) do update set
  identity_data = excluded.identity_data,
  updated_at = excluded.updated_at;

create function public.enable_bob_test_access()
returns pg_catalog.bool
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_email pg_catalog.text := auth.jwt() ->> 'email';
  v_journey_id pg_catalog.uuid;
  v_user_journey_id pg_catalog.uuid;
  v_first_journey_lesson_id pg_catalog.uuid;
begin
  if v_user_id is null
    or pg_catalog.lower(coalesce(v_email, '')) <> 'bob@testing.healthdecoded.local'
  then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;

  update public.profiles
  set display_name = 'Bob',
      onboarding_intent = coalesce(onboarding_intent, 'learn-basics'),
      onboarding_completed_at = coalesce(onboarding_completed_at, pg_catalog.now())
  where id = v_user_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'Profile unavailable.';
  end if;

  insert into public.user_settings as settings (
    user_id,
    reduced_motion,
    preferred_text_scale,
    locale,
    timezone
  )
  values (v_user_id, false, 'default', 'en', 'America/Chicago')
  on conflict (user_id) do nothing;

  select journey.id
  into v_journey_id
  from public.journeys as journey
  where journey.slug = 'type-2-first-14-days'
    and journey.status = 'published'
    and journey.published_at is not null
  limit 1;

  select assignment.id
  into v_first_journey_lesson_id
  from public.journey_lessons as assignment
  join public.lessons as lesson on lesson.id = assignment.lesson_id
  where assignment.journey_id = v_journey_id
    and assignment.status = 'published'
    and assignment.published_at is not null
    and lesson.status = 'published'
    and lesson.published_at is not null
  order by assignment.display_order
  limit 1;

  if v_journey_id is null or v_first_journey_lesson_id is null then
    raise exception using errcode = 'P0002', message = 'Journey unavailable.';
  end if;

  insert into public.user_journeys as user_journey (
    user_id,
    journey_id,
    current_journey_lesson_id
  )
  values (v_user_id, v_journey_id, v_first_journey_lesson_id)
  on conflict on constraint user_journeys_unique_user_journey
  do update set
    current_journey_lesson_id = coalesce(
      user_journey.current_journey_lesson_id,
      excluded.current_journey_lesson_id
    );

  select user_journey.id
  into v_user_journey_id
  from public.user_journeys as user_journey
  where user_journey.user_id = v_user_id
    and user_journey.journey_id = v_journey_id;

  insert into public.lesson_progress as progress (
    user_journey_id,
    journey_lesson_id,
    status,
    started_at,
    xp_awarded
  )
  select
    v_user_journey_id,
    assignment.id,
    'in_progress',
    pg_catalog.now(),
    0
  from public.journey_lessons as assignment
  join public.lessons as lesson on lesson.id = assignment.lesson_id
  where assignment.journey_id = v_journey_id
    and assignment.status = 'published'
    and assignment.published_at is not null
    and lesson.status = 'published'
    and lesson.published_at is not null
  on conflict on constraint lesson_progress_unique_user_journey_lesson
  do update set
    status = case when progress.status = 'completed' then 'completed' else 'in_progress' end,
    started_at = coalesce(progress.started_at, excluded.started_at);

  return true;
end;
$$;

comment on function public.enable_bob_test_access() is
  'Prepares the fixed Bob testing account and unlocks every published foundation lesson. Access is restricted to the exact authenticated test identity.';

revoke all on function public.enable_bob_test_access() from public;
revoke all on function public.enable_bob_test_access() from anon;
grant execute on function public.enable_bob_test_access() to authenticated;
