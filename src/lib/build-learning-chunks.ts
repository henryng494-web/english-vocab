import {
  MAX_LEARNING_CHUNKS,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkEntry,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { isNaturalExample, keepNaturalExamples, viTranslationMatchesGloss } from "@/lib/example-quality";
import { capitalizeFirst } from "@/lib/format-text";
import type { VocabExample } from "@/lib/parse-examples";
import { normalizeWordType } from "@/lib/word-type";
import { alignmentMeaningLines } from "@/lib/word-meanings";

const MIN_CHUNK_WORDS = 5;

const LEADING_DETERMINERS =
  /^(a|an|the|my|your|his|her|its|our|their|some|any|this|that|these|those|every|each|no|another|one|two|three|four|five|six|seven|eight|nine|ten|\d+)$/i;

const EN_MODIFIER_VI: Record<string, string> = {
  every: "Mỗi",
  each: "Mỗi",
  the: "",
  a: "Một",
  an: "Một",
  beautiful: "đẹp",
  amazing: "kinh ngạc",
  great: "tuyệt vời",
  truly: "thật",
  difficult: "khó",
  wild: "hoang dã",
  business: "kinh doanh",
  dont: "Đừng",
  will: "Sẽ",
  can: "Có thể",
  not: "không",
  good: "tốt",
  human: "con người",
  open: "mở",
  turn: "rẽ",
  walk: "đi bộ",
  take: "đi",
};

function normalizePhrase(text: string): string {
  return text.trim().replace(/[.!?…]+$/, "").replace(/\s+/g, " ");
}

function phraseKey(en: string): string {
  return normalizePhrase(en).toLowerCase();
}

function normalizeEnToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z']/g, "");
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
    end = Math.min(words.length, idx + 2);
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
  return findHeadwordIndex(words, headword) >= 0;
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

function resolveSenseLine(
  sourceVi: string,
  meaning?: string | null,
  senseIndex?: number,
): string | null {
  const lines = alignmentMeaningLines(meaning);
  if (!lines.length) return null;
  if (senseIndex && lines[senseIndex - 1]) return lines[senseIndex - 1]!;
  return lines.find((line) => viTranslationMatchesGloss(sourceVi, line)) ?? lines[0]!;
}

function compactSenseLine(senseLine: string): string {
  const first = senseLine.split(",")[0]?.split("...")[0]?.trim() ?? senseLine.trim();
  return first.replace(/^\s*sự\s+/i, "").trim();
}

function lowerGloss(gloss: string): string {
  if (!gloss) return gloss;
  return gloss.charAt(0).toLowerCase() + gloss.slice(1);
}

function modifierVi(token: string): string {
  const key = normalizeEnToken(token);
  if (key === "don't" || key === "dont") return "Đừng";
  return EN_MODIFIER_VI[key] ?? "";
}

function composeCollocationVi(
  collocationEn: string,
  word: string,
  senseLine: string,
  wordType?: string | null,
): string {
  const colWords = normalizePhrase(collocationEn).split(/\s+/);
  const headIdx = findHeadwordIndex(colWords, word);
  if (headIdx < 0) return compactSenseLine(senseLine);

  const gloss = compactSenseLine(senseLine);
  const before = colWords.slice(0, headIdx);
  const pos = normalizeWordType(wordType, word);

  const viBefore = before
    .map((token) => modifierVi(token))
    .filter(Boolean);

  if (pos === "noun" || !pos) {
    const adj = before
      .map((token) => modifierVi(token))
      .find((value) => value && value !== "Mỗi" && value !== "Một");
    if (adj) {
      return `${gloss} ${adj}`.trim();
    }
    if (viBefore.length) {
      return `${viBefore.join(" ")} ${lowerGloss(gloss)}`.trim();
    }
    return gloss;
  }

  if (pos === "verb" || pos === "conjunction") {
    if (viBefore.length) {
      return `${viBefore.join(" ")} ${lowerGloss(gloss)}`.trim();
    }
    return lowerGloss(gloss);
  }

  if (pos === "adjective" && viBefore.length) {
    return `${viBefore.join(" ")} ${lowerGloss(gloss)}`.trim();
  }

  return gloss;
}

function collocationTranslation(
  collocationEn: string,
  sourceEn: string,
  sourceVi: string,
  word: string,
  wordType?: string | null,
  meaning?: string | null,
  senseIndex?: number,
): string {
  if (phraseKey(collocationEn) === phraseKey(sourceEn)) {
    return sourceVi.trim();
  }

  const senseLine = resolveSenseLine(sourceVi, meaning, senseIndex);
  if (!senseLine) return "";

  const composed = composeCollocationVi(
    collocationEn,
    word,
    senseLine,
    wordType,
  );
  return composed ? capitalizeFirst(composed) : "";
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
      const extracted = extractCollocationPhrase(en, word, wordType);
      if (
        extracted &&
        phraseKey(extracted) !== phraseKey(en) &&
        isValidCollocationEn(extracted, word)
      ) {
        collocationCandidates.push({
          en: extracted,
          vi: collocationTranslation(
            extracted,
            en,
            ex.vi,
            word,
            wordType,
            meaning,
            ex.senseIndex,
          ),
          sense: ex.senseIndex,
        });
      }
    } else {
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
    .sort((a, b) => collocationScore(a.en) - collocationScore(b.en));

  if (!collocations.length && chunks[0]) {
    const extracted = extractCollocationPhrase(chunks[0].en, word, wordType);
    if (
      extracted &&
      phraseKey(extracted) !== phraseKey(chunks[0].en) &&
      isValidCollocationEn(extracted, word)
    ) {
      collocations = [
        {
          en: extracted,
          vi: collocationTranslation(
            extracted,
            chunks[0].en,
            chunks[0].vi,
            word,
            wordType,
            meaning,
            chunks[0].sense,
          ),
          sense: chunks[0].sense,
        },
      ];
    }
  }

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
