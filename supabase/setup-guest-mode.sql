-- Guest mode setup for English Vocab (run once in Supabase SQL Editor)
-- Skip lines that error with "policy already exists"

-- Word bank & details (anon read/write)
create policy "word_bank read anon" on public.word_bank
  for select to anon using (true);
create policy "word_bank insert anon" on public.word_bank
  for insert to anon with check (true);
create policy "word_bank update anon" on public.word_bank
  for update to anon using (true);

create policy "word_details read anon" on public.word_details
  for select to anon using (true);
create policy "word_details insert anon" on public.word_details
  for insert to anon with check (true);

-- Learning progress without login
alter table public.user_learning drop constraint if exists user_learning_status_check;
alter table public.user_learning
  add constraint user_learning_status_check
  check (status in ('new', 'learning', 'need_review', 'mastered'));

create unique index if not exists user_learning_guest_word_unique
  on public.user_learning (word)
  where user_id is null;

create policy "user_learning anon select" on public.user_learning
  for select to anon using (user_id is null);
create policy "user_learning anon insert" on public.user_learning
  for insert to anon with check (user_id is null);
create policy "user_learning anon update" on public.user_learning
  for update to anon using (user_id is null);
