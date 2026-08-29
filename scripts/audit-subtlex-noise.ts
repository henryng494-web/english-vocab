/**
 * Report foreign subtitle tokens still present in the preset inventory.
 * Run: npx tsx scripts/audit-subtlex-noise.ts
 */
import { PRESET_WORDS } from "@/data/preset-vocabulary";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { isSubtlexOnlyForeignNoise } from "@/lib/subtlex-corpus-filter";

const foreignInPreset = PRESET_WORDS.filter((entry) =>
  isSubtlexOnlyForeignNoise(entry.word),
);

const excludedInPreset = PRESET_WORDS.filter((entry) =>
  isExcludedVocabWord(entry.word),
);

console.log(`Preset words: ${PRESET_WORDS.length}`);
console.log(`Excluded words still in preset: ${excludedInPreset.length}`);
if (excludedInPreset.length > 0) {
  for (const entry of excludedInPreset.sort((a, b) => a.rank - b.rank)) {
    console.log(`  ${entry.rank}\t${entry.word}`);
  }
}

console.log(`\nSUBTLEX-only foreign noise in preset: ${foreignInPreset.length}`);
if (foreignInPreset.length > 0) {
  for (const entry of foreignInPreset.sort((a, b) => a.rank - b.rank)) {
    console.log(`  ${entry.rank}\t${entry.word}`);
  }
}

process.exit(excludedInPreset.length > 0 ? 1 : 0);
