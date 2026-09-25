import {
  translateExampleToSpanishWithGemini,
  translateMeaningToSpanishWithGemini,
} from "@/lib/gemini-core";
import {
  exampleRowsFromDetail,
  mergeLegacyViIntoMeanings,
  hasStoredEsMeaning,
  exampleTranslationsNeedEs,
} from "@/lib/multilang-record";
import { parseExamples } from "@/lib/parse-examples";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";

const MAX_EXAMPLES_TO_TRANSLATE = 2;

export function wordDetailNeedsSpanishHydration(
  detail: Pick<
    WordDetail,
    "meanings" | "vietnamese_meaning" | "examples" | "example_translations"
  >,
): boolean {
  const meanings = mergeLegacyViIntoMeanings(detail);
  const parsed = parseExamples(detail.examples);
  const rows = exampleRowsFromDetail(detail);
  const count = Math.min(parsed.length, MAX_EXAMPLES_TO_TRANSLATE);
  return (
    !hasStoredEsMeaning(meanings) ||
    (count > 0 && exampleTranslationsNeedEs(rows, count))
  );
}

export async function hydrateSpanishWordContent(
  detail: WordDetail,
): Promise<{
  meanings: LocalizedMeaningsJson;
  example_translations: ExampleTranslationsJson;
}> {
  const meanings = mergeLegacyViIntoMeanings(detail);
  let example_translations = exampleRowsFromDetail(detail);
  const parsed = parseExamples(detail.examples).slice(
    0,
    MAX_EXAMPLES_TO_TRANSLATE,
  );

  const glossForPrompt =
    meanings.es?.trim() || meanings.vi?.trim() || detail.vietnamese_meaning;

  if (!hasStoredEsMeaning(meanings)) {
    const es = await translateMeaningToSpanishWithGemini(
      detail.word,
      meanings.vi ?? detail.vietnamese_meaning,
      detail.english_definition,
    );
    if (es?.trim()) meanings.es = es.trim();
  }

  if (parsed.length && exampleTranslationsNeedEs(example_translations, parsed.length)) {
    const next = [...example_translations];
    for (let i = 0; i < parsed.length; i += 1) {
      if (next[i]?.es?.trim()) continue;
      const esLine = await translateExampleToSpanishWithGemini(
        parsed[i].en,
        detail.word,
        detail.word_type,
        glossForPrompt,
      );
      next[i] = { ...(next[i] ?? {}), ...(next[i]?.vi ? { vi: next[i].vi } : {}) };
      if (parsed[i].vi?.trim() && !next[i].vi) next[i].vi = parsed[i].vi.trim();
      if (esLine?.trim()) next[i].es = esLine.trim();
    }
    example_translations = next;
  }

  return { meanings, example_translations };
}
