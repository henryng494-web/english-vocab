-- Allow anonymous learning progress (no login required)
-- Run in Supabase SQL Editor

-- Extend status values if needed
alter table public.user_learning drop constraint if exists user_learning_status_check;
alter table public.user_learning
  add constraint user_learning_status_check
  check (status in ('new', 'learning', 'need_review', 'mastered'));

-- Unique word for guest learning (user_id is null)
create unique index if not exists user_learning_guest_word_unique
  on public.user_learning (word)
  where user_id is null;

-- RLS policies for anon
create policy "user_learning anon select" on public.user_learning
  for select to anon using (user_id is null);

create policy "user_learning anon insert" on public.user_learning
  for insert to anon with check (user_id is null);

create policy "user_learning anon update" on public.user_learning
  for update to anon using (user_id is null);
