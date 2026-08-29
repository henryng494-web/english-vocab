"use client";

import { WordCardHeader } from "@/components/flashcard/WordCardHeader";
import { WordCardDetails } from "@/components/flashcard/WordCardDetails";
import { WordImage } from "@/components/word/WordImage";
import { displayPhonetic } from "@/lib/phonetic";
import type { WordFamilyMember } from "@/types/database";
import type { WordRegister } from "@/lib/word-meanings";
import { resolveWordRegister } from "@/lib/word-meanings";

export type DiscoverWordData = {
  word: string;
  rank: number;
  importance_tier: string;
  phonetic?: string | null;
  word_type?: string | null;
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  examples?: string | null;
  image_url?: string | null;
  collocations?: string | null;
  register?: WordRegister | null;
  search_keyword?: string | null;
  word_family?: WordFamilyMember[] | null;
  family_members?: string[] | null;
};

type DiscoverCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
  /** e.g. "2 / 194" — shown on the image top-right. */
  imageBadge?: string;
};

function CardImage({
  word,
  imageUrl,
  searchKeyword,
  wordType,
  meaning,
  badge,
}: {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  badge?: string;
}) {
  return (
    <div className="card-image-frame relative h-full min-h-0 w-full">
      <WordImage
        word={word}
        imageUrl={imageUrl}
        searchKeyword={searchKeyword}
        wordType={wordType}
        meaning={meaning}
        priority
      />
      {badge ? (
        <span className="card-image-badge" aria-label={`Word ${badge}`}>
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export function DiscoverCard({ data, loading, imageBadge }: DiscoverCardProps) {
  const detailsLoading = loading && !data.vietnamese_meaning?.trim();
  const phonetic = displayPhonetic(data.word, data.phonetic);
  const register = resolveWordRegister(data);

  return (
    <div className="discover-card discover-card--compact grid h-full min-h-0 w-full overflow-hidden rounded-2xl border-2 shadow-lg">
      <CardImage
        word={data.word}
        imageUrl={data.image_url}
        searchKeyword={data.search_keyword}
        wordType={data.word_type}
        meaning={data.vietnamese_meaning}
        badge={imageBadge}
      />

      <div className="discover-card__body discover-card__body--compact flex min-h-0 flex-col overflow-hidden p-3">
        <WordCardHeader
          word={data.word}
          phonetic={phonetic}
          wordType={data.word_type}
          meanings={data.vietnamese_meaning}
          register={register}
          loadingPhonetic={detailsLoading && !phonetic}
        />

        <WordCardDetails
          word={data.word}
          examples={data.examples}
          wordType={data.word_type}
          family={data.word_family}
          loading={detailsLoading}
        />
      </div>
    </div>
  );
}
