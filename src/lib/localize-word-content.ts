import {
  translateCollocationToSpanishWithGemini,
  translateExampleToSpanishWithGemini,
  translateMeaningToSpanishWithGemini,
} from "@/lib/gemini-core";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import {
  exampleRowsFromDetail,
  mergeLegacyViIntoMeanings,
  hasStoredEsMeaning,
  exampleTranslationsNeedEs,
  mergePhraseRowsFromEntry,
  parsePhraseTranslationsJson,
  phraseTranslationsNeedEs,
} from "@/lib/multilang-record";
import { parseExamples } from "@/lib/parse-examples";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
  PhraseTranslationsJson,
} from "@/types/word-content";

const MAX_EXAMPLES_TO_TRANSLATE = 2;

export function wordDetailNeedsSpanishHydration(
  detail: Pick<
    WordDetail,
    | "word"
    | "meanings"
    | "vietnamese_meaning"
    | "examples"
    | "example_translations"
    | "phrase_translations"
    | "word_type"
  >,
): boolean {
  const meanings = mergeLegacyViIntoMeanings(detail);
  const parsed = parseExamples(detail.examples);
  const rows = exampleRowsFromDetail(detail);
  const count = Math.min(parsed.length, MAX_EXAMPLES_TO_TRANSLATE);
  const chunkEntry = resolveLearningChunks(detail.word, {
    examples: detail.examples,
    wordType: detail.word_type,
    meaning: detail.vietnamese_meaning,
  });
  const phrases = parsePhraseTranslationsJson(detail.phrase_translations);
  return (
    !hasStoredEsMeaning(meanings) ||
    (count > 0 && exampleTranslationsNeedEs(rows, count)) ||
    (chunkEntry != null && phraseTranslationsNeedEs(phrases, chunkEntry))
  );
}

export async function hydrateSpanishWordContent(
  detail: WordDetail,
): Promise<{
  meanings: LocalizedMeaningsJson;
  example_translations: ExampleTranslationsJson;
  phrase_translations: PhraseTranslationsJson;
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

  const chunkEntry = resolveLearningChunks(detail.word, {
    examples: detail.examples,
    wordType: detail.word_type,
    meaning: detail.vietnamese_meaning,
  });
  const parsedAll = parseExamples(detail.examples);
  let phrase_translations = parsePhraseTranslationsJson(detail.phrase_translations);

  if (chunkEntry) {
    let collocations = mergePhraseRowsFromEntry(
      chunkEntry.collocations,
      phrase_translations.collocations,
    );
    let chunks = mergePhraseRowsFromEntry(
      chunkEntry.chunks,
      phrase_translations.chunks,
    );

    for (let i = 0; i < collocations.length; i += 1) {
      if (collocations[i].es?.trim()) continue;
      const es = await translateCollocationToSpanishWithGemini(
        collocations[i].en ?? chunkEntry.collocations[i].en,
        detail.word,
        collocations[i].vi ?? chunkEntry.collocations[i].vi,
      );
      if (es?.trim()) collocations[i] = { ...collocations[i], es: es.trim() };
    }

    for (let i = 0; i < chunks.length; i += 1) {
      if (chunks[i].es?.trim()) continue;
      const en = chunks[i].en ?? chunkEntry.chunks[i].en;
      const exIdx = parsedAll.findIndex(
        (row) => row.en.trim().toLowerCase() === en.trim().toLowerCase(),
      );
      const fromExample =
        exIdx >= 0 ? example_translations[exIdx]?.es?.trim() : null;
      if (fromExample) {
        chunks[i] = { ...chunks[i], es: fromExample };
        continue;
      }
      const esLine = await translateExampleToSpanishWithGemini(
        en,
        detail.word,
        detail.word_type,
        glossForPrompt,
      );
      if (esLine?.trim()) chunks[i] = { ...chunks[i], es: esLine.trim() };
    }

    phrase_translations = { collocations, chunks };
  }

  return { meanings, example_translations, phrase_translations };
}
