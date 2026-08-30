"use client";

import { SpeakButton } from "@/components/flashcard/SpeakButton";
import { useI18n } from "@/hooks/use-i18n";
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
  wordType,
  meaning,
  boxed = false,
  compact = false,
}: VocabExampleListProps) {
  const { t } = useI18n();
  const filled = keepNaturalExamples(word, examples, wordType, meaning);
  const visible = filled.slice(0, 2);

  if (visible.length === 0) return null;

  const itemClass = boxed
    ? "vocab-examples__item vocab-examples__item--speakable rounded-lg bg-[var(--example-bg)] px-3 py-2.5 text-[0.9375rem] leading-snug"
    : compact
      ? "vocab-examples__item vocab-examples__item--speakable"
      : "vocab-examples__item vocab-examples__item--speakable bg-[var(--example-bg)] text-[0.9375rem] leading-snug";

  const enClass = "vocab-examples__en italic";
  const viClass = "vocab-examples__vi mt-0.5 italic";

  return (
    <ul
      className={
        compact ? "vocab-examples vocab-examples--compact" : "space-y-2"
      }
    >
      {visible.map((ex, i) => (
        <li key={`${word}-ex-${i}`} className={itemClass}>
          <SpeakButton
            text={ex.en}
            iconOnly
            variant="light"
            className="vocab-examples__speak"
            ariaLabel={t("speak.exampleAria")}
          />
          <p className={enClass}>{ex.en}</p>
          {ex.vi ? <p className={viClass}>{ex.vi}</p> : null}
        </li>
      ))}
    </ul>
  );
}
