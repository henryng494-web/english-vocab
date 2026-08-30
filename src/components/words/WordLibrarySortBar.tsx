"use client";

import type { WordLibrarySort } from "@/lib/learning-storage";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";

type WordLibrarySortBarProps = {
  count: number;
  sort: WordLibrarySort;
  onSortChange: (sort: WordLibrarySort) => void;
};

export function WordLibrarySortBar({
  count,
  sort,
  onSortChange,
}: WordLibrarySortBarProps) {
  const { t } = useI18n();
  const sortOptions: Array<{ value: WordLibrarySort; label: string }> = [
    { value: "rank", label: t("library.sortRank") },
    { value: "recent", label: t("library.sortRecent") },
  ];

  return (
    <div className="word-library__toolbar">
      <p className={`word-library__count ${displayFontClass}`}>
        {t("library.wordCount", { count })}
      </p>
      <div
        className="mobile-segment word-library__sort"
        role="group"
        aria-label={t("library.sortAria")}
      >
        {sortOptions.map((option) => (
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
