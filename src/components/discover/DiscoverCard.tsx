"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { WordCardHeader } from "@/components/flashcard/WordCardHeader";
import { VocabExampleList } from "@/components/flashcard/VocabExampleList";
import { capitalizeFirst } from "@/lib/format-text";
import { parseExamples } from "@/lib/parse-examples";
import { displayPhonetic } from "@/lib/phonetic";
import {
  getDefaultLearningImageDataUrl,
  resolveWordImageUrl,
} from "@/lib/unsplash";

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
};

type DiscoverCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
};

function CardImage({
  word,
  imageUrl,
  searchKeyword,
  wordType,
}: {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
}) {
  const primarySrc = resolveWordImageUrl(
    word,
    imageUrl,
    searchKeyword,
    wordType,
  );
  const finalSrc = getDefaultLearningImageDataUrl(word, wordType);
  const [src, setSrc] = useState(primarySrc);

  useEffect(() => {
    setSrc(resolveWordImageUrl(word, imageUrl, searchKeyword, wordType));
  }, [word, imageUrl, searchKeyword, wordType]);

  return (
    <div className="relative h-44 w-full shrink-0 bg-gradient-to-br from-primary-100 via-primary to-primary-hover">
      <Image
        src={src}
        alt={word}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
        priority
        unoptimized
        onError={() => {
          if (src !== finalSrc) setSrc(finalSrc);
        }}
      />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-3 pt-1" aria-hidden>
      <div className="h-6 w-3/4 animate-pulse rounded bg-primary-50" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
    </div>
  );
}

export function DiscoverCard({ data, loading }: DiscoverCardProps) {
  const detailsLoading = loading && !data.vietnamese_meaning?.trim();
  const examples = detailsLoading ? [] : parseExamples(data.examples);
  const phonetic = displayPhonetic(data.word, data.phonetic);

  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-primary-200 bg-white shadow-lg">
      <CardImage
        word={data.word}
        imageUrl={data.image_url}
        searchKeyword={data.search_keyword}
        wordType={data.word_type}
      />

      <div className="space-y-4 p-6">
        <WordCardHeader
          word={data.word}
          phonetic={phonetic}
          wordType={data.word_type}
          loadingPhonetic={detailsLoading && !phonetic}
        />

        {detailsLoading ? (
          <DetailSkeleton />
        ) : (
          <>
            {data.vietnamese_meaning ? (
              <p className="text-lg font-semibold text-primary-700">
                {capitalizeFirst(data.vietnamese_meaning)}
              </p>
            ) : null}

            <VocabExampleList
              word={data.word}
              examples={examples}
              wordType={data.word_type}
              meaning={data.vietnamese_meaning}
            />
          </>
        )}
      </div>
    </div>
  );
}
