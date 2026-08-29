"use client";

import { preloadSpeechVoices, preloadWordPronunciation } from "@/lib/speak-word";
import { ensureSpeechVoicesReady, isAppleWebKit } from "@/lib/speech-voice";
import { useEffect } from "react";

/** Warm up human audio + Safari voices so the first pronounce sounds natural. */
export function SpeechVoiceWarmup() {
  useEffect(() => {
    preloadSpeechVoices();
    preloadWordPronunciation("hello");
    void ensureSpeechVoicesReady();

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // iOS Safari: prime speechSynthesis (otherwise first tap can be silent).
    if (isAppleWebKit()) {
      window.speechSynthesis.getVoices();
      const prime = new SpeechSynthesisUtterance(" ");
      prime.volume = 0;
      window.speechSynthesis.speak(prime);
      window.speechSynthesis.cancel();
    }
  }, []);

  return null;
}
