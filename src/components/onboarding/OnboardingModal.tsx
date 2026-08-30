"use client";

import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { DEFAULT_BOOTSTRAP_RANGE } from "@/lib/app-bootstrap";
import {
  DAILY_GOAL_LABELS,
  DAILY_GOAL_OPTIONS,
  type DailyGoalMinutes,
} from "@/lib/app-settings";
import { displayFontClass } from "@/lib/fonts";
import { completeOnboarding } from "@/lib/onboarding";
import { WORD_RANGES } from "@/data/word-ranges";
import { useCallback, useState } from "react";

type OnboardingModalProps = {
  onComplete: (preferredRangeId: string) => void;
};

const STEPS = ["band", "goal", "how"] as const;
type Step = (typeof STEPS)[number];

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>("band");
  const [rangeId, setRangeId] = useState(DEFAULT_BOOTSTRAP_RANGE);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<DailyGoalMinutes>(20);

  const stepIndex = STEPS.indexOf(step);

  const finish = useCallback(() => {
    completeOnboarding(rangeId, dailyGoalMinutes);
    onComplete(rangeId);
  }, [dailyGoalMinutes, onComplete, rangeId]);

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-label="Giới thiệu app">
      <div className="onboarding__panel">
        <div className="onboarding__progress" aria-hidden>
          {STEPS.map((item, index) => (
            <span
              key={item}
              className={`onboarding__dot${index <= stepIndex ? " is-active" : ""}`}
            />
          ))}
        </div>

        {step === "band" ? (
          <>
            <div className="onboarding__hero">
              <JungleCastPill size={28} />
              <JungleMascot character="tiger" size={80} className="mt-3" />
            </div>
            <h2 className={`onboarding__title ${displayFontClass}`}>
              Chọn cấp từ bạn muốn học
            </h2>
            <p className="onboarding__body">
              Bắt đầu từ từ phổ biến nhất (Rank 1–100) hoặc chọn band phù hợp trình độ.
            </p>
            <div className="onboarding__chips">
              {WORD_RANGES.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  className={`onboarding__chip${rangeId === range.id ? " is-active" : ""}`}
                  onClick={() => setRangeId(range.id)}
                >
                  {range.compactLabel}
                </button>
              ))}
            </div>
            <button type="button" className="btn-pill-primary onboarding__cta" onClick={() => setStep("goal")}>
              Tiếp theo
            </button>
          </>
        ) : null}

        {step === "goal" ? (
          <>
            <div className="onboarding__hero">
              <JungleMascot character="crocodile" size={80} />
            </div>
            <h2 className={`onboarding__title ${displayFontClass}`}>
              Mục tiêu học mỗi ngày
            </h2>
            <p className="onboarding__body">
              Chọn thời gian bạn muốn dành cho tiếng Anh mỗi ngày — có thể đổi sau trong Menu.
            </p>
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
                  {DAILY_GOAL_LABELS[minutes]}
                </button>
              ))}
            </div>
            <div className="onboarding__nav">
              <button type="button" className="btn-pill-outline-secondary onboarding__back" onClick={() => setStep("band")}>
                Quay lại
              </button>
              <button type="button" className="btn-pill-primary onboarding__cta" onClick={() => setStep("how")}>
                Tiếp theo
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
              Cách học trên Hành trình
            </h2>
            <div className="onboarding__tips">
              <div className="onboarding__tip home-card border-primary-200 bg-primary-50/40">
                <p className="onboarding__tip-label text-primary-800">Học từ này</p>
                <p className="onboarding__body mt-1">
                  Thêm từ vào danh sách <strong>Đang ôn</strong> — app sẽ nhắc bạn ôn theo lịch.
                </p>
              </div>
              <div className="onboarding__tip home-card border-secondary-200 bg-secondary-50/40">
                <p className="onboarding__tip-label text-secondary-800">Đã biết rồi</p>
                <p className="onboarding__body mt-1">
                  Bỏ qua từ bạn đã thuộc — lưu vào <strong>Đã biết</strong>, không cần ôn lại.
                </p>
              </div>
            </div>
            <div className="onboarding__nav">
              <button type="button" className="btn-pill-outline-secondary onboarding__back" onClick={() => setStep("goal")}>
                Quay lại
              </button>
              <button type="button" className="btn-pill-primary onboarding__cta" onClick={finish}>
                Bắt đầu học
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
