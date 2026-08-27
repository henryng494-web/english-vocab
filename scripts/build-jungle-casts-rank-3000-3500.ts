/**
 * Build Jungle Jokers cast prompts for rank 3000–3500 and merge into existing entries.
 * Run: npm run build:jungle-casts-3000-3500
 */
import { readFileSync, writeFileSync } from "node:fs";
import { getWordsInRange } from "@/data/preset-vocabulary";
import { CURATED_IMAGE_KEYWORDS_RANK_3001_5000 } from "@/data/curated-image-keywords-rank-3001-5000";
import { CURATED_IMAGE_KEYWORDS_RANK_1001_3000 } from "@/data/curated-image-keywords-rank-1001-3000";
import {
  JUNGLE_WORD_IMAGE_ENTRIES,
  type JungleWordImageEntry,
} from "@/data/jungle-cast-word-image-prompts";
import type { JungleCastMember } from "@/data/jungle-cast-refs";

const MEMBERS: readonly JungleCastMember[] = [
  "monkey",
  "elephant",
  "crocodile",
  "tiger",
];

const RANK_FROM = 3000;
const RANK_TO = 3500;

/** Collective / group words in 3000–3500 → all four mascots. */
const CAST_FOUR = new Set<string>([]);

/** Interactive / duo words in 3000–3500 → duo mascots. */
const CAST_DUO: Record<string, readonly JungleCastMember[]> = {
  colleague: ["monkey", "elephant"],
};

const LABEL: Record<JungleCastMember, string> = {
  monkey: "purple monkey",
  elephant: "pink elephant",
  crocodile: "lime-green crocodile",
  tiger: "orange tiger",
};

function teachingProps(word: string): string {
  const curated =
    CURATED_IMAGE_KEYWORDS_RANK_3001_5000[word] ??
    CURATED_IMAGE_KEYWORDS_RANK_1001_3000[word];
  if (curated) {
    return `${curated} — simplified flat cartoon props on white floor`;
  }
  return `2-3 simple grounded props that clearly teach the meaning of "${word}"`;
}

function castPrefix(cast: readonly JungleCastMember[]): string {
  if (cast.length === 4) return "All four mascots";
  if (cast.length === 1) return `ONLY ${LABEL[cast[0]!]}`;
  return `ONLY ${cast.map((m) => LABEL[m]).join(" and ")}`;
}

function soloExpression(member: JungleCastMember): string {
  const map: Record<JungleCastMember, string> = {
    monkey:
      "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs.",
    elephant:
      "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible.",
    crocodile:
      "Crocodile: expressive face on horizontal log body low to ground, four stub legs.",
    tiger:
      "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs.",
  };
  return map[member];
}

function duoExpression(cast: readonly JungleCastMember[]): string {
  return cast.map((m) => soloExpression(m).split(".")[0]!).join(". ") + ".";
}

function allFourExpression(): string {
  return "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only.";
}

function buildScene(word: string, cast: readonly JungleCastMember[]): string {
  const props = teachingProps(word);
  const accent =
    " Accent doodle: small grass tuft OR swing silhouette OR flower.";
  const action = `acting out the meaning of "${word}" clearly on white canvas`;
  return `${castPrefix(cast)} on plain white #FFFFFF — ${action}. PROPS (grounded on white): ${props}.${accent} Word "${word}" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.`;
}

function assignCast(word: string, soloIndex: number): readonly JungleCastMember[] {
  if (CAST_FOUR.has(word)) return MEMBERS;
  if (CAST_DUO[word]) return CAST_DUO[word]!;
  return [MEMBERS[soloIndex % MEMBERS.length]!];
}

const rankWords = getWordsInRange(RANK_FROM, RANK_TO).map((e) => e.word);
let soloIndex = 0;
const newEntries: Record<string, JungleWordImageEntry> = {};

for (const word of rankWords) {
  const cast = assignCast(word, soloIndex);
  if (cast.length === 1) soloIndex++;

  let expressions: string;
  if (cast.length === 1) expressions = soloExpression(cast[0]!);
  else if (cast.length === 2) expressions = duoExpression(cast);
  else expressions = allFourExpression();

  newEntries[word] = {
    cast: [...cast],
    scene: buildScene(word, cast),
    expressions,
  };
}

const merged: Record<string, JungleWordImageEntry> = {
  ...JUNGLE_WORD_IMAGE_ENTRIES,
  ...newEntries,
};

const header = readFileSync("src/data/jungle-cast-word-image-prompts.ts", "utf8")
  .split("export const JUNGLE_WORD_IMAGE_ENTRIES")[0]
  .replace(/rank 1–\d+(?:, \d+–\d+)?/, "rank 1–1000, 3000–3500");

const tail = readFileSync("src/data/jungle-cast-word-image-prompts.ts", "utf8")
  .split("} as const;")
  .slice(1)
  .join("} as const;");

writeFileSync(
  "src/data/jungle-cast-word-image-prompts.ts",
  `${header}export const JUNGLE_WORD_IMAGE_ENTRIES: Readonly<
  Record<string, JungleWordImageEntry>
> = ${JSON.stringify(merged, null, 2)} as const;${tail}`,
);

const sizes = { 1: 0, 2: 0, 3: 0, 4: 0 };
for (const e of Object.values(newEntries)) {
  sizes[e.cast.length as 1 | 2 | 3 | 4]++;
}

console.log(`Added ${Object.keys(newEntries).length} entries (rank ${RANK_FROM}–${RANK_TO})`);
console.log("New entry cast sizes:", sizes);
console.log("Total entries:", Object.keys(merged).length);
