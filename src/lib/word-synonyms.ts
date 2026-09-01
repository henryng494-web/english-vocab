import { generateSimilarWordsWithGemini } from "@/lib/gemini-core";
import { getFamilyDisplayWords } from "@/lib/word-family";

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

/** Normalize learner-facing similar words (1–3 English tokens). */
export function normalizeSimilarWords(
  raw: unknown,
  headword: string,
  familyWords: string[] = [],
): string[] {
  const blocked = new Set(
    [headword, ...familyWords].map((item) => item.trim().toLowerCase()),
  );
  const items = Array.isArray(raw) ? raw : [];
  const out: string[] = [];

  for (const item of items) {
    const word = String(item ?? "")
      .trim()
      .toLowerCase();
    if (!/^[a-z][a-z'-]{0,24}$/.test(word)) continue;
    if (blocked.has(word)) continue;
    if (out.includes(word)) continue;
    out.push(word);
    if (out.length >= 3) break;
  }

  return out;
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
