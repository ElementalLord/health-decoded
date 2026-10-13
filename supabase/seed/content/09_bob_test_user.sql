-- Shared non-production account used by the Congressional App Challenge button.
-- The fixed credentials are intentionally public and must never be used for real user data.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  'b0b00000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  'bob@testing.healthdecoded.local',
  extensions.crypt('Bob-Testing-Access-2026!', extensions.gen_salt('bf')),
  pg_catalog.now(),
  '{"provider":"email","providers":["email"]}'::pg_catalog.jsonb,
  '{}'::pg_catalog.jsonb,
  pg_catalog.now(),
  pg_catalog.now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = excluded.updated_at;

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  'b0b00000-0000-4000-8000-000000000002',
  'b0b00000-0000-4000-8000-000000000001',
  'b0b00000-0000-4000-8000-000000000001',
  '{"sub":"b0b00000-0000-4000-8000-000000000001","email":"bob@testing.healthdecoded.local","email_verified":true}'::pg_catalog.jsonb,
  'email',
  pg_catalog.now(),
  pg_catalog.now(),
  pg_catalog.now()
)
on conflict (provider_id, provider) do update set
  identity_data = excluded.identity_data,
  updated_at = excluded.updated_at;
