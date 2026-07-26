-- Learners who finished Day 13 can begin the Foundation Phase milestone.
-- Earlier learners remain where they are, and completed Day 14 progress is
-- preserved if this migration is reapplied.
insert into public.lesson_progress (
  user_journey_id,
  journey_lesson_id,
  status,
  xp_awarded
)
select
  public.user_journeys.id,
  day_fourteen.id,
  'not_started',
  0
from public.user_journeys
join public.journeys
  on public.journeys.id = public.user_journeys.journey_id
join public.journey_lessons as day_fourteen
  on day_fourteen.journey_id = public.journeys.id
  and day_fourteen.day_number = 14
join public.journey_lessons as day_thirteen
  on day_thirteen.journey_id = public.journeys.id
  and day_thirteen.day_number = 13
where public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_thirteen_progress
    where day_thirteen_progress.user_journey_id = public.user_journeys.id
      and day_thirteen_progress.journey_lesson_id = day_thirteen.id
      and day_thirteen_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_fourteen_progress
    where day_fourteen_progress.user_journey_id = public.user_journeys.id
      and day_fourteen_progress.journey_lesson_id = day_fourteen.id
  )
on conflict on constraint lesson_progress_unique_user_journey_lesson do nothing;

update public.user_journeys
set
  current_journey_lesson_id = day_fourteen.id,
  completed_at = null,
  last_active_at = pg_catalog.now()
from public.journeys
join public.journey_lessons as day_fourteen
  on day_fourteen.journey_id = public.journeys.id
  and day_fourteen.day_number = 14
join public.journey_lessons as day_thirteen
  on day_thirteen.journey_id = public.journeys.id
  and day_thirteen.day_number = 13
where public.user_journeys.journey_id = public.journeys.id
  and public.journeys.slug = 'type-2-first-14-days'
  and exists (
    select 1
    from public.lesson_progress as day_thirteen_progress
    where day_thirteen_progress.user_journey_id = public.user_journeys.id
      and day_thirteen_progress.journey_lesson_id = day_thirteen.id
      and day_thirteen_progress.status = 'completed'
  )
  and not exists (
    select 1
    from public.lesson_progress as day_fourteen_progress
    where day_fourteen_progress.user_journey_id = public.user_journeys.id
      and day_fourteen_progress.journey_lesson_id = day_fourteen.id
      and day_fourteen_progress.status = 'completed'
  );
