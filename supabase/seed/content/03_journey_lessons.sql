insert into public.journey_lessons (
  id, journey_id, lesson_id, day_number, display_order, status, reviewed_by, reviewed_at, published_at
) values (
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  1,
  1,
  'published',
  'Development seed',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do update set
  journey_id = excluded.journey_id,
  lesson_id = excluded.lesson_id,
  day_number = excluded.day_number,
  display_order = excluded.display_order,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
