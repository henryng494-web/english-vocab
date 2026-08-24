"use client";

import type { WordLibrarySort } from "@/lib/learning-storage";
import { displayFontClass } from "@/lib/fonts";

type WordLibrarySortBarProps = {
  count: number;
  sort: WordLibrarySort;
  onSortChange: (sort: WordLibrarySort) => void;
};

const SORT_OPTIONS: Array<{ value: WordLibrarySort; label: string }> = [
  { value: "rank", label: "Rank" },
  { value: "recent", label: "Recently added" },
];

export function WordLibrarySortBar({
  count,
  sort,
  onSortChange,
}: WordLibrarySortBarProps) {
  return (
    <div className="word-library__toolbar">
      <p className={`word-library__count ${displayFontClass}`}>
        {count} {count === 1 ? "word" : "words"}
      </p>
      <div
        className="mobile-segment word-library__sort"
        role="group"
        aria-label="Sort words"
      >
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            data-active={sort === option.value ? "true" : "false"}
            aria-pressed={sort === option.value}
            onClick={() => onSortChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
