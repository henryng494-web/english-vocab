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
};

const LETTERS = ["A", "B", "C", "D"] as const;

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
