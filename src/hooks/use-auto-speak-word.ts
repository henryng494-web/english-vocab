"use client";

import {
  preloadWordPronunciation,
  speakEnglishTextAuto,
} from "@/lib/speak-word";
import { useAutoSpeakSetting } from "@/context/AppSettingsContext";
import { useEffect } from "react";

let autoSpeakGeneration = 0;

/** Auto-pronounce when `text` changes (new word card). Respects menu setting. */
export function useAutoSpeakWord(
  text: string | null | undefined,
  enabled = true,
): void {
  const autoSpeakEnabled = useAutoSpeakSetting();
  const active = enabled && autoSpeakEnabled;

  useEffect(() => {
    if (!active) return;

    const trimmed = text?.trim() ?? "";
    if (!trimmed) return;

    const generation = ++autoSpeakGeneration;
    preloadWordPronunciation(trimmed);

    // One animation frame — lets the card paint, then speak as soon as bytes are warm.
    const frame = window.requestAnimationFrame(() => {
      if (generation !== autoSpeakGeneration) return;
      speakEnglishTextAuto(trimmed);
    });

    // Intentionally no effect cleanup: Strict Mode re-runs bump generation above.
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [text, active]);
}
