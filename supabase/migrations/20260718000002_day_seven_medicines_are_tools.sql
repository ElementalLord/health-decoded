insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000007',
  'medicines-are-tools-not-judgments',
  'Medicines Are Tools, Not Judgments',
  'Understand why different bodies may need different treatment tools',
  'Person-centered medication choice, metformin, medication pathways, insulin, side effects, and practical questions',
  'Explain why medication may be part of Type 2 diabetes care, describe several high-level body pathways, recognize that insulin is treatment rather than failure, and prepare one safe question for the care team.',
  16,
  '[{"type":"summary","title":"Three ideas worth carrying","points":["Medication is a tool, not a judgment.","Different medicines work through different pathways, and the plan should be fitted to the person.","Know the medicine name, why it was chosen, and what safety questions to bring to the care team."]}]'::pg_catalog.jsonb,
  'Medication is not a judgment. It is one treatment tool, chosen for what the person and body need.',
  'published',
  'Health Decoded curriculum blueprint, Day 7 manuscript, CDC, ADA, and NIDDK guidance',
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
  '30000000-0000-0000-0000-000000000007',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000007',
  7,
  7,
  '30000000-0000-0000-0000-000000000006',
  'published',
  'Health Decoded curriculum blueprint, Day 7 manuscript, CDC, ADA, and NIDDK guidance',
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
