import { getPresetRank } from "@/data/preset-word-details";
import {
  getStandardVocab,
  hasQualityStandardVocab,
} from "@/data/standard-vocab";
import {
  ensureExamples,
  fillExampleTranslations,
  alignExampleTranslations,
  hasQualityExamples,
  keepNaturalExamples,
} from "@/lib/example-fallback";
import {
  generateExamplesWithGemini,
  enrichWithGemini,
  generatePhoneticWithGemini,
  type WordEnrichment,
} from "@/lib/gemini-core";
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
import {
  alignmentMeaningLines,
  encodeRegisterCollocation,
  parseVietnameseMeanings,
  serializeVietnameseMeanings,
  type WordRegister,
} from "@/lib/word-meanings";
import { hasQualityMeanings } from "@/lib/meaning-quality";
import { repairWordMeanings } from "@/lib/repair-word-meanings";

export type { WordEnrichment } from "@/lib/gemini-core";

export type EnrichOptions = {
  rank?: number;
  /** Skip Gemini when a complete standard card already exists. */
  skipGemini?: boolean;
  /** Bypass curated standard vocab and prefer Gemini (for re-enrich scripts). */
  forceGemini?: boolean;
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
  const existing = keepNaturalExamples(word, examples, pos, meaning);
  if (hasQualityExamples(word, existing, pos, meaning)) {
    return existing.slice(0, 2);
  }

  if (allowGemini) {
    let lastGenerated: VocabExample[] | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const generated = await generateExamplesWithGemini(
        word,
        pos,
        meaning,
        alignmentMeaningLines(meaning),
      );
      lastGenerated = generated;
      if (hasQualityExamples(word, generated ?? undefined, pos, meaning)) {
        return (generated ?? []).slice(0, 2);
      }
    }
    if (lastGenerated?.length) {
      const merged = keepNaturalExamples(word, [...existing, ...lastGenerated], pos, meaning);
      if (hasQualityExamples(word, merged, pos, meaning)) return merged.slice(0, 2);
    }
  }

  const naturalOnly = keepNaturalExamples(word, existing, pos, meaning);
  if (naturalOnly.length >= 2) {
    const translated = await fillExampleTranslations(naturalOnly, word, pos, meaning);
    if (hasQualityExamples(word, translated, pos, meaning)) {
      return translated.slice(0, 2);
    }
  }

  const ensured = ensureExamples(word, existing, pos, meaning);
  const aligned = await alignExampleTranslations(ensured, word, pos, meaning);
  if (hasQualityExamples(word, aligned, pos, meaning)) return aligned.slice(0, 2);

  const translatedEnsured = await fillExampleTranslations(aligned, word, pos, meaning);
  if (hasQualityExamples(word, translatedEnsured, pos, meaning)) {
    return translatedEnsured.slice(0, 2);
  }

  return [];
}

async function finalizeMeanings(
  word: string,
  meaning: string,
  wordType: string,
  examples: VocabExample[],
  englishDefinition: string,
  allowGemini?: boolean,
): Promise<string> {
  if (
    hasQualityMeanings(word, meaning, wordType, examples, englishDefinition)
  ) {
    return serializeVietnameseMeanings(parseVietnameseMeanings(meaning)) || meaning;
  }
  if (!allowGemini) return meaning;
  return repairWordMeanings(
    word,
    meaning,
    wordType,
    undefined,
    englishDefinition,
  );
}

function meaningFields(meaning: string, register?: WordRegister | null) {
  const meanings = parseVietnameseMeanings(meaning);
  const normalizedRegister = register ?? null;
  return {
    vietnameseMeaning: serializeVietnameseMeanings(meanings) || meaning,
    vietnameseMeanings: meanings,
    register: normalizedRegister,
    collocations: encodeRegisterCollocation(normalizedRegister),
  };
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
    ...meaningFields(entry.meaning, entry.register ?? "neutral"),
    examples,
    phonetic: await finalizePhonetic(word, entry.phonetic),
    wordType,
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
    ...meaningFields(vietnamese),
    examples,
    phonetic: `/${word}/`,
    wordType,
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

  // Prefer curated cards even during repair — forceGemini only bypasses incomplete entries.
  if (!options?.forceGemini || hasQualityStandardVocab(normalized)) {
    const fromStandard = await standardToEnrichment(
      normalized,
      presetRank,
      !options?.skipGemini,
    );
    if (fromStandard) return fromStandard;
  }

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
      geminiResult.vietnameseMeaning = await finalizeMeanings(
        normalized,
        geminiResult.vietnameseMeaning,
        geminiResult.wordType,
        geminiResult.examples,
        geminiResult.englishDefinition,
        true,
      );
      geminiResult.vietnameseMeanings = parseVietnameseMeanings(
        geminiResult.vietnameseMeaning,
      );
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
