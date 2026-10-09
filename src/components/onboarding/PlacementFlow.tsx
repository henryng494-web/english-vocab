"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import { PLACEMENT_QUESTIONS_PER_LEVEL } from "@/data/placement-questions";
import { WORD_RANGES } from "@/data/word-ranges";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import {
  PLACEMENT_TIERS,
  buildPlacementQuiz,
  savePlacement,
  scorePlacement,
  type PlacementOutcome,
  type PlacementQuiz,
  type PlacementTierInfo,
} from "@/lib/placement";
import { useMemo, useState } from "react";

type Step = "choice" | "test" | "result" | "grid";

const TIER_EMOJI: Record<string, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
  master: "👑",
};

function tierForManualRange(rangeId: string): PlacementTierInfo {
  const min = WORD_RANGES.find((range) => range.id === rangeId)?.min ?? 1;
  const candidates = PLACEMENT_TIERS.filter((tier) => {
    const tierMin = WORD_RANGES.find((range) => range.id === tier.rangeId)?.min ?? 1;
    return tierMin <= min;
  });
  return candidates[candidates.length - 1] ?? PLACEMENT_TIERS[0];
}

type PlacementFlowProps = {
  onDone: () => void;
};

export function PlacementFlow({ onDone }: PlacementFlowProps) {
  const { t } = useI18n();
  const { appLanguage } = useAppSettings();
  const [step, setStep] = useState<Step>("choice");
  const [quiz, setQuiz] = useState<PlacementQuiz[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<PlacementOutcome | null>(null);
  const [gridPick, setGridPick] = useState<string | null>(null);

  const totalQuestions = useMemo(
    () => Object.values(PLACEMENT_QUESTIONS_PER_LEVEL).reduce((a, b) => a + b, 0),
    [],
  );

  function startTest() {
    setQuiz(buildPlacementQuiz());
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setOutcome(null);
    setStep("test");
  }

  function submitAnswer() {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    if (index + 1 < quiz.length) {
      setAnswers(nextAnswers);
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    setAnswers(nextAnswers);
    setOutcome(scorePlacement(quiz, nextAnswers));
    setStep("result");
  }

  function confirmResult() {
    if (!outcome) return;
    savePlacement({
      rangeId: outcome.tier.rangeId,
      tier: outcome.tier.tier,
      level: outcome.tier.level,
      source: "test",
      correct: outcome.correct,
      total: outcome.total,
    });
    onDone();
  }

  function confirmGrid() {
    if (!gridPick) return;
    const tier = tierForManualRange(gridPick);
    savePlacement({
      rangeId: gridPick,
      tier: tier.tier,
      level: tier.level,
      source: "manual",
    });
    onDone();
  }

  const rtl = appLanguage === "ar";

  if (step === "choice") {
    return (
      <main className="onboarding" aria-labelledby="placement-title" dir={rtl ? "rtl" : "ltr"}>
        <div className="onboarding__scroll">
          <h1 id="placement-title" className={`onboarding__title ${displayFontClass}`}>
            {t("placement.title")}
          </h1>
          <ul className="onboarding__list">
            <li>
              <button type="button" className="onboarding__row" onClick={startTest}>
                <span className="onboarding__flag" aria-hidden>📝</span>
                <span className="onboarding__label">
                  {t("placement.testNow")}
                  <span className="mt-0.5 block text-xs font-normal text-foreground/60">
                    {t("placement.testNowDesc")}
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="onboarding__row" onClick={() => setStep("grid")}>
                <span className="onboarding__flag" aria-hidden>🎯</span>
                <span className="onboarding__label">
                  {t("placement.pickRank")}
                  <span className="mt-0.5 block text-xs font-normal text-foreground/60">
                    {t("placement.pickRankDesc")}
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </main>
    );
  }

  if (step === "test" && quiz[index]) {
    const current = quiz[index];
    const isLast = index + 1 === quiz.length;
    return (
      <main className="onboarding" aria-labelledby="placement-question">
        <div className="onboarding__scroll">
          <button type="button" className="onboarding__back" onClick={() => setStep("choice")}>
            ← {t("placement.back")}
          </button>
          <p className="text-sm font-semibold text-foreground/60">
            {t("placement.question", { current: index + 1, total: totalQuestions })}
          </p>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary-50"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={quiz.length}
            aria-valuenow={index + 1}
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((index + 1) / quiz.length) * 100}%` }}
            />
          </div>
          <h1
            id="placement-question"
            className={`onboarding__title mt-4 ${displayFontClass}`}
            lang="en"
            dir="ltr"
          >
            {current.question.clue}
          </h1>
          <p className="mb-2 text-sm text-foreground/60">{t("placement.prompt")}</p>
          <ul className="onboarding__list" dir="ltr" lang="en">
            {current.options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  className={`onboarding__row${selected === option ? " is-active" : ""}`}
                  aria-pressed={selected === option}
                  onClick={() => setSelected(option)}
                >
                  <span className="onboarding__label">{option}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="onboarding__footer">
          <button
            type="button"
            className="onboarding__cta"
            disabled={selected === null}
            onClick={submitAnswer}
          >
            {isLast ? t("placement.finish") : t("placement.next")}
          </button>
        </div>
      </main>
    );
  }

  if (step === "result" && outcome) {
    const range = WORD_RANGES.find((item) => item.id === outcome.tier.rangeId);
    return (
      <main className="onboarding" aria-labelledby="placement-result" dir={rtl ? "rtl" : "ltr"}>
        <div className="onboarding__scroll text-center">
          <p className="mt-6 text-6xl" aria-hidden>{TIER_EMOJI[outcome.tier.tier]}</p>
          <h1 id="placement-result" className={`onboarding__title ${displayFontClass}`}>
            {t("placement.resultTitle")}
          </h1>
          <p className="text-3xl font-extrabold text-primary-700">
            {t(`placement.tier.${outcome.tier.tier}` as never)}
          </p>
          <p className="mt-3 text-sm text-foreground/70">
            {t("placement.score", { correct: outcome.correct, total: outcome.total })}
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            {t("placement.level", { level: outcome.tier.level })}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {t("placement.rangeLine", { range: range?.label ?? outcome.tier.rangeId })}
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <button type="button" className="onboarding__back" onClick={startTest}>
              {t("placement.retake")}
            </button>
            <button type="button" className="onboarding__back" onClick={() => setStep("grid")}>
              {t("placement.pickAnother")}
            </button>
          </div>
        </div>
        <div className="onboarding__footer">
          <button type="button" className="onboarding__cta" onClick={confirmResult}>
            {t("placement.start")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="onboarding" aria-labelledby="placement-grid" dir={rtl ? "rtl" : "ltr"}>
      <div className="onboarding__scroll">
        <button type="button" className="onboarding__back" onClick={() => setStep("choice")}>
          ← {t("placement.back")}
        </button>
        <h1 id="placement-grid" className={`onboarding__title ${displayFontClass}`}>
          {t("placement.gridTitle")}
        </h1>
        <p className="mb-3 text-sm text-foreground/60">{t("placement.gridHint")}</p>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t("placement.gridTitle")}>
          {WORD_RANGES.map((range) => {
            const active = gridPick === range.id;
            return (
              <button
                key={range.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`onboarding__row justify-center${active ? " is-active" : ""}`}
                onClick={() => setGridPick(range.id)}
              >
                <span className="onboarding__label text-center">{range.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="onboarding__footer">
        <button
          type="button"
          className="onboarding__cta"
          disabled={!gridPick}
          onClick={confirmGrid}
        >
          {t("placement.confirm")}
        </button>
      </div>
    </main>
  );
}
