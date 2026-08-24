"use client";

import {
  DiscoverCard,
  type DiscoverWordData,
} from "@/components/discover/DiscoverCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { CoachDog } from "@/components/mascot/CoachDog";
import {
  DISCOVER_WORD_CACHE_VERSION,
  isCacheEntryValid,
  isWordDetailComplete,
  loadPersistedWordCache,
  persistWordCache,
} from "@/lib/discover-word-cache";
import { capitalizeFirst } from "@/lib/format-text";
import { getLocalWordStatus } from "@/lib/learning-storage";
import { getPresetRank } from "@/data/preset-vocabulary";
import { getImportanceTier } from "@/lib/word-rank";
import { WordLibraryPager } from "@/components/words/WordLibraryPager";
import {
  buildWordLibraryListHref,
  getWordLibraryNeighbors,
  parseWordLibraryNavContext,
} from "@/lib/word-library-nav";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function statusLabel(status: ReturnType<typeof getLocalWordStatus>): string | null {
  if (!status) return null;
  switch (status) {
    case "mastered":
      return "You know this word";
    case "new":
      return "In review · New";
    case "learning":
      return "In review · Learning";
    case "need_review":
      return "In review · Due";
    default:
      return null;
  }
}

function WordDetailPageContent() {
  const params = useParams<{ word: string }>();
  const searchParams = useSearchParams();
  const word = decodeURIComponent(params.word ?? "").trim().toLowerCase();
  const libraryContext = parseWordLibraryNavContext(searchParams);
  const libraryNeighbors = useMemo(() => {
    if (!word || !libraryContext) return null;
    return getWordLibraryNeighbors(word, libraryContext);
  }, [libraryContext, word]);
  const [data, setData] = useState<DiscoverWordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const localStatus = word ? getLocalWordStatus(word) : null;
  const statusText = statusLabel(localStatus);

  useEffect(() => {
    if (!word) {
      setError("Word not found");
      setLoading(false);
      return;
    }

    const cache = loadPersistedWordCache();
    const cached = cache.get(word);
    if (isWordDetailComplete(cached, word)) {
      setData(cached!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const rank = getPresetRank(word) ?? 10000;
    const params = new URLSearchParams({
      word,
      rank: String(rank),
      skipGemini: "false",
      cacheVersion: String(DISCOVER_WORD_CACHE_VERSION),
    });

    fetch(`/api/discover/word?${params}`, { cache: "no-store" })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.details ?? payload.error ?? "Failed to load word");
        }
        const apiWord = payload.word as Record<string, unknown>;
        const loaded: DiscoverWordData = {
          word,
          rank: Number(apiWord.rank ?? rank),
          importance_tier: String(
            apiWord.importance_tier ?? getImportanceTier(rank),
          ),
          phonetic: apiWord.phonetic as string | null | undefined,
          word_type: apiWord.word_type as string | null | undefined,
          vietnamese_meaning: apiWord.vietnamese_meaning as string | null | undefined,
          english_definition: apiWord.english_definition as string | null | undefined,
          examples: apiWord.examples as string | null | undefined,
          image_url: (apiWord.image_url as string | null | undefined) ?? null,
          collocations: apiWord.collocations as string | null | undefined,
          search_keyword: (apiWord.search_keyword as string | null | undefined) ?? word,
          word_family: Array.isArray(apiWord.word_family)
            ? (apiWord.word_family as DiscoverWordData["word_family"])
            : null,
        };
        if (!isCacheEntryValid(loaded, word)) {
          throw new Error(`Incomplete data for "${word}"`);
        }
        if (cancelled) return;
        cache.set(word, loaded);
        persistWordCache(cache);
        setData(loaded);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load word");
        setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [word]);

  return (
    <div className="app-screen app-screen--journey">
      <AppHeader
        title={word ? capitalizeFirst(word) : "Word"}
        leading={
          libraryContext ? (
            <Link
              href={buildWordLibraryListHref(libraryContext)}
              className="app-header__icon-btn"
              aria-label="Back to word list"
            >
              ←
            </Link>
          ) : (
            <button
              type="button"
              className="app-header__icon-btn"
              aria-label="Back"
              onClick={() => window.history.back()}
            >
              ←
            </button>
          )
        }
        trailing={
          <Link href="/search" className="app-header__icon-btn" aria-label="Search">
            🔍
          </Link>
        }
      />

      <div className="word-detail px-4">
        {statusText ? (
          <p className="word-detail__status">{statusText}</p>
        ) : null}

        {error ? (
          <div className="word-detail__empty">
            <CoachDog pose="sad" size={72} className="mb-3" />
            <p className="text-sm text-foreground/70">{error}</p>
          </div>
        ) : (
          <>
            <div className="word-detail__card">
              <div className="journey-card-slot">
                <DiscoverCard
                  data={
                    data ?? {
                      word,
                      rank: getPresetRank(word) ?? 10000,
                      importance_tier: getImportanceTier(getPresetRank(word) ?? 10000),
                    }
                  }
                  loading={loading}
                  compact
                />
              </div>
            </div>
            {libraryContext && libraryNeighbors ? (
              <WordLibraryPager
                context={libraryContext}
                neighbors={libraryNeighbors}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default function WordDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="app-screen app-screen--journey flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
        </div>
      }
    >
      <WordDetailPageContent />
    </Suspense>
  );
}
