alter table public.user_settings
  add column if not exists lesson_reminders boolean not null default true,
  add column if not exists learning_pace text not null default 'normal';

alter table public.user_settings
  drop constraint if exists user_settings_learning_pace_check;

alter table public.user_settings
  add constraint user_settings_learning_pace_check
  check (learning_pace in ('gentle', 'normal', 'focused'));
