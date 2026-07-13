insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000001',
  'development-lesson-one',
  'Development lesson',
  'Schema seed only',
  'Getting started',
  'Verify that a published lesson can be assigned to a journey.',
  5,
  '[{"type":"text","heading":"Development seed","body":"This is not production medical content."}]'::jsonb,
  'Schema relationships can be tested with minimal seed content.',
  'published',
  'Development seed',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  primary_topic = excluded.primary_topic,
  learning_objective = excluded.learning_objective,
  estimated_minutes = excluded.estimated_minutes,
  content_blocks = excluded.content_blocks,
  key_takeaway = excluded.key_takeaway,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
