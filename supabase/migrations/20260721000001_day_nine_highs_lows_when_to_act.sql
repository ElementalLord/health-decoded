insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000009',
  'highs-lows-and-knowing-when-to-act',
  'Highs, Lows, and Knowing When to Act',
  'Replace panic with preparedness for high and low blood sugar',
  'Hyperglycemia, hypoglycemia, symptom recognition, calm response plans, urgent signals, and knowing when to seek help',
  'Recognize the common gradual signals of high blood sugar and the quicker signals of low blood sugar, explain that low-glucose risk depends largely on medications, respond to possible highs and lows by following a personal care plan, and identify the uncommon urgent signals that deserve prompt medical care.',
  18,
  '[{"type":"summary","title":"Three ideas worth carrying","points":["High and low blood sugar feel different: highs often build slowly, lows often announce themselves quickly.","Most changes are not emergencies—pause, follow the care team plan, and reach out early when something stays off.","Urgent signals are uncommon, and recognizing them is preparedness, not fear."]}]'::pg_catalog.jsonb,
  'Knowing what to do is more powerful than being afraid of what might happen. Recognize the signals early, stay calm, and follow the plan you built with your care team.',
  'published',
  'Health Decoded curriculum blueprint and Day 9 manuscript',
  '2026-07-21T00:00:00Z',
  '2026-07-21T00:00:00Z'
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
  '30000000-0000-0000-0000-000000000009',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000009',
  9,
  9,
  '30000000-0000-0000-0000-000000000008',
  'published',
  'Health Decoded curriculum blueprint and Day 9 manuscript',
  '2026-07-21T00:00:00Z',
  '2026-07-21T00:00:00Z'
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
