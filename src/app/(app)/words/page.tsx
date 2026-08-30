"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { WordLibrarySortBar } from "@/components/words/WordLibrarySortBar";
import { WordList } from "@/components/words/WordList";
import { useI18n } from "@/hooks/use-i18n";
import {
  getLocalWordsByFilter,
  type WordLibraryFilter,
  type WordLibrarySort,
} from "@/lib/learning-storage";
import { getStaticVietnamese } from "@/lib/static-vietnamese";
import type { LearningStatus } from "@/types/database";

function WordLibraryFilterTabs({
  filter,
  onFilterChange,
}: {
  filter: WordLibraryFilter;
  onFilterChange: (next: WordLibraryFilter) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="word-library__filters" role="tablist" aria-label={t("library.filterAria")}>
      <button
        type="button"
        role="tab"
        aria-selected={filter === "known"}
        className={`word-library__filter${filter === "known" ? " is-active" : ""}`}
        onClick={() => onFilterChange("known")}
      >
        {t("library.filterKnown")}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={filter === "review"}
        className={`word-library__filter${filter === "review" ? " is-active" : ""}`}
        onClick={() => onFilterChange("review")}
      >
        {t("library.filterReview")}
      </button>
    </div>
  );
}

function WordsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const filter = parseFilter(searchParams.get("filter"));
  const sort = parseSort(searchParams.get("sort"));
  const [tick, setTick] = useState(0);

  const meta = useMemo(() => {
    if (filter === "known") {
      return {
        title: t("library.knownTitle"),
        emptyTitle: t("library.knownEmpty"),
        emptyHint: t("library.knownHint"),
      };
    }
    return {
      title: t("library.reviewTitle"),
      emptyTitle: t("library.reviewEmpty"),
      emptyHint: t("library.reviewHint"),
    };
  }, [filter, t]);

  const setFilter = useCallback(
    (next: WordLibraryFilter) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filter", next);
      router.replace(`/words?${params.toString()}`);
    },
    [router, searchParams],
  );

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
      badge:
        filter === "review" ? statusBadge(entry.status, t) : t("status.known"),
    }));
  }, [filter, sort, t, tick]);

  return (
    <>
      <AppHeader title={meta.title} leading={<AppMenuButton />} />

      <div className="word-library page-scroll px-4">
        <WordLibraryFilterTabs filter={filter} onFilterChange={setFilter} />
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

function statusBadge(
  status: LearningStatus,
  t: (key: import("@/lib/i18n/messages").MessageKey) => string,
): string {
  switch (status) {
    case "mastered":
      return t("status.known");
    case "new":
      return t("status.new");
    case "learning":
      return t("status.learning");
    case "need_review":
      return t("status.due");
    default:
      return status;
  }
}

function parseFilter(value: string | null): WordLibraryFilter {
  return value === "known" ? "known" : "review";
}

function parseSort(value: string | null): WordLibrarySort {
  return value === "rank" ? "rank" : "recent";
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
