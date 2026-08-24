/**
 * Two-step vocabulary illustration pipeline:
 * 1. Gemini → concrete stock-photo search phrase (3–5 English words)
 * 2. Unsplash → best matching photo URL (alt-text scoring)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  fetchUnsplashImageForQuery,
  getDefaultLearningImageDataUrl,
  markGeminiPipelineImageUrl,
} from "@/lib/unsplash";

/** Override with GEMINI_IMAGE_MODEL (e.g. gemini-1.5-flash) if your key supports it. */
const GEMINI_IMAGE_MODELS = [
  process.env.GEMINI_IMAGE_MODEL?.trim(),
  "gemini-3.6-flash",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
].filter((model): model is string => Boolean(model));

export type VocabIllustrationInput = {
  word: string;
  partOfSpeech: string;
  meaning: string;
};

export type VocabIllustrationResult = {
  /** Resolved image URL (Unsplash or SVG placeholder). */
  imageUrl: string;
  /** Search phrase produced by Gemini (null when Gemini failed). */
  searchPhrase: string | null;
  /** Where the final image URL came from. */
  source: "unsplash" | "placeholder";
};

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

/**
 * Step 1 — Ask Gemini for one concrete stock-photo search phrase.
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

    for (const modelName of GEMINI_IMAGE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const phrase = cleanGeminiSearchPhrase(result.response.text(), word);
        if (phrase) return phrase;
      } catch (error) {
        console.warn(
          `[gemini-unsplash-image] Gemini model "${modelName}" failed for "${word}":`,
          error instanceof Error ? error.message : error,
        );
      }
    }
    return null;
  } catch (error) {
    console.warn(
      `[gemini-unsplash-image] Gemini failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

async function fetchUnsplashForPhrase(
  word: string,
  searchPhrase: string,
): Promise<string | null> {
  const query = searchPhrase.trim();
  if (!query) return null;

  const primary = await fetchUnsplashImageForQuery(word, query);
  if (primary) return primary;

  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length > 3) {
    const shorter = await fetchUnsplashImageForQuery(
      word,
      tokens.slice(0, 3).join(" "),
    );
    if (shorter) return shorter;
  }
  if (tokens.length > 2) {
    const tail = await fetchUnsplashImageForQuery(
      word,
      tokens.slice(-2).join(" "),
    );
    if (tail) return tail;
  }
  return null;
}

/**
 * Step 2 — Search Unsplash and return the best scored photo URL.
 */
export async function fetchUnsplashImageUrl(
  word: string,
  searchPhrase: string,
): Promise<string | null> {
  const normalizedWord = word.trim().toLowerCase();
  const query = searchPhrase.trim();
  if (!normalizedWord || !query) return null;

  if (!process.env.UNSPLASH_ACCESS_KEY?.trim()) {
    console.warn("[gemini-unsplash-image] UNSPLASH_ACCESS_KEY is not set");
    return null;
  }

  return fetchUnsplashForPhrase(normalizedWord, query);
}

/**
 * Full pipeline: Gemini search phrase → Unsplash photo.
 * Returns placeholder SVG when either step fails.
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
    const searchPhrase = await generateStockSearchPhraseWithGemini({
      word,
      partOfSpeech,
      meaning,
    });

    if (!searchPhrase) {
      return { imageUrl: placeholder, searchPhrase: null, source: "placeholder" };
    }

    const unsplashUrl = await fetchUnsplashImageUrl(word, searchPhrase);
    if (unsplashUrl) {
      return {
        imageUrl: markGeminiPipelineImageUrl(unsplashUrl),
        searchPhrase,
        source: "unsplash",
      };
    }

    return { imageUrl: placeholder, searchPhrase, source: "placeholder" };
  } catch (error) {
    console.warn(
      `[gemini-unsplash-image] Pipeline failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return { imageUrl: placeholder, searchPhrase: null, source: "placeholder" };
  }
}

/** Convenience alias — returns null instead of placeholder on total failure. */
export async function fetchVocabIllustrationImageOrNull(
  input: VocabIllustrationInput,
): Promise<{ imageUrl: string; searchPhrase: string } | null> {
  const result = await fetchVocabIllustrationImage(input);
  if (result.source !== "unsplash") return null;
  return {
    imageUrl: result.imageUrl,
    searchPhrase: result.searchPhrase!,
  };
}
