create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint ai_conversations_title_length check (char_length(title) between 1 and 120)
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint ai_messages_role_check check (role in ('user', 'assistant')),
  constraint ai_messages_content_length check (char_length(content) between 1 and 8000)
);

create trigger ai_conversations_set_updated_at before update on public.ai_conversations
for each row execute function public.set_updated_at();

create index ai_conversations_user_active_updated_idx
on public.ai_conversations (user_id, updated_at desc)
where archived_at is null;
create index ai_messages_conversation_created_idx
on public.ai_messages (conversation_id, created_at desc);

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

create policy "users read own ai conversations"
on public.ai_conversations for select to authenticated
using (user_id = auth.uid());
create policy "users create own ai conversations"
on public.ai_conversations for insert to authenticated
with check (user_id = auth.uid());
create policy "users update own ai conversations"
on public.ai_conversations for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users delete own ai conversations"
on public.ai_conversations for delete to authenticated
using (user_id = auth.uid());

create policy "users read own ai messages"
on public.ai_messages for select to authenticated
using (
  exists (
    select 1 from public.ai_conversations
    where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
  )
);
create policy "users create own ai messages"
on public.ai_messages for insert to authenticated
with check (
  exists (
    select 1 from public.ai_conversations
    where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
  )
);
create policy "users delete own ai messages"
on public.ai_messages for delete to authenticated
using (
  exists (
    select 1 from public.ai_conversations
    where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
  )
);

comment on table public.ai_conversations is
  'User-owned educational AI conversation metadata. Provider prompts, classifications, and analytics are intentionally not stored.';
comment on table public.ai_messages is
  'Plain-text user and assistant educational messages only. No system prompts, provider metadata, or hidden instructions are stored.';
