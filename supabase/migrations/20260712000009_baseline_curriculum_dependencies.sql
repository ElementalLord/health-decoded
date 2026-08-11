-- Establish the baseline curriculum parents required by later data migrations.
-- Supabase applies all migrations before seed files, so migration-time content
-- must not depend on rows that exist only in supabase/seed/content.
-- These values intentionally match the idempotent seed records exactly.
insert into public.journeys (
  id, slug, title, description, duration_days, status, reviewed_by, reviewed_at, published_at
) values (
  '10000000-0000-0000-0000-000000000001',
  'type-2-first-14-days',
  'Your first 14 days',
  'A calm, practical introduction to Type 2 diabetes during the first two weeks after diagnosis.',
  14,
  'published',
  'Health Decoded curriculum',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes,
  content_blocks, key_takeaway, status, reviewed_by, reviewed_at, published_at
) values (
  '20000000-0000-0000-0000-000000000001',
  'first-five-minutes-after-diagnosis',
  'The First Five Minutes After Diagnosis',
  'A calm first step after hearing the diagnosis',
  'Emotional orientation after diagnosis',
  'Feel calmer, understand one central idea about Type 2 diabetes, and distinguish routine follow-up from urgent warning signs.',
  5,
  '[{"type":"summary","title":"What to carry with you","points":["Too much glucose is staying in the blood.","The diagnosis is not proof that you failed.","Most next steps happen through planned follow-up.","Serious warning signs need urgent help."]}]'::jsonb,
  'You are not expected to know everything. This diagnosis is not a judgment, and you now know what can wait and what cannot.',
  'published',
  'Health Decoded curriculum',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do nothing;

insert into public.journey_lessons (
  id, journey_id, lesson_id, day_number, display_order, status, reviewed_by, reviewed_at, published_at
) values (
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  1,
  1,
  'published',
  'Health Decoded curriculum',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do nothing;
