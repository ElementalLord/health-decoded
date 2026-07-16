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
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  duration_days = excluded.duration_days,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
