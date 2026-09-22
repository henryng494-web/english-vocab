"use client";

import { isLikelyVietnameseGloss, keepNaturalExamples } from "@/lib/example-quality";
import type { VocabExample } from "@/lib/parse-examples";
import type { UserLanguage } from "@/lib/user-language";

type VocabExampleListProps = {
  word: string;
  examples: VocabExample[];
  wordType?: string | null;
  meaning?: string | null;
  userLanguage?: UserLanguage;
  /** True while Gemini/backfill is fetching missing ES glosses. */
  localeLoading?: boolean;
  boxed?: boolean;
  /** Tighter layout for fixed-height journey cards. */
  compact?: boolean;
};

export function VocabExampleList({
  word,
  examples,
  wordType,
  meaning,
  userLanguage = "vi",
  localeLoading = false,
  boxed = false,
  compact = false,
}: VocabExampleListProps) {
  const filled = keepNaturalExamples(word, examples, wordType, meaning).map(
    (item) => ({
      ...item,
      vi:
        userLanguage === "es" && isLikelyVietnameseGloss(item.vi)
          ? ""
          : item.vi,
    }),
  );
  const visible = filled.filter((item) => item.en.trim()).slice(0, 2);

  if (visible.length === 0) return null;

  const itemClass = boxed
    ? "vocab-examples__item rounded-lg bg-[var(--example-bg)] px-3 py-2.5 text-[0.9375rem] leading-snug"
    : compact
      ? "vocab-examples__item"
      : "vocab-examples__item bg-[var(--example-bg)] text-[0.9375rem] leading-snug";

  const enClass = "vocab-examples__en italic";
  const viClass = "vocab-examples__vi mt-0.5 italic";

  return (
    <ul
      className={
        compact ? "vocab-examples vocab-examples--compact" : "space-y-2"
      }
    >
      {visible.map((ex, i) => {
        const awaitingLocale =
          userLanguage === "es" &&
          localeLoading &&
          ex.en.trim() &&
          !ex.vi.trim();
        return (
          <li key={`${word}-ex-${i}`} className={itemClass}>
            <p className={enClass}>{ex.en}</p>
            {awaitingLocale ? (
              <p className="mt-0.5">
                <span
                  className="inline-block h-3.5 w-40 max-w-full animate-pulse rounded bg-primary-100/80"
                  aria-hidden
                />
              </p>
            ) : ex.vi ? (
              <p className={viClass}>{ex.vi}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
