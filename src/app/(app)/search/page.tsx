"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { WordList, type WordListRowData } from "@/components/words/WordList";
import { displayFontClass } from "@/lib/fonts";
import { getStaticVietnamese } from "@/lib/static-vietnamese";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initial);
  const [rows, setRows] = useState<WordListRowData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    const params = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    router.replace(`/search${params}`, { scroll: false });

    if (trimmed.length < 1) {
      setRows([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/words/search?q=${encodeURIComponent(trimmed)}&limit=40`,
          { cache: "no-store", signal: controller.signal },
        );
        const data = (await res.json()) as {
          words?: Array<{ word: string; rank: number }>;
        };
        setRows(
          (data.words ?? []).map((item) => ({
            word: item.word,
            subtitle: getStaticVietnamese(item.word) ?? null,
            meta: `Rank ${item.rank}`,
          })),
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, router]);

  return (
    <>
      <AppHeader
        title="Search"
        leading={
          <Link href="/discover" className="app-header__icon-btn" aria-label="Back">
            ←
          </Link>
        }
      />

      <div className="word-search page-scroll px-4">
        <label className="word-search__field">
          <span className="word-search__icon" aria-hidden>
            🔍
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search any word…"
            className="word-search__input"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        {loading ? (
          <div className="word-search__loading">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        ) : query.trim() ? (
          <>
            <p className={`word-library__count ${displayFontClass}`}>
              {rows.length} {rows.length === 1 ? "result" : "results"}
            </p>
            <WordList
              rows={rows}
              emptyTitle="No words found"
              emptyHint="Try another spelling or a shorter search."
            />
          </>
        ) : (
          <p className="word-search__hint">
            Type an English word to look it up in the vocabulary bank.
          </p>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="app-screen app-screen--home">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        }
      >
        <SearchPageContent />
      </Suspense>
    </div>
  );
}
