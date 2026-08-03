create table public.user_milestones (
  user_id pg_catalog.uuid not null references auth.users(id) on delete cascade,
  milestone_id pg_catalog.text not null,
  unlocked_at pg_catalog.timestamptz not null default pg_catalog.now(),
  constraint user_milestones_pkey primary key (user_id, milestone_id),
  constraint user_milestones_controlled_id check (
    milestone_id = any (array[
      'MILESTONE-FIRST-STEP',
      'MILESTONE-FOUNDATION-COMPLETE',
      'MILESTONE-LEARNING-IN-MOTION',
      'MILESTONE-MYTH-CHECKER',
      'MILESTONE-SECOND-LOOK',
      'MILESTONE-EVIDENCE-SEEKER',
      'MILESTONE-PRIORITIES-SET',
      'MILESTONE-QUESTIONS-READY',
      'MILESTONE-APPOINTMENT-READY',
      'MILESTONE-PLAN-IN-HAND',
      'MILESTONE-SUPPORT-WITH-PERMISSION',
      'MILESTONE-CONVERSATION-BUILDER',
      'MILESTONE-FOUND-TRUSTED-SUPPORT',
      'MILESTONE-PERSONAL-TOOLKIT'
    ]::pg_catalog.text[])
  )
);

alter table public.user_milestones enable row level security;

create policy "users read own milestones"
on public.user_milestones for select to authenticated
using (user_id = auth.uid());

create policy "users create own milestones"
on public.user_milestones for insert to authenticated
with check (user_id = auth.uid());

create index user_milestones_recent_idx
on public.user_milestones (user_id, unlocked_at desc);
