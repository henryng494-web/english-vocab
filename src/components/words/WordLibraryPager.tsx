"use client";

import Link from "next/link";
import { capitalizeFirst } from "@/lib/format-text";
import { displayFontClass } from "@/lib/fonts";
import {
  buildWordLibraryDetailHref,
  type WordLibraryNavContext,
  type WordLibraryNeighbors,
} from "@/lib/word-library-nav";

type WordLibraryPagerProps = {
  context: WordLibraryNavContext;
  neighbors: WordLibraryNeighbors;
};

export function WordLibraryPager({
  context,
  neighbors,
}: WordLibraryPagerProps) {
  if (neighbors.total <= 1 || neighbors.index < 0) return null;

  const prevHref = neighbors.prev
    ? buildWordLibraryDetailHref(neighbors.prev, context)
    : null;
  const nextHref = neighbors.next
    ? buildWordLibraryDetailHref(neighbors.next, context)
    : null;

  return (
    <nav
      className="word-detail__pager"
      aria-label="Browse words in this list"
    >
      {prevHref ? (
        <Link href={prevHref} className="word-detail__pager-btn">
          <span className="word-detail__pager-arrow" aria-hidden>
            ←
          </span>
          <span className="word-detail__pager-label">
            <span className="word-detail__pager-caption">Previous</span>
            <span className={`word-detail__pager-word ${displayFontClass}`}>
              {capitalizeFirst(neighbors.prev!)}
            </span>
          </span>
        </Link>
      ) : (
        <span
          className="word-detail__pager-btn word-detail__pager-btn--disabled"
          aria-hidden
        >
          <span className="word-detail__pager-arrow">←</span>
          <span className="word-detail__pager-label">
            <span className="word-detail__pager-caption">Previous</span>
          </span>
        </span>
      )}

      {nextHref ? (
        <Link
          href={nextHref}
          className="word-detail__pager-btn word-detail__pager-btn--next"
        >
          <span className="word-detail__pager-label">
            <span className="word-detail__pager-caption">Next</span>
            <span className={`word-detail__pager-word ${displayFontClass}`}>
              {capitalizeFirst(neighbors.next!)}
            </span>
          </span>
          <span className="word-detail__pager-arrow" aria-hidden>
            →
          </span>
        </Link>
      ) : (
        <span
          className="word-detail__pager-btn word-detail__pager-btn--next word-detail__pager-btn--disabled"
          aria-hidden
        >
          <span className="word-detail__pager-label">
            <span className="word-detail__pager-caption">Next</span>
          </span>
          <span className="word-detail__pager-arrow">→</span>
        </span>
      )}
    </nav>
  );
}
