-- The Day 1 guided experience already teaches planned follow-up versus urgent
-- warning signs. Retire the additional matching gate so it cannot prevent a
-- learner from continuing to Day 2.
update public.activities
set
  status = 'archived',
  published_at = null,
  updated_at = pg_catalog.now()
where id = '40000000-0000-0000-0000-000000000002';
