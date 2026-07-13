create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (char_length(display_name) <= 100)
);

create table public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  reduced_motion boolean not null default false,
  preferred_text_scale text not null default 'default',
  locale text not null default 'en',
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_settings_preferred_text_scale_check
    check (preferred_text_scale in ('default', 'large', 'extra_large')),
  constraint user_settings_locale_length check (char_length(locale) between 2 and 16),
  constraint user_settings_timezone_length check (timezone is null or char_length(timezone) <= 64)
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

comment on table public.profiles is
  'Minimal user profile. Authentication identity and email remain in auth.users.';
comment on table public.user_settings is
  'User-owned accessibility and presentation preferences only.';
