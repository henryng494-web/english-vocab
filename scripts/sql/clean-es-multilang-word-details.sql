-- Strip Spanish (es) from word_details and restore Vietnamese gloss column.
-- Safe to run when rolling back the Spanish multilang experiment.
-- ALWAYS preview with the SELECT blocks before running UPDATE.

begin;

-- ---------------------------------------------------------------------------
-- A) meanings jsonb — keep vi, drop es, sync vietnamese_meaning from vi
-- (Skip section if column `meanings` does not exist.)
-- ---------------------------------------------------------------------------
-- preview:
-- select word, vietnamese_meaning, meanings
-- from public.word_details
-- where meanings ? 'es' or meanings ? 'vi'
-- limit 20;

-- update public.word_details
-- set
--   meanings = (meanings - 'es'),
--   vietnamese_meaning = coalesce(
--     nullif(trim(meanings->>'vi'), ''),
--     nullif(trim(vietnamese_meaning), ''),
--     word
--   )
-- where meanings ? 'es' or (meanings ? 'vi' and coalesce(trim(vietnamese_meaning), '') = '');

-- If vi gloss lives only in meanings.vi, force sync for all rows with vi key:
-- update public.word_details
-- set vietnamese_meaning = trim(meanings->>'vi')
-- where meanings ? 'vi'
--   and coalesce(trim(meanings->>'vi'), '') <> ''
--   and trim(vietnamese_meaning) is distinct from trim(meanings->>'vi');

-- ---------------------------------------------------------------------------
-- B) example_translations — remove es key from each array element
-- (Skip if column does not exist.)
-- ---------------------------------------------------------------------------
-- preview count:
-- select count(*) from public.word_details
-- where exists (
--   select 1 from jsonb_array_elements(coalesce(example_translations, '[]'::jsonb)) e
--   where e ? 'es'
-- );

-- update public.word_details wd
-- set example_translations = (
--   select coalesce(jsonb_agg(e - 'es'), '[]'::jsonb)
--   from jsonb_array_elements(coalesce(wd.example_translations, '[]'::jsonb)) e
-- )
-- where exists (
--   select 1 from jsonb_array_elements(coalesce(wd.example_translations, '[]'::jsonb)) e
--   where e ? 'es'
-- );

-- ---------------------------------------------------------------------------
-- C) phrase_translations — drop es from collocations/chunks rows
-- ---------------------------------------------------------------------------
-- preview:
-- select word, phrase_translations
-- from public.word_details
-- where coalesce(phrase_translations, '{}'::jsonb) <> '{}'::jsonb
-- limit 20;

update public.word_details wd
set phrase_translations = jsonb_build_object(
  'collocations',
  coalesce(
    (
      select jsonb_agg(
        (elem - 'es')
        order by ord
      )
      from jsonb_array_elements(coalesce(wd.phrase_translations->'collocations', '[]'::jsonb))
        with ordinality as t(elem, ord)
    ),
    '[]'::jsonb
  ),
  'chunks',
  coalesce(
    (
      select jsonb_agg(
        (elem - 'es')
        order by ord
      )
      from jsonb_array_elements(coalesce(wd.phrase_translations->'chunks', '[]'::jsonb))
        with ordinality as t(elem, ord)
    ),
    '[]'::jsonb
  )
)
where coalesce(phrase_translations, '{}'::jsonb)::text like '%"es"%';

-- Optional: reset empty phrase objects entirely
-- update public.word_details
-- set phrase_translations = '{}'::jsonb
-- where phrase_translations = '{"collocations":[],"chunks":[]}'::jsonb;

-- ---------------------------------------------------------------------------
-- D) Optional — drop multilang columns to match vi-only app (irreversible)
-- ---------------------------------------------------------------------------
-- alter table public.word_details drop column if exists meanings;
-- alter table public.word_details drop column if exists example_translations;
-- alter table public.word_details drop column if exists phrase_translations;

commit;
