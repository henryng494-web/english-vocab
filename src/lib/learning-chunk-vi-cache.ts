import type { LearningChunkPhrase } from "@/data/demo-learning-chunks";
import {
  DEFAULT_LEARNER_LOCALE,
  type LearnerLocale,
} from "@/lib/learner-locale";

const STORAGE_KEY = "learning-chunk-vi-cache-v3";

type CacheEntry = {
  collocations: LearningChunkPhrase[];
};

type CacheStore = Record<string, CacheEntry>;

function cacheKey(
  word: string,
  phrases: LearningChunkPhrase[],
  locale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): string {
  const enKey = phrases.map((item) => item.en.trim().toLowerCase()).join("|");
  return `${locale}:${word.trim().toLowerCase()}::${enKey}`;
}

function readStore(): CacheStore {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CacheStore;
  } catch {
    return {};
  }
}

function writeStore(store: CacheStore): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

export function getCachedCollocationTranslations(
  word: string,
  phrases: LearningChunkPhrase[],
  locale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): LearningChunkPhrase[] | null {
  const key = cacheKey(word, phrases, locale);
  const hit = readStore()[key];
  if (!hit?.collocations?.length) return null;
  if (hit.collocations.length !== phrases.length) return null;
  return hit.collocations;
}

export function setCachedCollocationTranslations(
  word: string,
  phrases: LearningChunkPhrase[],
  translated: LearningChunkPhrase[],
  locale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): void {
  if (!translated.length) return;
  const key = cacheKey(word, phrases, locale);
  const store = readStore();
  store[key] = { collocations: translated };
  writeStore(store);
}
