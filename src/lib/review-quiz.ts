import { capitalizeFirst } from "@/lib/format-text";

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
  wordType?: string | null;
};

export type ReviewQuizKind = "word" | "sense";

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
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  image_url?: string | null;
  word_type?: string | null;
};

export function reviewSenseText(word: {
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
}): string {
  const meaning = word.vietnamese_meaning?.trim();
  if (meaning) return capitalizeFirst(meaning);
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

  const used = new Set<string>([correct]);
  const distractors: SenseSource[] = [];
  for (const item of shuffle(pool)) {
    const key = item.word.trim().toLowerCase();
    if (used.has(key) || !reviewSenseText(item)) continue;
    used.add(key);
    distractors.push(item);
    if (distractors.length === 2) break;
  }
  for (const fallback of FALLBACK_SENSE_DISTRACTORS) {
    if (distractors.length === 2) break;
    if (used.has(fallback.word)) continue;
    used.add(fallback.word);
    distractors.push(fallback);
  }

  const options = shuffle([correctItem ?? { word: correct, vietnamese_meaning: correctMeaning }, ...distractors]);
  return options.slice(0, 3).map((item, index) => ({
    key: `${item.word.trim().toLowerCase()}-${index}`,
    letter: SENSE_LETTERS[index] ?? String(index + 1),
    word: capitalizeFirst(item.word),
    meaning: reviewSenseText(item) || correctMeaning,
    imageUrl: item.image_url ?? null,
    wordType: item.word_type ?? null,
  }));
}

export function reviewQuizKindForIndex(index: number): ReviewQuizKind {
  return index % 2 === 1 ? "sense" : "word";
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
  pool: string[],
): ReviewChoice[] {
  const correct = correctWord.trim().toLowerCase();
  const unique = [
    ...new Set(
      [...pool, ...FALLBACK_DISTRACTORS]
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item && item !== correct),
    ),
  ];
  const distractors = shuffle(unique).slice(0, 3);
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
  const meaning = word.vietnamese_meaning?.trim();
  if (meaning) return capitalizeFirst(meaning);
  return "Choose the matching word.";
}
