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
on conflict (id) do update set
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
  published_at = excluded.published_at;

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
  '[{"type":"summary","title":"The body system","points":["Glucose is a source of energy.","Insulin helps many cells take in glucose.","Cells may respond less effectively to insulin.","The pancreas may not meet the body’s increased insulin need.","More glucose remains in the blood."]}]'::jsonb,
  'Type 2 diabetes is not simply about whether the body makes insulin. The body may respond less effectively to insulin, and the pancreas may not make enough insulin to meet the increased need. As a result, more glucose remains in the blood.',
  'published',
  'Implementation specification — medical review pending',
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
  published_at = excluded.published_at;
