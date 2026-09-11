"use client";

import {
  cancelSpeech,
  preloadWordPronunciation,
  speakEnglishTextAuto,
  subscribeSpeechUnlock,
  wasRecentlySpokenInGesture,
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

    return subscribeSpeechUnlock(() => {
      if (!active || wasRecentlySpokenInGesture(trimmed)) return;
      speakEnglishTextAuto(trimmed);
    });
  }, [text, active]);

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

    if (wasRecentlySpokenInGesture(trimmed)) return;

    const cached =
      hasWordAudioBlob(trimmed) || isWordAudioElementReady(trimmed);
    const settleMs = cached ? 0 : AUTO_SPEAK_SETTLE_MS;

    const speak = () => {
      if (generation !== autoSpeakGeneration) return;
      if (wasRecentlySpokenInGesture(trimmed)) return;
      speakEnglishTextAuto(trimmed);
    };

    if (settleMs === 0) {
      const frame = window.requestAnimationFrame(speak);
      return () => window.cancelAnimationFrame(frame);
    }

    const timer = window.setTimeout(speak, settleMs);
    return () => window.clearTimeout(timer);
  }, [text, active]);
}
