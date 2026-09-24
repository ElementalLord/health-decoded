-- Extend the controlled milestone catalog with completion signals from existing,
-- reachable learning tools. Each event is still written through the authenticated
-- milestone service and remains idempotent on (user_id, milestone_id).

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
    'MILESTONE-PERSONAL-TOOLKIT',
    'MILESTONE-IN-YOUR-OWN-WORDS',
    'MILESTONE-MEMORY-IN-MOTION',
    'MILESTONE-LABEL-WISE',
    'MILESTONE-STORY-EXPLORER'
  ]::pg_catalog.text[])
);

-- Explain It Back already writes only the selected concept identifier. Unlock the
-- milestone in the same transaction so a lost browser response cannot lose it.
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

  insert into public.user_milestones (user_id, milestone_id)
  values (v_user_id, 'MILESTONE-IN-YOUR-OWN-WORDS')
  on conflict on constraint user_milestones_pkey do nothing;

  return true;
end;
$$;

revoke all on function public.record_explain_it_back_learning(pg_catalog.text) from public, anon;
grant execute on function public.record_explain_it_back_learning(pg_catalog.text) to authenticated;

-- A recorded review is durable source data. Mirror it into the milestone table
-- inside Postgres and repair accounts that reviewed before this badge existed.
create or replace function public.reconcile_spaced_review_milestone()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.last_reviewed_at is not null then
    insert into public.user_milestones (user_id, milestone_id, unlocked_at)
    values (new.user_id, 'MILESTONE-MEMORY-IN-MOTION', new.last_reviewed_at)
    on conflict on constraint user_milestones_pkey do nothing;
  end if;
  return new;
end;
$$;

revoke all on function public.reconcile_spaced_review_milestone() from public, anon, authenticated;

drop trigger if exists spaced_review_reconcile_milestone on public.user_spaced_review_state;
create trigger spaced_review_reconcile_milestone
after insert or update of last_reviewed_at on public.user_spaced_review_state
for each row
when (new.last_reviewed_at is not null)
execute function public.reconcile_spaced_review_milestone();

insert into public.user_milestones (user_id, milestone_id, unlocked_at)
select
  public.user_spaced_review_state.user_id,
  'MILESTONE-MEMORY-IN-MOTION',
  pg_catalog.min(public.user_spaced_review_state.last_reviewed_at)
from public.user_spaced_review_state
where public.user_spaced_review_state.last_reviewed_at is not null
group by public.user_spaced_review_state.user_id
on conflict on constraint user_milestones_pkey do nothing;
