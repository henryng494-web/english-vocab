"use client";

import {
  cancelSpeech,
  preloadWordPronunciation,
  speakEnglishTextAuto,
} from "@/lib/speak-word";
import { useAutoSpeakSetting } from "@/context/AppSettingsContext";
import { useEffect } from "react";

let autoSpeakGeneration = 0;

/** Wait for card to settle before speaking — fast swipes only pronounce the last word. */
const AUTO_SPEAK_SETTLE_MS = 140;

/** Auto-pronounce when `text` changes (new word card). Respects menu setting. */
export function useAutoSpeakWord(
  text: string | null | undefined,
  enabled = true,
): void {
  const autoSpeakEnabled = useAutoSpeakSetting();
  const active = enabled && autoSpeakEnabled;

  useEffect(() => {
    if (!active) {
      cancelSpeech();
      return;
    }

    const trimmed = text?.trim() ?? "";
    if (!trimmed) return;

    const generation = ++autoSpeakGeneration;
    cancelSpeech();
    preloadWordPronunciation(trimmed);

    const timer = window.setTimeout(() => {
      if (generation !== autoSpeakGeneration) return;
      speakEnglishTextAuto(trimmed);
    }, AUTO_SPEAK_SETTLE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [text, active]);
}
