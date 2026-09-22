import { getBundledEsContent } from "@/lib/learner-content/bundled-es";
import { getBundledViContent } from "@/lib/learner-content/bundled-vi";
import type { LearnerLocale } from "@/lib/learner-locale";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import type { WordEnrichment } from "@/lib/gemini-core";
import { parseExamples } from "@/lib/parse-examples";
import { getImportanceTier } from "@/lib/word-rank";
import { parseVietnameseMeanings } from "@/lib/word-meanings";

/** Map bundled store slice → enrichment (same path as curated VI standard cards). */
export function enrichmentFromBundledStore(
  word: string,
  rank: number,
  locale: LearnerLocale,
): WordEnrichment | null {
  const slice =
    locale === DEFAULT_LEARNER_LOCALE
      ? getBundledViContent(word)
      : getBundledEsContent(word);
  if (!slice?.vietnamese_meaning?.trim()) return null;

  const frequencyRank = rank > 0 ? rank : 10000;
  const meanings = parseVietnameseMeanings(slice.vietnamese_meaning);
  return {
    phonetic: slice.phonetic?.trim() || `/${word}/`,
    wordType: slice.word_type?.trim() || "unknown",
    vietnameseMeaning: meanings[0] ?? slice.vietnamese_meaning,
    vietnameseMeanings: meanings,
    englishDefinition:
      slice.english_definition?.trim() ||
      slice.vietnamese_meaning.trim(),
    examples: parseExamples(slice.examples),
    searchKeyword: slice.search_keyword?.trim() || word,
    frequencyRank,
    importanceTier: getImportanceTier(frequencyRank) as WordEnrichment["importanceTier"],
    register: slice.register ?? null,
    collocations: slice.collocations ?? null,
    fromFallback: false,
    fromStatic: true,
    source: "static",
  };
}
