import subtlexWordFrequencies from "subtlex-word-frequencies";

/**
 * Full-coverage (~74k word) frequency rank, computed once per server process
 * from the complete SUBTLEX-US corpus (see THIRD_PARTY_NOTICES.md).
 *
 * `src/data/spoken-frequency-ranks.ts` and `src/data/ngsl-frequency-ranks.ts`
 * only cover this app's curated preset vocabulary / the NGSL's 2801
 * headwords. Words a user types into "Add word" (e.g. "goodbye") are not
 * guaranteed to be in either, and previously fell back to a flat, made-up
 * default rank (5000/10000) regardless of how common the word actually is.
 * This lookup gives every real English word a genuine, corpus-derived rank
 * instead of that guess.
 */
let rankByWord: Map<string, number> | null = null;

function buildRankMap(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of subtlexWordFrequencies as Array<{
    word: string;
    count: number;
  }>) {
    const key = entry.word.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + entry.count);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const ranks = new Map<string, number>();
  sorted.forEach(([word], index) => ranks.set(word, index + 1));
  return ranks;
}

export function getFullCorpusFrequencyRank(word: string): number | undefined {
  if (!rankByWord) rankByWord = buildRankMap();
  return rankByWord.get(word.toLowerCase());
}
