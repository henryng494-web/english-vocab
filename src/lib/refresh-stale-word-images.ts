import { shouldRefreshImageUrl } from "@/lib/unsplash";
import { setCachedWordImageUrl } from "@/lib/word-image-cache";

export type StaleWordImageTarget = {
  word: string;
  imageUrl?: string | null;
  meaning?: string | null;
  wordType?: string | null;
  searchKeyword?: string | null;
};

const BATCH_SIZE = 12;

export function isStaleWordImage(
  word: string,
  imageUrl?: string | null,
): boolean {
  return shouldRefreshImageUrl(imageUrl, word);
}

export function collectStaleWordImageTargets<
  T extends StaleWordImageTarget,
>(items: T[]): T[] {
  const seen = new Set<string>();
  const stale: T[] = [];
  for (const item of items) {
    const word = item.word.trim().toLowerCase();
    if (!word || seen.has(word)) continue;
    if (!isStaleWordImage(word, item.imageUrl)) continue;
    seen.add(word);
    stale.push(item);
  }
  return stale;
}

/** Refresh stale photos via /api/word-image/batch and return word→url updates. */
export async function refreshStaleWordImages(
  targets: StaleWordImageTarget[],
  concurrency = 2,
): Promise<Record<string, string>> {
  const stale = collectStaleWordImageTargets(targets);
  if (stale.length === 0) return {};

  const updates: Record<string, string> = {};
  const batches: StaleWordImageTarget[][] = [];
  for (let i = 0; i < stale.length; i += BATCH_SIZE) {
    batches.push(stale.slice(i, i + BATCH_SIZE));
  }

  let batchIndex = 0;
  async function worker() {
    while (batchIndex < batches.length) {
      const current = batchIndex;
      batchIndex += 1;
      const batch = batches[current]!;
      try {
        const res = await fetch("/api/word-image/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: batch.map((item) => ({
              word: item.word,
              keyword: item.searchKeyword?.trim() || undefined,
              pos: item.wordType?.trim() || undefined,
              meaning: item.meaning?.trim() || undefined,
            })),
          }),
        });
        if (!res.ok) throw new Error(`batch ${res.status}`);
        const data = (await res.json()) as {
          images?: Record<string, string | null>;
        };
        for (const item of batch) {
          const word = item.word.trim().toLowerCase();
          const url = data.images?.[word]?.trim();
          if (url && !shouldRefreshImageUrl(url, word, item.wordType)) {
            updates[word] = url;
            setCachedWordImageUrl(word, url);
          }
        }
      } catch {
        await Promise.all(
          batch.map(async (item) => {
            const word = item.word.trim().toLowerCase();
            const params = new URLSearchParams({ word: item.word });
            if (item.searchKeyword?.trim()) {
              params.set("keyword", item.searchKeyword.trim());
            }
            if (item.wordType?.trim()) {
              params.set("pos", item.wordType.trim());
            }
            if (item.meaning?.trim()) {
              params.set("meaning", item.meaning.trim());
            }
            try {
              const res = await fetch(`/api/word-image?${params}`, {
                cache: "no-store",
              });
              const data = (await res.json()) as { image_url?: string | null };
              const url = data.image_url?.trim();
              if (url && !shouldRefreshImageUrl(url, word, item.wordType)) {
                updates[word] = url;
                setCachedWordImageUrl(word, url);
              }
            } catch {
              /* best-effort */
            }
          }),
        );
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, batches.length) }, () => worker()),
  );

  return updates;
}

/** Keep calling batch refresh until no stale targets remain (background warm). */
export async function refreshAllStaleWordImages(
  targets: StaleWordImageTarget[],
  concurrency = 3,
  maxRounds = 20,
): Promise<Record<string, string>> {
  const allUpdates: Record<string, string> = {};
  let round = 0;
  let remaining = collectStaleWordImageTargets(targets);

  while (remaining.length > 0 && round < maxRounds) {
    round += 1;
    const updates = await refreshStaleWordImages(remaining, concurrency);
    if (Object.keys(updates).length === 0) break;
    Object.assign(allUpdates, updates);
    remaining = collectStaleWordImageTargets(
      targets.map((target) => {
        const key = target.word.trim().toLowerCase();
        return updates[key]
          ? { ...target, imageUrl: updates[key] }
          : target;
      }),
    );
  }

  return allUpdates;
}

/** Refresh one word photo when the stored URL is not from the current pipeline. */
export async function refreshSingleWordImage(
  target: StaleWordImageTarget,
): Promise<string | null> {
  const word = target.word.trim().toLowerCase();
  if (!word) return null;
  if (!shouldRefreshImageUrl(target.imageUrl, word, target.wordType)) {
    return target.imageUrl?.trim() ?? null;
  }

  const params = new URLSearchParams({ word });
  if (target.searchKeyword?.trim()) {
    params.set("keyword", target.searchKeyword.trim());
  }
  if (target.wordType?.trim()) {
    params.set("pos", target.wordType.trim());
  }
  if (target.meaning?.trim()) {
    params.set("meaning", target.meaning.trim());
  }

  try {
    const res = await fetch(`/api/word-image?${params}`, { cache: "no-store" });
    const data = (await res.json()) as { image_url?: string | null };
    const url = data.image_url?.trim() ?? null;
    if (url && !shouldRefreshImageUrl(url, word, target.wordType)) {
      setCachedWordImageUrl(word, url);
      return url;
    }
  } catch {
    /* ignore */
  }
  return null;
}
