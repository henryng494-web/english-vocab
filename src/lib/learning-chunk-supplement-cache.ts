import type { LearningChunkPhrase } from "@/data/demo-learning-chunks";

const STORAGE_KEY = "learning-chunk-supplement-v1";

type CacheStore = Record<string, LearningChunkPhrase[]>;

function cacheKey(word: string, existing: string[]): string {
  const existingKey = existing.map((item) => item.trim().toLowerCase()).join("|");
  return `${word.trim().toLowerCase()}::${existingKey}`;
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

export function getCachedSupplementCollocations(
  word: string,
  existing: string[],
): LearningChunkPhrase[] | null {
  const hit = readStore()[cacheKey(word, existing)];
  return hit?.length ? hit : null;
}

export function setCachedSupplementCollocations(
  word: string,
  existing: string[],
  collocations: LearningChunkPhrase[],
): void {
  if (!collocations.length) return;
  const store = readStore();
  store[cacheKey(word, existing)] = collocations;
  writeStore(store);
}
