/**
 * Build Jungle Jokers cast prompts for rank 5001–6000 (multi-cast policy).
 * Cast mix target: ~15% solo, ~45% duo, ~35% trio, ~5% all-four (+ group-word overrides).
 * Run: npx tsx scripts/build-jungle-casts-rank-5001-6000.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { getWordsInRange } from "@/data/preset-vocabulary";
import {
  JUNGLE_WORD_IMAGE_ENTRIES,
  type JungleWordImageEntry,
} from "@/data/jungle-cast-word-image-prompts";
import type { JungleCastMember } from "@/data/jungle-cast-refs";

const curated5001Plus = JSON.parse(
  readFileSync("src/data/curated-image-keywords-rank-5001-plus.json", "utf8")
) as Record<string, string>;

const MEMBERS: readonly JungleCastMember[] = [
  "monkey",
  "elephant",
  "crocodile",
  "tiger",
];

const RANK_FROM = 5001;
const RANK_TO = 6000;

/** Collective / group words → all four mascots. */
const CAST_FOUR = new Set([
  "alliance",
  "assembly",
  "association",
  "band",
  "brigade",
  "brotherhood",
  "cast",
  "choir",
  "clan",
  "club",
  "coalition",
  "colony",
  "commune",
  "company",
  "congregation",
  "corps",
  "covenant",
  "crowd",
  "faction",
  "federation",
  "fellowship",
  "flock",
  "guild",
  "horde",
  "host",
  "league",
  "legion",
  "mob",
  "orchestra",
  "pack",
  "party",
  "platoon",
  "posse",
  "regiment",
  "sect",
  "sisterhood",
  "squad",
  "swarm",
  "syndicate",
  "throng",
  "troupe",
  "union",
]);

/** Interactive / pair words → fixed duo. */
const CAST_DUO: Record<string, readonly JungleCastMember[]> = {
  accompany: ["monkey", "elephant"],
  collaborate: ["elephant", "monkey"],
  conspire: ["tiger", "crocodile"],
  converse: ["monkey", "tiger"],
  counsel: ["elephant", "monkey"],
  duet: ["monkey", "tiger"],
  embrace: ["monkey", "elephant"],
  handshake: ["monkey", "elephant"],
  interact: ["elephant", "tiger"],
  reconcile: ["monkey", "crocodile"],
  rivalry: ["tiger", "monkey"],
  spar: ["tiger", "crocodile"],
  tussle: ["tiger", "monkey"],
  wrestle: ["tiger", "crocodile"],
};

/** Small-group words → fixed trio. */
const CAST_TRIO: Record<string, readonly JungleCastMember[]> = {
  committee: ["monkey", "elephant", "tiger"],
  council: ["elephant", "crocodile", "tiger"],
  triad: ["monkey", "elephant", "crocodile"],
  trinity: ["monkey", "elephant", "tiger"],
  trio: ["monkey", "elephant", "crocodile"],
};

const DUO_COMBOS: readonly (readonly JungleCastMember[])[] = [
  ["monkey", "elephant"],
  ["monkey", "crocodile"],
  ["monkey", "tiger"],
  ["elephant", "crocodile"],
  ["elephant", "tiger"],
  ["crocodile", "tiger"],
];

const TRIO_COMBOS: readonly (readonly JungleCastMember[])[] = [
  ["monkey", "elephant", "crocodile"],
  ["monkey", "elephant", "tiger"],
  ["monkey", "crocodile", "tiger"],
  ["elephant", "crocodile", "tiger"],
];

const LABEL: Record<JungleCastMember, string> = {
  monkey: "purple monkey",
  elephant: "pink elephant",
  crocodile: "lime-green crocodile",
  tiger: "orange tiger",
};

function teachingProps(word: string): string {
  const curated = curated5001Plus[word];
  if (curated) {
    return `${curated} — simplified flat cartoon props on white floor`;
  }
  return `2-3 simple grounded props that clearly teach the meaning of "${word}"`;
}

function castPrefix(cast: readonly JungleCastMember[]): string {
  if (cast.length === 4) return "All four mascots";
  if (cast.length === 1) return `ONLY ${LABEL[cast[0]!]}`;
  const labels = cast.map((m) => LABEL[m]);
  if (cast.length === 2) return `ONLY ${labels.join(" and ")}`;
  return `ONLY ${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
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

function multiExpression(cast: readonly JungleCastMember[]): string {
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
  const groupHint =
    cast.length >= 2
      ? " Mascots interact together — shared props, facing each other or same goal."
      : "";
  return `${castPrefix(cast)} on plain white #FFFFFF — ${action}.${groupHint} PROPS (grounded on white): ${props}.${accent} Word "${word}" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.`;
}

/** ~15% solo, ~45% duo, ~35% trio, ~5% all-four (bucket rotation). */
function assignCast(word: string, index: number): readonly JungleCastMember[] {
  if (CAST_FOUR.has(word)) return MEMBERS;
  if (CAST_DUO[word]) return CAST_DUO[word]!;
  if (CAST_TRIO[word]) return CAST_TRIO[word]!;

  const bucket = index % 20;
  if (bucket <= 2) return [MEMBERS[index % MEMBERS.length]!]; // 15% solo
  if (bucket <= 11) return DUO_COMBOS[index % DUO_COMBOS.length]!; // 45% duo
  if (bucket <= 18) return TRIO_COMBOS[index % TRIO_COMBOS.length]!; // 35% trio
  return MEMBERS; // 5% all-four rotation
}

const rankWords = getWordsInRange(RANK_FROM, RANK_TO).map((e) => e.word);
const newEntries: Record<string, JungleWordImageEntry> = {};

rankWords.forEach((word, index) => {
  const cast = assignCast(word, index);

  let expressions: string;
  if (cast.length === 1) expressions = soloExpression(cast[0]!);
  else if (cast.length === 4) expressions = allFourExpression();
  else expressions = multiExpression(cast);

  newEntries[word] = {
    cast: [...cast],
    scene: buildScene(word, cast),
    expressions,
  };
});

const merged: Record<string, JungleWordImageEntry> = {
  ...JUNGLE_WORD_IMAGE_ENTRIES,
  ...newEntries,
};

const fullSource = readFileSync("src/data/jungle-cast-word-image-prompts.ts", "utf8");
const header = fullSource
  .split("export const JUNGLE_WORD_IMAGE_ENTRIES")[0]
  .replace(/rank 1–\d+(?:, \d+–\d+)*/, "rank 1–6000");

const tailIndex = fullSource.indexOf("export const JUNGLE_WORD_IMAGE_SCENES");
const tail = fullSource.slice(tailIndex);

const out = `${header}export const JUNGLE_WORD_IMAGE_ENTRIES: Readonly<
  Record<string, JungleWordImageEntry>
> = ${JSON.stringify(merged, null, 2)} as const;\n\n${tail}`;

writeFileSync("src/data/jungle-cast-word-image-prompts.ts", out, "utf8");
console.log(
  `Generated rank ${RANK_FROM}–${RANK_TO}: +${rankWords.length} prompts. Total dictionary entries: ${Object.keys(merged).length}`
);
