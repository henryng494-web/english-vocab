"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { WordLibrarySortBar } from "@/components/words/WordLibrarySortBar";
import { WordList } from "@/components/words/WordList";
import {
  getLocalWordsByFilter,
  type WordLibraryFilter,
  type WordLibrarySort,
} from "@/lib/learning-storage";
import { getStaticVietnamese } from "@/lib/static-vietnamese";
import type { LearningStatus } from "@/types/database";

function statusBadge(status: LearningStatus): string {
  switch (status) {
    case "mastered":
      return "Đã biết";
    case "new":
      return "Mới";
    case "learning":
      return "Đang học";
    case "need_review":
      return "Đến hạn";
    default:
      return status;
  }
}

function filterMeta(filter: WordLibraryFilter) {
  if (filter === "known") {
    return {
      title: "Thư viện · Đã biết",
      emptyTitle: "Chưa có từ nào được đánh dấu đã biết",
      emptyHint: 'Nhấn "Đã biết rồi" trên Hành trình khi bạn thuộc từ đó.',
    };
  }
  return {
    title: "Thư viện · Đang ôn",
    emptyTitle: "Chưa có từ đang ôn",
    emptyHint: 'Nhấn "Học từ này" trên Hành trình để thêm từ vào lịch ôn.',
  };
}

function parseFilter(value: string | null): WordLibraryFilter {
  return value === "known" ? "known" : "review";
}

function parseSort(value: string | null): WordLibrarySort {
  return value === "rank" ? "rank" : "recent";
}

function WordLibraryFilterTabs({
  filter,
  onFilterChange,
}: {
  filter: WordLibraryFilter;
  onFilterChange: (next: WordLibraryFilter) => void;
}) {
  return (
    <div className="word-library__filters" role="tablist" aria-label="Lọc thư viện">
      <button
        type="button"
        role="tab"
        aria-selected={filter === "known"}
        className={`word-library__filter${filter === "known" ? " is-active" : ""}`}
        onClick={() => onFilterChange("known")}
      >
        Đã biết
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={filter === "review"}
        className={`word-library__filter${filter === "review" ? " is-active" : ""}`}
        onClick={() => onFilterChange("review")}
      >
        Đang ôn
      </button>
    </div>
  );
}

function WordsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = parseFilter(searchParams.get("filter"));
  const sort = parseSort(searchParams.get("sort"));
  const meta = filterMeta(filter);
  const [tick, setTick] = useState(0);

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
      badge: filter === "review" ? statusBadge(entry.status) : "Đã biết",
    }));
  }, [filter, sort, tick]);

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
