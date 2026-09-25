"use client";

import { useEffect, useMemo, useState } from "react";
import { WordCardHeader } from "@/components/flashcard/WordCardHeader";
import { WordCardDetails } from "@/components/flashcard/WordCardDetails";
import { WordImage } from "@/components/word/WordImage";
import { useAppSettings } from "@/context/AppSettingsContext";
import {
  discoverDataNeedsSpanishHydration,
  examplesForCard,
  primaryGlossForCard,
} from "@/lib/card-localized-display";
import { displayPhonetic } from "@/lib/phonetic";
import { isCardContentReady } from "@/lib/discover-word-cache";
import { ensureCardSpanishContent } from "@/lib/ensure-card-locale-content";
import type { WordFamilyMember } from "@/types/database";
import type { WordRegister } from "@/lib/word-meanings";
import { resolveWordRegister } from "@/lib/word-meanings";
import { buildWordFamilyEntries } from "@/lib/word-family-display";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";

export type DiscoverWordData = {
  word: string;
  rank: number;
  importance_tier: string;
  phonetic?: string | null;
  word_type?: string | null;
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  examples?: string | null;
  meanings?: LocalizedMeaningsJson | null;
  example_translations?: ExampleTranslationsJson | null;
  image_url?: string | null;
  collocations?: string | null;
  register?: WordRegister | null;
  search_keyword?: string | null;
  word_family?: WordFamilyMember[] | null;
  family_members?: string[] | null;
  similar_words?: string[] | null;
};

type DiscoverCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
  /** e.g. "2 / 194" — shown on the image top-right. */
  imageBadge?: string;
  autoSpeak?: boolean;
  hintGraceMs?: number;
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

export function DiscoverCard({
  data,
  loading,
  imageBadge,
  autoSpeak = true,
  hintGraceMs,
}: DiscoverCardProps) {
  const { learnerLocale } = useAppSettings();
  const [cardData, setCardData] = useState(data);
  const needsSpanishHydration =
    learnerLocale === "es" && discoverDataNeedsSpanishHydration(data);
  const [localeLoading, setLocaleLoading] = useState(needsSpanishHydration);

  useEffect(() => {
    setCardData(data);
  }, [data]);

  useEffect(() => {
    const needs =
      learnerLocale === "es" && discoverDataNeedsSpanishHydration(data);
    if (!needs) {
      setLocaleLoading(false);
      return;
    }
    let cancelled = false;
    setLocaleLoading(true);
    void ensureCardSpanishContent(data, learnerLocale).then((updated) => {
      if (cancelled) return;
      if (updated) setCardData(updated);
      setLocaleLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [
    data.word,
    data.examples,
    data.meanings,
    data.example_translations,
    data.vietnamese_meaning,
    learnerLocale,
  ]);

  const detailsLoading =
    loading && !isCardContentReady(cardData, cardData.word);
  const phonetic = displayPhonetic(cardData.word, cardData.phonetic);
  const register = resolveWordRegister(cardData);
  const wordFamily =
    cardData.word_family && cardData.word_family.length > 0
      ? cardData.word_family
      : buildWordFamilyEntries(
          cardData.word,
          cardData.vietnamese_meaning,
          cardData.word_type,
        );

  const meaningSkeleton =
    learnerLocale === "es" &&
    localeLoading &&
    discoverDataNeedsSpanishHydration(cardData);
  const displayMeaning = useMemo(
    () => primaryGlossForCard(cardData, learnerLocale),
    [cardData, learnerLocale],
  );
  const displayExamples = useMemo(
    () => examplesForCard(cardData, learnerLocale),
    [cardData, learnerLocale],
  );
  const meaningForUi = meaningSkeleton ? null : displayMeaning;

  return (
    <div className="discover-card discover-card--compact grid h-full min-h-0 w-full overflow-hidden rounded-2xl border-2 shadow-lg">
      <CardImage
        word={cardData.word}
        imageUrl={cardData.image_url}
        searchKeyword={cardData.search_keyword}
        wordType={cardData.word_type}
        meaning={meaningForUi ?? cardData.vietnamese_meaning}
        badge={imageBadge}
      />

      <div className="discover-card__body discover-card__body--compact flex min-h-0 flex-col overflow-hidden p-3">
        <WordCardHeader
          word={cardData.word}
          phonetic={phonetic}
          wordType={cardData.word_type}
          meanings={meaningForUi}
          register={register}
          loadingPhonetic={detailsLoading && !phonetic}
          loadingMeaning={meaningSkeleton}
          autoSpeak={autoSpeak}
        />

        <WordCardDetails
          key={cardData.word.trim().toLowerCase()}
          word={cardData.word}
          examples={cardData.examples}
          displayExamples={displayExamples}
          wordType={cardData.word_type}
          meaning={meaningForUi}
          register={register}
          englishDefinition={cardData.english_definition}
          family={wordFamily}
          similarWords={cardData.similar_words}
          loading={detailsLoading}
          localeLoadingExamples={meaningSkeleton}
          hintGraceMs={hintGraceMs}
        />
      </div>
    </div>
  );
}
