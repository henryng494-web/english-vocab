import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  discoverDataNeedsLocaleHydration,
  hasCompleteLocaleCardContent,
} from "@/lib/card-localized-display";
import { getPresetRankLite as getPresetRank } from "@/data/preset-rank-map";
import type { LearnerLocale } from "@/lib/learner-locale";
import {
  DEFAULT_LEARNER_LOCALE,
  learnerLocaleNeedsHydration,
} from "@/lib/learner-locale";

const inflight = new Map<string, Promise<DiscoverWordData | null>>();

function cacheKey(word: string, locale: LearnerLocale): string {
  return `${locale}:${word.trim().toLowerCase()}`;
}

/** On-demand locale hydration (also used by background prefetch ahead of the card). */
export function ensureCardLocaleContent(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): Promise<DiscoverWordData | null> {
  if (!learnerLocaleNeedsHydration(learnerLocale)) {
    return Promise.resolve(null);
  }
  if (hasCompleteLocaleCardContent(data, learnerLocale)) {
    return Promise.resolve(null);
  }

  const key = cacheKey(data.word, learnerLocale);
  const existing = inflight.get(key);
  if (existing) return existing;

  const task = fetchLocaleWord(data, learnerLocale).finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, task);
  return task;
}

/** @deprecated Use `ensureCardLocaleContent`. */
export function ensureCardSpanishContent(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): Promise<DiscoverWordData | null> {
  return ensureCardLocaleContent(data, learnerLocale);
}

async function fetchLocaleWord(
  data: DiscoverWordData,
  locale: LearnerLocale,
): Promise<DiscoverWordData | null> {
  const word = data.word.trim().toLowerCase();
  if (!word) return null;
  const params = new URLSearchParams({
    word,
    rank: String(data.rank ?? getPresetRank(word) ?? 10000),
    locale,
    skipGemini: "false",
  });
  const controller = new AbortController();
  const clientTimeoutMs = 12_000;
  const timeoutId = setTimeout(() => controller.abort(), clientTimeoutMs);
  let res: Response;
  try {
    res = await fetch(`/api/discover/word?${params}`, {
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    console.warn(
      `[Locale Debug] discover/word request failed for "${word}" locale=${locale}:`,
      error,
    );
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
  if (!res.ok) {
    let detail = "";
    try {
      const errBody = (await res.json()) as { error?: string; details?: string };
      detail = errBody.details ?? errBody.error ?? "";
    } catch {
      // ignore
    }
    console.warn(
      `[Locale Debug] discover/word failed (${res.status}) for "${word}" locale=${locale}:`,
      detail || res.statusText,
    );
    return null;
  }
  const payload = (await res.json()) as { word?: DiscoverWordData };
  if (!payload.word?.word?.trim()) {
    console.warn(
      `[Locale Debug] discover/word empty payload for "${word}" locale=${locale}`,
    );
    return null;
  }
  return { ...data, ...payload.word };
}
