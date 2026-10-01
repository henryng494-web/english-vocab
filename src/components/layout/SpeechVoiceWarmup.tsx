"use client";

import {
  hasPendingAutoSpeak,
  preloadSpeechVoices,
  unlockSpeechFromUserGesture,
} from "@/lib/speak-word";
import { primeAudioPipelineInUserGesture } from "@/lib/word-pronunciation-audio";
import { useEffect } from "react";

function isSpeakButtonTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("[data-pronounce-speak]"));
}

/** Unlock MP3 playback on first user touch (iOS Safari/PWA). */
export function SpeechVoiceWarmup() {
  useEffect(() => {
    preloadSpeechVoices();
    let primed = false;
    const onFirstTouch = (event: Event) => {
      if (primed && !hasPendingAutoSpeak()) return;
      primed = true;
      unlockSpeechFromUserGesture();
      // Skip silent priming when the first tap is the speak button — it plays MP3
      // in the same gesture and silent priming would race and cancel playback.
      if (!isSpeakButtonTarget(event.target)) {
        primeAudioPipelineInUserGesture();
      }
    };

    document.addEventListener("pointerdown", onFirstTouch, {
      capture: true,
      passive: true,
    });
    document.addEventListener("click", onFirstTouch, {
      capture: true,
    });

    return () => {
      document.removeEventListener("pointerdown", onFirstTouch, { capture: true });
      document.removeEventListener("click", onFirstTouch, { capture: true });
    };
  }, []);

  return null;
}
