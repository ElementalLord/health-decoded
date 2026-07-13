insert into public.activity_answer_keys (activity_id, answer_config)
values (
  '40000000-0000-0000-0000-000000000001',
  '{"pairs":{"label-one":"description-one","label-two":"description-two"}}'::jsonb
)
on conflict (activity_id) do update set
  answer_config = excluded.answer_config;
