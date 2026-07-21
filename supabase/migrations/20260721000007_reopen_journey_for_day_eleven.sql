-- Learners who finished Day 10 can begin the newly published Day 11. Earlier
-- learners remain where they are, and completed Day 11 progress is preserved.
insert into public.lesson_progress (
  user_journey_id,
  journey_lesson_id,
  status,
  xp_awarded
)
select
  public.user_journeys.id,
  day_eleven.id,
  'not_started',
  0
from public.user_journeys
join public.journeys
  on public.journeys.id = public.user_journeys.journey_id
join public.journey_lessons as day_eleven
  on day_eleven.journey_id = public.journeys.id
  and day_eleven.day_number = 11
join public.journey_lessons as day_ten
  on day_ten.journey_id = public.journeys.id
  and day_ten.day_number = 10
where public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_ten_progress
    where day_ten_progress.user_journey_id = public.user_journeys.id
      and day_ten_progress.journey_lesson_id = day_ten.id
      and day_ten_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_eleven_progress
    where day_eleven_progress.user_journey_id = public.user_journeys.id
      and day_eleven_progress.journey_lesson_id = day_eleven.id
  )
on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

update public.user_journeys
set
  current_journey_lesson_id = day_eleven.id,
  completed_at = null,
  last_active_at = pg_catalog.now()
from public.journeys
join public.journey_lessons as day_eleven
  on day_eleven.journey_id = public.journeys.id
  and day_eleven.day_number = 11
join public.journey_lessons as day_ten
  on day_ten.journey_id = public.journeys.id
  and day_ten.day_number = 10
where public.user_journeys.journey_id = public.journeys.id
  and public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_ten_progress
    where day_ten_progress.user_journey_id = public.user_journeys.id
      and day_ten_progress.journey_lesson_id = day_ten.id
      and day_ten_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_eleven_progress
    where day_eleven_progress.user_journey_id = public.user_journeys.id
      and day_eleven_progress.journey_lesson_id = day_eleven.id
      and day_eleven_progress.status = 'completed'
  );
