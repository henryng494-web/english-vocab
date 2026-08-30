"use client";

import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { DEFAULT_BOOTSTRAP_RANGE } from "@/lib/app-bootstrap";
import { DAILY_GOAL_OPTIONS, type DailyGoalMinutes } from "@/lib/app-settings";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import { completeOnboarding } from "@/lib/onboarding";
import { useCallback, useState } from "react";

type OnboardingModalProps = {
  onComplete: (preferredRangeId: string) => void;
};

const STEPS = ["welcome", "goal", "how"] as const;
type Step = (typeof STEPS)[number];

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { t, dailyGoalLabel } = useI18n();
  const [step, setStep] = useState<Step>("welcome");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<DailyGoalMinutes>(20);

  const stepIndex = STEPS.indexOf(step);

  const finish = useCallback(() => {
    completeOnboarding(DEFAULT_BOOTSTRAP_RANGE, dailyGoalMinutes);
    onComplete(DEFAULT_BOOTSTRAP_RANGE);
  }, [dailyGoalMinutes, onComplete]);

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-label={t("onboarding.aria")}>
      <div className="onboarding__panel">
        <div className="onboarding__progress" aria-hidden>
          {STEPS.map((item, index) => (
            <span
              key={item}
              className={`onboarding__dot${index <= stepIndex ? " is-active" : ""}`}
            />
          ))}
        </div>

        {step === "welcome" ? (
          <>
            <div className="onboarding__hero">
              <JungleCastPill size={28} />
              <JungleMascot character="tiger" size={80} className="mt-3" />
            </div>
            <h2 className={`onboarding__title ${displayFontClass}`}>
              {t("onboarding.welcomeTitle")}
            </h2>
            <p className="onboarding__body">{t("onboarding.welcomeDesc")}</p>
            <button
              type="button"
              className="btn-pill-primary onboarding__cta"
              onClick={() => setStep("goal")}
            >
              {t("onboarding.next")}
            </button>
          </>
        ) : null}

        {step === "goal" ? (
          <>
            <div className="onboarding__hero">
              <JungleMascot character="crocodile" size={80} />
            </div>
            <h2 className={`onboarding__title ${displayFontClass}`}>
              {t("onboarding.dailyGoal")}
            </h2>
            <p className="onboarding__body">{t("onboarding.dailyGoalDesc")}</p>
            <div className="onboarding__chips">
              {DAILY_GOAL_OPTIONS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className={`onboarding__chip${
                    dailyGoalMinutes === minutes ? " is-active" : ""
                  }`}
                  onClick={() => setDailyGoalMinutes(minutes)}
                >
                  {dailyGoalLabel(minutes)}
                </button>
              ))}
            </div>
            <div className="onboarding__nav">
              <button
                type="button"
                className="btn-pill-outline-secondary onboarding__back"
                onClick={() => setStep("welcome")}
              >
                {t("onboarding.back")}
              </button>
              <button
                type="button"
                className="btn-pill-primary onboarding__cta"
                onClick={() => setStep("how")}
              >
                {t("onboarding.next")}
              </button>
            </div>
          </>
        ) : null}

        {step === "how" ? (
          <>
            <div className="onboarding__hero">
              <JungleMascot character="elephant" size={80} />
            </div>
            <h2 className={`onboarding__title ${displayFontClass}`}>
              {t("onboarding.howTitle")}
            </h2>
            <div className="onboarding__tips">
              <div className="onboarding__tip home-card border-primary-200 bg-primary-50/40">
                <p className="onboarding__tip-label text-primary-800">{t("onboarding.learnThis")}</p>
                <p className="onboarding__body mt-1">{t("onboarding.learnThisDesc")}</p>
              </div>
              <div className="onboarding__tip home-card border-secondary-200 bg-secondary-50/40">
                <p className="onboarding__tip-label text-secondary-800">{t("onboarding.alreadyKnow")}</p>
                <p className="onboarding__body mt-1">{t("onboarding.alreadyKnowDesc")}</p>
              </div>
            </div>
            <p className="onboarding__body mt-3 text-sm">{t("onboarding.bandHint")}</p>
            <div className="onboarding__nav">
              <button
                type="button"
                className="btn-pill-outline-secondary onboarding__back"
                onClick={() => setStep("goal")}
              >
                {t("onboarding.back")}
              </button>
              <button type="button" className="btn-pill-primary onboarding__cta" onClick={finish}>
                {t("onboarding.start")}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
