import { standardToDiscoverFieldsWithRank } from "@/lib/standard-discover-fields";
import { getPresetRank } from "@/data/preset-word-details";
import type { WordEnrichment } from "@/lib/gemini";
import { serializeExamples } from "@/lib/parse-examples";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { resolveWordImageUrl } from "@/lib/unsplash";
import { normalizeWordType } from "@/lib/word-type";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import {
  encodeRegisterCollocation,
  serializeVietnameseMeanings,
} from "@/lib/word-meanings";
import { withWordFamily } from "@/lib/word-family-display";
import { normalizeSimilarWords } from "@/lib/word-synonyms";
import { getFamilyDisplayWords } from "@/lib/word-family";

export function enrichmentToDiscoverWord(
  word: string,
  enrichment: WordEnrichment,
  imageUrl?: string | null,
) {
  const keyword = resolveImageSearchKeyword(word, {
    searchKeyword: enrichment.searchKeyword,
    meaning: enrichment.vietnameseMeaning,
    englishDefinition: enrichment.englishDefinition,
    pos: enrichment.wordType,
  });
  return withWordFamily({
    word,
    phonetic: enrichment.phonetic,
    word_type:
      normalizeWordType(enrichment.wordType, word) ?? enrichment.wordType,
    vietnamese_meaning: sanitizeVietnameseText(
      serializeVietnameseMeanings(
        enrichment.vietnameseMeanings?.length
          ? enrichment.vietnameseMeanings
          : [enrichment.vietnameseMeaning],
      ),
    ),
    english_definition: enrichment.englishDefinition,
    examples: serializeExamples(enrichment.examples),
    collocations:
      enrichment.collocations ??
      encodeRegisterCollocation(enrichment.register),
    register: enrichment.register,
    image_url: resolveWordImageUrl(word, imageUrl, keyword, enrichment.wordType),
    rank: enrichment.frequencyRank,
    importance_tier: enrichment.importanceTier,
    from_fallback: enrichment.fromFallback ?? false,
    from_static: enrichment.fromStatic ?? false,
    source: enrichment.source,
    search_keyword: keyword,
    similar_words: normalizeSimilarWords(
      enrichment.similarWords,
      word,
      getFamilyDisplayWords(word),
    ),
  });
}

export function standardToDiscoverFields(word: string) {
  return standardToDiscoverFieldsWithRank(word, getPresetRank(word));
}
