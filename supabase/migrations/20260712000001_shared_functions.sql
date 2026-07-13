-- Supabase PostgreSQL provides gen_random_uuid(); no extension is required for this schema.

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Sets updated_at on application rows. It does not access user data or elevate privileges.';
