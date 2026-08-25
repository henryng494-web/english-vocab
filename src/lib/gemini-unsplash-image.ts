/**
 * Two-step vocabulary illustration pipeline:
 * 1. Gemini Lite → concrete stock-photo search phrase (3–5 English words)
 * 2. Unsplash / Pexels → best matching photo URL
 *
 * On Gemini quota errors, falls back to the English headword as the stock query.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  fetchStockImageForQuery,
  getDefaultLearningImageDataUrl,
  markGeminiPipelineImageUrl,
  markSemanticImageUrl,
} from "@/lib/unsplash";

/**
 * Lite models only — generous free-tier daily limits (~1,500 req/day).
 * Override with GEMINI_IMAGE_MODEL if needed.
 */
const GEMINI_IMAGE_MODELS = [
  process.env.GEMINI_IMAGE_MODEL?.trim(),
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
].filter((model): model is string => Boolean(model));

/** De-dupe while preserving order. */
const UNIQUE_GEMINI_IMAGE_MODELS = [...new Set(GEMINI_IMAGE_MODELS)];

export type VocabIllustrationInput = {
  word: string;
  partOfSpeech: string;
  meaning: string;
};

export type VocabIllustrationResult = {
  imageUrl: string;
  searchPhrase: string | null;
  source: "gemini-stock" | "direct-stock" | "placeholder";
};

function isGeminiQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /429|quota|rate limit|too many requests|resource exhausted/i.test(
    message,
  );
}

function cleanGeminiSearchPhrase(raw: string, word: string): string | null {
  const line = raw
    .trim()
    .split(/\r?\n/)
    .map((part) => part.trim())
    .find(Boolean);
  if (!line) return null;

  const cleaned = line
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^(search phrase|query|keyword):\s*/i, "")
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!cleaned) return null;

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length < 2 || tokens.length > 8) return null;
  if (tokens.every((token) => token === word.toLowerCase())) return null;

  return tokens.slice(0, 5).join(" ");
}

function buildGeminiImagePrompt(
  word: string,
  partOfSpeech: string,
  meaning: string,
): string {
  return `You are a stock-photo search expert for English vocabulary flashcards.

Word: "${word}"
Part of speech: ${partOfSpeech}
Vietnamese or English meaning: ${meaning}

Task: Analyze the PRIMARY everyday sense and output exactly ONE short English stock-photo search phrase.

Rules:
- 3 to 5 concrete English words describing a visible scene, object, or action
- Must be searchable on Unsplash
- No abstract words alone, no the word "${word}" by itself, no quotes
- For adjectives: show the quality visually (e.g. "pale" → "pale tired face portrait")
- For verbs: show a person doing the action
- For nouns: show the object or typical scene

Reply with ONLY the search phrase. No greeting, no explanation, no punctuation except spaces.`;
}

/** Ordered stock queries from the English headword when Gemini is unavailable. */
export function buildDirectWordStockQueries(
  word: string,
  partOfSpeech: string,
): string[] {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return [];

  const pos = partOfSpeech.trim().toLowerCase() || "noun";
  const queries: string[] = [];

  if (normalized.includes(" ")) {
    queries.push(normalized);
  } else {
    queries.push(normalized);
    if (pos === "verb") {
      queries.push(`person ${normalized} action`);
    } else if (pos === "adjective" || pos === "adverb") {
      queries.push(`${normalized} scene`);
    } else {
      queries.push(`${normalized} object`);
    }
  }

  return [...new Set(queries)];
}

async function fetchStockForQueries(
  word: string,
  queries: string[],
): Promise<{ url: string; query: string } | null> {
  for (const query of queries) {
    const trimmed = query.trim();
    if (!trimmed) continue;

    const url = await fetchStockImageForQuery(word, trimmed);
    if (url) return { url, query: trimmed };

    const tokens = trimmed.split(/\s+/).filter(Boolean);
    if (tokens.length > 2) {
      const shorter = await fetchStockImageForQuery(
        word,
        tokens.slice(0, 2).join(" "),
      );
      if (shorter) {
        return { url: shorter, query: tokens.slice(0, 2).join(" ") };
      }
    }
  }
  return null;
}

/**
 * Step 1 — Ask Gemini Lite for one concrete stock-photo search phrase.
 * Returns null on quota errors so callers can use direct-word fallback.
 */
export async function generateStockSearchPhraseWithGemini(
  input: VocabIllustrationInput,
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const word = input.word.trim().toLowerCase();
  const partOfSpeech = input.partOfSpeech.trim() || "noun";
  const meaning = input.meaning.trim();
  if (!word || !meaning) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = buildGeminiImagePrompt(word, partOfSpeech, meaning);

    for (const modelName of UNIQUE_GEMINI_IMAGE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const phrase = cleanGeminiSearchPhrase(result.response.text(), word);
        if (phrase) return phrase;
      } catch (error) {
        if (isGeminiQuotaError(error)) {
          console.warn(
            `[gemini-unsplash-image] Gemini quota exceeded for "${word}" — using direct word fallback`,
          );
          return null;
        }
        console.warn(
          `[gemini-unsplash-image] Gemini model "${modelName}" failed for "${word}":`,
          error instanceof Error ? error.message : error,
        );
      }
    }
    return null;
  } catch (error) {
    if (isGeminiQuotaError(error)) {
      console.warn(
        `[gemini-unsplash-image] Gemini quota exceeded for "${word}" — using direct word fallback`,
      );
      return null;
    }
    console.warn(
      `[gemini-unsplash-image] Gemini failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/** Step 2 — Search Unsplash/Pexels for one phrase. */
export async function fetchUnsplashImageUrl(
  word: string,
  searchPhrase: string,
): Promise<string | null> {
  const normalizedWord = word.trim().toLowerCase();
  const query = searchPhrase.trim();
  if (!normalizedWord || !query) return null;

  if (
    !process.env.UNSPLASH_ACCESS_KEY?.trim() &&
    !process.env.PEXELS_API_KEY?.trim()
  ) {
    console.warn(
      "[gemini-unsplash-image] UNSPLASH_ACCESS_KEY and PEXELS_API_KEY are not set",
    );
    return null;
  }

  return fetchStockImageForQuery(normalizedWord, query);
}

/**
 * Full pipeline: Gemini Lite phrase → stock photo.
 * On Gemini miss/quota, searches Unsplash/Pexels with the English headword.
 */
export async function fetchVocabIllustrationImage(
  input: VocabIllustrationInput,
): Promise<VocabIllustrationResult> {
  const word = input.word.trim().toLowerCase();
  const partOfSpeech = input.partOfSpeech.trim() || "noun";
  const meaning = input.meaning.trim();
  const placeholder = getDefaultLearningImageDataUrl(word, partOfSpeech);

  if (!word || !meaning) {
    return { imageUrl: placeholder, searchPhrase: null, source: "placeholder" };
  }

  try {
    const geminiPhrase = await generateStockSearchPhraseWithGemini({
      word,
      partOfSpeech,
      meaning,
    });

    if (geminiPhrase) {
      const geminiStock = await fetchStockForQueries(word, [geminiPhrase]);
      if (geminiStock) {
        return {
          imageUrl: markGeminiPipelineImageUrl(geminiStock.url),
          searchPhrase: geminiStock.query,
          source: "gemini-stock",
        };
      }
    }

    const directQueries = buildDirectWordStockQueries(word, partOfSpeech);
    const directStock = await fetchStockForQueries(word, directQueries);
    if (directStock) {
      console.warn(
        `[gemini-unsplash-image] Direct word stock fallback for "${word}" → "${directStock.query}"`,
      );
      return {
        imageUrl: markSemanticImageUrl(directStock.url),
        searchPhrase: directStock.query,
        source: "direct-stock",
      };
    }

    return {
      imageUrl: placeholder,
      searchPhrase: geminiPhrase ?? directQueries[0] ?? null,
      source: "placeholder",
    };
  } catch (error) {
    console.warn(
      `[gemini-unsplash-image] Pipeline failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );

    const directStock = await fetchStockForQueries(
      word,
      buildDirectWordStockQueries(word, partOfSpeech),
    );
    if (directStock) {
      return {
        imageUrl: markSemanticImageUrl(directStock.url),
        searchPhrase: directStock.query,
        source: "direct-stock",
      };
    }

    return { imageUrl: placeholder, searchPhrase: null, source: "placeholder" };
  }
}

/** Returns a stock photo URL, or null when only the SVG placeholder remains. */
export async function fetchVocabIllustrationImageOrNull(
  input: VocabIllustrationInput,
): Promise<{ imageUrl: string; searchPhrase: string } | null> {
  const result = await fetchVocabIllustrationImage(input);
  if (result.source === "placeholder") return null;
  return {
    imageUrl: result.imageUrl,
    searchPhrase: result.searchPhrase!,
  };
}
