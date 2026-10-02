import { writeFileSync } from "node:fs";
import { PRESET_WORDS } from "@/data/preset-vocabulary";
const MAX_RANK = 6300;
const map = Object.fromEntries(PRESET_WORDS.filter((w) => w.rank <= MAX_RANK).map((w) => [w.word, w.rank]));
writeFileSync(
  "src/data/preset-rank-map.ts",
  `/** Generated from PRESET_WORDS (client-safe). Run \`npm run export:preset-rank-map\`. */\nexport const PRESET_RANK_MAP: Readonly<Record<string, number>> = ${JSON.stringify(map)};\n\nexport function getPresetRankLite(word: string): number | undefined {\n  return PRESET_RANK_MAP[word.trim().toLowerCase()];\n}\n`,
);
console.log(Object.keys(map).length);
