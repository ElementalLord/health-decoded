insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000004',
  'food-isnt-the-enemy',
  'Food Isn''t the Enemy',
  'Build balanced meals without turning food into a list of fears',
  'Carbohydrates, fiber, balanced meals, and the plate method',
  'Explain how carbohydrate-containing foods affect blood glucose, identify common carbohydrate foods, and build one balanced meal using the plate method.',
  13,
  '[{"type":"summary","title":"Four permissions to carry forward","points":["Food provides nourishment, culture, connection, and celebration.","Carbohydrate foods affect blood glucose but do not need to disappear.","Fiber, protein, vegetables, portions, and meal context can add balance.","Longer eating patterns matter more than judging one meal."]}]'::pg_catalog.jsonb,
  'Food is not the enemy: carbohydrate can remain, balance can be added, and one meal is not a verdict.',
  'published',
  'Health Decoded curriculum blueprint and Day 4 manuscript',
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
  '30000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000004',
  4,
  4,
  '30000000-0000-0000-0000-000000000003',
  'published',
  'Health Decoded curriculum blueprint and Day 4 manuscript',
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
