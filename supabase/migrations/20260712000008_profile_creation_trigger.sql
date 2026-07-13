create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

comment on function public.handle_new_user() is
  'Runs with definer privileges because auth.users inserts cannot be granted direct application-table access. It creates only a blank profile, ignores all user metadata, and uses an empty search_path.';
