alter table public.profiles
add column onboarding_intent pg_catalog.text;

alter table public.profiles
add constraint profiles_onboarding_intent_check
check (
  onboarding_intent is null
  or onboarding_intent in (
    'recently-diagnosed',
    'learn-basics',
    'support-someone',
    'prepare-appointment'
  )
);

comment on column public.profiles.onboarding_intent is
  'Optional first-use navigation preference. This is not medical profile data and does not drive ongoing recommendations.';

drop function public.complete_onboarding(
  pg_catalog.text,
  pg_catalog.text,
  pg_catalog.text,
  pg_catalog.bool,
  pg_catalog.text
);

create function public.complete_onboarding(
  p_onboarding_intent pg_catalog.text
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

  if p_onboarding_intent is not null
    and p_onboarding_intent not in (
      'recently-diagnosed',
      'learn-basics',
      'support-someone',
      'prepare-appointment'
    )
  then
    raise exception using errcode = '22023', message = 'Invalid onboarding intent.';
  end if;

  update public.profiles
  set onboarding_intent = case
        when onboarding_completed_at is null then p_onboarding_intent
        else onboarding_intent
      end,
      onboarding_completed_at = coalesce(onboarding_completed_at, pg_catalog.now())
  where id = v_user_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'Profile unavailable.';
  end if;

  return true;
end;
$$;

comment on function public.complete_onboarding(pg_catalog.text) is
  'Atomically completes first-use onboarding and stores one optional, controlled navigation preference without overwriting an existing completion.';

revoke all on function public.complete_onboarding(pg_catalog.text) from public;
revoke all on function public.complete_onboarding(pg_catalog.text) from anon;
grant execute on function public.complete_onboarding(pg_catalog.text) to authenticated;
