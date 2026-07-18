-- Learners who finished Day 7 can begin the newly published Day 8. Earlier
-- learners remain where they are, and completed Day 8 progress is preserved.
insert into public.lesson_progress (
  user_journey_id,
  journey_lesson_id,
  status,
  xp_awarded
)
select
  public.user_journeys.id,
  day_eight.id,
  'not_started',
  0
from public.user_journeys
join public.journeys
  on public.journeys.id = public.user_journeys.journey_id
join public.journey_lessons as day_eight
  on day_eight.journey_id = public.journeys.id
  and day_eight.day_number = 8
join public.journey_lessons as day_seven
  on day_seven.journey_id = public.journeys.id
  and day_seven.day_number = 7
where public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_seven_progress
    where day_seven_progress.user_journey_id = public.user_journeys.id
      and day_seven_progress.journey_lesson_id = day_seven.id
      and day_seven_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_eight_progress
    where day_eight_progress.user_journey_id = public.user_journeys.id
      and day_eight_progress.journey_lesson_id = day_eight.id
  )
on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

update public.user_journeys
set
  current_journey_lesson_id = day_eight.id,
  completed_at = null,
  last_active_at = pg_catalog.now()
from public.journeys
join public.journey_lessons as day_eight
  on day_eight.journey_id = public.journeys.id
  and day_eight.day_number = 8
join public.journey_lessons as day_seven
  on day_seven.journey_id = public.journeys.id
  and day_seven.day_number = 7
where public.user_journeys.journey_id = public.journeys.id
  and public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_seven_progress
    where day_seven_progress.user_journey_id = public.user_journeys.id
      and day_seven_progress.journey_lesson_id = day_seven.id
      and day_seven_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_eight_progress
    where day_eight_progress.user_journey_id = public.user_journeys.id
      and day_eight_progress.journey_lesson_id = day_eight.id
      and day_eight_progress.status = 'completed'
  );
