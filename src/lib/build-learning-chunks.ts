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
  /^(a|an|the|my|your|his|her|its|our|their|some|any|this|that|these|those|every|each|no|another|one|two|three|four|five|six|seven|eight|nine|ten|several|many|few|multiple|numerous|various|\d+)$/i;

const PREP_TOKENS = new Set(["of", "in", "on", "at", "for", "with", "by", "to", "about"]);

const TRAILING_PREPS = new Set([
  "into", "onto", "upon", "from", "by", "as", "up", "down", "out", "off", "over",
  "under", "through", "to", "at", "for", "with", "in", "on", "of", "about",
  "against", "between", "among", "within", "without", "during", "before", "after",
]);

const ALLOWED_MID_PREPS = new Set(["of", "in", "on"]);

const FRAGMENT_START =
  /^(i|we|you|they|he|she|it|which|that|when|where|if|but|and|or|so|then|there|here|was|were|is|are|am|had|has|have|met|not|she|her|his|my|our|their|several|many|few|multiple|numerous|various|launched|launch|launches)$/i;

const INLINE_VERBS = new Set([
  "was", "were", "is", "are", "am", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would",
  "can", "could", "should", "may", "might", "must", "met", "arrived",
  "got", "get", "went", "go", "come", "came", "said", "say",
  "make", "made", "take", "took", "give", "gave", "feel", "feels", "felt",
  "look", "looks", "looked", "seem", "seems", "seemed", "not",
  "launch", "launched", "launches", "fire", "fired", "fires",
]);

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

/** Classic headword + preposition pairs: "flattered by", "good at", "depend on". */
function isHeadwordPrepCollocation(
  phrase: string,
  headword: string,
  wordType?: string | null,
): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 3) return false;

  const idx = findHeadwordIndex(words, headword);
  if (idx < 0) return false;

  const last = normalizeToken(words[words.length - 1] ?? "");
  if (!TRAILING_PREPS.has(last) && last !== "to") return false;

  const pos = normalizeWordType(wordType, headword);
  if (pos === "noun") return false;

  if (idx === words.length - 2) return true;
  return pos === "adjective" && words.length === 3 && idx === words.length - 3;
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
    if (next && TRAILING_PREPS.has(next) && idx + 1 < words.length) {
      start = idx;
      end = idx + 2;
    } else if (next && !INLINE_VERBS.has(next) && idx + 1 < words.length) {
      start = idx;
      end = idx + 2;
    } else if (idx > 0) {
      start = idx - 1;
      end = idx + 1;
    }
  } else {
    const prev = normalizeToken(words[idx - 1] ?? "");
    const next = normalizeToken(words[idx + 1] ?? "");

    if (
      ALLOWED_MID_PREPS.has(next) &&
      idx + 2 < words.length &&
      !TRAILING_PREPS.has(normalizeToken(words[idx + 2] ?? ""))
    ) {
      start = idx > 0 && LEADING_DETERMINERS.test(prev) ? idx - 1 : idx;
      end = idx + 3;
    } else if (next && !TRAILING_PREPS.has(next)) {
      if (idx > 0 && !INLINE_VERBS.has(prev) && !FRAGMENT_START.test(prev)) {
        start = idx - 1;
      }
      end = idx + 2;
    } else if (idx > 0) {
      start = idx - 1;
      end = idx + 1;
    }
  }

  let phrase = trimDanglingTail(
    words.slice(start, end).join(" ").trim(),
    headword,
    wordType,
  );
  if (!phrase || phraseKey(phrase) === phraseKey(text)) {
    phrase = trimDanglingTail(
      words.slice(Math.max(0, idx - 1), idx + 1).join(" ").trim(),
      headword,
      wordType,
    );
  }
  return phrase || null;
}

function extractCollocationPhrases(
  sentence: string,
  headword: string,
  wordType?: string | null,
): string[] {
  const phrase = extractCollocationPhrase(sentence, headword, wordType);
  if (!phrase || !isValidCollocationEn(phrase, headword, wordType)) return [];
  return [phrase];
}

const DANGLING_TAIL =
  /^(at|to|into|onto|in|on|for|with|the|a|an|of|that|you|was|were|is|are|my|your|his|her|its|our|their|from|by|up|off|out|over|under|through|about|against|between|among|within|without|during|before|after)$/i;

function trimDanglingTail(
  phrase: string,
  headword?: string,
  wordType?: string | null,
): string {
  const words = phrase.split(" ");
  while (words.length >= 2 && DANGLING_TAIL.test(normalizeToken(words[words.length - 1] ?? ""))) {
    const current = words.join(" ").trim();
    if (headword && isHeadwordPrepCollocation(current, headword, wordType)) {
      break;
    }
    words.pop();
  }
  return words.join(" ").trim();
}

function endsWithDanglingToken(
  phrase: string,
  headword: string,
  wordType?: string | null,
): boolean {
  if (isHeadwordPrepCollocation(phrase, headword, wordType)) return false;
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  if (words.length < 2) return true;
  const last = normalizeToken(words[words.length - 1] ?? "");
  return DANGLING_TAIL.test(last) || TRAILING_PREPS.has(last);
}

function hasStrayPreposition(
  phrase: string,
  headword: string,
  wordType?: string | null,
): boolean {
  if (isHeadwordPrepCollocation(phrase, headword, wordType)) return false;
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    const token = normalizeToken(words[i] ?? "");
    if (!TRAILING_PREPS.has(token) && !ALLOWED_MID_PREPS.has(token)) continue;
    if (!ALLOWED_MID_PREPS.has(token)) return true;
    if (i === 0 || i === words.length - 1) return true;
  }
  return false;
}

function isValidCollocationEn(
  extracted: string,
  headword: string,
  wordType?: string | null,
): boolean {
  const words = normalizePhrase(extracted).split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  if (words.some((word) => word.includes("?"))) return false;
  if (findHeadwordIndex(words, headword) < 0) return false;
  if (isWeakCollocation(extracted, headword)) return false;
  if (isSentenceFragment(extracted)) return false;
  if (endsWithDanglingToken(extracted, headword, wordType)) return false;
  if (hasStrayPreposition(extracted, headword, wordType)) return false;
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
    } else if (isValidCollocationEn(en, word, wordType)) {
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
    .filter((item) => isValidCollocationEn(item.en, word, wordType))
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
    if (isValidCollocationEn(fallback.en, word, wordType)) {
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
