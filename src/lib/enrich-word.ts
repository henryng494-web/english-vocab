import { getPresetRank } from "@/data/preset-word-details";
import { getStandardVocab } from "@/data/standard-vocab";
import {
  ensureExamples,
  fillExampleTranslations,
  hasQualityExamples,
  keepNaturalExamples,
} from "@/lib/example-fallback";
import { generateExamplesWithGemini, enrichWithGemini, generatePhoneticWithGemini, type WordEnrichment } from "@/lib/gemini-core";
import { getStaticVietnamese } from "@/lib/static-vietnamese";
import { formatIpa, isPlaceholderPhonetic } from "@/lib/phonetic";
import {
  buildDefinitionFromVietnameseMeaning,
  isMissingDefinition,
  resolveVietnameseDefinition,
  resolveVietnameseMeaning,
  type ResolveViOptions,
} from "@/lib/translate-vi";
import type { VocabExample } from "@/lib/parse-examples";
import { normalizeWordType } from "@/lib/word-type";
import { getImportanceTier } from "@/lib/word-rank";

export type { WordEnrichment } from "@/lib/gemini-core";

export type EnrichOptions = {
  rank?: number;
  /** Skip Gemini when a complete standard card already exists. */
  skipGemini?: boolean;
};

function clampFrequencyRank(rank: number): number {
  if (!Number.isFinite(rank) || rank < 1) return 10000;
  return Math.round(rank);
}

function normalizeTier(rank: number): WordEnrichment["importanceTier"] {
  return getImportanceTier(rank) as WordEnrichment["importanceTier"];
}

function displayWordType(word: string, pos: string | null | undefined): string {
  return normalizeWordType(pos, word) ?? "unknown";
}

async function finalizePhonetic(word: string, phonetic?: string | null): Promise<string> {
  const formatted = formatIpa(phonetic ?? "", word);
  if (!isPlaceholderPhonetic(word, formatted)) return formatted;
  const fromGemini = await generatePhoneticWithGemini(word);
  if (fromGemini && !isPlaceholderPhonetic(word, fromGemini)) return fromGemini;
  return formatted;
}

function simpleKeyword(word: string): string {
  return word.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "") || "vocabulary";
}

async function finalizeExamples(
  word: string,
  examples: VocabExample[] | undefined,
  pos?: string | null,
  meaning?: string | null,
  allowGemini?: boolean,
): Promise<VocabExample[]> {
  const existing = keepNaturalExamples(word, examples);
  if (hasQualityExamples(word, existing)) {
    return existing.slice(0, 2);
  }

  if (allowGemini) {
    const generated = await generateExamplesWithGemini(word, pos, meaning);
    if (hasQualityExamples(word, generated ?? undefined)) {
      return (generated ?? []).slice(0, 2);
    }
    if (generated?.length) {
      const merged = keepNaturalExamples(word, [...existing, ...generated]);
      if (hasQualityExamples(word, merged)) return merged.slice(0, 2);
    }
  }

  const naturalOnly = keepNaturalExamples(word, existing);
  if (naturalOnly.length >= 2) {
    const translated = await fillExampleTranslations(naturalOnly);
    if (hasQualityExamples(word, translated)) {
      return translated.slice(0, 2);
    }
  }

  const ensured = ensureExamples(word, existing, pos, meaning);
  if (hasQualityExamples(word, ensured)) return ensured.slice(0, 2);

  const translatedEnsured = await fillExampleTranslations(ensured);
  if (hasQualityExamples(word, translatedEnsured)) {
    return translatedEnsured.slice(0, 2);
  }

  return translatedEnsured.length ? translatedEnsured.slice(0, 2) : ensured;
}

async function standardToEnrichment(
  word: string,
  rank?: number,
  allowGemini?: boolean,
): Promise<WordEnrichment | null> {
  const entry = getStandardVocab(word);
  if (!entry) return null;

  const frequencyRank = clampFrequencyRank(
    rank ?? getPresetRank(word) ?? 5000,
  );
  const wordType = displayWordType(word, entry.pos);
  const examples = await finalizeExamples(
    word,
    entry.examples,
    wordType,
    entry.meaning,
    allowGemini,
  );

  return {
    englishDefinition: entry.definition,
    vietnameseMeaning: entry.meaning,
    examples,
    phonetic: await finalizePhonetic(word, entry.phonetic),
    wordType,
    collocations: null,
    searchKeyword: entry.searchKeyword || simpleKeyword(word),
    frequencyRank,
    importanceTier: normalizeTier(frequencyRank),
    fromFallback: false,
    fromStatic: true,
    source: "static",
  };
}

async function finalizeDefinition(
  word: string,
  sourceDefinition: string,
  vietnameseMeaning: string,
  wordType: string,
  viOptions?: ResolveViOptions,
): Promise<string> {
  const resolved = await resolveVietnameseDefinition(word, sourceDefinition, {
    ...viOptions,
    vietnameseMeaning,
    wordType,
  });

  if (!isMissingDefinition(resolved)) return resolved;

  const fromMeaning = buildDefinitionFromVietnameseMeaning(
    vietnameseMeaning,
    wordType,
  );
  if (fromMeaning) return fromMeaning;

  return "—";
}

/**
 * Last resort without any dictionary API — static meaning only.
 */
export async function getBasicEnrichment(
  word: string,
  rank?: number,
  viOptions?: ResolveViOptions,
): Promise<WordEnrichment> {
  const fromStandard = await standardToEnrichment(word, rank, viOptions?.allowGemini);
  if (fromStandard) return fromStandard;

  const frequencyRank = clampFrequencyRank(rank ?? getPresetRank(word) ?? 5000);
  const vietnamese = await resolveVietnameseMeaning(word, viOptions);
  const wordType = displayWordType(word, null);
  const definition = await finalizeDefinition(
    word,
    "",
    vietnamese,
    wordType,
    viOptions,
  );
  const hasStaticVi = Boolean(getStaticVietnamese(word));
  const examples = await finalizeExamples(
    word,
    [],
    wordType,
    vietnamese,
    viOptions?.allowGemini,
  );

  return {
    englishDefinition: definition,
    vietnameseMeaning: vietnamese,
    examples,
    phonetic: `/${word}/`,
    wordType,
    collocations: null,
    searchKeyword: simpleKeyword(word),
    frequencyRank,
    importanceTier: normalizeTier(frequencyRank),
    fromFallback: true,
    fromStatic: hasStaticVi,
    source: "basic",
  };
}

export async function enrichWord(
  word: string,
  options?: EnrichOptions,
): Promise<WordEnrichment> {
  const normalized = word.trim().toLowerCase();
  const presetRank = options?.rank ?? getPresetRank(normalized);
  const viOptions: ResolveViOptions = {
    allowGemini: !options?.skipGemini,
  };

  const fromStandard = await standardToEnrichment(
    normalized,
    presetRank,
    !options?.skipGemini,
  );
  if (fromStandard) return fromStandard;

  if (process.env.GEMINI_API_KEY?.trim()) {
    try {
      const geminiResult = await enrichWithGemini(normalized, presetRank);
      if (isMissingDefinition(geminiResult.englishDefinition)) {
        const built = buildDefinitionFromVietnameseMeaning(
          geminiResult.vietnameseMeaning,
          geminiResult.wordType,
        );
        if (built) geminiResult.englishDefinition = built;
      }
      geminiResult.wordType = displayWordType(
        normalized,
        geminiResult.wordType,
      );
      if (!geminiResult.searchKeyword) {
        geminiResult.searchKeyword = simpleKeyword(normalized);
      }
      geminiResult.examples = await finalizeExamples(
        normalized,
        geminiResult.examples,
        geminiResult.wordType,
        geminiResult.vietnameseMeaning,
        true,
      );
      geminiResult.phonetic = await finalizePhonetic(
        normalized,
        geminiResult.phonetic,
      );
      return geminiResult;
    } catch (error) {
      console.warn(`Gemini failed for "${normalized}":`, error);
    }
  }

  return getBasicEnrichment(normalized, presetRank, viOptions);
}
