"use client";

import { unlockSpeechFromUserGesture } from "@/lib/speak-word";
import { primeAudioPipelineInUserGesture } from "@/lib/word-pronunciation-audio";
import { ensureSpeechVoicesReady } from "@/lib/speech-voice";
import { useEffect } from "react";

/** Unlock speech + audio pipeline on first user touch (iOS Safari/PWA). No audible warmup word. */
export function SpeechVoiceWarmup() {
  useEffect(() => {
    void ensureSpeechVoicesReady();

    const onFirstTouch = () => {
      unlockSpeechFromUserGesture();
      primeAudioPipelineInUserGesture();
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
