insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000011',
  'preventing-complications-without-fear',
  'Preventing Complications Without Fear',
  'Build a calm protection plan for your eyes, kidneys, feet, heart, and future',
  'Complication risk, early screening, eye care, kidney checks, foot checks, heart and blood-vessel protection, diabetes ABCs, and preventive care planning',
  'Name the main body systems diabetes can affect over time, explain the diabetes ABCs at a basic level, connect eye, kidney, and foot checks to their preventive purpose, and build a personalized list of follow-up questions without treating complications as inevitable.',
  18,
  '[{"type":"summary","title":"Three truths worth carrying","points":["Complications are risks, not guarantees. Steady care can prevent, delay, or reduce harm.","Screening can find some eye, kidney, blood-pressure, and foot changes before symptoms appear.","A1C, blood pressure, cholesterol, screenings, medicines, habits, and questions can work together as one personalized protection plan."]}]'::pg_catalog.jsonb,
  'Your future is not already written. Screening early, knowing the diabetes ABCs, and continuing to show up for care build protection without requiring perfection.',
  'published',
  'Health Decoded curriculum blueprint, Day 11 manuscript, ADA 2026 Standards of Care, and NIDDK guidance',
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
  '30000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000011',
  11,
  11,
  '30000000-0000-0000-0000-000000000010',
  'published',
  'Health Decoded curriculum blueprint, Day 11 manuscript, ADA 2026 Standards of Care, and NIDDK guidance',
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
