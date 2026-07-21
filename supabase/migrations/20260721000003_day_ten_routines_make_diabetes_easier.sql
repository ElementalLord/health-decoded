insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000010',
  'building-routines-that-make-diabetes-easier',
  'Building Routines That Make Diabetes Easier',
  'Reduce decision fatigue with small, consistent habits',
  'Routines, decision fatigue, habit stacking, environment design, consistency over perfection, and returning after interruptions',
  'Explain how routines reduce daily decision fatigue, build a habit stack that attaches a new habit to an existing anchor, set up visible environment supports that make healthy choices easier, and respond to interrupted routines with the next small step instead of all-or-nothing thinking.',
  18,
  '[{"type":"summary","title":"Three ideas worth carrying","points":["A routine is a decision you make once, then simply repeat.","Small habits stacked onto existing ones beat dramatic overnight overhauls.","When life interrupts, you do not start over, you take the next step, without guilt."]}]'::pg_catalog.jsonb,
  'Consistency is more powerful than perfection. Small routines, repeated kindly and returned to after interruptions, make diabetes fit into your life.',
  'published',
  'Health Decoded curriculum blueprint and Day 10 manuscript',
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
  '30000000-0000-0000-0000-000000000010',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000010',
  10,
  10,
  '30000000-0000-0000-0000-000000000009',
  'published',
  'Health Decoded curriculum blueprint and Day 10 manuscript',
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
