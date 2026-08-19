import { NGSL_FREQUENCY_RANKS } from "@/data/ngsl-frequency-ranks";
import { SPOKEN_FREQUENCY_RANKS } from "@/data/spoken-frequency-ranks";
import { isProfaneWord } from "@/lib/safe-image-search";

export type WordRange = {
  id: string;
  label: string;
  min: number;
  max: number;
};

export type PresetWord = {
  word: string;
  rank: number;
};

export const WORD_RANGES: WordRange[] = [
  { id: "1-100", label: "Rank 1 - 100", min: 1, max: 100 },
  { id: "101-200", label: "Rank 101 - 200", min: 101, max: 200 },
  { id: "201-300", label: "Rank 201 - 300", min: 201, max: 300 },
  { id: "301-500", label: "Rank 301 - 500", min: 301, max: 500 },
  { id: "501-1000", label: "Rank 501 - 1000", min: 501, max: 1000 },
  { id: "1001-3000", label: "Rank 1001 - 3000", min: 1001, max: 3000 },
  { id: "3001-5000", label: "Rank 3001 - 5000", min: 3001, max: 5000 },
  {
    id: "5001-plus",
    label: "Rank 5001+",
    min: 5001,
    max: Number.MAX_SAFE_INTEGER,
  },
];

/**
 * Ranking priority: NGSL headwords (1-2801), curriculum overrides, SUBTLEX-US
 * fill for ranks 2802-5000, then remaining SUBTLEX words for rank 5001+.
 */
const CURRICULUM_RANK_OVERRIDES: Readonly<Record<string, number>> = {
  thirteen: 3700,
  fourteen: 3800,
  seventeen: 4200,
  eighteen: 4300,
  nineteen: 4900,
  january: 3950,
  february: 4150,
  december: 4950,
  fraction: 3250,
  multiply: 3350,
  vowel: 3550,
  syllable: 3650,
  decimal: 3750,
  numeral: 3850,
  equate: 3950,
  consonant: 4050,
  triangle: 2650,
  // Spelled-out numbers, colors, days — pedagogical core, absent from NGSL ranks
  three: 150,
  four: 160,
  five: 170,
  six: 180,
  seven: 190,
  eight: 200,
  nine: 210,
  ten: 220,
  eleven: 230,
  twelve: 240,
  fifteen: 250,
  sixteen: 260,
  twenty: 270,
  thirty: 280,
  forty: 290,
  fifty: 300,
  hundred: 310,
  thousand: 320,
  red: 330,
  white: 340,
  blue: 350,
  green: 360,
  yellow: 370,
  black: 380,
  orange: 390,
  brown: 400,
  pink: 410,
  purple: 420,
  gray: 430,
  monday: 440,
  tuesday: 450,
  wednesday: 460,
  thursday: 470,
  friday: 480,
  saturday: 490,
  sunday: 500,
  march: 510,
  april: 520,
  may: 530,
  june: 540,
  july: 550,
  august: 560,
  september: 570,
  october: 580,
  november: 590,
};

const NGSL_MAX_RANK = 2801;
const SUBTLEX_CORE_MAX_RANK = 5000;

function isLearnableWord(word: string): boolean {
  return /^[a-z]+$/.test(word) && word.length > 1 && !isProfaneWord(word);
}

/** One NGSL headword per rank; first listed form in the generated NGSL table. */
function buildNgslHeadwordRanks(): Map<string, number> {
  const rankToWord = new Map<number, string>();
  for (const [word, rank] of Object.entries(NGSL_FREQUENCY_RANKS)) {
    if (rank > NGSL_MAX_RANK) continue;
    if (isProfaneWord(word)) continue;
    if (!rankToWord.has(rank)) rankToWord.set(rank, word);
  }

  const wordToRank = new Map<string, number>();
  for (const [rank, word] of rankToWord) {
    wordToRank.set(word, rank);
  }
  return wordToRank;
}

/** Fill rank slots minRank..maxRank with next SUBTLEX words not already used. */
function fillSubtlexRankBand(
  wordToRank: Map<string, number>,
  minRank: number,
  maxRank: number,
): void {
  const subtlexByFrequency = Object.entries(SPOKEN_FREQUENCY_RANKS)
    .filter(([word]) => isLearnableWord(word))
    .sort((a, b) => a[1] - b[1]);

  let nextRank = minRank;
  for (const [word] of subtlexByFrequency) {
    if (nextRank > maxRank) break;
    if (wordToRank.has(word)) continue;
    wordToRank.set(word, nextRank);
    nextRank++;
  }
}

/** Add remaining SUBTLEX words using their corpus rank (for 5001+ band). */
function addSubtlexBeyondCore(wordToRank: Map<string, number>): void {
  for (const [word, rank] of Object.entries(SPOKEN_FREQUENCY_RANKS)) {
    if (rank <= SUBTLEX_CORE_MAX_RANK) continue;
    if (!isLearnableWord(word)) continue;
    if (wordToRank.has(word)) continue;
    wordToRank.set(word, rank);
  }
}

function buildPresetWordInventory(): PresetWord[] {
  const wordToRank = buildNgslHeadwordRanks();

  for (const [word, rank] of Object.entries(CURRICULUM_RANK_OVERRIDES)) {
    if (isProfaneWord(word)) continue;
    wordToRank.set(word, rank);
  }

  fillSubtlexRankBand(wordToRank, NGSL_MAX_RANK + 1, SUBTLEX_CORE_MAX_RANK);
  addSubtlexBeyondCore(wordToRank);

  return [...wordToRank.entries()]
    .filter(([word]) => !isProfaneWord(word))
    .map(([word, rank]) => ({ word, rank }))
    .sort((a, b) => a.rank - b.rank || a.word.localeCompare(b.word));
}

export const PRESET_WORDS: PresetWord[] = buildPresetWordInventory();

export const PRESET_RANK_BY_WORD: Readonly<Record<string, number>> =
  Object.fromEntries(PRESET_WORDS.map((entry) => [entry.word, entry.rank]));

export function getRangeById(id: string): WordRange | undefined {
  return WORD_RANGES.find((r) => r.id === id);
}

export function getWordsInRange(min: number, max: number): PresetWord[] {
  return PRESET_WORDS.filter((w) => w.rank >= min && w.rank <= max);
}

export function getWordsByRangeId(rangeId: string): PresetWord[] {
  const range = getRangeById(rangeId);
  if (!range) return [];
  return getWordsInRange(range.min, range.max);
}

export function getPresetRank(word: string): number | undefined {
  return PRESET_RANK_BY_WORD[word.toLowerCase()];
}
