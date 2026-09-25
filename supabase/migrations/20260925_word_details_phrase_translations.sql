alter table public.word_details
  add column if not exists phrase_translations jsonb not null default '{}'::jsonb;

comment on column public.word_details.phrase_translations is
  'Goes-with UI: {"collocations":[{"en":"...","vi":"...","es":"..."}],"chunks":[...]}';
