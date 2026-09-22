import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import type { LearnerLocale } from "@/lib/learner-locale";

/** One locale’s gloss + examples for a headword (same shape as card fields). */
export type LearnerContentSlice = Pick<
  DiscoverWordData,
  | "phonetic"
  | "word_type"
  | "vietnamese_meaning"
  | "english_definition"
  | "examples"
  | "search_keyword"
  | "collocations"
  | "register"
>;

export type LearnerStoreMeta = {
  locale: LearnerLocale;
  /** Bump when store layout or migration rules change. */
  version: number;
};

export const LEARNER_CONTENT_STORE_VERSION = 1;
