"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { WordLibrarySortBar } from "@/components/words/WordLibrarySortBar";
import { WordList } from "@/components/words/WordList";
import {
  getLocalWordsByFilter,
  type WordLibraryFilter,
  type WordLibrarySort,
} from "@/lib/learning-storage";
import { getStaticVietnamese } from "@/lib/static-vietnamese";
import type { LearningStatus } from "@/types/database";
import Link from "next/link";

function statusBadge(status: LearningStatus): string {
  switch (status) {
    case "mastered":
      return "Known";
    case "new":
      return "New";
    case "learning":
      return "Learning";
    case "need_review":
      return "Due";
    default:
      return status;
  }
}

function filterMeta(filter: WordLibraryFilter) {
  if (filter === "known") {
    return {
      title: "You know",
      emptyTitle: "No words marked as known yet",
      emptyHint: "Tap Already know on Journey when a word is familiar.",
    };
  }
  return {
    title: "In review",
    emptyTitle: "No words in review yet",
    emptyHint: "Tap Learn this on Journey to add words to your review queue.",
  };
}

function parseFilter(value: string | null): WordLibraryFilter {
  return value === "known" ? "known" : "review";
}

function parseSort(value: string | null): WordLibrarySort {
  return value === "rank" ? "rank" : "recent";
}

function WordsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = parseFilter(searchParams.get("filter"));
  const sort = parseSort(searchParams.get("sort"));
  const meta = filterMeta(filter);
  const [tick, setTick] = useState(0);

  const setSort = useCallback(
    (next: WordLibrarySort) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filter", filter);
      params.set("sort", next);
      router.replace(`/words?${params.toString()}`);
    },
    [filter, router, searchParams],
  );

  useEffect(() => {
    const refresh = () => setTick((value) => value + 1);
    window.addEventListener("vocab-learning-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("vocab-learning-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const rows = useMemo(() => {
    void tick;
    return getLocalWordsByFilter(filter, sort).map((entry) => ({
      word: entry.word,
      subtitle: getStaticVietnamese(entry.word) ?? null,
      badge: filter === "review" ? statusBadge(entry.status) : "Known",
    }));
  }, [filter, sort, tick]);

  return (
    <>
      <AppHeader
        title={meta.title}
        peekMascot={filter === "known" ? "crocodile" : "tiger"}
        leading={
          <Link href="/discover" className="app-header__icon-btn" aria-label="Back">
            ←
          </Link>
        }
      />

      <div className="word-library page-scroll px-4">
        <WordLibrarySortBar
          count={rows.length}
          sort={sort}
          onSortChange={setSort}
        />
        <WordList
          rows={rows}
          emptyTitle={meta.emptyTitle}
          emptyHint={meta.emptyHint}
          libraryContext={{ filter, sort }}
        />
      </div>
    </>
  );
}

export default function WordsPage() {
  return (
    <div className="app-screen app-screen--home">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        }
      >
        <WordsPageContent />
      </Suspense>
    </div>
  );
}
