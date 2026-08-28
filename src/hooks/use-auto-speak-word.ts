"use client";

import { preloadWordPronunciation, speakEnglishText } from "@/lib/speak-word";
import { useAutoSpeakSetting } from "@/context/AppSettingsContext";
import { useEffect, useRef } from "react";

/** Auto-pronounce when `text` changes (new word card). Respects menu setting. */
export function useAutoSpeakWord(
  text: string | null | undefined,
  enabled = true,
): void {
  const autoSpeakEnabled = useAutoSpeakSetting();
  const lastRef = useRef<string | null>(null);
  const active = enabled && autoSpeakEnabled;

  useEffect(() => {
    if (!active) return;
    const trimmed = text?.trim() ?? "";
    if (!trimmed) return;

    const key = trimmed.toLowerCase();
    if (key === lastRef.current) return;
    lastRef.current = key;

    preloadWordPronunciation(trimmed);

    const timer = window.setTimeout(() => {
      speakEnglishText(trimmed);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [text, active]);
}
