import { keepNaturalExamples } from "@/lib/example-quality";
import { capitalizeFirst } from "@/lib/format-text";
import { parseExamples } from "@/lib/parse-examples";
import { formatMeaningsForDisplay } from "@/lib/word-meanings";
import { isSameRankBand } from "@/data/word-ranges";

const FALLBACK_DISTRACTORS = [
  "apple",
  "river",
  "window",
  "family",
  "music",
  "garden",
  "yellow",
  "travel",
  "friend",
  "morning",
  "paper",
  "school",
  "bread",
  "cloud",
  "table",
  "light",
];

export type ReviewChoice = {
  key: string;
  letter: string;
  word: string;
  meaning?: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  /** Sense quiz: this gloss belongs to the prompt word. */
  isCorrect?: boolean;
};

export type ReviewQuizKind = "word" | "sense" | "recall";

const LETTERS = ["A", "B", "C", "D"] as const;
const SENSE_LETTERS = ["A", "B", "C"] as const;

const FALLBACK_SENSE_DISTRACTORS: Array<{
  word: string;
  vietnamese_meaning: string;
}> = [
  { word: "apple", vietnamese_meaning: "Quả táo" },
  { word: "river", vietnamese_meaning: "Con sông" },
  { word: "window", vietnamese_meaning: "Cửa sổ" },
  { word: "family", vietnamese_meaning: "Gia đình" },
  { word: "garden", vietnamese_meaning: "Khu vườn" },
  { word: "school", vietnamese_meaning: "Trường học" },
  { word: "paper", vietnamese_meaning: "Tờ giấy" },
  { word: "table", vietnamese_meaning: "Cái bàn" },
];

type SenseSource = {
  word: string;
  rank?: number;
  family_head?: string | null;
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  image_url?: string | null;
  search_keyword?: string | null;
  word_type?: string | null;
};

function familyKey(word: string, familyHead?: string | null): string {
  return (familyHead ?? word).trim().toLowerCase();
}

function pickSameRankDistractors<T extends { word: string; rank?: number }>(
  correctWord: string,
  correctRank: number,
  pool: T[],
  count: number,
  usable: (item: T) => boolean,
): T[] {
  const correct = correctWord.trim().toLowerCase();
  const candidates = pool.filter((item) => {
    const key = item.word.trim().toLowerCase();
    return key && key !== correct && usable(item);
  });
  const inBand = candidates.filter((item) =>
    isSameRankBand(correctRank, item.rank ?? Number.MAX_SAFE_INTEGER),
  );
  const picked = shuffle(inBand).slice(0, count);
  if (picked.length >= count) return picked;

  const used = new Set(picked.map((item) => item.word.trim().toLowerCase()));
  const nearest = [...candidates]
    .filter((item) => !used.has(item.word.trim().toLowerCase()))
    .sort(
      (left, right) =>
        Math.abs((left.rank ?? 99999) - correctRank) -
        Math.abs((right.rank ?? 99999) - correctRank),
    );
  return [...picked, ...nearest].slice(0, count);
}

export function reviewSenseCacheKey(questionIndex: number, word: string): string {
  return `${questionIndex}:${word.trim().toLowerCase()}`;
}

/** True when choices include the prompt word marked correct with a gloss. */
export function senseChoicesIncludeCorrectWord(
  choices: ReviewChoice[],
  correctWord: string,
): boolean {
  const correct = correctWord.trim().toLowerCase();
  if (!correct || choices.length !== 3) return false;

  const match = choices.find(
    (choice) => choice.word.trim().toLowerCase() === correct,
  );
  if (!match || match.isCorrect !== true) return false;
  return Boolean(match.meaning?.trim());
}

/** Stricter check: prompt gloss present, unique meanings, matches pool data. */
export function senseChoicesAreValidForPrompt(
  choices: ReviewChoice[],
  promptWord: string,
  pool: SenseSource[],
): boolean {
  const correct = promptWord.trim().toLowerCase();
  if (!correct || choices.length !== 3) return false;
  if (!senseChoicesIncludeCorrectWord(choices, promptWord)) return false;

  const poolItem = pool.find((item) => item.word.trim().toLowerCase() === correct);
  const expectedMeaning = reviewSenseText(poolItem ?? {});
  if (!expectedMeaning) return false;

  const correctChoice = choices.find(
    (choice) => choice.word.trim().toLowerCase() === correct,
  );
  if (!correctChoice || correctChoice.meaning !== expectedMeaning) return false;

  const meanings = choices
    .map((choice) => choice.meaning?.trim())
    .filter(Boolean);
  return new Set(meanings).size === 3;
}

function mergeChoiceImages(
  choices: ReviewChoice[],
  cached: ReviewChoice[],
): ReviewChoice[] {
  const imageByWord = new Map(
    cached.map((choice) => [
      choice.word.trim().toLowerCase(),
      choice.imageUrl ?? null,
    ]),
  );
  return choices.map((choice) => {
    const key = choice.word.trim().toLowerCase();
    const imageUrl = imageByWord.get(key) ?? choice.imageUrl ?? null;
    return imageUrl ? { ...choice, imageUrl } : choice;
  });
}

/** Prefer a fresh build; fall back to cached only when it passes validation. */
export function resolveReviewSenseChoices(
  promptWord: string,
  pool: SenseSource[],
  cached?: ReviewChoice[] | null,
): ReviewChoice[] {
  const fresh = buildReviewSenseChoices(promptWord, pool);
  if (senseChoicesAreValidForPrompt(fresh, promptWord, pool)) {
    return cached ? mergeChoiceImages(fresh, cached) : fresh;
  }
  if (
    cached &&
    senseChoicesAreValidForPrompt(cached, promptWord, pool)
  ) {
    return cached;
  }
  return fresh;
}

/** Compact Vietnamese gloss for review sense choices (matches WordCard rules). */
export function reviewSenseText(word: {
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
}): string {
  const lines = formatMeaningsForDisplay(word.vietnamese_meaning);
  if (lines.length > 0) {
    return lines.join(" · ");
  }
  const definition = word.english_definition?.trim();
  if (definition) return capitalizeFirst(definition);
  return "";
}

export function buildReviewSenseChoices(
  correctWord: string,
  pool: SenseSource[],
): ReviewChoice[] {
  const correct = correctWord.trim().toLowerCase();
  const correctItem = pool.find(
    (item) => item.word.trim().toLowerCase() === correct,
  );
  const correctMeaning = reviewSenseText(correctItem ?? {});
  if (!correctMeaning) return [];

  const correctHead = familyKey(correct, correctItem?.family_head);
  const distractors = pickSameRankDistractors(
    correct,
    correctItem?.rank ?? 0,
    pool,
    2,
    (item) =>
      Boolean(reviewSenseText(item)) &&
      familyKey(item.word, item.family_head) !== correctHead,
  );
  if (distractors.length < 2) {
    for (const fallback of FALLBACK_SENSE_DISTRACTORS) {
      if (distractors.length === 2) break;
      if (fallback.word === correct) continue;
      if (distractors.some((item) => item.word.trim().toLowerCase() === fallback.word)) {
        continue;
      }
      distractors.push(fallback);
    }
  }

  const correctOption =
    correctItem ?? { word: correct, vietnamese_meaning: correctMeaning };
  let options = shuffle([correctOption, ...distractors.slice(0, 2)]);
  if (
    !options.some((item) => item.word.trim().toLowerCase() === correct)
  ) {
    options = shuffle([correctOption, ...distractors.slice(0, 2)]);
  }

  return options.slice(0, 3).map((item, index) => {
    const itemWord = item.word.trim().toLowerCase();
    const isCorrect = itemWord === correct;
    return {
      key: `${itemWord}-${index}`,
      letter: SENSE_LETTERS[index] ?? String(index + 1),
      word: capitalizeFirst(item.word),
      meaning: isCorrect
        ? correctMeaning
        : reviewSenseText(item) || correctMeaning,
      imageUrl: item.image_url ?? null,
      searchKeyword: item.search_keyword ?? null,
      wordType: item.word_type ?? null,
      isCorrect,
    };
  });
}

export function reviewQuizKindForIndex(index: number): ReviewQuizKind {
  const slot = index % 3;
  if (slot === 1) return "sense";
  if (slot === 2) return "recall";
  return "word";
}

type ReviewPoolWord = SenseSource & {
  family_head?: string | null;
};

/** Build quiz kind + choices for a review slot (shared by UI and image prefetch). */
export function buildReviewQuestionPlan(
  word: ReviewPoolWord,
  pool: ReviewPoolWord[],
  questionIndex: number,
): { kind: ReviewQuizKind; choices: ReviewChoice[] } {
  const wanted = reviewQuizKindForIndex(questionIndex);
  let kind: ReviewQuizKind = "word";
  let choices: ReviewChoice[] = [];

  if (wanted === "sense") {
    const senseChoices = buildReviewSenseChoices(word.word, pool);
    if (senseChoicesAreValidForPrompt(senseChoices, word.word, pool)) {
      kind = "sense";
      choices = senseChoices;
    }
  } else if (wanted === "recall") {
    kind = "recall";
  }

  if (kind === "word") {
    choices = buildReviewChoices(
      word.word,
      pool.filter(
        (item) =>
          /^[a-z]+$/i.test(item.word) &&
          item.word.length >= 3 &&
          Boolean(item.english_definition?.trim()),
      ),
      word.rank,
      reviewSenseCacheKey(questionIndex, word.word),
    );
  }

  return { kind, choices };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sentenceHasWord(sentence: string, word: string): boolean {
  const needle = word.trim();
  if (!needle || !sentence.trim()) return false;
  return new RegExp(`\\b${escapeRegExp(needle)}\\b`, "i").test(sentence);
}

export function pickReviewRecallSentence(
  word: string,
  rawExamples: unknown,
  meaning?: string | null,
  pos?: string | null,
): string {
  const parsed = parseExamples(rawExamples);
  const natural = keepNaturalExamples(word, parsed, pos, meaning);
  const withWord =
    natural.find((item) => sentenceHasWord(item.en, word)) ??
    parsed.find((item) => sentenceHasWord(item.en, word));
  return withWord?.en?.trim() ?? natural[0]?.en?.trim() ?? "";
}

export function splitSentenceAroundWord(
  sentence: string,
  word: string,
): Array<{ text: string; highlight: boolean }> {
  const needle = word.trim();
  if (!sentence.trim() || !needle) {
    return sentence ? [{ text: sentence, highlight: false }] : [];
  }
  const re = new RegExp(`\\b(${escapeRegExp(needle)})\\b`, "ig");
  const parts = sentence.split(re);
  return parts
    .filter((part) => part.length > 0)
    .map((text) => ({
      text,
      highlight: text.toLowerCase() === needle.toLowerCase(),
    }));
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = next[i];
    next[i] = next[j];
    next[j] = current;
  }
  return next;
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  const next = [...items];
  let state = hashSeed(seed);
  for (let i = next.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const current = next[i];
    next[i] = next[j]!;
    next[j] = current!;
  }
  return next;
}

export function buildReviewChoices(
  correctWord: string,
  pool: Array<{ word: string; rank?: number; family_head?: string | null }>,
  correctRank = 0,
  choiceSeed?: string,
): ReviewChoice[] {
  const correct = correctWord.trim().toLowerCase();
  const correctHead = familyKey(
    correct,
    pool.find((item) => item.word.trim().toLowerCase() === correct)?.family_head,
  );
  const ranked = pickSameRankDistractors(
    correct,
    correctRank,
    pool,
    3,
    (item) =>
      /^[a-z]+$/i.test(item.word) &&
      item.word.length >= 3 &&
      familyKey(item.word, item.family_head) !== correctHead,
  );
  const unique = [
    ...new Set([
      ...ranked.map((item) => item.word.trim().toLowerCase()),
      ...FALLBACK_DISTRACTORS,
    ]),
  ].filter((item) => item && item !== correct);
  const distractors = unique.slice(0, 3);
  const options = [correct, ...distractors];
  const words = choiceSeed
    ? seededShuffle(options, choiceSeed)
    : shuffle(options);
  return words.map((word, index) => ({
    key: word,
    letter: LETTERS[index] ?? String(index + 1),
    word: capitalizeFirst(word),
  }));
}

export function reviewClue(word: {
  english_definition?: string | null;
  vietnamese_meaning?: string | null;
}): string {
  const definition = word.english_definition?.trim();
  if (definition) return capitalizeFirst(definition);
  const meaning = reviewSenseText(word);
  if (meaning) return meaning;
  return "Choose the matching word.";
}
