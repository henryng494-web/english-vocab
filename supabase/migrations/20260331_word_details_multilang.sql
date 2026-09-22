-- Multi-language glosses and example translations for English-learning app.
-- Run in Supabase SQL editor (production word_details uses `word` text key).

alter table public.word_details
  add column if not exists meanings jsonb not null default '{}'::jsonb;

alter table public.word_details
  add column if not exists example_translations jsonb not null default '[]'::jsonb;

comment on column public.word_details.meanings is
  'Per-locale glosses: {"vi":"...","es":"..."}. English headword stays in `word`.';

comment on column public.word_details.example_translations is
  'Index-aligned with English `examples` rows: [{"vi":"...","es":"..."}, ...].';

-- Optional one-time backfill (legacy vietnamese_meaning → meanings.vi):
-- update public.word_details
-- set meanings = jsonb_build_object('vi', vietnamese_meaning)
-- where meanings = '{}'::jsonb and coalesce(trim(vietnamese_meaning), '') <> '';
