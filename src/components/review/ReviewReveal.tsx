"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WordCardHeader } from "@/components/flashcard/WordCardHeader";
import { WordCardDetails } from "@/components/flashcard/WordCardDetails";
import { ReviewWordImage } from "@/components/review/ReviewWordImage";
import {
  REVIEW_INTERVALS,
  formatReviewInLabel,
  intervalLevelIndex,
  type ReviewIntervalDays,
} from "@/lib/review-schedule";
import type { VocabWord } from "@/types/database";

type ReviewRevealProps = {
  word: VocabWord;
  correct: boolean;
  timesReviewed: number;
  intervalDays: ReviewIntervalDays;
  onIntervalChange: (days: ReviewIntervalDays) => void;
  onConfirm: () => void;
  confirming: boolean;
};

export function ReviewReveal({
  word,
  correct,
  timesReviewed,
  intervalDays,
  onIntervalChange,
  onConfirm,
  confirming,
}: ReviewRevealProps) {
  const filled = intervalLevelIndex(intervalDays) + 1;
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
      <div className="review-reveal__card">
        <ReviewWordImage
          word={word.word}
          imageUrl={word.image_url}
          wordType={word.word_type}
          className="review-reveal__image"
        />
        <div className="review-reveal__body">
          <WordCardHeader
            word={word.word}
            phonetic={word.phonetic}
            wordType={word.word_type}
          />
          <WordCardDetails
            word={word.word}
            meaning={word.vietnamese_meaning}
            examples={word.examples}
            wordType={word.word_type}
            family={word.word_family}
          />
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
            {formatReviewInLabel(intervalDays)}
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
                    aria-selected={days === intervalDays}
                    className={`review-schedule__option${
                      days === intervalDays ? " is-active" : ""
                    }`}
                    onClick={() => {
                      onIntervalChange(days);
                      setOpen(false);
                    }}
                  >
                    {formatReviewInLabel(days)}
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
