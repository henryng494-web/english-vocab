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

  const options = shuffle([correctItem ?? { word: correct, vietnamese_meaning: correctMeaning }, ...distractors]);
  return options.slice(0, 3).map((item, index) => ({
    key: `${item.word.trim().toLowerCase()}-${index}`,
    letter: SENSE_LETTERS[index] ?? String(index + 1),
    word: capitalizeFirst(item.word),
    meaning: reviewSenseText(item) || correctMeaning,
    imageUrl: item.image_url ?? null,
    searchKeyword: item.search_keyword ?? null,
    wordType: item.word_type ?? null,
  }));
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
    if (senseChoices.length === 3) {
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
): string {
  const parsed = parseExamples(rawExamples);
  const natural = keepNaturalExamples(word, parsed);
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

export function buildReviewChoices(
  correctWord: string,
  pool: Array<{ word: string; rank?: number; family_head?: string | null }>,
  correctRank = 0,
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
  const words = shuffle([correct, ...distractors]);
  return words.map((word, index) => ({
    key: `${word}-${index}`,
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
