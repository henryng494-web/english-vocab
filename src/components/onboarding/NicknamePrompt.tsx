"use client";

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
    <div className="app-page">
      <div className="app-shell mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col justify-center bg-background px-6 py-10">
        <div className="home-card border-violet-200 bg-card p-6 text-center shadow-sm">
          <h1 className={`text-xl font-bold text-foreground ${displayFontClass}`}>
            {t("nickname.promptTitle")}
          </h1>
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
            className="mt-5 w-full rounded-2xl border border-foreground/15 bg-surface px-4 py-3.5 text-center text-base text-foreground outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/25"
            onKeyDown={(event) => {
              if (event.key === "Enter") void handleSubmit();
            }}
          />
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSubmit()}
            className="btn-pill-primary mt-5 flex w-full justify-center py-3.5 disabled:opacity-60"
          >
            {saving ? t("nickname.saving") : t("nickname.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
