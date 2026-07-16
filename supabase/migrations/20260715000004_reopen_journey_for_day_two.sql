-- Day 1 was initially the only published assignment, so early learners could
-- legitimately complete the whole journey before Day 2 was added. Give those
-- learners a Day 2 progress row and make Day 2 current without disturbing
-- anyone who has already completed it.
insert into public.lesson_progress (
  user_journey_id,
  journey_lesson_id,
  status,
  xp_awarded
)
select
  public.user_journeys.id,
  day_two.id,
  'not_started',
  0
from public.user_journeys
join public.journeys
  on public.journeys.id = public.user_journeys.journey_id
join public.journey_lessons as day_two
  on day_two.journey_id = public.journeys.id
  and day_two.day_number = 2
join public.journey_lessons as day_one
  on day_one.journey_id = public.journeys.id
  and day_one.day_number = 1
where public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_one_progress
    where day_one_progress.user_journey_id = public.user_journeys.id
      and day_one_progress.journey_lesson_id = day_one.id
      and day_one_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_two_progress
    where day_two_progress.user_journey_id = public.user_journeys.id
      and day_two_progress.journey_lesson_id = day_two.id
  )
on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

update public.user_journeys
set
  current_journey_lesson_id = day_two.id,
  completed_at = null,
  last_active_at = pg_catalog.now()
from public.journeys
join public.journey_lessons as day_two
  on day_two.journey_id = public.journeys.id
  and day_two.day_number = 2
join public.journey_lessons as day_one
  on day_one.journey_id = public.journeys.id
  and day_one.day_number = 1
where public.user_journeys.journey_id = public.journeys.id
  and public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_one_progress
    where day_one_progress.user_journey_id = public.user_journeys.id
      and day_one_progress.journey_lesson_id = day_one.id
      and day_one_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_two_progress
    where day_two_progress.user_journey_id = public.user_journeys.id
      and day_two_progress.journey_lesson_id = day_two.id
      and day_two_progress.status = 'completed'
  );
