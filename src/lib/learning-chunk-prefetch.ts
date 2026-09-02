import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  LEARNING_CHUNK_OVERRIDES,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import {
  getCachedCollocationTranslations,
  setCachedCollocationTranslations,
} from "@/lib/learning-chunk-vi-cache";
import {
  getCachedSupplementCollocations,
  setCachedSupplementCollocations,
} from "@/lib/learning-chunk-supplement-cache";
import { resolveWordRegister } from "@/lib/word-meanings";

type ChunkPrefetchInput = Pick<
  DiscoverWordData,
  | "word"
  | "word_type"
  | "vietnamese_meaning"
  | "english_definition"
  | "examples"
  | "register"
  | "collocations"
>;

function findContextForCollocation(
  collocationEn: string,
  examples: LearningChunkPhrase[],
): LearningChunkPhrase | null {
  const key = collocationEn.trim().toLowerCase();
  for (const ex of examples) {
    if (ex.en.trim().toLowerCase().includes(key)) return ex;
  }
  return examples[0] ?? null;
}

function prefetchKey(word: string, entry: { collocations: LearningChunkPhrase[]; chunks: LearningChunkPhrase[] }): string {
  const col = entry.collocations.map((item) => item.en.trim().toLowerCase()).join("|");
  const chunks = entry.chunks.map((item) => item.en.trim().toLowerCase()).join("|");
  return `${word.trim().toLowerCase()}::${col}::${chunks}`;
}

const inflight = new Map<string, Promise<void>>();

async function prefetchSupplementCollocations(
  data: ChunkPrefetchInput,
  entry: { collocations: LearningChunkPhrase[]; chunks: LearningChunkPhrase[] },
): Promise<void> {
  if (entry.collocations.length > 0 || !entry.chunks.length) return;

  const cached = getCachedSupplementCollocations(data.word, []);
  if (cached?.length) return;

  const usefulPhrase = entry.chunks[0];
  const response = await fetch("/api/learning-chunks/supplement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word: data.word,
      wordType: data.word_type,
      meaning: data.vietnamese_meaning,
      register: resolveWordRegister(data),
      englishDefinition: data.english_definition,
      existing: [],
      usefulPhrase: usefulPhrase
        ? { en: usefulPhrase.en, vi: usefulPhrase.vi }
        : null,
      count: MAX_LEARNING_COLLOCATIONS,
    }),
  });

  if (!response.ok) return;

  const body = (await response.json()) as {
    collocations?: LearningChunkPhrase[];
  };
  const supplemented = body.collocations?.filter(
    (item) => item.en?.trim() && item.vi?.trim(),
  );
  if (!supplemented?.length) return;

  setCachedSupplementCollocations(data.word, [], supplemented);
}

async function prefetchCollocationTranslations(
  data: ChunkPrefetchInput,
  entry: { collocations: LearningChunkPhrase[]; chunks: LearningChunkPhrase[] },
): Promise<void> {
  const pending = entry.collocations.filter((item) => !item.vi.trim());
  if (!pending.length) return;

  const cachedTranslations = getCachedCollocationTranslations(data.word, pending);
  if (cachedTranslations?.length) return;

  const contextPool = [...entry.chunks];
  const response = await fetch("/api/learning-chunks/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word: data.word,
      wordType: data.word_type,
      meaning: data.vietnamese_meaning,
      register: resolveWordRegister(data),
      englishDefinition: data.english_definition,
      phrases: pending.map((item) => {
        const context = findContextForCollocation(item.en, contextPool);
        return {
          en: item.en,
          sense: item.sense,
          contextEn: context?.en,
          contextVi: context?.vi,
        };
      }),
    }),
  });

  if (!response.ok) return;

  const body = (await response.json()) as {
    translations?: LearningChunkPhrase[];
  };
  const translated = body.translations?.filter((item) => item.vi?.trim());
  if (!translated?.length) return;

  setCachedCollocationTranslations(data.word, pending, translated);
}

/** Warm sessionStorage caches for Goes-with / phrase VI before the card opens. */
export function prefetchLearningChunkContent(
  data: ChunkPrefetchInput | null | undefined,
): void {
  if (!data?.word?.trim() || !data.vietnamese_meaning?.trim()) return;

  const key = data.word.trim().toLowerCase();
  if (LEARNING_CHUNK_OVERRIDES[key]) return;

  const entry = resolveLearningChunks(data.word, {
    examples: data.examples,
    wordType: data.word_type,
    meaning: data.vietnamese_meaning,
  });
  if (!entry) return;
  if (!entry.collocations.length && !entry.chunks.length) return;

  const dedupeKey = prefetchKey(data.word, entry);
  const existing = inflight.get(dedupeKey);
  if (existing) return;

  const promise = (async () => {
    try {
      await prefetchSupplementCollocations(data, entry);

      const supplemented = getCachedSupplementCollocations(data.word, []);
      const collocations =
        entry.collocations.length > 0
          ? entry.collocations
          : (supplemented ?? []);

      if (!collocations.length) return;

      await prefetchCollocationTranslations(data, {
        collocations,
        chunks: entry.chunks,
      });
    } catch {
      /* best-effort warm cache */
    }
  })();

  inflight.set(dedupeKey, promise);
  void promise.finally(() => {
    if (inflight.get(dedupeKey) === promise) {
      inflight.delete(dedupeKey);
    }
  });
}
