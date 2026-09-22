"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VocabExampleList } from "@/components/flashcard/VocabExampleList";
import { WordLearningChunks } from "@/components/flashcard/WordLearningChunks";
import { useI18n } from "@/hooks/use-i18n";
import type { UserLanguage } from "@/lib/user-language";
import { resolveWordDisplay } from "@/lib/word-display";
import { useCardSimilarWords } from "@/hooks/use-card-similar-words";
import { capitalizeFirst } from "@/lib/format-text";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import { parseExamples } from "@/lib/parse-examples";
import type { WordFamilyMember } from "@/types/database";
import type { WordRegister } from "@/lib/word-meanings";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";
import { isLikelyVietnameseGloss } from "@/lib/example-quality";

const POS_ABBREV: Record<string, string> = {
  noun: "n.",
  verb: "v.",
  adjective: "adj.",
  adverb: "adv.",
  preposition: "prep.",
  pronoun: "pron.",
  conjunction: "conj.",
  interjection: "interj.",
  article: "art.",
  number: "num.",
  determiner: "det.",
};

const HINT_TAP_SLOP_PX = 10;

type WordCardDetailsProps = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  userLanguage: UserLanguage;
  register?: WordRegister | null;
  englishDefinition?: string | null;
  meanings?: LocalizedMeaningsJson | null;
  example_translations?: ExampleTranslationsJson | null;
  phrase_translations?: import("@/types/word-content").PhraseTranslationsJson | null;
  family?: WordFamilyMember[] | null;
  similarWords?: string[] | null;
  loading?: boolean;
  /** Fetching missing ES example/phrase glosses (show skeleton, no VI). */
  localeLoading?: boolean;
  /**
   * Block Family hint taps briefly after mount/word change (review reveal uses ~450ms
   * so the confirm tap cannot bleed into the hint when similar words appear async).
   */
  hintGraceMs?: number;
};

function CardHintArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="card-details__hint-icon"
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "right" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
      />
    </svg>
  );
}

function DetailsLoadingSkeleton() {
  return (
    <div className="card-details card-details--compact">
      <div className="space-y-3 pt-1" aria-hidden>
        <div className="h-6 w-3/4 animate-pulse rounded bg-primary-50" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
      </div>
    </div>
  );
}

export function WordCardDetails({
  word,
  examples,
  wordType,
  meaning,
  userLanguage,
  register,
  englishDefinition,
  meanings,
  example_translations,
  phrase_translations,
  family,
  similarWords,
  loading = false,
  localeLoading = false,
  hintGraceMs = 0,
}: WordCardDetailsProps) {
  const { t } = useI18n();
  const chunkEntry = useMemo(
    () => resolveLearningChunks(word, { examples, wordType, meaning }),
    [word, examples, wordType, meaning],
  );
  const chunksOnly = Boolean(
    (chunkEntry?.collocations.length ?? 0) > 0 ||
      (chunkEntry?.chunks.length ?? 0) > 0,
  );
  const parsed = useMemo(() => {
    if (loading) return [];
    const display = resolveWordDisplay(
      {
        word,
        examples,
        vietnamese_meaning: meaning,
        word_type: wordType,
        english_definition: englishDefinition,
        meanings,
        example_translations,
      },
      userLanguage,
    );
    return display.examples
      .map((item) => ({
        en: item.sentence,
        vi: item.translation ?? "",
      }))
      .filter((item) => {
        if (!item.en.trim()) return false;
        if (!item.vi.trim()) return userLanguage === "vi";
        if (userLanguage === "es" && isLikelyVietnameseGloss(item.vi)) {
          return false;
        }
        return true;
      });
  }, [
    loading,
    examples,
    meaning,
    userLanguage,
    word,
    wordType,
    englishDefinition,
    meanings,
    example_translations,
  ]);
  const rows = (family ?? []).filter((item) => item.word.trim());
  const similar = useCardSimilarWords({
    word,
    preset: similarWords,
    wordType,
    meaning,
    englishDefinition,
  }).filter((item) => item.trim());
  const canFlip = rows.length > 1 || similar.length > 0;
  const [showFamily, setShowFamily] = useState(false);
  const [hintReady, setHintReady] = useState(hintGraceMs <= 0);
  const examplesScrollingRef = useRef(false);
  const scrollIdleTimerRef = useRef<number | null>(null);
  const hintTapStartRef = useRef<{ x: number; y: number } | null>(null);
  const hintGraceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setShowFamily(false);
    setHintReady(hintGraceMs <= 0);
    if (hintGraceTimerRef.current != null) {
      window.clearTimeout(hintGraceTimerRef.current);
      hintGraceTimerRef.current = null;
    }
    if (hintGraceMs > 0) {
      hintGraceTimerRef.current = window.setTimeout(() => {
        setHintReady(true);
        hintGraceTimerRef.current = null;
      }, hintGraceMs);
    }
  }, [word, hintGraceMs]);

  useEffect(() => {
    if (!canFlip) setShowFamily(false);
  }, [canFlip]);

  useEffect(
    () => () => {
      if (scrollIdleTimerRef.current != null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
      if (hintGraceTimerRef.current != null) {
        window.clearTimeout(hintGraceTimerRef.current);
      }
    },
    [],
  );

  function markExamplesScrolling() {
    examplesScrollingRef.current = true;
    if (scrollIdleTimerRef.current != null) {
      window.clearTimeout(scrollIdleTimerRef.current);
    }
    scrollIdleTimerRef.current = window.setTimeout(() => {
      examplesScrollingRef.current = false;
      scrollIdleTimerRef.current = null;
    }, 350);
  }

  if (loading) {
    return <DetailsLoadingSkeleton />;
  }

  function toggle() {
    if (!canFlip || !hintReady) return;
    setShowFamily((current) => !current);
  }

  function handleHintPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (!hintReady) return;
    hintTapStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function handleHintPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const start = hintTapStartRef.current;
    hintTapStartRef.current = null;
    if (!start || !canFlip || !hintReady || examplesScrollingRef.current) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > HINT_TAP_SLOP_PX) {
      return;
    }
    toggle();
  }

  function handleHintPointerCancel() {
    hintTapStartRef.current = null;
  }

  return (
    <div className="card-details card-details--compact">
      <div className="card-details__scene">
        <div className={`card-details__flip${showFamily ? " is-family" : ""}`}>
          <div className="card-details__face card-details__face--meaning">
            <div
              className={`discover-card__examples min-h-0 flex-1${chunksOnly ? " discover-card__examples--chunks-only" : ""}`}
              onScroll={markExamplesScrolling}
              onTouchMove={markExamplesScrolling}
            >
              <WordLearningChunks
                word={word}
                examples={examples}
                wordType={wordType}
                meaning={meaning}
                userLanguage={userLanguage}
                register={register}
                englishDefinition={englishDefinition}
                phraseTranslations={phrase_translations}
                compact
              />
              {!chunksOnly ? (
                <VocabExampleList
                  word={word}
                  examples={parsed}
                  wordType={wordType}
                  meaning={meaning}
                  userLanguage={userLanguage}
                  localeLoading={localeLoading}
                  compact
                />
              ) : null}
            </div>
          </div>

          {canFlip ? (
            <div className="card-details__face card-details__face--family">
              <section className="card-family__column">
                {rows.length > 0 ? (
                  <>
                    <h3 className="word-learning-chunks__label">{t("card.wordForms")}</h3>
                    <ul className="card-family__list">
                      {rows.map((item) => {
                        const pos =
                          POS_ABBREV[item.pos] ?? (item.pos ? `${item.pos}.` : "");
                        return (
                          <li key={item.word} className="card-family__row">
                            <span className="card-family__word">
                              {capitalizeFirst(item.word)}
                            </span>
                            {pos ? (
                              <span className="card-family__meta"> — {pos}</span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}
              </section>
              <section className="card-similar__column">
                {similar.length > 0 ? (
                  <>
                    <h3 className="word-learning-chunks__label">{t("card.similarWords")}</h3>
                    <ul className="card-similar__list">
                      {similar.map((item) => (
                        <li key={item} className="card-similar__row">
                          {capitalizeFirst(item)}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            </div>
          ) : null}
        </div>
      </div>

      {canFlip ? (
        <button
          type="button"
          className={`card-details__hint${hintReady ? "" : " card-details__hint--grace"}`}
          onPointerDown={handleHintPointerDown}
          onPointerUp={handleHintPointerUp}
          onPointerCancel={handleHintPointerCancel}
          aria-disabled={!hintReady}
          aria-label={showFamily ? t("card.showExamples") : t("card.showFamily")}
        >
          {showFamily ? <CardHintArrow direction="left" /> : null}
          <span>{showFamily ? "Examples" : "Family"}</span>
          {!showFamily ? <CardHintArrow direction="right" /> : null}
        </button>
      ) : (
        <div className="card-details__hint-slot" aria-hidden />
      )}
    </div>
  );
}
