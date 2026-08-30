import {
  MAX_LEARNING_CHUNKS,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkEntry,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { isNaturalExample, keepNaturalExamples, viTranslationMatchesGloss } from "@/lib/example-quality";
import type { VocabExample } from "@/lib/parse-examples";
import { normalizeWordType } from "@/lib/word-type";
import { alignmentMeaningLines, glossAlignmentTerms } from "@/lib/word-meanings";

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
    if (auxBefore.has(prev)) {
      start = Math.max(0, idx - 1);
      end = Math.min(words.length, idx + 2);
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

const VI_NOUN_PREFIX =
  /^(một|lời|con|cái|chiếc|bức|tờ|người|những|các|quả|viên|cuốn)$/i;

const VI_TRAILING_STOP =
  /^(hôm|nay|rồi|đã|đang|sẽ|và|nhưng|mà|để|khi|nếu|vì|bởi|trong|ngoài|trên|dưới|tại|ở|với|cho|của|về|quanh|ra|vào|đi|bộ|thấy|là)$/i;

function cleanViToken(token: string): string {
  return token.replace(/[,;.!?…]+$/g, "");
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

function collocationGlossTerms(senseLine: string): string[] {
  const terms = new Set<string>();
  for (const term of glossAlignmentTerms(senseLine)) {
    if (!term.includes(" ") && term.length < 4) continue;
    terms.add(term);
    if (term.startsWith("sự ")) {
      terms.add(term.slice(3));
    }
  }
  return [...terms].sort((a, b) => b.length - a.length);
}

function findTermSpan(
  viWords: string[],
  matchTerm: string,
): { start: number; end: number } | null {
  const termWords = matchTerm.split(/\s+/).filter(Boolean);
  if (!termWords.length) return null;

  for (let i = 0; i <= viWords.length - termWords.length; i++) {
    let matched = true;
    for (let j = 0; j < termWords.length; j++) {
      const token = cleanViToken(viWords[i + j] ?? "").toLowerCase();
      if (token !== termWords[j]!.toLowerCase()) {
        matched = false;
        break;
      }
    }
    if (matched) return { start: i, end: i + termWords.length };
  }

  if (termWords.length === 1 && termWords[0]!.length >= 4) {
    const idx = viWords.findIndex((word) =>
      cleanViToken(word).toLowerCase().includes(termWords[0]!.toLowerCase()),
    );
    if (idx >= 0) return { start: idx, end: idx + 1 };
  }

  return null;
}

function isWeakViPhrase(phrase: string): boolean {
  const words = phrase.split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  if (words.length === 1 && cleanViToken(words[0] ?? "").length < 4) return true;
  return false;
}

function findGlossSpanInVi(
  viWords: string[],
  senseLine: string,
): { start: number; end: number; matchTerm: string } | null {
  const viText = viWords.join(" ").toLowerCase();

  for (const term of collocationGlossTerms(senseLine)) {
    if (!viText.includes(term.toLowerCase())) continue;
    const span = findTermSpan(viWords, term);
    if (span) return { ...span, matchTerm: term };
  }

  for (const term of glossAlignmentTerms(senseLine)) {
    const head = term.split(/\s+/)[0];
    if (!head || head.length < 2) continue;
    for (let i = 0; i < viWords.length - 1; i++) {
      if (cleanViToken(viWords[i] ?? "").toLowerCase() !== head.toLowerCase()) {
        continue;
      }
      return {
        start: i,
        end: i + 2,
        matchTerm: `${head} ${cleanViToken(viWords[i + 1] ?? "")}`,
      };
    }
  }

  return null;
}

function extractViCollocationPhrase(
  sourceVi: string,
  meaning?: string | null,
  senseIndex?: number,
): string {
  const vi = sourceVi.trim();
  if (!vi) return "";

  const senseLine = resolveSenseLine(vi, meaning, senseIndex);
  if (!senseLine) return "";

  const viWords = vi.split(/\s+/);
  const located = findGlossSpanInVi(viWords, senseLine);
  if (!located) return "";

  let start = located.start;
  if (
    start > 0 &&
    VI_NOUN_PREFIX.test(cleanViToken(viWords[start - 1] ?? ""))
  ) {
    start--;
  }
  if (start > 0 && cleanViToken(viWords[start - 1] ?? "").toLowerCase() === "sự") {
    start--;
  }
  if (
    start > 0 &&
    !VI_TRAILING_STOP.test(cleanViToken(viWords[start - 1] ?? "")) &&
    located.start - start < 2
  ) {
    const prev = cleanViToken(viWords[start - 1] ?? "").toLowerCase();
    if (prev.length >= 3 && !VI_NOUN_PREFIX.test(prev)) {
      start--;
    }
  }

  let end = located.end;
  while (end < viWords.length && end - start < 6) {
    const next = cleanViToken(viWords[end] ?? "");
    if (!next || VI_TRAILING_STOP.test(next)) break;
    end++;
  }

  const phrase = viWords
    .slice(start, end)
    .map(cleanViToken)
    .join(" ")
    .trim();
  if (!phrase || phrase.split(/\s+/).length > 6) return "";
  if (phraseKey(phrase) === phraseKey(vi)) return "";
  if (isWeakViPhrase(phrase)) return "";
  return phrase;
}

function isBareDeterminerPhrase(collocationEn: string): boolean {
  const words = normalizePhrase(collocationEn).split(/\s+/);
  return (
    words.length === 2 &&
    LEADING_DETERMINERS.test(words[0] ?? "") &&
    Boolean(words[1])
  );
}

function compactSenseLine(senseLine: string): string {
  return senseLine
    .split(",")[0]
    ?.replace(/^\s*sự\s+/i, "")
    .trim() ?? senseLine.trim();
}

function collocationTranslation(
  collocationEn: string,
  sourceEn: string,
  sourceVi: string,
  meaning?: string | null,
  senseIndex?: number,
): string {
  if (phraseKey(collocationEn) === phraseKey(sourceEn)) {
    return sourceVi.trim();
  }

  const senseLine = resolveSenseLine(sourceVi, meaning, senseIndex);
  if (isBareDeterminerPhrase(collocationEn) && senseLine) {
    return compactSenseLine(senseLine);
  }

  const derived = extractViCollocationPhrase(sourceVi, meaning, senseIndex);
  if (derived) return derived;

  if (
    senseLine &&
    normalizePhrase(collocationEn).split(/\s+/).length <= 3
  ) {
    return compactSenseLine(senseLine);
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
      const extracted = extractCollocationPhrase(en, word, wordType);
      if (extracted && phraseKey(extracted) !== phraseKey(en)) {
        collocationCandidates.push({
          en: extracted,
          vi: collocationTranslation(
            extracted,
            en,
            ex.vi,
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
    if (extracted && phraseKey(extracted) !== phraseKey(chunks[0].en)) {
      collocations = [
        {
          en: extracted,
          vi: collocationTranslation(
            extracted,
            chunks[0].en,
            chunks[0].vi,
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
