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

const LEADING_DETERMINERS =
  /^(a|an|the|my|your|his|her|its|our|their|some|any|this|that|these|those|every|each|no|another|one|two|three|four|five|six|seven|eight|nine|ten|\d+)$/i;

function normalizePhrase(text: string): string {
  return text.trim().replace(/[.!?…]+$/, "").replace(/\s+/g, " ");
}

function phraseKey(en: string): string {
  return normalizePhrase(en).toLowerCase();
}

function findHeadwordIndex(words: string[], headword: string): number {
  const hw = headword.toLowerCase();
  const stem = hw.length > 4 ? hw.slice(0, 4) : hw;

  for (let i = 0; i < words.length; i++) {
    const token = words[i].toLowerCase().replace(/[^a-z'-]/g, "");
    if (!token) continue;
    if (token === hw || token.startsWith(stem) || hw.startsWith(token)) {
      return i;
    }
  }
  return -1;
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
  if (idx < 0) return words.slice(0, Math.min(4, words.length)).join(" ");

  const pos = normalizeWordType(wordType, headword);
  let start = idx;
  let end = idx + 1;

  if (pos === "verb") {
    const prev = words[idx - 1]?.toLowerCase() ?? "";
    const auxBefore = new Set([
      "to", "will", "can", "could", "should", "would", "may", "might", "must",
      "please", "not", "you", "we", "they", "he", "she", "it", "i", "do", "did",
    ]);
    if (auxBefore.has(prev) || prev === "don't") {
      start = Math.max(0, idx - 1);
      end = Math.min(words.length, idx + 1);
    } else {
      start = Math.max(0, idx - 1);
      end = idx + 1;
    }
  } else if (pos === "adjective") {
    start = Math.max(0, idx - 1);
    while (start > 0 && LEADING_DETERMINERS.test(words[start - 1] ?? "")) {
      start--;
    }
    end = idx + 1;
  } else {
    while (start > 0 && LEADING_DETERMINERS.test(words[start - 1] ?? "")) {
      start--;
    }
    if (start > 0) {
      const maybeVerb = words[start - 1]?.toLowerCase().replace(/[^a-z']/g, "") ?? "";
      const skipBeforeNoun = new Set([
        "is", "are", "was", "were", "be", "been", "being", "am",
        "has", "have", "had", "does", "do", "did",
      ]);
      if (maybeVerb && !skipBeforeNoun.has(maybeVerb)) {
        start--;
      }
    }
    const next = words[idx + 1]?.toLowerCase();
    if (next === "of" || next === "in" || next === "on") {
      end = Math.min(words.length, idx + 3);
    }
  }

  let phrase = words.slice(start, end).join(" ").trim();
  phrase = trimDanglingTail(phrase);
  if (!phrase || phraseKey(phrase) === phraseKey(text)) {
    start = Math.max(0, idx - 1);
    end = Math.min(words.length, idx + 2);
    phrase = trimDanglingTail(words.slice(start, end).join(" ").trim());
  }
  return phrase || null;
}

function extractCollocationPhrases(
  sentence: string,
  headword: string,
  wordType?: string | null,
): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  const add = (phrase: string | null) => {
    if (!phrase || !isValidCollocationEn(phrase, headword)) return;
    const key = phraseKey(phrase);
    if (seen.has(key)) return;
    seen.add(key);
    results.push(phrase);
  };

  add(extractCollocationPhrase(sentence, headword, wordType));

  const text = normalizePhrase(sentence);
  const words = text.split(" ");
  if (words.length <= 3) return results;

  const idx = findHeadwordIndex(words, headword);
  if (idx < 0) return results;

  const pos = normalizeWordType(wordType, headword);

  if (pos === "adjective") {
    if (idx > 0) {
      let start = idx - 1;
      while (start > 0 && LEADING_DETERMINERS.test(words[start - 1] ?? "")) {
        start--;
      }
      add(trimDanglingTail(words.slice(start, idx + 1).join(" ")));
    }
    for (let back = 2; back <= Math.min(4, idx + 1); back++) {
      const start = idx - back + 1;
      if (start < 0) continue;
      add(trimDanglingTail(words.slice(start, idx + 1).join(" ")));
    }
  } else if (pos === "verb") {
    if (idx > 0) {
      add(trimDanglingTail(words.slice(Math.max(0, idx - 1), idx + 1).join(" ")));
    }
    if (idx >= 2) {
      add(trimDanglingTail(words.slice(idx - 2, idx + 1).join(" ")));
    }
  } else {
    if (idx > 0) {
      const prev = words[idx - 1]?.toLowerCase().replace(/[^a-z']/g, "") ?? "";
      const skipBeforeNoun = new Set([
        "is", "are", "was", "were", "be", "been", "being", "am",
        "has", "have", "had", "does", "do", "did",
      ]);
      if (prev && !skipBeforeNoun.has(prev)) {
        add(trimDanglingTail(words.slice(idx - 1, idx + 1).join(" ")));
      }
    }
    if (idx + 1 < words.length) {
      const next = words[idx + 1]?.toLowerCase();
      if (next === "of" || next === "in" || next === "on") {
        add(trimDanglingTail(words.slice(idx, idx + 3).join(" ")));
      } else {
        add(trimDanglingTail(words.slice(idx, idx + 2).join(" ")));
      }
    }
  }

  return results;
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
  const words = normalizePhrase(extracted).split(/\s+/);
  if (words.length < 2) return false;
  if (words.some((word) => word.includes("?"))) return false;
  if (findHeadwordIndex(words, headword) < 0) return false;
  return !isWeakCollocation(extracted, headword);
}

/** Reject determiner/possessive + headword only (e.g. "the usual", "her usual"). */
function isWeakCollocation(phrase: string, headword: string): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  if (words.length < 2) return true;

  const idx = findHeadwordIndex(words, headword);
  if (idx < 0) return true;

  const others = words.filter((_, i) => i !== idx);
  if (!others.length) return true;

  return others.every((word) => {
    const token = word.toLowerCase().replace(/[^a-z']/g, "");
    return LEADING_DETERMINERS.test(token);
  });
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
  // Extracted collocations get AI translation on the client (see useLearningChunkTranslations).
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
  let collocations = dedupePhrases(collocationCandidates)
    .filter((item) => !chunkKeys.has(phraseKey(item.en)))
    .filter((item) => !isWeakCollocation(item.en, word))
    .sort((a, b) => collocationScore(b.en) - collocationScore(a.en));

  collocations = collocations.slice(0, MAX_LEARNING_COLLOCATIONS);

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

  return { collocations, chunks };
}
