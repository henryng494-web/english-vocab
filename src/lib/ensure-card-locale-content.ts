import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { discoverDataNeedsSpanishHydration } from "@/lib/card-localized-display";
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
  if (!discoverDataNeedsSpanishHydration(data)) return Promise.resolve(null);

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
  if (!res.ok) return null;
  const payload = (await res.json()) as { word?: DiscoverWordData };
  if (!payload.word?.word?.trim()) return null;
  return { ...data, ...payload.word };
}
