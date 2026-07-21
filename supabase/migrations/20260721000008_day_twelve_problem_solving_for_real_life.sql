insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000012',
  'problem-solving-for-real-life',
  'Problem Solving for Real Life',
  'Build flexible responses for changed meals, disrupted routines, sick days, and missed doses',
  'Flexible problem solving, disrupted meals and routines, sick-day planning, dehydration, when to call, missed-dose safety, and Plan A and Plan B strategies',
  'Use a simple pause-understand-choose-adjust sequence, explain why illness changes diabetes management, recognize basic urgent help signals, and create one practical backup plan for a social, work, meal, or routine disruption.',
  20,
  '[{"type":"summary","title":"Three truths worth carrying","points":["One meal, missed routine, or difficult day does not decide your health. Adaptability is a diabetes skill.","Illness changes the conditions. Hydration, personal sick-day instructions, and knowing when to call make the plan safer.","Medication rules are specific. Check the exact instructions and ask a pharmacist or care team rather than guessing or doubling."]}]'::pg_catalog.jsonb,
  'A changed plan is not a failed plan. Pause, understand what changed, choose one useful response, and adjust again when needed.',
  'published',
  'Health Decoded curriculum blueprint, Day 12 manuscript, CDC sick-day guidance, ADA sick-day guidance, and NIDDK education',
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
  '30000000-0000-0000-0000-000000000012',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000012',
  12,
  12,
  '30000000-0000-0000-0000-000000000011',
  'published',
  'Health Decoded curriculum blueprint, Day 12 manuscript, CDC sick-day guidance, ADA sick-day guidance, and NIDDK education',
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
