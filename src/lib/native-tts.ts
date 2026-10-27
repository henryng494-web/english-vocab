import { Capacitor } from "@capacitor/core";
import { getPronounceAccent } from "@/lib/pronounce-accent";
import { getPronouncePlaybackRate } from "@/lib/pronounce-speed";
import { logPronunciation } from "@/lib/pronunciation-log";

function langForAccent(): string {
  const accent = getPronounceAccent();
  if (accent === "uk") return "en-GB";
  if (accent === "au") return "en-AU";
  return "en-US";
}

export async function stopNativeTts(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
    await TextToSpeech.stop();
  } catch {
    /* ignore */
  }
}

/** Capacitor native TTS — last resort after dictionary MP3 on native shells. */
export async function speakNativeText(text: string): Promise<boolean> {
  const trimmed = text?.trim();
  if (!trimmed) return false;
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
    await TextToSpeech.stop();
    const rate = getPronouncePlaybackRate();
    const pace = Number.isFinite(rate) && rate > 0 ? rate : 1;
    await TextToSpeech.speak({
      text: trimmed,
      lang: langForAccent(),
      rate: Math.min(1.05, Math.max(0.92, pace * 0.98)),
      pitch: 1.05,
      category: "playback",
    });
    logPronunciation({ stage: "native-tts-started", word: trimmed });
    return true;
  } catch (error) {
    logPronunciation({ stage: "native-tts-error", word: trimmed, error });
    return false;
  }
}
