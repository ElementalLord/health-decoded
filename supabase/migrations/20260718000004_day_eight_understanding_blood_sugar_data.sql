insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000008',
  'understanding-your-blood-sugar-data',
  'Understanding Your Blood Sugar Data',
  'Learn what different glucose views can, and cannot, tell you',
  'A1C, finger-stick readings, continuous glucose monitoring, context, patterns, and nonjudgmental data interpretation',
  'Distinguish the longer A1C view from one-moment finger-stick readings and many-moment CGM data, explain why context and repeated patterns are more useful than judgment, and prepare one monitoring question for the care team.',
  18,
  '[{"type":"summary","title":"Three ideas worth carrying","points":["Different monitoring tools answer different kinds of questions.","One reading is a clue; repeated context can reveal a more useful pattern.","Numbers measure glucose, not effort, courage, or worth."]}]'::pg_catalog.jsonb,
  'A reading is information, not a verdict. Keep the moment, add context, and look for a useful pattern.',
  'published',
  'Health Decoded curriculum blueprint and Day 8 manuscript',
  '2026-07-18T00:00:00Z',
  '2026-07-18T00:00:00Z'
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
  '30000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000008',
  8,
  8,
  '30000000-0000-0000-0000-000000000007',
  'published',
  'Health Decoded curriculum blueprint and Day 8 manuscript',
  '2026-07-18T00:00:00Z',
  '2026-07-18T00:00:00Z'
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
