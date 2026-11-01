import { consumeGestureAutoSpeak } from "@/lib/speak-word";

/** Card controls own their gestures; only a tap on plain card content may
 * unlock a queued pronunciation, and only for the word currently on screen. */
export function handleJourneyCardPointerDown(target: EventTarget | null, word: string): void {
  if (!(target instanceof Element)) return;
  if (target.closest(".journey-actions, button, a, input, select, textarea, [role='button'], [data-pronounce-speak]")) return;
  consumeGestureAutoSpeak(word);
}
