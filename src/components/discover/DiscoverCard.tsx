"use client";

import Image from "next/image";
import { WordCardHeader } from "@/components/flashcard/WordCardHeader";
import { WordCardDetails } from "@/components/flashcard/WordCardDetails";
import { displayPhonetic } from "@/lib/phonetic";
import { useWordImageSrc } from "@/lib/use-word-image-src";
import type { WordFamilyMember } from "@/types/database";

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
  search_keyword?: string | null;
  word_family?: WordFamilyMember[] | null;
  family_members?: string[] | null;
};

type DiscoverCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
  /** Fit card in a fixed viewport panel without scrolling. */
  compact?: boolean;
  /** e.g. "2 / 194" — shown on the image top-right when compact. */
  imageBadge?: string;
};

function CardImage({
  word,
  imageUrl,
  searchKeyword,
  wordType,
  compact = false,
  badge,
}: {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  compact?: boolean;
  badge?: string;
}) {
  const { src, onError } = useWordImageSrc(
    word,
    imageUrl,
    searchKeyword,
    wordType,
  );

  return (
    <div
      className={`relative w-full ${
        compact ? "card-image-frame h-full min-h-0" : "h-44 shrink-0 bg-gradient-to-br from-primary-100 via-primary to-primary-hover"
      }`}
    >
      <Image
        src={src}
        alt={word}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
        priority
        unoptimized
        onError={onError}
      />
      {compact && badge ? (
        <span className="card-image-badge" aria-label={`Word ${badge}`}>
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export function DiscoverCard({
  data,
  loading,
  compact = false,
  imageBadge,
}: DiscoverCardProps) {
  const detailsLoading = loading && !data.vietnamese_meaning?.trim();
  const phonetic = displayPhonetic(data.word, data.phonetic);

  return (
    <div
      className={`discover-card w-full overflow-hidden rounded-2xl border-2 shadow-lg${
        compact ? " grid h-full min-h-0 grid-rows-2" : " border-primary-200 bg-surface"
      }`}
    >
      <CardImage
        word={data.word}
        imageUrl={data.image_url}
        searchKeyword={data.search_keyword}
        wordType={data.word_type}
        compact={compact}
        badge={imageBadge}
      />

      <div
        className={
          compact
            ? "discover-card__body discover-card__body--compact flex min-h-0 flex-col overflow-hidden p-3"
            : "space-y-4 p-6"
        }
      >
        <WordCardHeader
          word={data.word}
          phonetic={phonetic}
          wordType={data.word_type}
          loadingPhonetic={detailsLoading && !phonetic}
        />

        <WordCardDetails
          word={data.word}
          meaning={data.vietnamese_meaning}
          examples={data.examples}
          wordType={data.word_type}
          family={data.word_family}
          compact={compact}
          loading={detailsLoading}
        />
      </div>
    </div>
  );
}
