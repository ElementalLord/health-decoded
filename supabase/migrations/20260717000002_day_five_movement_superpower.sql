insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000005',
  'movement-your-bodys-secret-superpower',
  'Movement: Your Body''s Secret Superpower',
  'How working muscles use glucose—and why small, safe bouts count',
  'Physical activity, muscle glucose uptake, and insulin sensitivity',
  'Explain one way movement changes glucose use, identify approachable aerobic and strength activities, and draft one realistic, safe first-week movement action.',
  14,
  '[{"type":"summary","title":"Three truths to carry forward","points":["Working muscles can take up glucose and use it for energy.","Regular physical activity can improve insulin sensitivity.","Small, safe, repeatable movement counts—even when it is adapted or interrupted."]}]'::pg_catalog.jsonb,
  'Movement is a glucose tool, not a punishment: working muscles use fuel, regular activity can improve insulin sensitivity, and one realistic opening is enough to begin.',
  'published',
  'Health Decoded curriculum blueprint, Day 5 manuscript, CDC, ADA, and NIDDK guidance',
  '2026-07-17T00:00:00Z',
  '2026-07-17T00:00:00Z'
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
  '30000000-0000-0000-0000-000000000005',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000005',
  5,
  5,
  '30000000-0000-0000-0000-000000000004',
  'published',
  'Health Decoded curriculum blueprint, Day 5 manuscript, CDC, ADA, and NIDDK guidance',
  '2026-07-17T00:00:00Z',
  '2026-07-17T00:00:00Z'
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
