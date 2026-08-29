"use client";

import {
  preloadWordPronunciation,
  speakEnglishTextAuto,
} from "@/lib/speak-word";
import { useAutoSpeakSetting } from "@/context/AppSettingsContext";
import { useEffect, useRef } from "react";

const AUTO_SPEAK_DELAY_MS = 420;
const AUTO_SPEAK_DEDUPE_MS = 2500;

let lastAutoSpeak: { key: string; at: number } | null = null;
let autoSpeakTimer: number | null = null;
let autoSpeakPendingKey: string | null = null;

function clearAutoSpeakTimer(): void {
  if (autoSpeakTimer !== null) {
    window.clearTimeout(autoSpeakTimer);
    autoSpeakTimer = null;
  }
  autoSpeakPendingKey = null;
}

function scheduleAutoSpeakWord(text: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;

  const key = trimmed.toLowerCase();
  const now = Date.now();
  if (
    lastAutoSpeak?.key === key &&
    now - lastAutoSpeak.at < AUTO_SPEAK_DEDUPE_MS
  ) {
    return;
  }

  clearAutoSpeakTimer();
  lastAutoSpeak = { key, at: now };
  preloadWordPronunciation(trimmed);
  autoSpeakPendingKey = key;

  autoSpeakTimer = window.setTimeout(() => {
    autoSpeakTimer = null;
    if (autoSpeakPendingKey !== key) return;
    autoSpeakPendingKey = null;
    speakEnglishTextAuto(trimmed);
  }, AUTO_SPEAK_DELAY_MS);
}

/** Auto-pronounce when `text` changes (new word card). Respects menu setting. */
export function useAutoSpeakWord(
  text: string | null | undefined,
  enabled = true,
): void {
  const autoSpeakEnabled = useAutoSpeakSetting();
  const lastRef = useRef<string | null>(null);
  const active = enabled && autoSpeakEnabled;

  useEffect(() => {
    if (!active) {
      if (lastRef.current) {
        clearAutoSpeakTimer();
      }
      return;
    }

    const trimmed = text?.trim() ?? "";
    if (!trimmed) return;

    const key = trimmed.toLowerCase();
    if (key === lastRef.current) return;
    lastRef.current = key;

    scheduleAutoSpeakWord(trimmed);

    return () => {
      if (autoSpeakPendingKey === key) {
        clearAutoSpeakTimer();
      }
    };
  }, [text, active]);
}
