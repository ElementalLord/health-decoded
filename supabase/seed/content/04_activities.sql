insert into public.activities (
  id, lesson_id, display_order, activity_type, title, instructions, configuration,
  explanation, status, reviewed_by, reviewed_at, published_at
) values (
  '40000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  1,
  'confidence_check',
  'Development confidence check',
  'Choose the option that best describes how you feel.',
  '{"options":["not_yet","somewhat","confident"]}'::jsonb,
  'This placeholder verifies public activity configuration only.',
  'published',
  'Development seed',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do update set
  lesson_id = excluded.lesson_id,
  display_order = excluded.display_order,
  activity_type = excluded.activity_type,
  title = excluded.title,
  instructions = excluded.instructions,
  configuration = excluded.configuration,
  explanation = excluded.explanation,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
