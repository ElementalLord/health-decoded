-- The current AI tutor is intentionally session-only. Preserve owner access to
-- any legacy rows, but prevent browsers from creating persistent health-chat
-- content until the reviewed, server-owned memory workflow is implemented.
drop policy if exists "users create own ai conversations" on public.ai_conversations;
drop policy if exists "users update own ai conversations" on public.ai_conversations;
drop policy if exists "users create own ai messages" on public.ai_messages;

revoke insert, update on table public.ai_conversations from anon, authenticated;
revoke insert, update on table public.ai_messages from anon, authenticated;

comment on table public.ai_conversations is
  'Legacy user-owned AI conversation metadata. New writes are disabled while the tutor remains session-only.';
comment on table public.ai_messages is
  'Legacy owner-readable AI messages. New writes are disabled to prevent unintended persistence of health-chat content.';
