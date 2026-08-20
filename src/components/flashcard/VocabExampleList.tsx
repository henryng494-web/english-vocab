"use client";

import { keepNaturalExamples } from "@/lib/example-quality";
import type { VocabExample } from "@/lib/parse-examples";

type VocabExampleListProps = {
  word: string;
  examples: VocabExample[];
  wordType?: string | null;
  meaning?: string | null;
  boxed?: boolean;
  /** Tighter layout for fixed-height journey cards. */
  compact?: boolean;
};

export function VocabExampleList({
  word,
  examples,
  boxed = false,
  compact = false,
}: VocabExampleListProps) {
  const filled = keepNaturalExamples(word, examples);
  const visible = compact ? filled.slice(0, 1) : filled;

  if (visible.length === 0) return null;

  return (
    <ul
      className={
        compact ? "vocab-examples vocab-examples--compact" : "space-y-2"
      }
    >
      {visible.map((ex, i) => (
        <li
          key={`${word}-ex-${i}`}
          className={
            boxed
              ? "rounded-lg bg-primary-50 px-3 py-2.5 text-base text-foreground/80"
              : compact
                ? "vocab-examples__item text-foreground/80"
                : "text-base text-foreground/80"
          }
        >
          <p className={compact ? "vocab-examples__en italic" : "italic"}>
            {ex.en}
          </p>
          {ex.vi ? (
            <p
              className={
                compact
                  ? "vocab-examples__vi mt-0.5 italic text-foreground/60"
                  : "mt-0.5 italic text-foreground/60"
              }
            >
              {ex.vi}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
