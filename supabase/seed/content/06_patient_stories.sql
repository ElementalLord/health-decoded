insert into public.patient_stories (
  id, slug, title, introduction, content_blocks, key_takeaway, journey_week,
  status, reviewed_by, reviewed_at, published_at
) values (
  '60000000-0000-0000-0000-000000000001',
  'development-story',
  'Development schema record',
  'Development-only schema fixture. Not a patient story.',
  '[{"type":"text","heading":"Development seed","body":"Not a patient story or medical guidance."}]'::jsonb,
  'This development-only record must not be published.',
  1,
  'draft',
  null,
  null,
  null
)
on conflict (id) do update set
  title = excluded.title,
  introduction = excluded.introduction,
  content_blocks = excluded.content_blocks,
  key_takeaway = excluded.key_takeaway,
  journey_week = excluded.journey_week,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
