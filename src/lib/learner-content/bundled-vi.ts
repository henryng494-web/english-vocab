import { getStaticWordDetail } from "@/data/preset-word-details";
import { standardToDiscoverFields } from "@/lib/enrichment-helpers";
import { serializeExamples } from "@/lib/parse-examples";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import type { LearnerContentSlice } from "@/lib/learner-content/types";
import { getStaticVietnamese } from "@/lib/static-vietnamese";

/** Vietnamese bundled store — curated standard + preset JSON + static one-liners. */
export function getBundledViContent(word: string): LearnerContentSlice | null {
  const key = word.trim().toLowerCase();
  if (!key) return null;

  const standard = standardToDiscoverFields(key);
  if (standard?.vietnamese_meaning?.trim()) {
    return {
      phonetic: standard.phonetic,
      word_type: standard.word_type,
      vietnamese_meaning: standard.vietnamese_meaning,
      english_definition: standard.english_definition,
      examples: standard.examples,
      search_keyword: standard.search_keyword,
      collocations: null,
      register: null,
    };
  }

  const preset = getStaticWordDetail(key);
  if (preset?.vietnamese?.trim()) {
    return {
      phonetic: preset.ipa,
      word_type: preset.pos,
      vietnamese_meaning: preset.vietnamese.trim(),
      english_definition: preset.definition?.trim() ?? null,
      examples: serializeExamples(preset.examples),
      search_keyword: resolveImageSearchKeyword(key, {
        pos: preset.pos,
        meaning: preset.vietnamese,
        englishDefinition: preset.definition,
      }),
      collocations: null,
      register: null,
    };
  }

  const oneLiner = getStaticVietnamese(key);
  if (oneLiner) {
    return {
      phonetic: null,
      word_type: null,
      vietnamese_meaning: oneLiner,
      english_definition: null,
      examples: null,
      search_keyword: key,
      collocations: null,
      register: null,
    };
  }

  return null;
}

export function hasBundledViGloss(word: string): boolean {
  return Boolean(getBundledViContent(word)?.vietnamese_meaning?.trim());
}
