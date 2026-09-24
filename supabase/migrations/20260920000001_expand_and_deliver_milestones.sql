alter table public.user_milestones
add column announced_at pg_catalog.timestamptz;

-- Existing milestones predate delivery tracking and must not replay as new.
update public.user_milestones
set announced_at = unlocked_at
where announced_at is null;

alter table public.user_milestones
drop constraint user_milestones_controlled_id;

alter table public.user_milestones
add constraint user_milestones_controlled_id check (
  milestone_id = any (array[
    'MILESTONE-FIRST-STEP',
    'MILESTONE-BUILDING-RHYTHM',
    'MILESTONE-WEEK-OF-LEARNING',
    'MILESTONE-LEARNING-IN-MOTION',
    'MILESTONE-FOUNDATION-COMPLETE',
    'MILESTONE-THOUGHTFUL-REFLECTION',
    'MILESTONE-MYTH-CHECKER',
    'MILESTONE-SECOND-LOOK',
    'MILESTONE-EVIDENCE-SEEKER',
    'MILESTONE-PRIORITIES-SET',
    'MILESTONE-QUESTIONS-READY',
    'MILESTONE-APPOINTMENT-READY',
    'MILESTONE-PLAN-IN-HAND',
    'MILESTONE-CONVERSATION-BUILDER',
    'MILESTONE-SUPPORT-WITH-PERMISSION',
    'MILESTONE-EVERYDAY-ALLY',
    'MILESTONE-STEADY-SUPPORT',
    'MILESTONE-SUSTAINABLE-SUPPORT',
    'MILESTONE-FOUND-TRUSTED-SUPPORT',
    'MILESTONE-PERSONAL-TOOLKIT'
  ]::pg_catalog.text[])
);

create index user_milestones_pending_announcement_idx
on public.user_milestones (user_id, unlocked_at)
where announced_at is null;

create or replace function public.acknowledge_milestone_announcements(
  p_milestone_ids pg_catalog.text[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.user_milestones
  set announced_at = coalesce(announced_at, pg_catalog.now())
  where user_id = auth.uid()
    and milestone_id = any (coalesce(p_milestone_ids, array[]::pg_catalog.text[]));
end;
$$;

revoke all on function public.acknowledge_milestone_announcements(pg_catalog.text[]) from public;
revoke all on function public.acknowledge_milestone_announcements(pg_catalog.text[]) from anon;
grant execute on function public.acknowledge_milestone_announcements(pg_catalog.text[]) to authenticated;
