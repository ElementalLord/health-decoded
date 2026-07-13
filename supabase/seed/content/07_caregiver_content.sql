insert into public.caregiver_content (
  id, slug, journey_lesson_id, title, content_blocks, support_tip, what_not_to_say,
  conversation_prompt, status, reviewed_by, reviewed_at, published_at
) values (
  '70000000-0000-0000-0000-000000000001',
  'development-caregiver-content',
  '30000000-0000-0000-0000-000000000001',
  'Development caregiver content',
  '[{"type":"text","heading":"Development seed","body":"Not production caregiver guidance."}]'::jsonb,
  'Use only for schema verification.',
  'No production language is included in this seed.',
  'How can we verify the schema together?',
  'draft',
  null,
  null,
  null
)
on conflict (id) do update set
  journey_lesson_id = excluded.journey_lesson_id,
  title = excluded.title,
  content_blocks = excluded.content_blocks,
  support_tip = excluded.support_tip,
  what_not_to_say = excluded.what_not_to_say,
  conversation_prompt = excluded.conversation_prompt,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
