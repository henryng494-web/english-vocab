import { getStandardVocab } from "@/data/standard-vocab";
import { serializeExamples } from "@/lib/parse-examples";
import { getImportanceTier } from "@/lib/word-rank";

export function standardToDiscoverFieldsWithRank(
  word: string,
  presetRank: number | undefined,
) {
  const entry = getStandardVocab(word);
  if (!entry) return null;
  const rank = presetRank ?? 5000;
  return {
    word,
    rank,
    importance_tier: getImportanceTier(rank),
    has_details: true,
    phonetic: entry.phonetic,
    word_type: entry.pos,
    vietnamese_meaning: entry.meaning,
    english_definition: entry.definition,
    examples: serializeExamples(entry.examples),
    image_url: null as string | null,
    collocations: null as string | null,
    from_static: true,
    search_keyword: entry.searchKeyword,
  };
}
