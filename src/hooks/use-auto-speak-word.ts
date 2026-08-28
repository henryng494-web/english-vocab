"use client";

import { preloadWordPronunciation, speakEnglishText } from "@/lib/speak-word";
import { useEffect, useRef } from "react";

/** Auto-pronounce when `text` changes (new word card). */
export function useAutoSpeakWord(
  text: string | null | undefined,
  enabled = true,
): void {
  const lastRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
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
  }, [text, enabled]);
}
