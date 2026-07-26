-- Publish Day 14 as the Foundation Phase milestone. The custom client
-- experience owns the full interaction design; this reviewed summary keeps the
-- canonical lesson record safe, concise, and compatible with standard readers.
insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000014',
  'your-foundation-is-built',
  'Your Foundation Is Built',
  'Recognize what you know, choose what to practice, and carry a realistic plan into the next phase',
  'Foundation Phase synthesis, diabetes self-management confidence, connected care tools, readiness, realistic habit planning, and preparation for the next 76 days',
  'Connect the major skills from the first fourteen days, explain how diabetes care works as a system, identify personal confidence and practice areas, and leave with one realistic next step for the coming month.',
  24,
  '[{"type":"summary","title":"Your foundation in three ideas","points":["Understand your body: explain the diagnosis, read numbers as information, and notice context.","Make everyday decisions: use food, movement, medication, monitoring, routines, and problem solving as connected tools.","Protect your future: use safety plans, prevention, healthcare partnership, and chosen support without expecting perfection."]}]'::pg_catalog.jsonb,
  'You do not need to know everything today. Use the foundation you built to recognize the next useful step, practice it, and adjust as life changes.',
  'published',
  'Health Decoded curriculum blueprint and Day 14 Foundation Phase milestone manuscripts',
  '2026-07-26T00:00:00Z',
  '2026-07-26T00:00:00Z'
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
  '30000000-0000-0000-0000-000000000014',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000014',
  14,
  14,
  '30000000-0000-0000-0000-000000000013',
  'published',
  'Health Decoded curriculum blueprint and Day 14 Foundation Phase milestone manuscripts',
  '2026-07-26T00:00:00Z',
  '2026-07-26T00:00:00Z'
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
