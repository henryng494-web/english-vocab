"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  VocabWordCard,
  vocabWordToDiscoverData,
} from "@/components/discover/VocabWordCard";
import { useI18n } from "@/hooks/use-i18n";
import {
  REVIEW_INTERVALS,
  intervalLevelIndex,
  type ReviewIntervalDays,
} from "@/lib/review-schedule";
import { progressBarFilledSegments, type ReviewGrade } from "@/lib/review-srs";
import type { VocabWord } from "@/types/database";

type ReviewRevealProps = {
  word: VocabWord;
  correct: boolean;
  grade: ReviewGrade;
  timesReviewed: number;
  srsLevel: number;
  intervalDays: ReviewIntervalDays;
  markMastered: boolean;
  isLeech: boolean;
  canMarkMastered: boolean;
  onIntervalChange: (days: ReviewIntervalDays) => void;
  onMarkMasteredChange: (mastered: boolean) => void;
  onConfirm: () => void;
  confirming: boolean;
};

function toDiscoverData(word: VocabWord) {
  return vocabWordToDiscoverData(word);
}

export function ReviewReveal({
  word,
  correct,
  grade,
  timesReviewed,
  srsLevel,
  intervalDays,
  markMastered,
  isLeech,
  canMarkMastered,
  onIntervalChange,
  onMarkMasteredChange,
  onConfirm,
  confirming,
}: ReviewRevealProps) {
  const { t, reviewTimesLabel, reviewInLabel, reviewConfirmLabel } = useI18n();
  const filled = progressBarFilledSegments(srsLevel, markMastered);
  const historyLabel = reviewTimesLabel(timesReviewed);
  const resultLabel =
    grade === "correct"
      ? t("review.resultCorrect")
      : grade === "unsure"
        ? t("review.resultUnsure")
        : t("review.resultWrong");
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<{ bottom: number; right: number } | null>(
    null,
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const actionClass =
    grade === "correct"
      ? "review-schedule__action review-schedule__action--correct"
      : grade === "unsure"
        ? "review-schedule__action review-schedule__action--unsure"
        : "review-schedule__action review-schedule__action--wrong";

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
        <VocabWordCard data={toDiscoverData(word)} familySwipeGraceMs={250} />
      </div>

      <div className="review-schedule">
        <div className="review-schedule__meta">
          <p
            className={`review-schedule__result${
              grade === "correct"
                ? " is-correct"
                : grade === "unsure"
                  ? " is-unsure"
                  : " is-wrong"
            }`}
          >
            {resultLabel}
          </p>
          <p className="review-schedule__times">
            {correct ? "✓ " : grade === "unsure" ? "~ " : "✗ "}
            {historyLabel}
          </p>
          {isLeech ? (
            <p className="review-schedule__leech">{t("review.leechHint")}</p>
          ) : null}
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

        <div className={actionClass}>
          <button
            type="button"
            className="review-schedule__confirm"
            disabled={confirming}
            onClick={onConfirm}
          >
            {reviewConfirmLabel(intervalDays, markMastered)}
          </button>
          <button
            ref={btnRef}
            type="button"
            className="review-schedule__chevron"
            aria-label={t("review.chooseInterval")}
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
                    {reviewInLabel(days)}
                  </button>
                </li>
              ))}
              <li role="separator" className="review-schedule__divider" aria-hidden />
              <li role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={markMastered}
                  disabled={!canMarkMastered}
                  className={`review-schedule__option review-schedule__option--mastered${
                    markMastered ? " is-active" : ""
                  }${!canMarkMastered ? " is-disabled" : ""}`}
                  onClick={() => {
                    if (!canMarkMastered) return;
                    onMarkMasteredChange(true);
                    setOpen(false);
                  }}
                >
                  {t("review.alreadyKnow")}
                  {!canMarkMastered ? (
                    <span className="review-schedule__option-note">
                      {t("review.masteredLocked")}
                    </span>
                  ) : null}
                </button>
              </li>
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
