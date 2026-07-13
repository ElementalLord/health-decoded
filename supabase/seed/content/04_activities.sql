insert into public.activities (
  id, lesson_id, display_order, activity_type, title, instructions, configuration,
  explanation, status, reviewed_by, reviewed_at, published_at
) values (
  '40000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  1,
  'match_pair',
  'Development matching activity',
  'Match each development label with its safe description.',
  '{"prompt":"Match each development label with its description.","left_items":[{"id":"label-one","label":"Development label one"},{"id":"label-two","label":"Development label two"}],"right_items":[{"id":"description-one","label":"First safe development description"},{"id":"description-two","label":"Second safe development description"}],"feedback":{"correct":"That’s right. You matched the development labels.","retry":"Not quite. Try matching each label with the description that fits it."}}'::jsonb,
  'This placeholder verifies safe public activity configuration and feedback.',
  'published',
  'Development seed',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do update set
  lesson_id = excluded.lesson_id,
  display_order = excluded.display_order,
  activity_type = excluded.activity_type,
  title = excluded.title,
  instructions = excluded.instructions,
  configuration = excluded.configuration,
  explanation = excluded.explanation,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
