"use client";

import { preloadSpeechVoices, preloadWordPronunciation } from "@/lib/speak-word";
import { useEffect } from "react";

/** Warm up human audio + Safari voices so the first pronounce sounds natural. */
export function SpeechVoiceWarmup() {
  useEffect(() => {
    preloadSpeechVoices();
    preloadWordPronunciation("hello");
  }, []);

  return null;
}
