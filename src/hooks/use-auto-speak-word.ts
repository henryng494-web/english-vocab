"use client";

import {
  cancelSpeech,
  preloadWordPronunciation,
  tryAutoSpeakWord,
  wasRecentlySpokenInGesture,
} from "@/lib/speak-word";
import { isAppleWebKit } from "@/lib/speech-voice";
import { useAutoSpeakSetting } from "@/context/AppSettingsContext";
import {
  hasWordAudioBlob,
  isWordAudioElementReady,
} from "@/lib/word-pronunciation-audio";
import { useEffect, useLayoutEffect } from "react";

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

  useLayoutEffect(() => {
    if (!active || !isAppleWebKit()) return;

    const trimmed = text?.trim() ?? "";
    if (!trimmed) return;

    cancelSpeech();
    preloadWordPronunciation(trimmed);
    if (wasRecentlySpokenInGesture(trimmed)) return;

    // Still inside the tab/button gesture window right after navigation.
    tryAutoSpeakWord(trimmed);
  }, [text, active]);

  useEffect(() => {
    if (!active) {
      cancelSpeech();
      return;
    }

    if (isAppleWebKit()) return;

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
      tryAutoSpeakWord(trimmed);
    };

    if (settleMs === 0) {
      const frame = window.requestAnimationFrame(speak);
      return () => window.cancelAnimationFrame(frame);
    }

    const timer = window.setTimeout(speak, settleMs);
    return () => window.clearTimeout(timer);
  }, [text, active]);
}
