import { getPresetRank } from "@/data/preset-word-details";
import { getStandardVocab } from "@/data/standard-vocab";
import type { WordEnrichment } from "@/lib/gemini";
import { serializeExamples } from "@/lib/parse-examples";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { resolveWordImageUrl } from "@/lib/unsplash";
import { getImportanceTier } from "@/lib/word-rank";
import { normalizeWordType } from "@/lib/word-type";

export function enrichmentToDiscoverWord(
  word: string,
  enrichment: WordEnrichment,
  imageUrl?: string | null,
) {
  const keyword = resolveImageSearchKeyword(word, {
    searchKeyword: enrichment.searchKeyword,
    meaning: enrichment.vietnameseMeaning,
    pos: enrichment.wordType,
  });
  return {
    word,
    phonetic: enrichment.phonetic,
    word_type:
      normalizeWordType(enrichment.wordType, word) ?? enrichment.wordType,
    vietnamese_meaning: enrichment.vietnameseMeaning,
    english_definition: enrichment.englishDefinition,
    examples: serializeExamples(enrichment.examples),
    collocations: enrichment.collocations,
    image_url: resolveWordImageUrl(word, imageUrl, keyword, enrichment.wordType),
    rank: enrichment.frequencyRank,
    importance_tier: enrichment.importanceTier,
    from_fallback: enrichment.fromFallback ?? false,
    from_static: enrichment.fromStatic ?? false,
    source: enrichment.source,
    search_keyword: keyword,
  };
}

export function standardToDiscoverFields(word: string) {
  const entry = getStandardVocab(word);
  if (!entry) return null;
  const rank = getPresetRank(word) ?? 5000;
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
