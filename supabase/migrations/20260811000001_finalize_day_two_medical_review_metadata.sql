-- Day 2 medical review completed on 2026-07-22. Keep the original publication date.
update public.lessons
set
  reviewed_by = 'Health Decoded curriculum optimization review; ADA Standards of Care in Diabetes—2026; CDC diabetes guidance',
  reviewed_at = '2026-07-22T00:00:00Z',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000002';

update public.journey_lessons
set
  reviewed_by = 'Health Decoded curriculum optimization review; ADA Standards of Care in Diabetes—2026; CDC diabetes guidance',
  reviewed_at = '2026-07-22T00:00:00Z',
  updated_at = pg_catalog.now()
where id = '30000000-0000-0000-0000-000000000002';
