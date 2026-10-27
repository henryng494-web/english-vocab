"use client";

import { OnboardingSetupProgress } from "@/components/onboarding/OnboardingSetupProgress";
import { ONBOARDING_NICKNAME_STEP_INDEX } from "@/components/onboarding/onboarding-setup-steps";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import { saveLearnerNickname } from "@/lib/learner-nickname";
import { useState } from "react";

type NicknamePromptProps = {
  onComplete: () => void;
};

export function NicknamePrompt({ onComplete }: NicknamePromptProps) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (saving) return;
    setError(null);
    const trimmed = value.trim();
    if (!trimmed) {
      setError(t("nickname.required"));
      return;
    }
    setSaving(true);
    try {
      const saved = await saveLearnerNickname(trimmed);
      if (!saved) {
        setError(t("nickname.required"));
        return;
      }
      onComplete();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="onboarding"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nickname-prompt-title"
    >
      <div className="onboarding__panel">
        <OnboardingSetupProgress activeStepIndex={ONBOARDING_NICKNAME_STEP_INDEX} />

        <h2 id="nickname-prompt-title" className={`onboarding__title ${displayFontClass}`}>
          {t("nickname.promptTitle")}
        </h2>
        <p className="onboarding__body">{t("nickname.promptDesc")}</p>

        <label className="sr-only" htmlFor="learner-nickname">
          {t("nickname.fieldLabel")}
        </label>
        <input
          id="learner-nickname"
          type="text"
          autoComplete="nickname"
          maxLength={32}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t("nickname.placeholder")}
          className="onboarding__input"
          onKeyDown={(event) => {
            if (event.key === "Enter") void handleSubmit();
          }}
        />
        {error ? (
          <p className="onboarding__error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={saving}
          className="btn-pill-primary onboarding__cta"
          onClick={() => void handleSubmit()}
        >
          {saving ? t("nickname.saving") : t("nickname.continue")}
        </button>
      </div>
    </div>
  );
}
