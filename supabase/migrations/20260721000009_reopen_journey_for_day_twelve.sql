-- Learners who finished Day 11 can begin the newly published Day 12. Earlier
-- learners remain where they are, and completed Day 12 progress is preserved.
insert into public.lesson_progress (
  user_journey_id,
  journey_lesson_id,
  status,
  xp_awarded
)
select
  public.user_journeys.id,
  day_twelve.id,
  'not_started',
  0
from public.user_journeys
join public.journeys
  on public.journeys.id = public.user_journeys.journey_id
join public.journey_lessons as day_twelve
  on day_twelve.journey_id = public.journeys.id
  and day_twelve.day_number = 12
join public.journey_lessons as day_eleven
  on day_eleven.journey_id = public.journeys.id
  and day_eleven.day_number = 11
where public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_eleven_progress
    where day_eleven_progress.user_journey_id = public.user_journeys.id
      and day_eleven_progress.journey_lesson_id = day_eleven.id
      and day_eleven_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_twelve_progress
    where day_twelve_progress.user_journey_id = public.user_journeys.id
      and day_twelve_progress.journey_lesson_id = day_twelve.id
  )
on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

update public.user_journeys
set
  current_journey_lesson_id = day_twelve.id,
  completed_at = null,
  last_active_at = pg_catalog.now()
from public.journeys
join public.journey_lessons as day_twelve
  on day_twelve.journey_id = public.journeys.id
  and day_twelve.day_number = 12
join public.journey_lessons as day_eleven
  on day_eleven.journey_id = public.journeys.id
  and day_eleven.day_number = 11
where public.user_journeys.journey_id = public.journeys.id
  and public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_eleven_progress
    where day_eleven_progress.user_journey_id = public.user_journeys.id
      and day_eleven_progress.journey_lesson_id = day_eleven.id
      and day_eleven_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_twelve_progress
    where day_twelve_progress.user_journey_id = public.user_journeys.id
      and day_twelve_progress.journey_lesson_id = day_twelve.id
      and day_twelve_progress.status = 'completed'
  );
