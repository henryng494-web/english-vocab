import { PRESET_WORDS } from "@/data/preset-vocabulary";
import { isExcludedVocabWord } from "@/lib/proper-noun";

export type WordSearchHit = {
  word: string;
  rank: number;
};

/** Search the preset vocabulary bank by exact, prefix, then substring match. */
export function searchPresetWords(
  query: string,
  limit = 40,
): WordSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const exact: WordSearchHit[] = [];
  const prefix: WordSearchHit[] = [];
  const includes: WordSearchHit[] = [];

  for (const entry of PRESET_WORDS) {
    if (isExcludedVocabWord(entry.word)) continue;
    const word = entry.word.toLowerCase();
    if (word === q) exact.push(entry);
    else if (word.startsWith(q)) prefix.push(entry);
    else if (word.includes(q)) includes.push(entry);
  }

  return [...exact, ...prefix, ...includes].slice(0, limit);
}
