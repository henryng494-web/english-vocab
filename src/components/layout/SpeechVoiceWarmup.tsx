"use client";

import {
  preloadWordPronunciation,
  unlockSpeechFromUserGesture,
} from "@/lib/speak-word";
import { playWordAudioInUserGesture } from "@/lib/word-pronunciation-audio";
import { ensureSpeechVoicesReady } from "@/lib/speech-voice";
import { useEffect } from "react";

/** Warm voices + unlock pronunciation on first user touch (iOS Safari/PWA). */
export function SpeechVoiceWarmup() {
  useEffect(() => {
    preloadWordPronunciation("hello");
    void ensureSpeechVoicesReady();

    const onFirstTouch = () => {
      unlockSpeechFromUserGesture();
      playWordAudioInUserGesture("hello");
    };

    document.addEventListener("touchend", onFirstTouch, {
      capture: true,
      passive: false,
      once: true,
    });
    document.addEventListener("click", onFirstTouch, {
      capture: true,
      once: true,
    });

    return () => {
      document.removeEventListener("touchend", onFirstTouch, { capture: true });
      document.removeEventListener("click", onFirstTouch, { capture: true });
    };
  }, []);

  return null;
}
