"use client";

import {
  preloadWordPronunciation,
  speakEnglishTextAuto,
} from "@/lib/speak-word";
import { useAutoSpeakSetting } from "@/context/AppSettingsContext";
import { useEffect } from "react";

const AUTO_SPEAK_DELAY_MS = 420;

let autoSpeakTimer: number | null = null;

function clearAutoSpeakTimer(): void {
  if (autoSpeakTimer !== null) {
    window.clearTimeout(autoSpeakTimer);
    autoSpeakTimer = null;
  }
}

/** Auto-pronounce when `text` changes (new word card). Respects menu setting. */
export function useAutoSpeakWord(
  text: string | null | undefined,
  enabled = true,
): void {
  const autoSpeakEnabled = useAutoSpeakSetting();
  const active = enabled && autoSpeakEnabled;

  useEffect(() => {
    if (!active) {
      clearAutoSpeakTimer();
      return;
    }

    const trimmed = text?.trim() ?? "";
    if (!trimmed) return;

    clearAutoSpeakTimer();
    preloadWordPronunciation(trimmed);

    autoSpeakTimer = window.setTimeout(() => {
      autoSpeakTimer = null;
      speakEnglishTextAuto(trimmed);
    }, AUTO_SPEAK_DELAY_MS);

    // Intentionally no cleanup: React Strict Mode runs cleanup then re-runs the
    // effect with the same deps. Clearing the timer there left auto-speak silent.
    // A new run (word/setting change) clears the previous timer at the top.
  }, [text, active]);
}
