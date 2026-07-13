create table public.activity_answer_keys (
  activity_id uuid primary key references public.activities (id) on delete cascade,
  answer_config jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_answer_keys_answer_config_object check (jsonb_typeof(answer_config) = 'object')
);

create trigger activity_answer_keys_set_updated_at
before update on public.activity_answer_keys
for each row execute function public.set_updated_at();

comment on table public.activity_answer_keys is
  'SERVER-ONLY, SECURITY-SENSITIVE: protected activity evaluation data. No anonymous or authenticated-user policy may grant direct access. A future trusted server-side evaluator is required.';

revoke all on table public.activity_answer_keys from anon, authenticated;
