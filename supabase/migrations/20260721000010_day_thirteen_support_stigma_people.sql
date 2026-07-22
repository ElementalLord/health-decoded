insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000013',
  'support-stigma-and-the-people-around-you',
  'Support, Stigma, and the People Around You',
  'Ask for useful help, protect your independence, and build connection without blame',
  'Diabetes stigma, blame, disclosure, boundaries, emotional wellbeing, peer support, family and caregiver education, and the difference between support and control',
  'Explain why blame is not useful, distinguish helpful support from control or surveillance, name one trusted person and one respectful boundary, and make one concrete request for support.',
  20,
  '[{"type":"summary","title":"Three truths worth carrying","points":["Type 2 diabetes develops through many interacting factors. A diagnosis is health information, not a character judgment.","Helpful support asks, listens, offers, and respects the person''s choices. Concern does not require control or surveillance.","A specific request or clear boundary can protect connection and independence at the same time."]}]'::pg_catalog.jsonb,
  'Support can reduce the burden of diabetes without adding shame or taking over. Ask for one concrete kind of help and keep your choices at the center.',
  'published',
  'Health Decoded curriculum blueprint and Day 13 manuscript',
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
  '30000000-0000-0000-0000-000000000013',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000013',
  13,
  13,
  '30000000-0000-0000-0000-000000000012',
  'published',
  'Health Decoded curriculum blueprint and Day 13 manuscript',
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
