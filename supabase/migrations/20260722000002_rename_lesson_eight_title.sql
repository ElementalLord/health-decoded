-- Rename Lesson 8 so its title no longer reads like Lesson 3 ("Understanding
-- Your Numbers"). Lesson 8 is about interpreting glucose patterns, not learning
-- what numbers are. The slug stays as a stable internal identifier; only the
-- user-facing title changes.
update public.lessons
set
  title = 'Making Sense of Your Glucose',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000008'
  and title <> 'Making Sense of Your Glucose';
