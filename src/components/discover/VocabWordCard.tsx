"use client";

import {
  DiscoverCard,
  type DiscoverWordData,
} from "@/components/discover/DiscoverCard";
import { resolveWordRegister } from "@/lib/word-meanings";
import type { VocabWord } from "@/types/database";

type VocabWordCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
  /** e.g. "8 / 163" — shown on the image top-right. */
  imageBadge?: string;
  className?: string;
};

export function vocabWordToDiscoverData(word: VocabWord): DiscoverWordData {
  return {
    word: word.word,
    rank: word.rank,
    importance_tier: word.importance_tier,
    phonetic: word.phonetic,
    word_type: word.word_type,
    vietnamese_meaning: word.vietnamese_meaning,
    english_definition: word.english_definition,
    examples: word.examples,
    image_url: word.image_url,
    collocations: word.collocations,
    register: resolveWordRegister(word),
    search_keyword: word.search_keyword,
    word_family: word.word_family,
  };
}

/** Standard vocabulary card shell used across Journey, Review, and Word detail. */
export function VocabWordCard({
  data,
  loading,
  imageBadge,
  className,
}: VocabWordCardProps) {
  return (
    <div className={`journey-card-slot${className ? ` ${className}` : ""}`}>
      <DiscoverCard data={data} loading={loading} imageBadge={imageBadge} />
    </div>
  );
}
