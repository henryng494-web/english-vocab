import { SPANISH_LEARNER_OVERRIDES } from "@/data/learner-stores/es/overrides";
import { standardToDiscoverFields } from "@/lib/enrichment-helpers";
import type { LearnerContentSlice } from "@/lib/learner-content/types";

/** Spanish bundled store — curated overrides first; no Vietnamese leakage from standard-vocab. */
export function getBundledEsContent(word: string): LearnerContentSlice | null {
  const key = word.trim().toLowerCase();
  if (!key) return null;

  const override = SPANISH_LEARNER_OVERRIDES[key];
  if (override?.vietnamese_meaning?.trim()) {
    return {
      phonetic: override.phonetic ?? null,
      word_type: override.word_type ?? null,
      vietnamese_meaning: override.vietnamese_meaning,
      english_definition: override.english_definition ?? null,
      examples: override.examples ?? null,
      search_keyword: override.search_keyword ?? key,
      collocations: override.collocations ?? null,
      register: override.register ?? null,
    };
  }

  const standard = standardToDiscoverFields(key);
  if (!standard) return null;

  return {
    phonetic: standard.phonetic,
    word_type: standard.word_type,
    vietnamese_meaning: null,
    english_definition: standard.english_definition,
    examples: null,
    search_keyword: standard.search_keyword,
    collocations: null,
    register: null,
  };
}

export function hasBundledEsGloss(word: string): boolean {
  return Boolean(getBundledEsContent(word)?.vietnamese_meaning?.trim());
}
