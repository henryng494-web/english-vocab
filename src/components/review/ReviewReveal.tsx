"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DiscoverCard,
  type DiscoverWordData,
} from "@/components/discover/DiscoverCard";
import {
  REVIEW_INTERVALS,
  REVIEW_MASTERED_LABEL,
  formatReviewConfirmLabel,
  formatReviewInLabel,
  intervalLevelIndex,
  type ReviewIntervalDays,
} from "@/lib/review-schedule";
import type { VocabWord } from "@/types/database";
import { resolveWordRegister } from "@/lib/word-meanings";

type ReviewRevealProps = {
  word: VocabWord;
  correct: boolean;
  timesReviewed: number;
  intervalDays: ReviewIntervalDays;
  markMastered: boolean;
  onIntervalChange: (days: ReviewIntervalDays) => void;
  onMarkMasteredChange: (mastered: boolean) => void;
  onConfirm: () => void;
  confirming: boolean;
};

function toDiscoverData(word: VocabWord): DiscoverWordData {
  return {
    word: word.word,
    rank: word.rank,
    importance_tier: word.importance_tier,
    phonetic: word.phonetic,
    word_type: word.word_type,
    vietnamese_meaning: word.vietnamese_meaning,
    english_definition: word.english_definition,
    examples: word.examples,
    image_url: word.image_url,
    search_keyword: word.search_keyword,
    word_family: word.word_family,
    collocations: word.collocations,
    register: resolveWordRegister(word),
  };
}

export function ReviewReveal({
  word,
  correct,
  timesReviewed,
  intervalDays,
  markMastered,
  onIntervalChange,
  onMarkMasteredChange,
  onConfirm,
  confirming,
}: ReviewRevealProps) {
  const filled = markMastered
    ? REVIEW_INTERVALS.length
    : intervalLevelIndex(intervalDays) + 1;
  const timesLabel =
    timesReviewed <= 0
      ? "Not yet"
      : timesReviewed === 1
        ? "Once so far"
        : `${timesReviewed} times so far`;
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<{ bottom: number; right: number } | null>(
    null,
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const placeMenu = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuBox({
      bottom: Math.max(8, window.innerHeight - rect.top + 6),
      right: Math.max(8, window.innerWidth - rect.right),
    });
  };

  useEffect(() => {
    if (!open) return;
    placeMenu();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const node = event.target as Node;
      if (btnRef.current?.contains(node) || menuRef.current?.contains(node)) {
        return;
      }
      setOpen(false);
    };
    window.addEventListener("resize", placeMenu);
    window.addEventListener("scroll", placeMenu, true);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("resize", placeMenu);
      window.removeEventListener("scroll", placeMenu, true);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="review-reveal">
      <div className="journey-panel review-reveal__panel">
        <div className="journey-card-slot">
          <DiscoverCard data={toDiscoverData(word)} compact />
        </div>
      </div>

      <div className="review-schedule">
        <div className="review-schedule__meta">
          <p className="review-schedule__times">
            {correct ? "✓ " : ""}
            {timesLabel}
          </p>
          <div className="review-schedule__bar" aria-hidden>
            {REVIEW_INTERVALS.map((days) => (
              <span
                key={days}
                className={`review-schedule__seg${
                  intervalLevelIndex(days) < filled ? " is-on" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div className="review-schedule__action">
          <button
            type="button"
            className="review-schedule__confirm"
            disabled={confirming}
            onClick={onConfirm}
          >
            {formatReviewConfirmLabel(intervalDays, markMastered)}
          </button>
          <button
            ref={btnRef}
            type="button"
            className="review-schedule__chevron"
            aria-label="Choose review interval"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            disabled={confirming}
            onClick={() => setOpen((current) => !current)}
          >
            ▾
          </button>
        </div>
      </div>

      {open && menuBox
        ? createPortal(
            <ul
              ref={menuRef}
              id={listId}
              role="listbox"
              className="review-schedule__menu"
              style={{ bottom: menuBox.bottom, right: menuBox.right }}
            >
              {REVIEW_INTERVALS.map((days) => (
                <li key={days} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={!markMastered && days === intervalDays}
                    className={`review-schedule__option${
                      !markMastered && days === intervalDays ? " is-active" : ""
                    }`}
                    onClick={() => {
                      onMarkMasteredChange(false);
                      onIntervalChange(days);
                      setOpen(false);
                    }}
                  >
                    {formatReviewInLabel(days)}
                  </button>
                </li>
              ))}
              <li role="separator" className="review-schedule__divider" aria-hidden />
              <li role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={markMastered}
                  className={`review-schedule__option review-schedule__option--mastered${
                    markMastered ? " is-active" : ""
                  }`}
                  onClick={() => {
                    onMarkMasteredChange(true);
                    setOpen(false);
                  }}
                >
                  {REVIEW_MASTERED_LABEL}
                </button>
              </li>
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
