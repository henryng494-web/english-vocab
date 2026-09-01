"use client";

import { registerPronounceAudioElement } from "@/lib/word-pronunciation-audio";
import { useCallback } from "react";

/** Persistent DOM audio node — iOS Safari/PWA ignores dynamically created Audio(). */
export function PronounceAudio() {
  const audioRef = useCallback((element: HTMLAudioElement | null) => {
    registerPronounceAudioElement(element);
  }, []);

  return (
    <audio
      ref={audioRef}
      id="ev-pronounce-audio"
      preload="auto"
      playsInline
      hidden
    />
  );
}
