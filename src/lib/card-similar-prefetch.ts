import { getFamilyDisplayWords } from "@/lib/word-family";
import { normalizeSimilarWords } from "@/lib/word-synonyms";

export type CardSimilarPrefetchInput = {
  word: string;
  wordType?: string | null;
  meaning?: string | null;
  englishDefinition?: string | null;
  preset?: string[] | null;
};

function cacheKey(
  word: string,
  pos?: string | null,
  meaning?: string | null,
): string {
  return `${word.trim().toLowerCase()}:${pos?.trim().toLowerCase() ?? ""}:${meaning?.trim() ?? ""}`;
}

const clientSimilarCache = new Map<string, string[]>();
const inflight = new Map<string, Promise<string[]>>();

export function getCachedCardSimilarWords(
  input: CardSimilarPrefetchInput,
): string[] | null {
  const headword = input.word.trim().toLowerCase();
  if (!headword) return null;

  const preset = normalizeSimilarWords(
    input.preset,
    headword,
    getFamilyDisplayWords(headword),
  );
  if (preset.length) return preset;

  const cached = clientSimilarCache.get(
    cacheKey(headword, input.wordType, input.meaning),
  );
  return cached ?? null;
}

/** Warm similar-word cache before the Family tab becomes interactive. */
export function prefetchCardSimilarWords(
  input: CardSimilarPrefetchInput | null | undefined,
): Promise<string[]> {
  if (!input?.word?.trim()) return Promise.resolve([]);

  const headword = input.word.trim().toLowerCase();
  const preset = normalizeSimilarWords(
    input.preset,
    headword,
    getFamilyDisplayWords(headword),
  );
  if (preset.length) {
    const key = cacheKey(headword, input.wordType, input.meaning);
    clientSimilarCache.set(key, preset);
    return Promise.resolve(preset);
  }

  const key = cacheKey(headword, input.wordType, input.meaning);
  const cached = clientSimilarCache.get(key);
  if (cached) return Promise.resolve(cached);

  const existing = inflight.get(key);
  if (existing) return existing;

  const params = new URLSearchParams({ word: headword });
  if (input.wordType?.trim()) params.set("pos", input.wordType.trim());
  if (input.meaning?.trim()) params.set("meaning", input.meaning.trim());
  if (input.englishDefinition?.trim()) {
    params.set("definition", input.englishDefinition.trim());
  }

  const promise = fetch(`/api/word/similar?${params.toString()}`, {
    cache: "no-store",
  })
    .then(async (response) => {
      if (!response.ok) return { similar_words: [] as string[] };
      return (await response.json()) as { similar_words?: string[] };
    })
    .then((payload) => {
      const resolved = normalizeSimilarWords(
        payload.similar_words,
        headword,
        getFamilyDisplayWords(headword),
      );
      clientSimilarCache.set(key, resolved);
      return resolved;
    })
    .catch(() => {
      clientSimilarCache.set(key, []);
      return [] as string[];
    })
    .finally(() => {
      if (inflight.get(key) === promise) {
        inflight.delete(key);
      }
    });

  inflight.set(key, promise);
  return promise;
}
