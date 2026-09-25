-- Combined multilang columns (run once in Supabase SQL Editor if CLI password unavailable).

alter table public.word_details
  add column if not exists meanings jsonb not null default '{}'::jsonb;

alter table public.word_details
  add column if not exists example_translations jsonb not null default '[]'::jsonb;

alter table public.word_details
  add column if not exists phrase_translations jsonb not null default '{}'::jsonb;

comment on column public.word_details.meanings is
  'Per-locale glosses: {"vi":"...","es":"..."}. Legacy `vietnamese_meaning` remains source for vi.';

comment on column public.word_details.example_translations is
  'Index-aligned with English `examples`: [{"vi":"...","es":"..."}, ...].';

comment on column public.word_details.phrase_translations is
  'Goes-with UI: {"collocations":[{"en":"...","vi":"...","es":"..."}],"chunks":[...]}';
