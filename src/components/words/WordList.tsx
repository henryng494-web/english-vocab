"use client";

import Link from "next/link";
import { capitalizeFirst } from "@/lib/format-text";
import { displayFontClass } from "@/lib/fonts";

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
};

export function WordList({ rows, emptyTitle, emptyHint }: WordListProps) {
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
            href={`/word/${encodeURIComponent(row.word.toLowerCase())}`}
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
