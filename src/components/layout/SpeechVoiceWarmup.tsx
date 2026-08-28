"use client";

import { preloadSpeechVoices } from "@/lib/speak-word";
import { useEffect } from "react";

/** Load en-US voices early so the first auto-pronounce sounds natural. */
export function SpeechVoiceWarmup() {
  useEffect(() => {
    preloadSpeechVoices();
  }, []);

  return null;
}
