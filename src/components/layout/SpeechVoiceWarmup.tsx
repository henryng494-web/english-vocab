"use client";

import { unlockSpeechFromUserGesture } from "@/lib/speak-word";
import { primeAudioPipelineInUserGesture } from "@/lib/word-pronunciation-audio";
import { useEffect } from "react";

/** Unlock MP3 playback on first user touch (iOS Safari/PWA). */
export function SpeechVoiceWarmup() {
  useEffect(() => {
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
