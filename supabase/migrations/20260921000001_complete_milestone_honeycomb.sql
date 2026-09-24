-- Complete the 28-badge honeycomb with durable, distinct-item progress.
-- Only fixed authored identifiers are stored; no explanations, reflections,
-- story answers, health details, or browsing destinations are persisted.

alter table public.user_milestones
drop constraint if exists user_milestones_controlled_id;

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
    'MILESTONE-PERSONAL-TOOLKIT',
    'MILESTONE-IN-YOUR-OWN-WORDS',
    'MILESTONE-MEMORY-IN-MOTION',
    'MILESTONE-LABEL-WISE',
    'MILESTONE-STORY-EXPLORER',
    'MILESTONE-CONCEPTS-MADE-CLEAR',
    'MILESTONE-MANY-PERSPECTIVES',
    'MILESTONE-CIRCLE-OF-SUPPORT',
    'MILESTONE-RESOURCE-NAVIGATOR'
  ]::pg_catalog.text[])
);

create table public.user_milestone_activity_progress (
  user_id pg_catalog.uuid not null references auth.users(id) on delete cascade,
  activity_type pg_catalog.text not null,
  item_id pg_catalog.text not null,
  completed_at pg_catalog.timestamptz not null default pg_catalog.now(),
  constraint user_milestone_activity_progress_pkey
    primary key (user_id, activity_type, item_id),
  constraint user_milestone_activity_progress_fixed_ids check (
    (
      activity_type = 'explain_it_back'
      and item_id = any (array[
        'blood-glucose','insulin','insulin-resistance','type-2-diabetes','a1c',
        'a1c-vs-glucose','carbohydrates','serving-size','total-vs-added-sugars',
        'total-carbohydrate'
      ]::pg_catalog.text[])
    )
    or (
      activity_type = 'interactive_story'
      and item_id = any (array[
        'marcus-parking-lot','asha-rice-on-the-table','nora-prescription-bag',
        'devon-number-screen'
      ]::pg_catalog.text[])
    )
    or (
      activity_type = 'trusted_resource'
      and item_id = any (array[
        'type-2-diabetes-basics','understanding-a1c','monitoring-blood-sugar',
        'diabetes-meal-planning','cultural-foods','physical-activity',
        'diabetes-treatments','low-blood-sugar','managing-sick-days',
        'heart-disease-and-stroke','kidney-health','eye-health','foot-care','oral-health',
        'diabetes-and-mental-health','diabetes-education-and-support','financial-help',
        'emergency-preparedness'
      ]::pg_catalog.text[])
    )
  )
);

alter table public.user_milestone_activity_progress enable row level security;

create policy "users read own milestone activity progress"
on public.user_milestone_activity_progress for select to authenticated
using (user_id = auth.uid());

grant select on public.user_milestone_activity_progress to authenticated;
revoke insert, update, delete on public.user_milestone_activity_progress from authenticated;
revoke all on public.user_milestone_activity_progress from anon;

create index user_milestone_activity_progress_user_idx
on public.user_milestone_activity_progress (user_id, activity_type);

create or replace function public.record_milestone_activity_for_user(
  p_user_id pg_catalog.uuid,
  p_activity_type pg_catalog.text,
  p_item_id pg_catalog.text
)
returns table (
  progress_count pg_catalog.int4,
  newly_unlocked_ids pg_catalog.text[]
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_progress_count pg_catalog.int4;
  v_candidates pg_catalog.text[] := array[]::pg_catalog.text[];
  v_newly_unlocked_ids pg_catalog.text[] := array[]::pg_catalog.text[];
begin
  if p_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required.';
  end if;

  if not (
    (p_activity_type = 'explain_it_back' and p_item_id = any (array[
      'blood-glucose','insulin','insulin-resistance','type-2-diabetes','a1c',
      'a1c-vs-glucose','carbohydrates','serving-size','total-vs-added-sugars',
      'total-carbohydrate'
    ]::pg_catalog.text[]))
    or (p_activity_type = 'interactive_story' and p_item_id = any (array[
      'marcus-parking-lot','asha-rice-on-the-table','nora-prescription-bag',
      'devon-number-screen'
    ]::pg_catalog.text[]))
    or (p_activity_type = 'trusted_resource' and p_item_id = any (array[
      'type-2-diabetes-basics','understanding-a1c','monitoring-blood-sugar',
      'diabetes-meal-planning','cultural-foods','physical-activity',
      'diabetes-treatments','low-blood-sugar','managing-sick-days',
      'heart-disease-and-stroke','kidney-health','eye-health','foot-care','oral-health',
      'diabetes-and-mental-health','diabetes-education-and-support','financial-help',
      'emergency-preparedness'
    ]::pg_catalog.text[]))
  ) then
    raise exception using errcode = '22023', message = 'Unknown milestone activity.';
  end if;

  -- Serialize progress for this user and activity. Without this lock, two
  -- different items completed in parallel could both count the pre-commit
  -- state and miss the threshold they collectively reached.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'milestone-activity:' || p_user_id::pg_catalog.text || ':' || p_activity_type,
      0
    )
  );

  insert into public.user_milestone_activity_progress (user_id, activity_type, item_id)
  values (p_user_id, p_activity_type, p_item_id)
  on conflict on constraint user_milestone_activity_progress_pkey do nothing;

  select pg_catalog.count(*)::pg_catalog.int4
  into v_progress_count
  from public.user_milestone_activity_progress
  where user_id = p_user_id and activity_type = p_activity_type;

  if p_activity_type = 'explain_it_back' then
    v_candidates := array['MILESTONE-IN-YOUR-OWN-WORDS']::pg_catalog.text[];
    if v_progress_count >= 3 then
      v_candidates := pg_catalog.array_append(v_candidates, 'MILESTONE-CONCEPTS-MADE-CLEAR');
    end if;
  elsif p_activity_type = 'interactive_story' then
    v_candidates := array['MILESTONE-STORY-EXPLORER']::pg_catalog.text[];
    if v_progress_count >= 4 then
      v_candidates := pg_catalog.array_append(v_candidates, 'MILESTONE-MANY-PERSPECTIVES');
    end if;
  elsif p_activity_type = 'trusted_resource' then
    if p_item_id = 'diabetes-education-and-support' then
      v_candidates := pg_catalog.array_append(
        v_candidates,
        'MILESTONE-FOUND-TRUSTED-SUPPORT'
      );
    end if;
    if v_progress_count >= 3 then
      v_candidates := pg_catalog.array_append(v_candidates, 'MILESTONE-RESOURCE-NAVIGATOR');
    end if;
  end if;

  with inserted as (
    insert into public.user_milestones (user_id, milestone_id)
    select p_user_id, candidate
    from pg_catalog.unnest(v_candidates) as candidate
    on conflict on constraint user_milestones_pkey do nothing
    returning milestone_id
  )
  select coalesce(
    pg_catalog.array_agg(inserted.milestone_id order by inserted.milestone_id),
    array[]::pg_catalog.text[]
  )
  into v_newly_unlocked_ids
  from inserted;

  return query select v_progress_count, v_newly_unlocked_ids;
end;
$$;

revoke all on function public.record_milestone_activity_for_user(
  pg_catalog.uuid,
  pg_catalog.text,
  pg_catalog.text
) from public, anon, authenticated;

create or replace function public.record_milestone_activity(
  p_activity_type pg_catalog.text,
  p_item_id pg_catalog.text
)
returns table (
  progress_count pg_catalog.int4,
  newly_unlocked_ids pg_catalog.text[]
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required.';
  end if;
  return query
  select *
  from public.record_milestone_activity_for_user(v_user_id, p_activity_type, p_item_id);
end;
$$;

revoke all on function public.record_milestone_activity(
  pg_catalog.text,
  pg_catalog.text
) from public, anon;
grant execute on function public.record_milestone_activity(
  pg_catalog.text,
  pg_catalog.text
) to authenticated;

-- Explain It Back already reaches this function after a successful evaluation.
-- Recording its authored challenge ID here makes the browser event a retry path,
-- not the sole source of truth.
create or replace function public.record_explain_it_back_learning(
  p_challenge_id pg_catalog.text
)
returns pg_catalog.bool
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Not authorized.';
  end if;
  if p_challenge_id <> all (array[
    'blood-glucose','insulin','insulin-resistance','type-2-diabetes','a1c','a1c-vs-glucose',
    'carbohydrates','serving-size','total-vs-added-sugars','total-carbohydrate'
  ]::pg_catalog.text[]) then
    raise exception using errcode = '22023', message = 'Unknown review challenge.';
  end if;

  insert into public.user_spaced_review_state (user_id, challenge_id, learned_at, next_due_at)
  values (
    v_user_id,
    p_challenge_id,
    pg_catalog.clock_timestamp(),
    pg_catalog.clock_timestamp() + interval '3 days'
  )
  on conflict (user_id, challenge_id) do nothing;

  perform 1
  from public.record_milestone_activity_for_user(
    v_user_id,
    'explain_it_back',
    p_challenge_id
  );

  return true;
end;
$$;

revoke all on function public.record_explain_it_back_learning(pg_catalog.text) from public, anon;
grant execute on function public.record_explain_it_back_learning(pg_catalog.text) to authenticated;

-- The collection milestone is derived from the same three-gate module records
-- as the individual caregiver badges, including historical completions.
create or replace function public.reconcile_caregiver_collection_milestone()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- The module row has already been written when this trigger runs. Serialize
  -- collection reconciliation so a parallel final-module completion sees the
  -- other transaction after it commits.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'caregiver-collection:' || new.user_id::pg_catalog.text,
      0
    )
  );
  if (
    select pg_catalog.count(*)
    from public.user_caregiver_module_progress
    where user_id = new.user_id and completed_at is not null
  ) >= 5 then
    insert into public.user_milestones (user_id, milestone_id)
    values (new.user_id, 'MILESTONE-CIRCLE-OF-SUPPORT')
    on conflict on constraint user_milestones_pkey do nothing;
  end if;
  return new;
end;
$$;

revoke all on function public.reconcile_caregiver_collection_milestone()
from public, anon, authenticated;

drop trigger if exists caregiver_progress_reconcile_collection_milestone
on public.user_caregiver_module_progress;
create trigger caregiver_progress_reconcile_collection_milestone
after insert or update of completed_at on public.user_caregiver_module_progress
for each row
when (new.completed_at is not null)
execute function public.reconcile_caregiver_collection_milestone();

insert into public.user_milestones (user_id, milestone_id)
select user_id, 'MILESTONE-CIRCLE-OF-SUPPORT'
from public.user_caregiver_module_progress
where completed_at is not null
group by user_id
having pg_catalog.count(*) >= 5
on conflict on constraint user_milestones_pkey do nothing;

-- Repair any durable achievement whose derived milestone row is missing. This
-- runs when the collection is read, covering interrupted requests, historical
-- data, and any progress written before the corresponding badge existed.
create or replace function public.reconcile_current_user_activity_milestones()
returns pg_catalog.text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id pg_catalog.uuid := auth.uid();
  v_inserted_ids pg_catalog.text[];
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required.';
  end if;

  with activity_counts as (
    select
      activity_type,
      pg_catalog.count(*)::pg_catalog.int4 as progress_count,
      pg_catalog.max(completed_at) as latest_completion
    from public.user_milestone_activity_progress
    where user_id = v_user_id
    group by activity_type
  ),
  caregiver_completed as (
    select
      module_id,
      completed_at
    from public.user_caregiver_module_progress
    where user_id = v_user_id and completed_at is not null
  ),
  candidates(milestone_id, unlocked_at) as (
    select 'MILESTONE-IN-YOUR-OWN-WORDS', latest_completion
    from activity_counts
    where activity_type = 'explain_it_back' and progress_count >= 1

    union all
    select 'MILESTONE-CONCEPTS-MADE-CLEAR', latest_completion
    from activity_counts
    where activity_type = 'explain_it_back' and progress_count >= 3

    union all
    select 'MILESTONE-STORY-EXPLORER', latest_completion
    from activity_counts
    where activity_type = 'interactive_story' and progress_count >= 1

    union all
    select 'MILESTONE-MANY-PERSPECTIVES', latest_completion
    from activity_counts
    where activity_type = 'interactive_story' and progress_count >= 4

    union all
    select 'MILESTONE-FOUND-TRUSTED-SUPPORT', pg_catalog.min(completed_at)
    from public.user_milestone_activity_progress
    where user_id = v_user_id
      and activity_type = 'trusted_resource'
      and item_id = 'diabetes-education-and-support'
    having pg_catalog.count(*) >= 1

    union all
    select 'MILESTONE-RESOURCE-NAVIGATOR', latest_completion
    from activity_counts
    where activity_type = 'trusted_resource' and progress_count >= 3

    union all
    select
      case module_id
        when 'CG-M1' then 'MILESTONE-CONVERSATION-BUILDER'
        when 'CG-M2' then 'MILESTONE-SUPPORT-WITH-PERMISSION'
        when 'CG-M3' then 'MILESTONE-EVERYDAY-ALLY'
        when 'CG-M4' then 'MILESTONE-STEADY-SUPPORT'
        when 'CG-M5' then 'MILESTONE-SUSTAINABLE-SUPPORT'
      end,
      completed_at
    from caregiver_completed

    union all
    select 'MILESTONE-CIRCLE-OF-SUPPORT', pg_catalog.max(completed_at)
    from caregiver_completed
    having pg_catalog.count(*) >= 5

    union all
    select 'MILESTONE-MEMORY-IN-MOTION', pg_catalog.min(last_reviewed_at)
    from public.user_spaced_review_state
    where user_id = v_user_id and last_reviewed_at is not null
    having pg_catalog.count(*) >= 1
  ),
  inserted as (
    insert into public.user_milestones (user_id, milestone_id, unlocked_at)
    select v_user_id, candidates.milestone_id, candidates.unlocked_at
    from candidates
    where candidates.milestone_id is not null and candidates.unlocked_at is not null
    on conflict on constraint user_milestones_pkey do nothing
    returning milestone_id
  )
  select coalesce(
    pg_catalog.array_agg(inserted.milestone_id order by inserted.milestone_id),
    array[]::pg_catalog.text[]
  )
  into v_inserted_ids
  from inserted;

  return v_inserted_ids;
end;
$$;

revoke all on function public.reconcile_current_user_activity_milestones()
from public, anon;
grant execute on function public.reconcile_current_user_activity_milestones()
to authenticated;

comment on table public.user_milestone_activity_progress is
  'Privacy-safe fixed content IDs used only for distinct milestone progress. Never stores user-authored or health content.';
