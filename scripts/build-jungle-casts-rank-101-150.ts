/**
 * Build Jungle Jokers cast prompts for rank 101–150 and merge into existing entries.
 * Same cast policy as rank 1–100: solo rotation, ~14% duo, max 25% all-four.
 *
 * Run: npx tsx scripts/build-jungle-casts-rank-101-150.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { getWordsInRange } from "@/data/preset-vocabulary";
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

const RANK_FROM = 101;
const RANK_TO = 150;

/** Max 25% all-four — group / collective words in 101–150. */
const CAST_FOUR = new Set([
  "everything",
  "believe",
  "life",
  "before",
  "after",
  "again",
  "still",
  "other",
  "around",
  "home",
  "great",
  "work",
]);

const CAST_DUO: Record<string, readonly JungleCastMember[]> = {
  talk: ["monkey", "elephant"],
  call: ["crocodile", "tiger"],
  find: ["monkey", "tiger"],
  money: ["elephant", "crocodile"],
  feel: ["monkey", "elephant"],
  stop: ["crocodile", "tiger"],
  new: ["elephant", "tiger"],
};

const LABEL: Record<JungleCastMember, string> = {
  monkey: "purple monkey",
  elephant: "pink elephant",
  crocodile: "lime-green crocodile",
  tiger: "orange tiger",
};

/** Teaching props on white canvas — one clear visual per word. */
const WORD_PROPS: Record<string, string> = {
  anything: "open basket with many different objects to pick from, question-curve shapes",
  god: "simple stained-glass window arch with warm light rays, no text",
  even: "two equal balance scales perfectly level",
  night: "crescent moon, few stars, small night lamp",
  call: "ringing teal smartphone on small table",
  talk: "two speech-bubble shapes with NO letters, facing each other",
  into: "teal arrow entering open cardboard box",
  first: "gold medal ribbon with number 1, winner podium step",
  three: "exactly three identical teal blocks in a row",
  find: "magnifying glass over hidden star sticker under cloth",
  wait: "bench beside hourglass with falling sand",
  put: "book being placed on simple wooden shelf",
  great: "gold star cluster, celebratory confetti dots",
  day: "bright yellow sun, blue sky arc, daytime window light",
  work: "small desk with laptop silhouette, coffee mug, pencil cup",
  life: "tiny green sprout in soil, heart shape, simple timeline arrow",
  before: "split panel: empty plate BEFORE vs full plate AFTER",
  better: "small wilted plant vs taller healthy plant with upward arrow",
  four: "exactly four colorful pencils lined up",
  again: "circular redo arrow around simple puzzle piece",
  still: "frozen pause symbol, unmoving hourglass",
  home: "small cozy house with chimney and welcome mat",
  guy: "simple stick-figure gentleman silhouette waving",
  won: "trophy cup with WIN ribbon, podium",
  than: "comparison scale — one side heavier with blocks",
  around: "circular path arrow looping a small tree",
  other: "two teal doors side by side, pointing at the other door",
  away: "footprints trail leading to distant tiny house",
  five: "five star stickers in a row, five fingers up",
  new: "shiny NEW tag sticker on wrapped box",
  last: "finish line ribbon at end of race track",
  ever: "very long winding path to horizon line",
  stop: "red octagon stop sign on stick, halt hand gesture",
  keep: "small treasure chest being hugged, KEEP arrow loop",
  big: "tiny stool next to giant oversized apple for scale",
  six: "six dice showing six dots arranged neatly",
  after: "sequence panels: breakfast plate then open door leaving",
  long: "very long measuring tape stretched out",
  everything: "open suitcase overflowing with every item type",
  nice: "flower bouquet gift with warm smile props",
  name: "blank name-tag sticker on shirt, pointing at tag",
  money: "stack of gold coins, small piggy bank",
  seven: "seven rainbow color stripes in arc",
  feel: "soft fluffy fabric swatch, gentle touch on heart",
  believe: "hand on heart, trust stars, warm glow",
  old: "dusty antique clock, cobweb corner detail",
  place: "map with red location pin marker",
  fine: "OK thumbs-up card, green checkmark",
  kind: "helping hand offering flower to friend silhouette",
  eight: "eight crayons lined up in color order",
};

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
  const props = WORD_PROPS[word] ?? "2-3 simple objects that clearly teach the word meaning";
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
  .replace("rank 1–100", "rank 1–150");

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
