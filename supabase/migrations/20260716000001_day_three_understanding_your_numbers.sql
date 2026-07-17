insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000003',
  'understanding-your-numbers',
  'Understanding Your Numbers',
  'What your A1C, blood sugar, and diagnosis numbers actually mean',
  'Blood glucose, A1C, diagnostic tests, and patterns',
  'Explain what blood glucose and A1C measure, why clinicians compare tests, and why patterns are more useful than isolated numbers.',
  12,
  '[{"type":"summary","title":"Four truths to carry forward","points":["Blood glucose is a point-in-time measurement.","A1C estimates average glucose exposure over roughly two to three months.","Different tests answer different questions and may be compared or confirmed.","Numbers are tools for learning and care, not judgments about a person."]}]'::pg_catalog.jsonb,
  'Blood glucose is a snapshot, A1C is a longer pattern, and neither number defines you.',
  'published',
  'Health Decoded curriculum blueprint and Day 3 manuscript',
  '2026-07-16T00:00:00Z',
  '2026-07-16T00:00:00Z'
)
on conflict (id) do update set
  slug = excluded.slug,
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
  published_at = excluded.published_at,
  updated_at = pg_catalog.now();

insert into public.journey_lessons (
  id, journey_id, lesson_id, day_number, display_order, prerequisite_journey_lesson_id,
  status, reviewed_by, reviewed_at, published_at
) values (
  '30000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000003',
  3,
  3,
  '30000000-0000-0000-0000-000000000002',
  'published',
  'Health Decoded curriculum blueprint and Day 3 manuscript',
  '2026-07-16T00:00:00Z',
  '2026-07-16T00:00:00Z'
)
on conflict (id) do update set
  journey_id = excluded.journey_id,
  lesson_id = excluded.lesson_id,
  day_number = excluded.day_number,
  display_order = excluded.display_order,
  prerequisite_journey_lesson_id = excluded.prerequisite_journey_lesson_id,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at,
  updated_at = pg_catalog.now();
