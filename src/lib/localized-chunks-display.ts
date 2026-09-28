import type { LearningChunkEntry, LearningChunkPhrase } from "@/data/demo-learning-chunks";
import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  exampleRowsFromDetail,
  findPhraseRow,
  parsePhraseTranslationsJson,
} from "@/lib/multilang-record";
import {
  pickExampleTranslationForLocale,
  pickPhraseTranslationForLocale,
} from "@/lib/localized-gloss";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import type { LearnerLocale } from "@/lib/learner-locale";
import { learnerLocaleNeedsHydration } from "@/lib/learner-locale";
import { parseExamples } from "@/lib/parse-examples";

function normalizeEn(text: string): string {
  return text.trim().toLowerCase();
}

function mapPhraseList(
  items: LearningChunkPhrase[],
  rows: ReturnType<typeof parsePhraseTranslationsJson>["collocations"],
  learnerLocale: LearnerLocale,
  exampleLocaleByEn: Map<string, string>,
  allowViFallback: boolean,
): LearningChunkPhrase[] {
  return items.map((item) => {
    const row = findPhraseRow(rows, item.en);
    if (learnerLocaleNeedsHydration(learnerLocale)) {
      const localized = row?.[learnerLocale]?.trim();
      if (localized) {
        return { ...item, vi: localized };
      }
      const fromExample = exampleLocaleByEn.get(normalizeEn(item.en));
      if (fromExample) {
        return { ...item, vi: fromExample };
      }
      if (allowViFallback) {
        const gloss = pickPhraseTranslationForLocale(
          row,
          learnerLocale,
          item.vi,
          { strictLearnerLocale: false },
        );
        if (gloss) return { ...item, vi: gloss };
      }
      return { ...item, vi: "" };
    }
    if (row?.vi?.trim() || item.vi) {
      return { ...item, vi: row?.vi?.trim() || item.vi };
    }
    return item;
  });
}

export function localizedLearningChunkEntry(
  data: Pick<
    DiscoverWordData,
    | "word"
    | "examples"
    | "word_type"
    | "vietnamese_meaning"
    | "phrase_translations"
    | "example_translations"
  >,
  learnerLocale: LearnerLocale,
  options?: { allowViFallback?: boolean },
): LearningChunkEntry | null {
  const allowViFallback = options?.allowViFallback ?? true;
  const base = resolveLearningChunks(data.word, {
    examples: data.examples,
    wordType: data.word_type,
    meaning: data.vietnamese_meaning,
  });
  if (!base) return null;

  const phrases = parsePhraseTranslationsJson(data.phrase_translations);
  const exampleRows = exampleRowsFromDetail({
    examples: data.examples ?? "",
    example_translations: data.example_translations,
  });
  const parsedExamples = parseExamples(data.examples ?? "");
  const exampleLocaleByEn = new Map<string, string>();
  parsedExamples.forEach((item, index) => {
    const localized = pickExampleTranslationForLocale(
      exampleRows,
      index,
      learnerLocale,
    );
    if (localized?.trim()) {
      exampleLocaleByEn.set(normalizeEn(item.en), localized.trim());
    }
  });

  return {
    collocations: mapPhraseList(
      base.collocations,
      phrases.collocations,
      learnerLocale,
      exampleLocaleByEn,
      allowViFallback,
    ),
    chunks: mapPhraseList(
      base.chunks,
      phrases.chunks,
      learnerLocale,
      exampleLocaleByEn,
      allowViFallback,
    ),
  };
}

export function chunkSecondaryGlossPending(
  data: Pick<
    DiscoverWordData,
    | "word"
    | "examples"
    | "word_type"
    | "vietnamese_meaning"
    | "phrase_translations"
    | "example_translations"
  >,
  learnerLocale: LearnerLocale,
): boolean {
  if (!learnerLocaleNeedsHydration(learnerLocale)) return false;
  const entry = resolveLearningChunks(data.word, {
    examples: data.examples,
    wordType: data.word_type,
    meaning: data.vietnamese_meaning,
  });
  if (!entry) return false;
  const localized = localizedLearningChunkEntry(data, learnerLocale, {
    allowViFallback: false,
  });
  if (!localized) return false;
  const check = (items: LearningChunkPhrase[]) =>
    items.some((item) => !item.vi.trim());
  return check(localized.collocations) || check(localized.chunks);
}
