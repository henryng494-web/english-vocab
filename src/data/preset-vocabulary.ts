import { NGSL_FREQUENCY_RANKS } from "@/data/ngsl-frequency-ranks";
import { SPOKEN_FREQUENCY_RANKS } from "@/data/spoken-frequency-ranks";
import { type WordRange, WORD_RANGES } from "@/data/word-ranges";
import { isProfaneWord } from "@/lib/safe-image-search";

export type { WordRange };
export { WORD_RANGES };

export type PresetWord = {
  word: string;
  rank: number;
};

/**
 * Build the discover inventory: sort all learnable words by corpus importance
 * (NGSL headword rank, curriculum override, or SUBTLEX rank), then assign
 * exactly (max − min + 1) words to each WORD_RANGES band so Rank 1-100 always
 * has 100 words, Rank 501-1000 always has 500, etc. Each word's rank number
 * is its slot within the global frequency order (1 = most important).
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

function isLearnableWord(word: string): boolean {
  return /^[a-z]+$/.test(word) && word.length > 1 && !isProfaneWord(word);
}

/** NGSL headword → rank (one word per NGSL slot 1..2801). */
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

/** Lower sort key = more important / should appear earlier in discover bands. */
function frequencySortKey(
  word: string,
  ngslHeadwords: Map<string, number>,
): number {
  const override = CURRICULUM_RANK_OVERRIDES[word];
  if (override !== undefined) return override;
  const subtlex = SPOKEN_FREQUENCY_RANKS[word];
  if (subtlex !== undefined) return subtlex;
  const ngsl = ngslHeadwords.get(word);
  if (ngsl !== undefined) return ngsl;
  return Number.MAX_SAFE_INTEGER;
}

function collectLearnableWords(ngslHeadwords: Map<string, number>): string[] {
  const words = new Set<string>();
  for (const word of ngslHeadwords.keys()) {
    if (isLearnableWord(word)) words.add(word);
  }
  for (const word of Object.keys(CURRICULUM_RANK_OVERRIDES)) {
    if (isLearnableWord(word)) words.add(word);
  }
  for (const word of Object.keys(SPOKEN_FREQUENCY_RANKS)) {
    if (isLearnableWord(word)) words.add(word);
  }
  return [...words].sort(
    (a, b) =>
      frequencySortKey(a, ngslHeadwords) - frequencySortKey(b, ngslHeadwords) ||
      a.localeCompare(b),
  );
}

function buildPresetWordInventory(): PresetWord[] {
  const ngslHeadwords = buildNgslHeadwordRanks();
  const sortedWords = collectLearnableWords(ngslHeadwords);
  const assigned = new Map<string, number>();

  let cursor = 0;
  for (const range of WORD_RANGES) {
    if (range.max === Number.MAX_SAFE_INTEGER) {
      let rank = range.min;
      while (cursor < sortedWords.length) {
        assigned.set(sortedWords[cursor], rank);
        cursor++;
        rank++;
      }
      break;
    }

    const capacity = range.max - range.min + 1;
    for (let slot = 0; slot < capacity && cursor < sortedWords.length; slot++) {
      assigned.set(sortedWords[cursor], range.min + slot);
      cursor++;
    }
  }

  return [...assigned.entries()]
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
