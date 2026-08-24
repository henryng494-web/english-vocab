"use client";

import Link from "next/link";
import { capitalizeFirst } from "@/lib/format-text";
import { displayFontClass } from "@/lib/fonts";
import {
  buildWordLibraryDetailHref,
  type WordLibraryNavContext,
} from "@/lib/word-library-nav";

export type WordListRowData = {
  word: string;
  subtitle?: string | null;
  badge?: string | null;
  meta?: string | null;
};

type WordListProps = {
  rows: WordListRowData[];
  emptyTitle: string;
  emptyHint?: string;
  libraryContext?: WordLibraryNavContext;
};

function wordHref(word: string, libraryContext?: WordLibraryNavContext): string {
  if (!libraryContext) {
    return `/word/${encodeURIComponent(word.toLowerCase())}`;
  }
  return buildWordLibraryDetailHref(word, libraryContext);
}

export function WordList({
  rows,
  emptyTitle,
  emptyHint,
  libraryContext,
}: WordListProps) {
  if (rows.length === 0) {
    return (
      <div className="word-list-empty">
        <p className={`word-list-empty__title ${displayFontClass}`}>{emptyTitle}</p>
        {emptyHint ? (
          <p className="word-list-empty__hint">{emptyHint}</p>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="word-list">
      {rows.map((row) => (
        <li key={row.word}>
          <Link
            href={wordHref(row.word, libraryContext)}
            className="word-list__row"
          >
            <div className="word-list__main">
              <p className={`word-list__word ${displayFontClass}`}>
                {capitalizeFirst(row.word)}
              </p>
              {row.subtitle ? (
                <p className="word-list__subtitle">{row.subtitle}</p>
              ) : null}
            </div>
            <div className="word-list__side">
              {row.badge ? (
                <span className="word-list__badge">{row.badge}</span>
              ) : null}
              {row.meta ? (
                <span className="word-list__meta">{row.meta}</span>
              ) : null}
              <span className="word-list__chev" aria-hidden>
                ›
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
