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

/** Capacitor native TTS — reliable on iOS/Android WKWebView where speechSynthesis is often silent. */
export async function speakNativeText(text: string): Promise<boolean> {
  const trimmed = text?.trim();
  if (!trimmed) return false;
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
    await TextToSpeech.stop();
    const rate = getPronouncePlaybackRate();
    await TextToSpeech.speak({
      text: trimmed,
      lang: langForAccent(),
      rate: Number.isFinite(rate) && rate > 0 ? Math.min(2, Math.max(0.5, rate)) : 1,
      category: "ambient",
    });
    logPronunciation({ stage: "native-tts-started", word: trimmed });
    return true;
  } catch (error) {
    logPronunciation({ stage: "native-tts-error", word: trimmed, error });
    return false;
  }
}
