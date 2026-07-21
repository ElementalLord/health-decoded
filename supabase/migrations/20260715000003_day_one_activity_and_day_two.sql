update public.activities
set status = 'archived', published_at = null, updated_at = pg_catalog.now()
where id = '40000000-0000-0000-0000-000000000001';

insert into public.activities (
  id, lesson_id, display_order, activity_type, title, instructions, configuration,
  explanation, status, reviewed_by, reviewed_at, published_at
) values (
  '40000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000001',
  2,
  'match_pair',
  'What can wait, and what cannot?',
  'Match each situation with the kind of response it needs.',
  '{"prompt":"Connect each situation with planned follow-up or urgent help.","left_items":[{"id":"follow-up-questions","label":"Questions about test results, medicine, food, movement, or home monitoring"},{"id":"urgent-symptoms","label":"Repeated vomiting, severe abdominal pain, difficulty breathing, or inability to keep liquids down"}],"right_items":[{"id":"planned-follow-up","label":"Bring these to a planned healthcare appointment"},{"id":"urgent-help","label":"Seek urgent medical care rather than waiting for a routine appointment"}],"feedback":{"correct":"Here is the connection: most questions can wait for planned follow-up, while serious symptoms should not wait.","retry":"One part needs another look. Questions about a care plan usually belong in follow-up; serious symptoms need urgent help."}}'::pg_catalog.jsonb,
  'Most diagnosis questions can be handled through planned follow-up. Serious warning signs should not wait.',
  'published',
  'Health Decoded curriculum',
  '2026-07-15T00:00:00Z',
  '2026-07-15T00:00:00Z'
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
  published_at = excluded.published_at,
  updated_at = pg_catalog.now();

insert into public.activity_answer_keys (activity_id, answer_config)
values (
  '40000000-0000-0000-0000-000000000002',
  '{"pairs":{"follow-up-questions":"planned-follow-up","urgent-symptoms":"urgent-help"}}'::pg_catalog.jsonb
)
on conflict (activity_id) do update set answer_config = excluded.answer_config;

insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000002',
  'what-is-happening-inside-my-body',
  'What is happening inside my body?',
  'Why glucose stays in the blood, even when your body still makes insulin',
  'Glucose, insulin, and insulin resistance',
  'Explain how glucose, insulin, the pancreas, muscle, liver, fat tissue, and bloodstream work together in Type 2 diabetes.',
  12,
  '[{"type":"summary","title":"The body system","points":["Glucose is a source of energy.","Insulin helps many cells take in glucose.","Cells may respond less effectively to insulin.","The pancreas may not meet the body’s increased insulin need.","More glucose remains in the blood."]}]'::pg_catalog.jsonb,
  'Type 2 diabetes is not simply about whether the body makes insulin. The body may respond less effectively to insulin, and the pancreas may not make enough insulin to meet the increased need. As a result, more glucose remains in the blood.',
  'published',
  'Implementation specification, medical review pending',
  '2026-07-15T00:00:00Z',
  '2026-07-15T00:00:00Z'
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
  '30000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  2,
  2,
  '30000000-0000-0000-0000-000000000001',
  'published',
  'Implementation specification, medical review pending',
  '2026-07-15T00:00:00Z',
  '2026-07-15T00:00:00Z'
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
