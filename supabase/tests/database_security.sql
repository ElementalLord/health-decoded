-- Written but not executed: requires `supabase start` and `supabase db reset`.
-- This file validates database-security metadata. JWT role integration tests require
-- local Auth fixtures and must be added before production schema promotion.

begin;

do $$
declare
  expected_rls_tables text[] := array[
    'profiles', 'user_settings', 'journeys', 'lessons', 'journey_lessons',
    'activities', 'activity_answer_keys', 'medications', 'patient_stories',
    'caregiver_content', 'user_journeys', 'lesson_progress', 'activity_progress',
    'confidence_check_ins', 'reflection_entries'
  ];
begin
  if (
    select count(*)
    from pg_class
    join pg_namespace on pg_namespace.oid = pg_class.relnamespace
    where pg_namespace.nspname = 'public'
      and pg_class.relname = any (expected_rls_tables)
      and pg_class.relrowsecurity
  ) <> cardinality(expected_rls_tables) then
    raise exception 'Every approved application table must have RLS enabled';
  end if;

  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'activity_answer_keys'
  ) then
    raise exception 'activity_answer_keys must not have ordinary user policies';
  end if;

  if has_table_privilege('authenticated', 'public.activity_answer_keys', 'select')
    or has_table_privilege('anon', 'public.activity_answer_keys', 'select') then
    raise exception 'activity_answer_keys must not be directly selectable';
  end if;

  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and roles @> array['anon']::name[]
      and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  ) then
    raise exception 'Anonymous write policies are not permitted';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'journeys_duration_days_positive'
  ) then
    raise exception 'Journey duration must allow any positive duration, including 90 days';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'reflection_entries_length'
  ) then
    raise exception 'Reflections must enforce the approved 300-character limit';
  end if;
end;
$$;

-- Pending JWT integration assertions after local Auth is available:
-- 1. User A cannot read User B's profile, progress, or reflections.
-- 2. Authenticated users can read published content but not draft content.
-- 3. Deleting auth.users rows cascades user-owned records only.
-- 4. A 90-day journey is accepted and a >300-character reflection is rejected.

rollback;
