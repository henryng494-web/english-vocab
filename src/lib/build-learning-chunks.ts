import {
  MAX_LEARNING_CHUNKS,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkEntry,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { isNaturalExample, keepNaturalExamples } from "@/lib/example-quality";
import type { VocabExample } from "@/lib/parse-examples";
import { normalizeWordType } from "@/lib/word-type";

const MIN_CHUNK_WORDS = 5;
const MAX_COLLOCATION_WORDS = 3;
const MAX_COLLOCATION_WORDS_WITH_PREP = 4;

const LEADING_DETERMINERS =
  /^(a|an|the|my|your|his|her|its|our|their|some|any|this|that|these|those|every|each|no|another|one|two|three|four|five|six|seven|eight|nine|ten|\d+)$/i;

const FRAGMENT_START =
  /^(i|we|you|they|he|she|it|which|that|when|where|if|but|and|or|so|then|there|here|was|were|is|are|am|had|has|have|met|not|she|her|his|my|our|their)$/i;

const INLINE_VERBS = new Set([
  "was", "were", "is", "are", "am", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would",
  "can", "could", "should", "may", "might", "must", "met", "arrived",
  "got", "get", "went", "go", "come", "came", "said", "say",
  "make", "made", "take", "took", "give", "gave", "feel", "feels", "felt",
  "look", "looks", "looked", "seem", "seems", "seemed", "not",
]);

const PREP_TOKENS = new Set(["of", "in", "on", "at", "for", "with"]);

function normalizePhrase(text: string): string {
  return text.trim().replace(/[.!?…]+$/, "").replace(/\s+/g, " ");
}

function phraseKey(en: string): string {
  return normalizePhrase(en).toLowerCase();
}

function normalizeToken(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}

function findHeadwordIndex(words: string[], headword: string): number {
  const hw = headword.toLowerCase();
  const stem = hw.length > 4 ? hw.slice(0, 4) : hw;

  for (let i = 0; i < words.length; i++) {
    const token = normalizeToken(words[i] ?? "");
    if (!token) continue;
    if (token === hw || token.startsWith(stem) || hw.startsWith(token)) {
      return i;
    }
  }
  return -1;
}

function hasPrepPattern(words: string[]): boolean {
  return words.some((word) => PREP_TOKENS.has(normalizeToken(word)));
}

function isSentenceFragment(phrase: string): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  if (words.length > MAX_COLLOCATION_WORDS_WITH_PREP) return true;
  if (words.length > MAX_COLLOCATION_WORDS && !hasPrepPattern(words)) return true;

  const first = normalizeToken(words[0] ?? "");
  if (first === "to" && words.length === 2) return false;
  if (FRAGMENT_START.test(first)) return true;

  for (let i = 0; i < words.length; i++) {
    const token = normalizeToken(words[i] ?? "");
    if (i === 0 && token === "to") continue;
    if (INLINE_VERBS.has(token)) return true;
  }
  return false;
}

function extractCollocationPhrase(
  sentence: string,
  headword: string,
  wordType?: string | null,
): string | null {
  const text = normalizePhrase(sentence);
  if (!text) return null;

  const words = text.split(" ");
  if (words.length <= 3) return text;

  const idx = findHeadwordIndex(words, headword);
  if (idx < 0) return null;

  const pos = normalizeWordType(wordType, headword);
  let start = idx;
  let end = idx + 1;

  if (pos === "verb") {
    const prev = normalizeToken(words[idx - 1] ?? "");
    if (prev === "to" || prev === "don't" || prev === "dont") {
      start = idx - 1;
    } else {
      start = idx;
    }
    end = Math.min(words.length, idx + 2);
  } else if (pos === "adjective") {
    const next = normalizeToken(words[idx + 1] ?? "");
    if (next && !PREP_TOKENS.has(next) && idx + 1 < words.length) {
      start = idx;
      end = idx + 2;
    } else if (idx > 0) {
      start = idx - 1;
      end = idx + 1;
    }
  } else {
    if (idx > 0) {
      start = idx - 1;
    }
    const next = normalizeToken(words[idx + 1] ?? "");
    if (next === "of" || next === "in" || next === "on") {
      end = Math.min(words.length, idx + 3);
    } else if (idx + 1 < words.length) {
      end = idx + 2;
    }
  }

  let phrase = trimDanglingTail(words.slice(start, end).join(" ").trim());
  if (!phrase || phraseKey(phrase) === phraseKey(text)) {
    phrase = trimDanglingTail(words.slice(Math.max(0, idx - 1), idx + 1).join(" ").trim());
  }
  return phrase || null;
}

function extractCollocationPhrases(
  sentence: string,
  headword: string,
  wordType?: string | null,
): string[] {
  const phrase = extractCollocationPhrase(sentence, headword, wordType);
  if (!phrase || !isValidCollocationEn(phrase, headword)) return [];
  return [phrase];
}

const DANGLING_TAIL =
  /^(at|to|in|on|for|with|the|a|an|of|that|you|was|were|is|are|my|your|his|her|its|our|their)$/i;

function trimDanglingTail(phrase: string): string {
  const words = phrase.split(" ");
  while (words.length > 2 && DANGLING_TAIL.test(words[words.length - 1] ?? "")) {
    words.pop();
  }
  return words.join(" ").trim();
}

function isValidCollocationEn(extracted: string, headword: string): boolean {
  const words = normalizePhrase(extracted).split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  if (words.some((word) => word.includes("?"))) return false;
  if (findHeadwordIndex(words, headword) < 0) return false;
  if (isWeakCollocation(extracted, headword)) return false;
  if (isSentenceFragment(extracted)) return false;
  return true;
}

/** Reject determiner/possessive + headword only (e.g. "the usual", "her usual"). */
function isWeakCollocation(phrase: string, headword: string): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  if (words.length < 2) return true;

  const idx = findHeadwordIndex(words, headword);
  if (idx < 0) return true;

  const others = words.filter((_, i) => i !== idx);
  if (!others.length) return true;

  return others.every((word) => LEADING_DETERMINERS.test(normalizeToken(word)));
}

function isFullSentence(en: string): boolean {
  const text = normalizePhrase(en);
  const words = text.split(/\s+/);
  return (
    words.length >= MIN_CHUNK_WORDS ||
    (/[.!?]$/.test(en.trim()) && words.length >= 4)
  );
}

function collocationScore(en: string): number {
  return normalizePhrase(en).split(/\s+/).length;
}

function dedupePhrases(items: LearningChunkPhrase[]): LearningChunkPhrase[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = phraseKey(item.en);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function selectExamplesForChunks(
  word: string,
  examples: VocabExample[],
  wordType?: string | null,
  meaning?: string | null,
): VocabExample[] {
  const aligned = keepNaturalExamples(word, examples, wordType, meaning);
  if (aligned.length) return aligned;

  const natural = examples.filter((item) => isNaturalExample(item, word, wordType));
  if (natural.length) return natural.slice(0, 2);

  return examples.filter((item) => item.en?.trim()).slice(0, 2);
}

function collocationTranslation(
  collocationEn: string,
  sourceEn: string,
  sourceVi: string,
): string {
  if (phraseKey(collocationEn) === phraseKey(sourceEn)) {
    return sourceVi.trim();
  }
  return "";
}

export function buildLearningChunksFromExamples(
  word: string,
  examples: VocabExample[],
  wordType?: string | null,
  meaning?: string | null,
): LearningChunkEntry | null {
  const natural = selectExamplesForChunks(word, examples, wordType, meaning);
  if (!natural.length) return null;

  const collocationCandidates: LearningChunkPhrase[] = [];
  const chunkCandidates: LearningChunkPhrase[] = [];

  for (const ex of natural) {
    const en = ex.en.trim();
    if (!en) continue;

    const item: LearningChunkPhrase = {
      en,
      vi: ex.vi,
      sense: ex.senseIndex,
    };

    if (isFullSentence(en)) {
      chunkCandidates.push(item);
      for (const extracted of extractCollocationPhrases(en, word, wordType)) {
        if (phraseKey(extracted) === phraseKey(en)) continue;
        collocationCandidates.push({
          en: extracted,
          vi: collocationTranslation(extracted, en, ex.vi),
          sense: ex.senseIndex,
        });
      }
    } else if (isValidCollocationEn(en, word)) {
      collocationCandidates.push(item);
    }
  }

  chunkCandidates.sort(
    (a, b) => b.en.split(/\s+/).length - a.en.split(/\s+/).length,
  );
  const chunks = chunkCandidates.slice(0, MAX_LEARNING_CHUNKS);

  const chunkKeys = new Set(chunks.map((item) => phraseKey(item.en)));
  const collocations = dedupePhrases(collocationCandidates)
    .filter((item) => !chunkKeys.has(phraseKey(item.en)))
    .filter((item) => isValidCollocationEn(item.en, word))
    .sort((a, b) => collocationScore(a.en) - collocationScore(b.en))
    .slice(0, MAX_LEARNING_COLLOCATIONS);

  if (!collocations.length && !chunks.length) {
    const fallback = natural[0];
    if (!fallback?.en.trim()) return null;
    if (isFullSentence(fallback.en)) {
      return {
        collocations: [],
        chunks: [
          {
            en: fallback.en,
            vi: fallback.vi,
            sense: fallback.senseIndex,
          },
        ],
      };
    }
    if (isValidCollocationEn(fallback.en, word)) {
      return {
        collocations: [
          {
            en: fallback.en,
            vi: fallback.vi,
            sense: fallback.senseIndex,
          },
        ],
        chunks: [],
      };
    }
    return null;
  }

  return { collocations, chunks };
}
