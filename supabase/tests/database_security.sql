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

  if not exists (
    select 1 from pg_constraint
    where conname = 'confidence_check_ins_unique_lesson_progress'
  ) then
    raise exception 'Confidence check-ins must be unique per lesson-progress context';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'lesson_progress_last_viewed_block_minimum'
  ) then
    raise exception 'Lesson progress must retain a bounded resume position';
  end if;

  if has_function_privilege('anon', 'public.initialize_current_user_journey()', 'execute')
    or not has_function_privilege(
      'authenticated',
      'public.initialize_current_user_journey()',
      'execute'
    ) then
    raise exception 'Journey initialization privileges are not restricted correctly';
  end if;

  if has_function_privilege(
    'anon',
    'public.complete_onboarding(text,text,text,boolean,text)',
    'execute'
  ) or not has_function_privilege(
    'authenticated',
    'public.complete_onboarding(text,text,text,boolean,text)',
    'execute'
  ) then
    raise exception 'Onboarding completion privileges are not restricted correctly';
  end if;

  if has_column_privilege(
    'authenticated',
    'public.profiles',
    'onboarding_completed_at',
    'update'
  ) or not has_column_privilege(
    'authenticated',
    'public.profiles',
    'display_name',
    'update'
  ) then
    raise exception 'Profile update privileges are not restricted to display_name';
  end if;

  if has_table_privilege('authenticated', 'public.user_settings', 'delete') then
    raise exception 'User settings deletion must not break the one-row-per-user invariant';
  end if;

  if has_function_privilege(
    'anon',
    'public.upsert_confidence_check_in(uuid,text)',
    'execute'
  ) or not has_function_privilege(
    'authenticated',
    'public.upsert_confidence_check_in(uuid,text)',
    'execute'
  ) then
    raise exception 'Confidence check-in privileges are not restricted correctly';
  end if;

  if has_function_privilege(
    'anon',
    'public.begin_or_resume_current_lesson(integer)',
    'execute'
  ) or not has_function_privilege(
    'authenticated',
    'public.begin_or_resume_current_lesson(integer)',
    'execute'
  ) then
    raise exception 'Lesson begin-or-resume privileges are not restricted correctly';
  end if;

  if has_function_privilege(
    'anon',
    'public.save_lesson_block_position(uuid,integer)',
    'execute'
  ) or not has_function_privilege(
    'authenticated',
    'public.save_lesson_block_position(uuid,integer)',
    'execute'
  ) then
    raise exception 'Lesson position-save privileges are not restricted correctly';
  end if;

  if has_function_privilege(
    'anon',
    'public.evaluate_match_pair_activity(uuid,uuid,jsonb)',
    'execute'
  ) or not has_function_privilege(
    'authenticated',
    'public.evaluate_match_pair_activity(uuid,uuid,jsonb)',
    'execute'
  ) then
    raise exception 'Activity evaluation privileges are not restricted correctly';
  end if;

  if has_function_privilege(
    'anon',
    'public.complete_current_lesson(uuid)',
    'execute'
  ) or not has_function_privilege(
    'authenticated',
    'public.complete_current_lesson(uuid)',
    'execute'
  ) then
    raise exception 'Lesson completion privileges are not restricted correctly';
  end if;

  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'activity_progress'
      and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  ) then
    raise exception 'Activity progress writes must remain limited to trusted evaluation operations';
  end if;
end;
$$;

-- Pending JWT integration assertions after local Auth is available:
-- 1. User A cannot read User B's profile, progress, or reflections.
-- 2. Authenticated users can read published content but not draft content.
-- 3. Deleting auth.users rows cascades user-owned records only.
-- 4. A 90-day journey is accepted and a >300-character reflection is rejected.
-- 5. Journey initialization rejects unauthenticated callers and is idempotent.
-- 6. Journey initialization selects and reconciles only the stable published journey.
-- 7. Confidence upsert rejects invalid values and another user's lesson progress.
-- 8. Repeated confidence submissions update one row while direct writes remain denied.
-- 9. Lesson begin-or-resume rejects unauthenticated and future-lesson access.
-- 10. Lesson position saving rejects out-of-range and cross-user progress IDs.
-- 11. Repeated position saves remain idempotent without completing a lesson.
-- 12. Match-pair evaluation rejects cross-user, unpublished, and future-lesson activity attempts.
-- 13. Match-pair evaluation never exposes answer-key data and only stores aggregate completion.
-- 14. Incorrect match-pair retries remain incomplete; correct retries complete one progress row.
-- 15. Completion rejects unauthenticated, cross-user, unpublished, future, and incomplete lessons.
-- 16. Completion requires every published activity while ignoring unpublished activity definitions.
-- 17. First completion stores exactly 75 XP; repeated and concurrent completion requests add no XP.
-- 18. Completion advances only to the immediate published assignment after prerequisite validation.
-- 19. The final assignment marks the journey complete only after every published assignment is complete.

rollback;
