"use client";

import { VocabWordCard } from "@/components/discover/VocabWordCard";
import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { JungleMascot } from "@/components/mascot/JungleMascot";
import {
  DISCOVER_WORD_CACHE_VERSION,
  isCacheEntryValid,
  loadPersistedWordCache,
  persistWordCache,
} from "@/lib/discover-word-cache";
import { mapApiWordToDiscoverData } from "@/lib/discover-fetch";
import { examplesNeedRegeneration } from "@/lib/repair-word-examples";
import { refreshSingleWordImage } from "@/lib/refresh-stale-word-images";
import { shouldRefreshImageUrl } from "@/lib/unsplash";
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
    const cachedMisaligned = Boolean(
      cached &&
        examplesNeedRegeneration(
          word,
          cached.examples,
          cached.word_type,
          cached.vietnamese_meaning,
        ),
    );
    if (cachedMisaligned) {
      cache.delete(word);
      persistWordCache(cache);
    }

    const hadValidCache = Boolean(
      cached &&
        !cachedMisaligned &&
        isCacheEntryValid(cached, word),
    );
    if (hadValidCache) {
      setData(cached!);
      setLoading(shouldRefreshImageUrl(cached!.image_url, word));
    } else {
      setLoading(true);
    }

    let cancelled = false;
    setError(null);

    const rank = getPresetRank(word) ?? 10000;

    const fetchWord = (forceRepair: boolean): Promise<void> => {
      const params = new URLSearchParams({
        word,
        rank: String(rank),
        skipGemini: "false",
        cacheVersion: String(DISCOVER_WORD_CACHE_VERSION),
      });
      if (forceRepair) {
        params.set("forceRepair", "true");
      }

      return fetch(`/api/discover/word?${params}`, { cache: "no-store" })
        .then(async (res) => {
          const payload = await res.json();
          if (!res.ok) {
            throw new Error(payload.details ?? payload.error ?? "Failed to load word");
          }
          const apiWord = payload.word as Record<string, unknown>;
          const loaded = mapApiWordToDiscoverData(
            {
              word,
              rank,
              importance_tier: getImportanceTier(rank),
            },
            apiWord,
          );
          if (!loaded.vietnamese_meaning?.trim()) {
            throw new Error(`Incomplete data for "${word}"`);
          }
          if (
            !forceRepair &&
            examplesNeedRegeneration(
              word,
              loaded.examples,
              loaded.word_type,
              loaded.vietnamese_meaning,
            )
          ) {
            return fetchWord(true);
          }
          if (cancelled) return;
          if (
            examplesNeedRegeneration(
              word,
              loaded.examples,
              loaded.word_type,
              loaded.vietnamese_meaning,
            )
          ) {
            throw new Error(
              `Could not repair examples for "${word}" — try again in a moment.`,
            );
          }
          cache.set(word, loaded);
          persistWordCache(cache);
          setData(loaded);
        });
    };

    void fetchWord(cachedMisaligned)
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load word");
        if (!hadValidCache) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [word]);

  useEffect(() => {
    if (!data?.word || !data.vietnamese_meaning?.trim()) return;

    let cancelled = false;
    void refreshSingleWordImage({
      word: data.word,
      imageUrl: data.image_url,
      meaning: data.vietnamese_meaning,
      wordType: data.word_type,
      searchKeyword: data.search_keyword,
    }).then((imageUrl) => {
      if (cancelled || !imageUrl || imageUrl === data.image_url) return;
      setData((prev) => (prev ? { ...prev, image_url: imageUrl } : prev));
      const cache = loadPersistedWordCache();
      const existing = cache.get(data.word);
      if (existing) {
        cache.set(data.word, { ...existing, image_url: imageUrl });
        persistWordCache(cache);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [data?.word, data?.image_url, data?.vietnamese_meaning, data?.word_type, data?.search_keyword]);

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

      <div className="journey-panel px-4">
        {statusText ? (
          <p className="word-detail__status">{statusText}</p>
        ) : null}

        {error ? (
          <div className="word-detail__empty">
            <JungleMascot character="monkey" size={72} className="mb-3" />
            <p className="text-sm text-foreground/70">{error}</p>
          </div>
        ) : (
          <div className="journey-main">
            <VocabWordCard
              data={
                data ?? {
                  word,
                  rank: getPresetRank(word) ?? 10000,
                  importance_tier: getImportanceTier(getPresetRank(word) ?? 10000),
                }
              }
              loading={loading}
            />
            {libraryContext && libraryNeighbors ? (
              <WordLibraryPager
                context={libraryContext}
                neighbors={libraryNeighbors}
              />
            ) : null}
          </div>
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
