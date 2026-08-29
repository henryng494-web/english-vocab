import { GoogleGenerativeAI } from "@google/generative-ai";
import { capitalizeFirst } from "@/lib/format-text";
import {
  buildDefinitionPrompt,
  buildEnrichPrompt,
  buildExampleTranslationPrompt,
  buildExamplesPrompt,
  buildMeaningPrompt,
} from "@/lib/gemini-prompts";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import { getPresetRank } from "@/data/preset-word-details";
import { buildDefinitionFromVietnameseMeaning } from "@/lib/translate-vi";
import { normalizeWordType } from "@/lib/word-type";
import { getImportanceTier } from "@/lib/word-rank";
import { formatIpa, isPlaceholderPhonetic } from "@/lib/phonetic";
import { fillExampleTranslations, keepNaturalExamples } from "@/lib/example-fallback";
import { hasQualityExamples } from "@/lib/example-quality";
import type { VocabExample } from "@/lib/parse-examples";
import {
  encodeRegisterCollocation,
  normalizeWordRegister,
  parseVietnameseMeanings,
  serializeVietnameseMeanings,
  type WordRegister,
} from "@/lib/word-meanings";

/**
 * "-latest" lite alias has the most generous free-tier quota; heavier/preview
 * models (e.g. gemini-3.6-flash) cap out at ~20 requests/day and exhaust
 * instantly once multiple calls run per word. Keep the fallback list short so
 * a 429 on one model doesn't burn through several more requests per word.
 */
const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
];

export type WordEnrichment = {
  englishDefinition: string;
  vietnameseMeaning: string;
  vietnameseMeanings: string[];
  register: WordRegister | null;
  examples: VocabExample[];
  phonetic: string;
  wordType: string;
  collocations: string | null;
  searchKeyword: string;
  frequencyRank: number;
  importanceTier: "Top 1000" | "Top 3000" | "Top 5000" | "Beyond 5000";
  fromFallback?: boolean;
  fromStatic?: boolean;
  source?: "static" | "gemini" | "basic";
};

type GeminiJsonShape = {
  word?: string;
  phonetic?: string;
  ipa?: string;
  pos?: string;
  register?: string;
  meaning?: string;
  meanings?: string[];
  vietnamese?: string;
  definition?: string;
  examples?: Array<
    string | { en?: string; vi?: string; senseIndex?: number; sense?: number }
  >;
  searchKeyword?: string;
  rank?: number;
};

function parseMeanings(parsed: GeminiJsonShape, fallbackWord: string): string[] {
  const fromArray = Array.isArray(parsed.meanings)
    ? parsed.meanings
        .map((item) => sanitizeVietnameseText(String(item ?? "").trim()))
        .filter(Boolean)
        .slice(0, 2)
    : [];

  if (fromArray.length) return fromArray;

  const legacy =
    sanitizeVietnameseText(
      parsed.meaning?.trim() || parsed.vietnamese?.trim() || "",
    ) || fallbackWord;

  return legacy ? [legacy] : [];
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(apiKey);
}

function clampFrequencyRank(rank: number): number {
  if (!Number.isFinite(rank) || rank < 1) return 10000;
  return Math.round(rank);
}

function primaryModelName(): string {
  return FALLBACK_MODELS[0];
}

async function generateGeminiText(prompt: string): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: primaryModelName() });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

function parseExamples(
  raw: GeminiJsonShape["examples"],
): VocabExample[] {
  if (!Array.isArray(raw)) return [];
  const parsed: VocabExample[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      parsed.push({ en: item.trim(), vi: "", senseIndex: parsed.length + 1 });
      continue;
    }
    if (item && typeof item === "object") {
      const en = item.en?.trim() ?? "";
      if (!en) continue;
      const senseIndexRaw = item.senseIndex ?? item.sense;
      parsed.push({
        en,
        vi: sanitizeVietnameseText(item.vi),
        senseIndex:
          typeof senseIndexRaw === "number" && Number.isFinite(senseIndexRaw)
            ? Math.max(1, Math.round(senseIndexRaw))
            : undefined,
      });
    }
  }
  return parsed
    .sort(
      (a, b) =>
        (a.senseIndex ?? Number.MAX_SAFE_INTEGER) -
        (b.senseIndex ?? Number.MAX_SAFE_INTEGER),
    )
    .slice(0, 2);
}

function parseGeminiResponse(text: string, word: string): WordEnrichment {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse Gemini response for "${word}"`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as GeminiJsonShape;
  const meanings = parseMeanings(parsed, word);
  const normalizedMeanings = meanings.map((item) => capitalizeFirst(item));
  const meaningRaw = normalizedMeanings[0] ?? word;
  const wordType = normalizeWordType(parsed.pos?.trim(), word) ?? "unknown";
  const register = normalizeWordRegister(parsed.register);

  const definition =
    parsed.definition?.trim() ||
    buildDefinitionFromVietnameseMeaning(meaningRaw, wordType) ||
    meaningRaw;

  const examples = keepNaturalExamples(word, parseExamples(parsed.examples));
  const frequencyRank = clampFrequencyRank(
    getPresetRank(word) || Number(parsed.rank) || 5000,
  );
  const phoneticRaw =
    parsed.phonetic?.trim() || parsed.ipa?.trim() || `/${word}/`;
  const phonetic = formatIpa(phoneticRaw, word);
  const searchKeyword =
    parsed.searchKeyword?.trim().toLowerCase() || word;

  return {
    englishDefinition: capitalizeFirst(definition),
    vietnameseMeaning: serializeVietnameseMeanings(normalizedMeanings),
    vietnameseMeanings: normalizedMeanings,
    register,
    examples,
    phonetic,
    wordType,
    collocations: encodeRegisterCollocation(register),
    searchKeyword,
    frequencyRank,
    importanceTier: getImportanceTier(
      frequencyRank,
    ) as WordEnrichment["importanceTier"],
    fromFallback: false,
    fromStatic: false,
    source: "gemini",
  };
}

async function enrichWithModel(
  word: string,
  modelName: string,
): Promise<WordEnrichment> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(buildEnrichPrompt(word));
  return parseGeminiResponse(result.response.text().trim(), word);
}

/** Lightweight Gemini call — Vietnamese meanings only (saves quota vs full enrich). */
export async function translateVietnameseWithGemini(
  word: string,
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY?.trim()) return null;

  try {
    const text = sanitizeVietnameseText(
      (await generateGeminiText(buildMeaningPrompt(word))).replace(
        /^["']|["']$/g,
        "",
      ),
    );
    return text || null;
  } catch (error) {
    console.warn(`Gemini VI "${primaryModelName()}" failed for "${word}":`, error);
    return null;
  }
}

/** Gemini — short Vietnamese definition for static fallback. */
export async function translateDefinitionWithGemini(
  word: string,
  englishDefinition?: string,
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY?.trim()) return null;

  try {
    const text = sanitizeVietnameseText(
      (
        await generateGeminiText(
          buildDefinitionPrompt(word, englishDefinition),
        )
      ).replace(/^["']|["']$/g, ""),
    );
    return text || null;
  } catch (error) {
    console.warn(
      `Gemini VI definition "${primaryModelName()}" failed for "${word}":`,
      error,
    );
    return null;
  }
}

/** Gemini — natural Vietnamese for one example sentence. */
export async function translateExampleWithGemini(
  englishSentence: string,
  word: string,
  pos?: string | null,
  meaning?: string | null,
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY?.trim()) return null;
  const en = englishSentence.trim();
  if (!en) return null;

  try {
    const text = sanitizeVietnameseText(
      (
        await generateGeminiText(
          buildExampleTranslationPrompt(en, word, pos, meaning),
        )
      ).replace(/^["']|["']$/g, ""),
    );
    return text || null;
  } catch (error) {
    console.warn(`Gemini example VI failed for "${word}":`, error);
    return null;
  }
}

/** Gemini — two short bilingual example sentences when sources omit them. */
export async function generateExamplesWithGemini(
  word: string,
  pos?: string | null,
  meaning?: string | null,
  meanings?: string[] | null,
): Promise<VocabExample[] | null> {
  if (!process.env.GEMINI_API_KEY?.trim()) return null;

  const meaningLines =
    meanings?.filter(Boolean) ?? parseVietnameseMeanings(meaning);

  try {
    const text = await generateGeminiText(
      buildExamplesPrompt(word, pos, meaning, meaningLines),
    );
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as GeminiJsonShape;
    const raw = keepNaturalExamples(
      word,
      parseExamples(parsed.examples),
      pos,
    );
    if (raw.length < 2) return null;
    const filled = await fillExampleTranslations(raw, word, pos, meaning);
    if (!hasQualityExamples(word, filled, pos, meaning)) return null;
    return filled.slice(0, 2);
  } catch (error) {
    console.warn(`Gemini examples failed for "${word}":`, error);
    return null;
  }
}

/** Gemini — IPA only when full enrich omits or echoes the spelling. */
export async function generatePhoneticWithGemini(
  word: string,
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY?.trim()) return null;

  const prompt = `English word: "${word}".

Reply with ONLY the American English IPA pronunciation in slashes.
Example: spent → /spɛnt/, opens → /ˈoʊpənz/
Do NOT repeat the spelling (wrong: /spent/). No other text.`;

  try {
    const text = (await generateGeminiText(prompt)).replace(/^["']|["']$/g, "");
    if (!text || isPlaceholderPhonetic(word, text)) return null;
    return formatIpa(text, word);
  } catch (error) {
    console.warn(`Gemini phonetic failed for "${word}":`, error);
    return null;
  }
}

export async function enrichWithGemini(
  word: string,
  presetRank?: number,
): Promise<WordEnrichment> {
  const models = [...new Set(FALLBACK_MODELS)];
  let lastError: unknown;

  for (const modelName of models) {
    try {
      const result = await enrichWithModel(word, modelName);
      if (presetRank) {
        result.frequencyRank = presetRank;
        result.importanceTier = getImportanceTier(
          presetRank,
        ) as WordEnrichment["importanceTier"];
      }
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`Gemini "${modelName}" failed for "${word}":`, error);
    }
  }

  throw lastError ?? new Error("All Gemini models failed");
}
