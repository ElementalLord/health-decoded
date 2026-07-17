insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000006',
  'movement-as-a-glucose-tool',
  'Movement as a Glucose Tool',
  'Turn one movement idea into a flexible routine that fits real life',
  'Movement timing, sitting breaks, small bouts, habit anchors, and flexible planning',
  'Explain how movement can support glucose use, identify approachable times and forms of movement, and build one realistic first-week plan with a backup route.',
  14,
  '[{"type":"summary","title":"Three truths to carry forward","points":["Movement gives working muscles a reason to use fuel.","Small bouts and sitting breaks can create approachable openings.","A flexible movement plan can shrink, adapt, and restart without becoming punishment."]}]'::pg_catalog.jsonb,
  'Movement is a flexible glucose tool: find one seam in real life, choose a safe action, and keep a smaller backup for changed days.',
  'published',
  'Health Decoded curriculum blueprint, Day 6 manuscript, CDC, ADA, and NIDDK guidance',
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
  '30000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000006',
  6,
  6,
  '30000000-0000-0000-0000-000000000005',
  'published',
  'Health Decoded curriculum blueprint, Day 6 manuscript, CDC, ADA, and NIDDK guidance',
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
