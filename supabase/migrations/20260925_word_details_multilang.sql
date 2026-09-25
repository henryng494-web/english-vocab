-- Step 1: optional JSONB columns for vi/es glosses (English headword unchanged).
-- Run in Supabase SQL editor when enabling Spanish learner locale.

alter table public.word_details
  add column if not exists meanings jsonb not null default '{}'::jsonb;

alter table public.word_details
  add column if not exists example_translations jsonb not null default '[]'::jsonb;

comment on column public.word_details.meanings is
  'Per-locale glosses: {"vi":"...","es":"..."}. Legacy `vietnamese_meaning` remains source for vi.';

comment on column public.word_details.example_translations is
  'Index-aligned with English `examples`: [{"vi":"...","es":"..."}, ...].';
