-- Learners who finished Day 12 can begin the newly published Day 13. Earlier
-- learners remain where they are, and completed Day 13 progress is preserved.
insert into public.lesson_progress (
  user_journey_id,
  journey_lesson_id,
  status,
  xp_awarded
)
select
  public.user_journeys.id,
  day_thirteen.id,
  'not_started',
  0
from public.user_journeys
join public.journeys
  on public.journeys.id = public.user_journeys.journey_id
join public.journey_lessons as day_thirteen
  on day_thirteen.journey_id = public.journeys.id
  and day_thirteen.day_number = 13
join public.journey_lessons as day_twelve
  on day_twelve.journey_id = public.journeys.id
  and day_twelve.day_number = 12
where public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_twelve_progress
    where day_twelve_progress.user_journey_id = public.user_journeys.id
      and day_twelve_progress.journey_lesson_id = day_twelve.id
      and day_twelve_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_thirteen_progress
    where day_thirteen_progress.user_journey_id = public.user_journeys.id
      and day_thirteen_progress.journey_lesson_id = day_thirteen.id
  )
on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

update public.user_journeys
set
  current_journey_lesson_id = day_thirteen.id,
  completed_at = null,
  last_active_at = pg_catalog.now()
from public.journeys
join public.journey_lessons as day_thirteen
  on day_thirteen.journey_id = public.journeys.id
  and day_thirteen.day_number = 13
join public.journey_lessons as day_twelve
  on day_twelve.journey_id = public.journeys.id
  and day_twelve.day_number = 12
where public.user_journeys.journey_id = public.journeys.id
  and public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_twelve_progress
    where day_twelve_progress.user_journey_id = public.user_journeys.id
      and day_twelve_progress.journey_lesson_id = day_twelve.id
      and day_twelve_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_thirteen_progress
    where day_thirteen_progress.user_journey_id = public.user_journeys.id
      and day_thirteen_progress.journey_lesson_id = day_thirteen.id
      and day_thirteen_progress.status = 'completed'
  );
