"use client";

import {
  DiscoverCard,
  type DiscoverWordData,
} from "@/components/discover/DiscoverCard";
import { applyMultilangToDiscoverWord } from "@/lib/discover-word-multilang";
import { readAppSettings } from "@/lib/app-settings";
import { resolveWordRegister } from "@/lib/word-meanings";
import type { UserLanguage } from "@/lib/user-language";
import type { VocabWord } from "@/types/database";

type VocabWordCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
  /** e.g. "8 / 163" — shown on the image top-right. */
  imageBadge?: string;
  className?: string;
  autoSpeak?: boolean;
  hintGraceMs?: number;
};

export function vocabWordToDiscoverData(
  word: VocabWord,
  userLanguage?: UserLanguage,
): DiscoverWordData {
  const locale =
    userLanguage ??
    (typeof window !== "undefined"
      ? readAppSettings().learnerLocale
      : "vi");
  const base: DiscoverWordData = {
    word: word.word,
    rank: word.rank,
    importance_tier: word.importance_tier,
    phonetic: word.phonetic,
    word_type: word.word_type,
    vietnamese_meaning: word.vietnamese_meaning,
    english_definition: word.english_definition,
    examples: word.examples,
    meanings: word.meanings,
    example_translations: word.example_translations,
    phrase_translations: word.phrase_translations,
    image_url: word.image_url,
    collocations: word.collocations,
    register: resolveWordRegister(word),
    search_keyword: word.search_keyword,
    word_family: word.word_family,
    similar_words: word.similar_words,
  };
  return applyMultilangToDiscoverWord(base, locale);
}

/** Standard vocabulary card shell used across Journey, Review, and Word detail. */
export function VocabWordCard({
  data,
  loading,
  imageBadge,
  className,
  autoSpeak = true,
  hintGraceMs,
}: VocabWordCardProps) {
  return (
    <div className={`journey-card-slot${className ? ` ${className}` : ""}`}>
      <DiscoverCard
        data={data}
        loading={loading}
        imageBadge={imageBadge}
        autoSpeak={autoSpeak}
        hintGraceMs={hintGraceMs}
      />
    </div>
  );
}
