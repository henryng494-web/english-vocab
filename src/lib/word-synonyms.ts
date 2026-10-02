import { generateSimilarWordsWithGemini } from "@/lib/gemini-core";
import { normalizeSimilarWords } from "@/lib/similar-words-normalize";
import { getFamilyDisplayWords } from "@/lib/word-family";

export { normalizeSimilarWords };

const SIMILAR_WORDS_CACHE = new Map<string, string[]>();
const SIMILAR_WORDS_CACHE_MAX = 6000;

export type SimilarWordsContext = {
  word: string;
  pos?: string | null;
  meaning?: string | null;
  englishDefinition?: string | null;
  /** Precomputed from enrichment — skips Gemini lookup. */
  preset?: string[] | null;
};

function cacheKey(ctx: SimilarWordsContext): string {
  return `${ctx.word.trim().toLowerCase()}:${ctx.pos?.trim().toLowerCase() ?? ""}`;
}

export async function resolveSimilarWords(
  ctx: SimilarWordsContext,
): Promise<string[]> {
  const headword = ctx.word.trim().toLowerCase();
  if (!headword) return [];

  const familyWords = getFamilyDisplayWords(headword);
  const preset = normalizeSimilarWords(ctx.preset, headword, familyWords);
  if (preset.length) return preset;

  const key = cacheKey(ctx);
  const cached = SIMILAR_WORDS_CACHE.get(key);
  if (cached) return cached;

  const fromGemini = await generateSimilarWordsWithGemini(
    headword,
    ctx.pos,
    ctx.meaning,
    ctx.englishDefinition,
    familyWords,
  );
  const resolved = normalizeSimilarWords(fromGemini, headword, familyWords);

  // Never cache an empty result: a transient Gemini failure (402/429/timeout)
  // would otherwise hide the Family button until the server restarts.
  if (!resolved.length) return resolved;

  if (SIMILAR_WORDS_CACHE.size >= SIMILAR_WORDS_CACHE_MAX) {
    const first = SIMILAR_WORDS_CACHE.keys().next().value;
    if (first) SIMILAR_WORDS_CACHE.delete(first);
  }
  SIMILAR_WORDS_CACHE.set(key, resolved);
  return resolved;
}

export async function withSimilarWords<
  T extends {
    word: string;
    word_type?: string | null;
    vietnamese_meaning?: string | null;
    english_definition?: string | null;
    similar_words?: string[] | null;
  },
>(data: T): Promise<T & { similar_words: string[] }> {
  const similar_words = await resolveSimilarWords({
    word: data.word,
    pos: data.word_type,
    meaning: data.vietnamese_meaning,
    englishDefinition: data.english_definition,
    preset: data.similar_words,
  });
  return { ...data, similar_words };
}
