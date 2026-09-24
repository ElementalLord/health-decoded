-- Persist only the three approved, non-sensitive caregiver completion gates.
-- Reflections, answers, drafts, and health content remain session-only.

create table public.user_caregiver_module_progress (
  user_id pg_catalog.uuid not null references auth.users(id) on delete cascade,
  module_id pg_catalog.text not null,
  central_idea_reached pg_catalog.bool not null default false,
  core_application_completed pg_catalog.bool not null default false,
  takeaway_viewed pg_catalog.bool not null default false,
  completed_at pg_catalog.timestamptz,
  updated_at pg_catalog.timestamptz not null default pg_catalog.now(),
  constraint user_caregiver_module_progress_pkey primary key (user_id, module_id),
  constraint user_caregiver_module_progress_module_check check (
    module_id = any (array['CG-M1', 'CG-M2', 'CG-M3', 'CG-M4', 'CG-M5']::pg_catalog.text[])
  ),
  constraint user_caregiver_module_progress_completion_check check (
    completed_at is null
    or (central_idea_reached and core_application_completed and takeaway_viewed)
  )
);

alter table public.user_caregiver_module_progress enable row level security;

create policy "users read own caregiver milestone progress"
on public.user_caregiver_module_progress for select to authenticated
using (user_id = auth.uid());

grant select on public.user_caregiver_module_progress to authenticated;
revoke insert, update, delete on public.user_caregiver_module_progress from authenticated;
revoke all on public.user_caregiver_module_progress from anon;

create index user_caregiver_module_progress_user_idx
on public.user_caregiver_module_progress (user_id, module_id);

create or replace function public.record_caregiver_milestone_progress(
  p_module_id pg_catalog.text,
  p_central_idea_reached pg_catalog.bool,
  p_core_application_completed pg_catalog.bool,
  p_takeaway_viewed pg_catalog.bool
)
returns table (
  progress_count pg_catalog.int4,
  milestone_id pg_catalog.text,
  newly_unlocked pg_catalog.bool
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_central pg_catalog.bool;
  v_core pg_catalog.bool;
  v_takeaway pg_catalog.bool;
  v_milestone_id pg_catalog.text;
  v_inserted_milestone_id pg_catalog.text;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required.';
  end if;

  v_milestone_id := case p_module_id
    when 'CG-M1' then 'MILESTONE-CONVERSATION-BUILDER'
    when 'CG-M2' then 'MILESTONE-SUPPORT-WITH-PERMISSION'
    when 'CG-M3' then 'MILESTONE-EVERYDAY-ALLY'
    when 'CG-M4' then 'MILESTONE-STEADY-SUPPORT'
    when 'CG-M5' then 'MILESTONE-SUSTAINABLE-SUPPORT'
    else null
  end;

  if v_milestone_id is null then
    raise exception using errcode = '22023', message = 'Unknown caregiver module.';
  end if;

  insert into public.user_caregiver_module_progress (
    user_id,
    module_id,
    central_idea_reached,
    core_application_completed,
    takeaway_viewed,
    completed_at
  )
  values (
    v_user_id,
    p_module_id,
    coalesce(p_central_idea_reached, false),
    coalesce(p_core_application_completed, false),
    coalesce(p_takeaway_viewed, false),
    case
      when coalesce(p_central_idea_reached, false)
        and coalesce(p_core_application_completed, false)
        and coalesce(p_takeaway_viewed, false)
      then pg_catalog.now()
      else null
    end
  )
  on conflict on constraint user_caregiver_module_progress_pkey do update
  set
    central_idea_reached = public.user_caregiver_module_progress.central_idea_reached
      or excluded.central_idea_reached,
    core_application_completed = public.user_caregiver_module_progress.core_application_completed
      or excluded.core_application_completed,
    takeaway_viewed = public.user_caregiver_module_progress.takeaway_viewed
      or excluded.takeaway_viewed,
    completed_at = case
      when (
        public.user_caregiver_module_progress.central_idea_reached
          or excluded.central_idea_reached
      ) and (
        public.user_caregiver_module_progress.core_application_completed
          or excluded.core_application_completed
      ) and (
        public.user_caregiver_module_progress.takeaway_viewed
          or excluded.takeaway_viewed
      )
      then coalesce(public.user_caregiver_module_progress.completed_at, pg_catalog.now())
      else null
    end,
    updated_at = pg_catalog.now()
  returning
    public.user_caregiver_module_progress.central_idea_reached,
    public.user_caregiver_module_progress.core_application_completed,
    public.user_caregiver_module_progress.takeaway_viewed
  into v_central, v_core, v_takeaway;

  if v_central and v_core and v_takeaway then
    insert into public.user_milestones (user_id, milestone_id)
    values (v_user_id, v_milestone_id)
    on conflict on constraint user_milestones_pkey do nothing
    returning public.user_milestones.milestone_id into v_inserted_milestone_id;
  end if;

  return query select
    v_central::pg_catalog.int4 + v_core::pg_catalog.int4 + v_takeaway::pg_catalog.int4,
    case when v_central and v_core and v_takeaway then v_milestone_id else null end,
    v_inserted_milestone_id is not null;
end;
$$;

revoke all on function public.record_caregiver_milestone_progress(
  pg_catalog.text,
  pg_catalog.bool,
  pg_catalog.bool,
  pg_catalog.bool
) from public;
revoke all on function public.record_caregiver_milestone_progress(
  pg_catalog.text,
  pg_catalog.bool,
  pg_catalog.bool,
  pg_catalog.bool
) from anon;
grant execute on function public.record_caregiver_milestone_progress(
  pg_catalog.text,
  pg_catalog.bool,
  pg_catalog.bool,
  pg_catalog.bool
) to authenticated;

-- Existing earned caregiver milestones imply that all three approved gates were met.
insert into public.user_caregiver_module_progress (
  user_id,
  module_id,
  central_idea_reached,
  core_application_completed,
  takeaway_viewed,
  completed_at
)
select
  public.user_milestones.user_id,
  case public.user_milestones.milestone_id
    when 'MILESTONE-CONVERSATION-BUILDER' then 'CG-M1'
    when 'MILESTONE-SUPPORT-WITH-PERMISSION' then 'CG-M2'
    when 'MILESTONE-EVERYDAY-ALLY' then 'CG-M3'
    when 'MILESTONE-STEADY-SUPPORT' then 'CG-M4'
    when 'MILESTONE-SUSTAINABLE-SUPPORT' then 'CG-M5'
  end,
  true,
  true,
  true,
  public.user_milestones.unlocked_at
from public.user_milestones
where public.user_milestones.milestone_id = any (array[
  'MILESTONE-CONVERSATION-BUILDER',
  'MILESTONE-SUPPORT-WITH-PERMISSION',
  'MILESTONE-EVERYDAY-ALLY',
  'MILESTONE-STEADY-SUPPORT',
  'MILESTONE-SUSTAINABLE-SUPPORT'
]::pg_catalog.text[])
on conflict on constraint user_caregiver_module_progress_pkey do update
set
  central_idea_reached = true,
  core_application_completed = true,
  takeaway_viewed = true,
  completed_at = coalesce(
    public.user_caregiver_module_progress.completed_at,
    excluded.completed_at
  ),
  updated_at = pg_catalog.now();

comment on table public.user_caregiver_module_progress is
  'Privacy-safe milestone gates only. Never stores caregiver reflections, answers, drafts, or health content.';
