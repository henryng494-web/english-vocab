/**
 * Two-step vocabulary illustration pipeline:
 * 1. Gemini → concrete stock-photo search phrase (3–5 English words)
 * 2. Pexels → first matching photo URL
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDefaultLearningImageDataUrl } from "@/lib/unsplash";

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
  /** Resolved image URL (Pexels or SVG placeholder). */
  imageUrl: string;
  /** Search phrase produced by Gemini (null when Gemini failed). */
  searchPhrase: string | null;
  /** Where the final image URL came from. */
  source: "pexels" | "placeholder";
};

type PexelsSearchResponse = {
  photos?: Array<{
    src?: { medium?: string; large?: string; landscape?: string };
  }>;
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
- Must be searchable on stock photo sites (Pexels)
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
          `[gemini-pexels-image] Gemini model "${modelName}" failed for "${word}":`,
          error instanceof Error ? error.message : error,
        );
      }
    }
    return null;
  } catch (error) {
    console.warn(
      `[gemini-pexels-image] Gemini failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Step 2 — Search Pexels and return medium/large image URL.
 */
export async function fetchPexelsImageUrl(
  searchPhrase: string,
): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return null;

  const query = searchPhrase.trim();
  if (!query) return null;

  try {
    const params = new URLSearchParams({
      query,
      per_page: "1",
      orientation: "landscape",
    });

    const response = await fetch(
      `https://api.pexels.com/v1/search?${params}`,
      {
        headers: { Authorization: apiKey },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.warn(
        `[gemini-pexels-image] Pexels HTTP ${response.status} for "${query}"`,
      );
      return null;
    }

    const data = (await response.json()) as PexelsSearchResponse;
    const photo = data.photos?.[0];
    const url =
      photo?.src?.medium?.trim() ||
      photo?.src?.large?.trim() ||
      photo?.src?.landscape?.trim() ||
      null;

    return url?.startsWith("https://") ? url : null;
  } catch (error) {
    console.warn(
      `[gemini-pexels-image] Pexels failed for "${query}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Full pipeline: Gemini search phrase → Pexels photo.
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

    const pexelsUrl = await fetchPexelsImageUrl(searchPhrase);
    if (pexelsUrl) {
      return {
        imageUrl: pexelsUrl,
        searchPhrase,
        source: "pexels",
      };
    }

    return { imageUrl: placeholder, searchPhrase, source: "placeholder" };
  } catch (error) {
    console.warn(
      `[gemini-pexels-image] Pipeline failed for "${word}":`,
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
  if (result.source !== "pexels") return null;
  return {
    imageUrl: result.imageUrl,
    searchPhrase: result.searchPhrase!,
  };
}
