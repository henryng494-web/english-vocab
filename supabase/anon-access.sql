-- Allow anonymous access (no login required)
-- Run this in Supabase SQL Editor if add/fetch words fails without login

create policy "word_bank read anon" on public.word_bank
  for select to anon using (true);

create policy "word_bank insert anon" on public.word_bank
  for insert to anon with check (true);

create policy "word_details read anon" on public.word_details
  for select to anon using (true);

create policy "word_details insert anon" on public.word_details
  for insert to anon with check (true);

create policy "word_bank update anon" on public.word_bank
  for update to anon using (true);
