import { writeFileSync } from "node:fs";
import { JUNGLE_WORD_IMAGE_ENTRIES } from "@/data/jungle-cast-word-image-prompts";
const keys = Object.keys(JUNGLE_WORD_IMAGE_ENTRIES).sort();
writeFileSync(
  "src/data/cast-word-keys.ts",
  `/** Generated: keys of JUNGLE_WORD_IMAGE_ENTRIES (client-safe, no prompt text). Run \`npm run export:cast-word-keys\`. */\nexport const CAST_WORD_KEYS: readonly string[] = ${JSON.stringify(keys)};\n`,
);
console.log(keys.length);
