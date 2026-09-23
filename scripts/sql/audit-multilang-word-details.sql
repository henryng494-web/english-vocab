-- Audit word_details for Spanish / JSONB multilang leftovers.
-- Run in Supabase SQL Editor (read-only checks).

-- 1) Which optional JSONB columns exist?
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'word_details'
  and column_name in ('meanings', 'example_translations', 'phrase_translations')
order by column_name;

-- 2) Row counts (adjust if your table is larger)
select count(*) as total_rows from public.word_details;

-- 3) meanings JSONB (only if column exists — skip if error)
-- select count(*) as rows_with_es_meaning
-- from public.word_details
-- where meanings ? 'es';

-- 4) example_translations array with any es key (only if column exists)
-- select count(*) as rows_with_es_examples
-- from public.word_details
-- where exists (
--   select 1
--   from jsonb_array_elements(coalesce(example_translations, '[]'::jsonb)) elem
--   where elem ? 'es'
-- );

-- 5) phrase_translations (column may exist even when meanings does not)
select count(*) as rows_with_phrase_es
from public.word_details
where coalesce(phrase_translations, '{}'::jsonb)::text like '%"es"%'
  and coalesce(phrase_translations, '{}'::jsonb) <> '{}'::jsonb;
