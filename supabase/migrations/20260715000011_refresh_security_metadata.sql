update public.journey_lessons
set reviewed_by = 'Health Decoded curriculum',
  updated_at = pg_catalog.now()
where id = '30000000-0000-0000-0000-000000000001'
  and reviewed_by = 'Development seed';

comment on table public.user_journeys is
  'User-owned journey state. Direct writes are denied; authenticated initialization and lesson completion use validated definer operations.';
comment on table public.lesson_progress is
  'User-owned lesson state. Direct writes are denied; position and completion changes use validated definer operations.';
comment on table public.activity_progress is
  'User-owned activity state. Direct writes are denied; published activity responses use the validated evaluator operation.';
comment on table public.confidence_check_ins is
  'User-owned confidence check-ins. Direct writes are denied; saves use the validated ownership-checking upsert operation.';
comment on table public.activity_answer_keys is
  'SERVER-ONLY, SECURITY-SENSITIVE activity evaluation data. Anonymous and ordinary authenticated table access is denied.';
