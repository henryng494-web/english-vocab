-- Supabase schema for English Vocab app
-- Run this in the Supabase SQL Editor

-- word_bank: central vocabulary list
create table if not exists public.word_bank (
  id uuid primary key default gen_random_uuid(),
  word text not null unique,
  created_at timestamptz not null default now()
);

-- word_details: enriched metadata per word (Gemini + Unsplash)
create table if not exists public.word_details (
  id uuid primary key default gen_random_uuid(),
  word_bank_id uuid not null references public.word_bank(id) on delete cascade,
  definition text not null,
  example_sentence text,
  pronunciation text,
  image_url text,
  part_of_speech text,
  created_at timestamptz not null default now()
);

-- user_learning: per-user progress tracking
create table if not exists public.user_learning (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word_bank_id uuid not null references public.word_bank(id) on delete cascade,
  status text not null default 'new' check (status in ('new', 'learning', 'mastered')),
  last_reviewed_at timestamptz,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, word_bank_id)
);

-- Row Level Security
alter table public.word_bank enable row level security;
alter table public.word_details enable row level security;
alter table public.user_learning enable row level security;

-- word_bank: readable by all authenticated users, insertable by authenticated
create policy "word_bank read" on public.word_bank
  for select to authenticated using (true);

create policy "word_bank insert" on public.word_bank
  for insert to authenticated with check (true);

create policy "word_bank read anon" on public.word_bank
  for select to anon using (true);

create policy "word_bank insert anon" on public.word_bank
  for insert to anon with check (true);

-- word_details: readable by all authenticated users
create policy "word_details read" on public.word_details
  for select to authenticated using (true);

create policy "word_details insert" on public.word_details
  for insert to authenticated with check (true);

create policy "word_details read anon" on public.word_details
  for select to anon using (true);

create policy "word_details insert anon" on public.word_details
  for insert to anon with check (true);

-- user_learning: users can only access their own records
create policy "user_learning select own" on public.user_learning
  for select to authenticated using (auth.uid() = user_id);

create policy "user_learning insert own" on public.user_learning
  for insert to authenticated with check (auth.uid() = user_id);

create policy "user_learning update own" on public.user_learning
  for update to authenticated using (auth.uid() = user_id);

create policy "user_learning upsert own" on public.user_learning
  for all to authenticated using (auth.uid() = user_id);
