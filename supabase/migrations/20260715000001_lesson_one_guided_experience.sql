update public.lessons
set
  slug = 'understanding-your-diagnosis',
  title = 'Understanding Your Diagnosis',
  subtitle = 'What this means, and what it does not',
  primary_topic = 'A calm first look at Type 2 diabetes',
  learning_objective = 'Understand the main meaning of a Type 2 diabetes diagnosis and recognize when symptoms need urgent attention.',
  estimated_minutes = 15,
  content_blocks = '[{"type":"summary","title":"What to carry with you","points":["Too much glucose is staying in the blood.","The diagnosis is not proof that you failed.","Most next steps happen through planned follow-up.","Serious warning signs need urgent help."]}]'::pg_catalog.jsonb,
  key_takeaway = 'A diagnosis needs care, not blame. Most next steps can wait for planned follow-up, while serious warning signs need urgent attention.',
  reviewed_by = 'Health Decoded curriculum',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000001';

-- The guided Lesson 1 UI contains its own privacy-safe, server-evaluated
-- interactions. Retire the old schema-test activity so it does not block
-- lesson completion.
update public.activities
set
  status = 'archived',
  published_at = null,
  updated_at = pg_catalog.now()
where id = '40000000-0000-0000-0000-000000000001';
