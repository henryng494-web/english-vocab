"use client";

import {
  preloadSpeechVoices,
  preloadWordPronunciation,
  unlockSpeechFromUserGesture,
} from "@/lib/speak-word";
import { ensureSpeechVoicesReady } from "@/lib/speech-voice";
import { useEffect } from "react";

/** Warm up voices + MP3 cache; unlock speech on first user touch (iOS Safari). */
export function SpeechVoiceWarmup() {
  useEffect(() => {
    preloadSpeechVoices();
    preloadWordPronunciation("hello");
    void ensureSpeechVoicesReady();

    const onFirstTouch = () => {
      unlockSpeechFromUserGesture();
    };

    document.addEventListener("touchstart", onFirstTouch, {
      capture: true,
      passive: true,
      once: true,
    });
    document.addEventListener("click", onFirstTouch, {
      capture: true,
      once: true,
    });

    return () => {
      document.removeEventListener("touchstart", onFirstTouch, { capture: true });
      document.removeEventListener("click", onFirstTouch, { capture: true });
    };
  }, []);

  return null;
}
