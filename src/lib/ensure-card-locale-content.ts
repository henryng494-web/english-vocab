import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  discoverDataNeedsSpanishHydration,
  hasCompleteEsCardContent,
} from "@/lib/card-localized-display";
import { getPresetRank } from "@/data/preset-word-details";
import type { LearnerLocale } from "@/lib/learner-locale";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";

const inflight = new Map<string, Promise<DiscoverWordData | null>>();

function cacheKey(word: string, locale: LearnerLocale): string {
  return `${locale}:${word.trim().toLowerCase()}`;
}

/** On-demand Spanish hydration for the visible card only (no batch prefetch). */
export function ensureCardSpanishContent(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): Promise<DiscoverWordData | null> {
  if (learnerLocale !== "es") return Promise.resolve(null);
  if (hasCompleteEsCardContent(data)) return Promise.resolve(null);

  const key = cacheKey(data.word, learnerLocale);
  const existing = inflight.get(key);
  if (existing) return existing;

  const task = fetchSpanishWord(data)
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, task);
  return task;
}

async function fetchSpanishWord(
  data: DiscoverWordData,
): Promise<DiscoverWordData | null> {
  const word = data.word.trim().toLowerCase();
  if (!word) return null;
  const params = new URLSearchParams({
    word,
    rank: String(data.rank ?? getPresetRank(word) ?? 10000),
    locale: "es",
    skipGemini: "false",
  });
  const res = await fetch(`/api/discover/word?${params}`, { cache: "no-store" });
  if (!res.ok) {
    let detail = "";
    try {
      const errBody = (await res.json()) as { error?: string; details?: string };
      detail = errBody.details ?? errBody.error ?? "";
    } catch {
      // ignore
    }
    console.warn(
      `[Locale Debug] discover/word failed (${res.status}) for "${word}":`,
      detail || res.statusText,
    );
    return null;
  }
  const payload = (await res.json()) as { word?: DiscoverWordData };
  if (!payload.word?.word?.trim()) {
    console.warn(`[Locale Debug] discover/word empty payload for "${word}"`);
    return null;
  }
  console.info("[Locale Debug] discover/word es hydrate ok", {
    word,
    meaningsEs: payload.word.meanings?.es?.slice(0, 40),
    phraseEs: Boolean(payload.word.phrase_translations),
  });
  return { ...data, ...payload.word };
}
