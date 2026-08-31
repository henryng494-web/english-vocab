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
  /^(i|we|you|they|he|she|it|which|that|when|where|if|but|and|or|so|then|there|here|was|were|is|are|am|had|has|have|met|not|she|her|his|my|our|their|launched|launch|launches)$/i;

const QUANTIFIER_HEADWORDS =
  /^(some|any|several|many|few|multiple|numerous|various|each|every|both|all|most|more|less|enough|another|other)$/i;

const ED_NOUN_EXCEPTIONS = new Set(["red", "bed", "fed", "led", "wed", "shed", "bred"]);

const INLINE_VERBS = new Set([
  "was", "were", "is", "are", "am", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would",
  "can", "could", "should", "may", "might", "must", "met", "arrived",
  "got", "get", "went", "go", "come", "came", "said", "say",
  "make", "made", "take", "took", "give", "gave", "feel", "feels", "felt",
  "look", "looks", "looked", "seem", "seems", "seemed", "not",
  "launch", "launched", "launches", "fire", "fired", "fires",
  "review", "reviewed", "reviews", "raise", "raised", "raises",
  "ask", "asked", "asks", "call", "called", "calls",
  "use", "used", "uses", "find", "found", "finds",
  "want", "wanted", "wants", "need", "needed", "needs",
  "help", "helped", "helps", "work", "worked", "works",
  "play", "played", "plays", "show", "showed", "shows",
  "tell", "told", "tells", "keep", "kept", "keeps",
  "let", "lets", "put", "puts", "set", "sets",
  "bring", "brought", "brings", "buy", "bought", "buys",
  "think", "thought", "thinks", "know", "knew", "knows",
  "see", "saw", "sees", "hear", "heard", "hears",
  "leave", "left", "leaves", "mean", "means", "meant",
  "become", "became", "becomes", "begin", "began", "begins",
  "write", "wrote", "writes", "read", "reads",
  "run", "ran", "runs", "walk", "walked", "walks",
  "talk", "talked", "talks", "speak", "spoke", "speaks",
  "pay", "paid", "pays", "send", "sent", "sends",
  "build", "built", "builds", "spend", "spent", "spends",
  "learn", "learned", "learnt", "learns",
  "change", "changed", "changes", "move", "moved", "moves",
  "live", "lived", "lives", "believe", "believed", "believes",
  "happen", "happened", "happens", "provide", "provided", "provides",
  "include", "included", "includes", "continue", "continued", "continues",
  "create", "created", "creates", "decide", "decided", "decides",
  "expect", "expected", "expects", "remember", "remembered", "remembers",
  "consider", "considered", "considers", "allow", "allowed", "allows",
  "add", "added", "adds", "offer", "offered", "offers",
  "appear", "appeared", "appears", "lose", "lost", "loses",
  "win", "won", "wins", "serve", "served", "serves",
  "die", "died", "dies", "stay", "stayed", "stays",
  "fall", "fell", "falls", "cut", "cuts", "reach", "reached", "reaches",
  "kill", "killed", "kills", "remain", "remained", "remains",
  "suggest", "suggested", "suggests", "pass", "passed", "passes",
  "sell", "sold", "sells", "require", "required", "requires",
  "report", "reported", "reports", "pull", "pulled", "pulls",
  "prove", "proved", "proven", "proves",
  "attend", "attended", "attends", "join", "joined", "joins",
  "discuss", "discussed", "discusses", "support", "supported", "supports",
  "develop", "developed", "develops", "improve", "improved", "improves",
  "accept", "accepted", "accepts", "receive", "received", "receives",
  "choose", "chose", "chosen", "chooses", "check", "checked", "checks",
  "follow", "followed", "follows", "watch", "watched", "watches",
  "wait", "waited", "waits", "open", "opened", "opens",
  "close", "closed", "closes", "start", "started", "starts",
  "stop", "stopped", "stops", "finish", "finished", "finishes",
  "try", "tried", "tries", "plan", "planned", "plans",
  "prepare", "prepared", "prepares", "share", "shared", "shares",
  "enjoy", "enjoyed", "enjoys", "love", "loved", "loves",
  "like", "liked", "likes", "prefer", "preferred", "prefers",
  "hope", "hoped", "hopes", "wish", "wished", "wishes",
  "agree", "agreed", "agrees", "disagree", "disagreed", "disagrees",
  "explain", "explained", "explains", "describe", "described", "describes",
  "mention", "mentioned", "mentions", "notice", "noticed", "notices",
  "realize", "realised", "realized", "realizes", "understand", "understood", "understands",
  "worry", "worried", "worries", "care", "cared", "cares",
  "miss", "missed", "misses", "avoid", "avoided", "avoids",
  "face", "faced", "faces", "handle", "handled", "handles",
  "manage", "managed", "manages", "cover", "covered", "covers",
  "pick", "picked", "picks", "drop", "dropped", "drops",
  "carry", "carried", "carries", "hold", "held", "holds",
  "push", "pushed", "pushes", "turn", "turned", "turns",
  "break", "broke", "broken", "breaks", "fix", "fixed", "fixes",
  "solve", "solved", "solves", "answer", "answered", "answers",
  "reply", "replied", "replies", "respond", "responded", "responds",
  "return", "returned", "returns", "visit", "visited", "visits",
  "travel", "travelled", "traveled", "travels", "meet", "met", "meets",
  "eat", "ate", "eaten", "eats", "drink", "drank", "drunk", "drinks",
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

function tokenMatchesHeadword(token: string, headword: string): boolean {
  const t = normalizeToken(token);
  const hw = headword.toLowerCase();
  if (!t || !hw) return false;
  if (t === hw) return true;
  if (LEADING_DETERMINERS.test(t) || t.length <= 2) return false;
  const stem = hw.length > 4 ? hw.slice(0, 4) : hw;
  return t.startsWith(stem);
}

function findHeadwordIndex(words: string[], headword: string): number {
  for (let i = 0; i < words.length; i++) {
    const token = normalizeToken(words[i] ?? "");
    if (token === headword.toLowerCase()) return i;
  }
  for (let i = 0; i < words.length; i++) {
    const token = normalizeToken(words[i] ?? "");
    if (tokenMatchesHeadword(token, headword)) return i;
  }
  return -1;
}

function phraseContainsHeadword(phrase: string, headword: string): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  return words.some((word) => tokenMatchesHeadword(word, headword));
}

function hasPrepPattern(words: string[]): boolean {
  return words.some((word) => PREP_TOKENS.has(normalizeToken(word)));
}

function looksLikeVerbToken(token: string): boolean {
  const t = normalizeToken(token);
  if (!t) return false;
  if (INLINE_VERBS.has(t)) return true;
  if (ED_NOUN_EXCEPTIONS.has(t)) return false;
  if (t.endsWith("ed") && t.length > 3) return true;
  return false;
}

function isQuantifierLike(
  wordType: string | null | undefined,
  headword: string,
): boolean {
  const pos = normalizeWordType(wordType, headword);
  if (pos === "determiner" || pos === "article" || pos === "number") {
    return true;
  }
  return QUANTIFIER_HEADWORDS.test(headword.toLowerCase());
}

function hasVerbBeforeHeadword(phrase: string, headword: string): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  const idx = findHeadwordIndex(words, headword);
  if (idx <= 0) return false;
  for (let i = 0; i < idx; i++) {
    const token = normalizeToken(words[i] ?? "");
    if (token === "to") continue;
    if (looksLikeVerbToken(token)) return true;
  }
  return false;
}

function isSentenceFragment(phrase: string, headword?: string): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  if (words.length > MAX_COLLOCATION_WORDS_WITH_PREP) return true;
  if (words.length > MAX_COLLOCATION_WORDS && !hasPrepPattern(words)) return true;

  const first = normalizeToken(words[0] ?? "");
  if (first === "to" && words.length === 2) return false;
  if (FRAGMENT_START.test(first)) return true;
  if (headword && hasVerbBeforeHeadword(phrase, headword)) return true;

  const hwIdx = headword ? findHeadwordIndex(words, headword) : -1;
  for (let i = 0; i < words.length; i++) {
    if (i === hwIdx) continue;
    const token = normalizeToken(words[i] ?? "");
    if (i === 0 && token === "to") continue;
    if (INLINE_VERBS.has(token)) return true;
  }
  return false;
}

/** Fixed prep + headword pairs learners treat as one unit: "at least", "at most". */
function isLeadingPrepHeadwordPair(phrase: string, headword: string): boolean {
  const words = normalizePhrase(phrase).split(/\s+/).filter(Boolean);
  if (words.length !== 2) return false;
  const prep = normalizeToken(words[0] ?? "");
  if (findHeadwordIndex(words, headword) !== 1) return false;
  return PREP_TOKENS.has(prep) || TRAILING_PREPS.has(prep);
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
  if (last === "to") return false;
  if (!TRAILING_PREPS.has(last)) return false;

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

  if (isQuantifierLike(pos, headword)) {
    const next = words[idx + 1];
    if (!next) return null;
    const nextToken = normalizeToken(next);
    if (
      looksLikeVerbToken(nextToken) ||
      TRAILING_PREPS.has(nextToken) ||
      LEADING_DETERMINERS.test(nextToken)
    ) {
      return null;
    }
    return `${words[idx]} ${next}`.trim();
  }

  let start = idx;
  let end = idx + 1;

  if (pos === "verb") {
    const prev = normalizeToken(words[idx - 1] ?? "");
    if (prev === "to" || prev === "don't" || prev === "dont") {
      return `${words[idx - 1]} ${words[idx]}`.trim();
    }
    for (let j = idx + 1; j < Math.min(words.length, idx + 4); j++) {
      const token = normalizeToken(words[j] ?? "");
      if (TRAILING_PREPS.has(token) || ALLOWED_MID_PREPS.has(token)) {
        return `${words[idx]} ${words[j]}`.trim();
      }
    }
    start = idx;
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

    if (looksLikeVerbToken(prev)) {
      if (
        ALLOWED_MID_PREPS.has(next) &&
        idx + 2 < words.length &&
        !TRAILING_PREPS.has(normalizeToken(words[idx + 2] ?? ""))
      ) {
        start = idx;
        end = idx + 3;
      } else if (next && !TRAILING_PREPS.has(next) && !looksLikeVerbToken(next)) {
        start = idx;
        end = idx + 2;
      } else {
        return null;
      }
    } else if (
      ALLOWED_MID_PREPS.has(next) &&
      idx + 2 < words.length &&
      !TRAILING_PREPS.has(normalizeToken(words[idx + 2] ?? ""))
    ) {
      start = idx > 0 && LEADING_DETERMINERS.test(prev) ? idx - 1 : idx;
      end = idx + 3;
    } else if (next && !TRAILING_PREPS.has(next)) {
      if (idx > 0 && !looksLikeVerbToken(prev) && !FRAGMENT_START.test(prev)) {
        start = idx - 1;
      }
      end = idx + 2;
    } else if (idx > 0 && !looksLikeVerbToken(prev)) {
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
    const prev = normalizeToken(words[idx - 1] ?? "");
    const fallbackStart =
      idx > 0 && !looksLikeVerbToken(prev) && !FRAGMENT_START.test(prev)
        ? idx - 1
        : idx;
    phrase = trimDanglingTail(
      words.slice(fallbackStart, idx + 1).join(" ").trim(),
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
  if (isLeadingPrepHeadwordPair(phrase, headword)) return false;
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
  if (isLeadingPrepHeadwordPair(phrase, headword)) return false;
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
  if (!phraseContainsHeadword(extracted, headword)) return false;
  if (findHeadwordIndex(words, headword) < 0) return false;
  if (isWeakCollocation(extracted, headword)) return false;
  if (isSentenceFragment(extracted, headword)) return false;
  if (hasVerbBeforeHeadword(extracted, headword)) return false;
  if (endsWithDanglingToken(extracted, headword, wordType)) return false;
  if (hasStrayPreposition(extracted, headword, wordType)) return false;
  if (isQuantifierLike(wordType, headword)) {
    if (words.length !== 2) return false;
    if (findHeadwordIndex(words, headword) !== 0) return false;
  }
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
