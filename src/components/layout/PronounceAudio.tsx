"use client";

import { registerPronounceAudioElement } from "@/lib/word-pronunciation-audio";
import { useEffect, useRef } from "react";

/** Persistent DOM audio node — iOS Safari/PWA ignores dynamically created Audio(). */
export function PronounceAudio() {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) registerPronounceAudioElement(el);
  }, []);

  return (
    <audio
      ref={ref}
      id="ev-pronounce-audio"
      preload="auto"
      playsInline
      hidden
    />
  );
}
