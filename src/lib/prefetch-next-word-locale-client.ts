import {
  DEFAULT_LEARNER_LOCALE,
  type LearnerLocale,
} from "@/lib/learner-locale";
import { PREFETCH_NEXT_WORDS_MAX } from "@/lib/prefetch-next-word-locale-shared";

const inflightKeys = new Set<string>();

/** Words at indices (startIndex + 1) … (startIndex + count). */
export function sliceNextWordsInQueue<
  T extends { word: string },
>(items: T[], startIndex: number, count = PREFETCH_NEXT_WORDS_MAX): string[] {
  const words: string[] = [];
  for (let offset = 1; offset <= count; offset += 1) {
    const item = items[startIndex + offset];
    const key = item?.word?.trim().toLowerCase();
    if (key) words.push(key);
  }
  return words;
}

/**
 * Fire-and-forget: server runs Gemini + Supabase persist in `after()` — does not block UI.
 */
export function triggerPrefetchNextWordsLocale(
  words: string[],
  locale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): void {
  if (typeof window === "undefined") return;
  if (locale === DEFAULT_LEARNER_LOCALE || words.length === 0) return;

  const normalized = [
    ...new Set(words.map((w) => w.trim().toLowerCase()).filter(Boolean)),
  ].slice(0, PREFETCH_NEXT_WORDS_MAX);
  if (!normalized.length) return;

  const batchKey = `${locale}:${normalized.join(",")}`;
  if (inflightKeys.has(batchKey)) return;
  inflightKeys.add(batchKey);

  void fetch("/api/words/prefetch-locale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words: normalized, locale }),
    keepalive: true,
  })
    .catch(() => {
      /* best-effort */
    })
    .finally(() => {
      window.setTimeout(() => inflightKeys.delete(batchKey), 30_000);
    });
}
