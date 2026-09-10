"use client";

import {
  cancelSpeech,
  preloadWordPronunciation,
  speakEnglishTextAuto,
} from "@/lib/speak-word";
import { useAutoSpeakSetting } from "@/context/AppSettingsContext";
import {
  hasWordAudioBlob,
  isWordAudioElementReady,
} from "@/lib/word-pronunciation-audio";
import { useEffect } from "react";

let autoSpeakGeneration = 0;

/** Wait for card to settle before speaking — fast swipes only pronounce the last word. */
const AUTO_SPEAK_SETTLE_MS = 140;
const AUTO_SPEAK_SETTLE_READY_MS = 0;

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

    const settleMs =
      hasWordAudioBlob(trimmed) || isWordAudioElementReady(trimmed)
        ? AUTO_SPEAK_SETTLE_READY_MS
        : AUTO_SPEAK_SETTLE_MS;

    const timer = window.setTimeout(() => {
      if (generation !== autoSpeakGeneration) return;
      speakEnglishTextAuto(trimmed);
    }, settleMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [text, active]);
}
