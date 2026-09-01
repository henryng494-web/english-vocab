/**
 * Report preset inventory words that should be excluded as subtitle abbreviations.
 * Run: npx tsx scripts/audit-vocab-abbreviations.ts
 */
import { PRESET_WORDS } from "@/data/preset-vocabulary";
import {
  ABBREV_TO_CANONICAL,
  SUBTITLE_ABBREV_TOKENS,
  isVocabAbbreviation,
} from "@/data/vocab-abbreviations";
import { isExcludedVocabWord } from "@/lib/proper-noun";

const leaking = PRESET_WORDS.filter(
  (entry) => isVocabAbbreviation(entry.word) && !isExcludedVocabWord(entry.word),
);

console.log(`Preset words: ${PRESET_WORDS.length}`);
console.log(`Abbrev mappings: ${Object.keys(ABBREV_TO_CANONICAL).length}`);
console.log(`Subtitle junk tokens: ${SUBTITLE_ABBREV_TOKENS.size}`);
console.log(`Leaking abbrev/clipping headwords: ${leaking.length}`);

if (leaking.length > 0) {
  for (const entry of leaking.sort((a, b) => a.rank - b.rank)) {
    const canonical = ABBREV_TO_CANONICAL[entry.word];
    const tag = canonical ? `→ ${canonical}` : "(junk)";
    console.log(`  ${entry.rank}\t${entry.word}\t${tag}`);
  }
}

process.exit(leaking.length > 0 ? 1 : 0);
