import { GoogleGenerativeAI } from "@google/generative-ai";
import { capitalizeFirst } from "@/lib/format-text";
import { getPresetRank } from "@/data/preset-word-details";
import { buildDefinitionFromVietnameseMeaning } from "@/lib/translate-vi";
import { normalizeWordType } from "@/lib/word-type";
import { getImportanceTier } from "@/lib/word-rank";
import { keepNaturalExamples } from "@/lib/example-fallback";
import type { VocabExample } from "@/lib/parse-examples";

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  "gemini-1.5-flash",
];

export type WordEnrichment = {
  englishDefinition: string;
  vietnameseMeaning: string;
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
  meaning?: string;
  vietnamese?: string;
  definition?: string;
  examples?: Array<string | { en?: string; vi?: string }>;
  searchKeyword?: string;
  rank?: number;
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(apiKey);
}

function clampFrequencyRank(rank: number): number {
  if (!Number.isFinite(rank) || rank < 1) return 10000;
  return Math.round(rank);
}

function buildPrompt(word: string): string {
  return `You are an English teacher writing a Vietnamese learner flashcard.

Word: "${word}"

Gold standard for "hole":
- meaning: "Lỗ, hố"
- examples:
  1. en: "There is a hole in my pocket." (7 words)
     vi: "Có một cái lỗ trong túi quần của tôi."
  2. en: "Dig a hole in the garden." (6 words)
     vi: "Đào một cái hố trong vườn."

Rules:
- Use ONLY the most common everyday PRIMARY sense.
- Numbers (one, twenty...) = counting number, NEVER money/slang.
- meaning: short common Vietnamese (like "Lỗ, hố"), not a long definition.
- examples: EXACTLY 2 English sentences, 5–10 words each, real daily life, MUST contain "${word}".
- Vietnamese translations must be natural (not word-by-word).
- NEVER write meta lines like "I learned the word...", "Please use ... in a sentence", "This is a sentence with...".
- pos: noun|verb|adjective|adverb|pronoun|preposition|conjunction|article|number|interjection|determiner
- searchKeyword: one simple concrete English photo keyword.

Respond with ONLY valid JSON:
{
  "word": "${word}",
  "phonetic": "/ipa/",
  "pos": "noun",
  "meaning": "Nghĩa tiếng Việt thông dụng nhất",
  "examples": [
    { "en": "5-10 word English sentence.", "vi": "Bản dịch tự nhiên." },
    { "en": "5-10 word English sentence.", "vi": "Bản dịch tự nhiên." }
  ],
  "searchKeyword": "simple-keyword"
}`;
}

function parseExamples(
  raw: GeminiJsonShape["examples"],
): VocabExample[] {
  if (!Array.isArray(raw)) return [];
  const parsed: VocabExample[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      parsed.push({ en: item.trim(), vi: "" });
      continue;
    }
    if (item && typeof item === "object") {
      const en = item.en?.trim() ?? "";
      if (!en) continue;
      parsed.push({ en, vi: item.vi?.trim() ?? "" });
    }
  }
  return parsed.slice(0, 2);
}

function parseGeminiResponse(text: string, word: string): WordEnrichment {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse Gemini response for "${word}"`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as GeminiJsonShape;
  const meaningRaw =
    parsed.meaning?.trim() || parsed.vietnamese?.trim() || word;
  const wordType = normalizeWordType(parsed.pos?.trim(), word) ?? "unknown";

  const definition =
    parsed.definition?.trim() ||
    buildDefinitionFromVietnameseMeaning(meaningRaw, wordType) ||
    meaningRaw;

  const examples = keepNaturalExamples(word, parseExamples(parsed.examples));
  const frequencyRank = clampFrequencyRank(
    Number(parsed.rank) || getPresetRank(word) || 5000,
  );
  const phonetic =
    parsed.phonetic?.trim() || parsed.ipa?.trim() || `/${word}/`;
  const searchKeyword =
    parsed.searchKeyword?.trim().toLowerCase() || word;

  return {
    englishDefinition: capitalizeFirst(definition),
    vietnameseMeaning: capitalizeFirst(meaningRaw),
    examples,
    phonetic: phonetic.startsWith("/") || phonetic.startsWith("[")
      ? phonetic
      : `/${phonetic}/`,
    wordType,
    collocations: null,
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
  const result = await model.generateContent(buildPrompt(word));
  return parseGeminiResponse(result.response.text().trim(), word);
}

/** Lightweight Gemini call — Vietnamese meanings only (saves quota vs full enrich). */
export async function translateVietnameseWithGemini(
  word: string,
): Promise<string | null> {
  const genAI = getGeminiClient();
  const prompt = `English word: "${word}".

Reply with ONLY the most common Vietnamese meaning (primary sense).
For numbers like "twenty", reply "Hai mươi" — never slang or money.
No English, no JSON, no explanation.`;

  const modelName = FALLBACK_MODELS[0];
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/^["']|["']$/g, "");
    return text || null;
  } catch (error) {
    console.warn(`Gemini VI "${modelName}" failed for "${word}":`, error);
    return null;
  }
}

/** Gemini — short Vietnamese definition for static fallback. */
export async function translateDefinitionWithGemini(
  word: string,
  englishDefinition?: string,
): Promise<string | null> {
  const genAI = getGeminiClient();
  const context = englishDefinition?.trim()
    ? `English definition: "${englishDefinition.trim()}".`
    : "";
  const prompt = `English word: "${word}". ${context}

Write ONE short, natural Vietnamese definition (1 sentence) using the PRIMARY everyday sense.
For "twenty": "Số đếm hai mươi (20)."
Reply with ONLY the Vietnamese definition. No English, no JSON.`;

  const modelName = FALLBACK_MODELS[0];
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/^["']|["']$/g, "");
    return text || null;
  } catch (error) {
    console.warn(
      `Gemini VI definition "${modelName}" failed for "${word}":`,
      error,
    );
    return null;
  }
}

/** Gemini — two short bilingual example sentences when sources omit them. */
export async function generateExamplesWithGemini(
  word: string,
  pos?: string | null,
  meaning?: string | null,
): Promise<VocabExample[] | null> {
  if (!process.env.GEMINI_API_KEY?.trim()) return null;

  const genAI = getGeminiClient();
  const posHint = pos?.trim() ? `Part of speech: ${pos}.` : "";
  const meaningHint = meaning?.trim()
    ? `Primary Vietnamese meaning: ${meaning.trim()}.`
    : "";
  const prompt = `Write a Vietnamese learner flashcard for "${word}".
${posHint} ${meaningHint}

Gold standard for hole:
- There is a hole in my pocket. → Có một cái lỗ trong túi quần của tôi.
- Dig a hole in the garden. → Đào một cái hố trong vườn.

Return EXACTLY 2 English sentences:
- 5 to 10 words each
- real daily life
- must contain "${word}"
- primary everyday sense only
- natural Vietnamese translation (not word-by-word)
- NEVER "I learned the word...", "Please use ... in a sentence", "This is a sentence with..."

ONLY JSON:
{"examples":[{"en":"...","vi":"..."},{"en":"...","vi":"..."}]}`;

  const modelName = FALLBACK_MODELS[0];
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as GeminiJsonShape;
    const examples = keepNaturalExamples(word, parseExamples(parsed.examples));
    if (examples.length < 2) return null;
    return examples.slice(0, 2);
  } catch (error) {
    console.warn(`Gemini examples failed for "${word}":`, error);
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
