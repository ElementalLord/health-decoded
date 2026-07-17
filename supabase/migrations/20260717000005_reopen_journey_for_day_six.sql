-- Day 5 was previously the final published assignment. Give learners who
-- completed it access to the newly published Day 6 without changing progress
-- for anyone who is still working through the earlier lessons.
insert into public.lesson_progress (
  user_journey_id,
  journey_lesson_id,
  status,
  xp_awarded
)
select
  public.user_journeys.id,
  day_six.id,
  'not_started',
  0
from public.user_journeys
join public.journeys
  on public.journeys.id = public.user_journeys.journey_id
join public.journey_lessons as day_six
  on day_six.journey_id = public.journeys.id
  and day_six.day_number = 6
join public.journey_lessons as day_five
  on day_five.journey_id = public.journeys.id
  and day_five.day_number = 5
where public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_five_progress
    where day_five_progress.user_journey_id = public.user_journeys.id
      and day_five_progress.journey_lesson_id = day_five.id
      and day_five_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_six_progress
    where day_six_progress.user_journey_id = public.user_journeys.id
      and day_six_progress.journey_lesson_id = day_six.id
  )
on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

update public.user_journeys
set
  current_journey_lesson_id = day_six.id,
  completed_at = null,
  last_active_at = pg_catalog.now()
from public.journeys
join public.journey_lessons as day_six
  on day_six.journey_id = public.journeys.id
  and day_six.day_number = 6
join public.journey_lessons as day_five
  on day_five.journey_id = public.journeys.id
  and day_five.day_number = 5
where public.user_journeys.journey_id = public.journeys.id
  and public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_five_progress
    where day_five_progress.user_journey_id = public.user_journeys.id
      and day_five_progress.journey_lesson_id = day_five.id
      and day_five_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_six_progress
    where day_six_progress.user_journey_id = public.user_journeys.id
      and day_six_progress.journey_lesson_id = day_six.id
      and day_six_progress.status = 'completed'
  );
