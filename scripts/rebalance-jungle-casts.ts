/**
 * Rebalance Jungle Jokers casts: even solo rotation across 4 mascots,
 * safe framing, 1–2 chars default, max 25% all-four.
 * Run: npx tsx scripts/rebalance-jungle-casts.ts
 */
import { writeFileSync, readFileSync } from "node:fs";
import { getWordsInRange } from "@/data/preset-vocabulary";
import type { JungleWordImageEntry } from "@/data/jungle-cast-word-image-prompts";
import type { JungleCastMember } from "@/data/jungle-cast-refs";

const MEMBERS: readonly JungleCastMember[] = [
  "monkey",
  "elephant",
  "crocodile",
  "tiger",
];

/** Max 25% all-four — group words only. */
const CAST_FOUR = new Set([
  "we",
  "all",
  "yes",
  "people",
  "love",
  "help",
  "with",
  "because",
  "two",
  "okay",
  "they",
  "some",
  "come",
  "give",
  "thank",
  "please",
  "sure",
  "never",
  "more",
  "well",
  "good",
  "know",
  "think",
  "see",
  "want",
]);

/** Duo pairs — balanced; tiger in only 2/15 duos. */
const CAST_DUO: Record<string, readonly JungleCastMember[]> = {
  you: ["monkey", "tiger"],
  the: ["monkey", "elephant"],
  and: ["elephant", "crocodile"],
  have: ["monkey", "elephant"],
  no: ["monkey", "crocodile"],
  not: ["monkey", "elephant"],
  with: ["elephant", "crocodile"],
  but: ["elephant", "crocodile"],
  now: ["crocodile", "tiger"],
  why: ["monkey", "crocodile"],
  who: ["elephant", "crocodile"],
  will: ["monkey", "elephant"],
  make: ["crocodile", "elephant"],
  sorry: ["monkey", "elephant"],
  maybe: ["crocodile", "elephant"],
};

const MEMBER_LABEL: Record<JungleCastMember, string> = {
  monkey: "purple monkey",
  elephant: "pink elephant",
  crocodile: "lime-green crocodile",
  tiger: "orange tiger",
};

/** Custom scenes — override auto templates. White canvas, small centered cast. */
const SCENE_PATCH: Record<string, { scene: string; expressions: string }> = {
  on: {
    scene:
      "ONLY orange tiger on white — small centered tiger (max 55% frame height) sits ON TOP of simple brown table, fully inside frame with wide margins.",
    expressions:
      "Tiger: comfortable perched ON table, relaxed smile, sphere body unchanged. Exactly two stub arms two stub legs.",
  },
  can: {
    scene:
      "ONLY orange tiger on white — small centered tiger easily lifts teal dumbbell, entire body inside frame with generous margins.",
    expressions:
      "Tiger: confident strong grin, flexing proudly. Sphere body, two stub arms two stub legs.",
  },
  but: {
    scene:
      "ONLY pink elephant and lime-green crocodile on white — split contrast, both small and centered with wide margins. Elephant holds teal umbrella left; crocodile horizontal log right.",
    expressions:
      "Elephant: conflicted hopeful face, BOTH thin stick arms visible. Crocodile: log body low, four stub legs, fully visible.",
  },
  maybe: {
    scene:
      "ONLY lime-green crocodile and pink elephant on white — small centered pair at path fork, wide margins, entire bodies visible.",
    expressions:
      "Crocodile: uncertain shrug on log body. Elephant: thinking, BOTH thin stick arms visible, giant circle head unchanged.",
  },
  will: {
    scene:
      "ONLY purple monkey and pink elephant on white — small centered pair marking calendar, wide margins, no clipping.",
    expressions:
      "Monkey: confident planning smile, sitting side profile, two arms only. Elephant: marking calendar, two thin stick arms visible plus trunk.",
  },
  help: {
    scene:
      "ONLY orange tiger and lime-green crocodile on white — small centered pair, tiger helps crocodile carry grocery bags, wide margins.",
    expressions:
      "Tiger: supportive helpful smile. Crocodile: relieved grateful face, horizontal log body, four stub legs fully visible.",
  },
  see: {
    scene:
      "All four mascots on white — small centered group looking through simple telescope on tripod, all bodies fully inside frame with wide margins.",
    expressions:
      "All four: excited looking together. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible.",
  },
  as: {
    scene:
      "ONLY purple monkey on white — small centered monkey in chef hat stirring pot on stool, side profile, entire body inside frame.",
    expressions:
      "Monkey: proud chef smile, sitting side profile, one hand stirring. Exactly two arms two legs.",
  },
  with: {
    scene:
      "ONLY pink elephant and lime-green crocodile on white — small centered pair walking together, wide margins, both fully visible.",
    expressions:
      "Elephant: happy walking, stick arms visible. Crocodile: horizontal LOG body low to ground, four stub legs.",
  },
  we: {
    scene:
      "All four mascots on white — small centered line holding paws, wide margins, every body fully inside frame. Crocodile horizontal log low.",
    expressions:
      "All four: united team smiles. Tiger: sphere only. Crocodile: log body only.",
  },
  all: {
    scene:
      "All four mascots on white — small centered around simple fruit bowl on table, wide margins, no clipping.",
    expressions:
      "All four: excited at abundance. Tiger: merged sphere. Crocodile: horizontal log.",
  },
  down: {
    scene:
      "ONLY orange tiger on white — small centered tiger points stub paw at downward arrow on ground, entire body inside frame with wide margins.",
    expressions:
      "Tiger: teaching gesture looking down along arrow, orange sphere body unchanged.",
  },
  no: {
    scene:
      "ONLY purple monkey and lime-green crocodile on white — small centered pair stepping back from candy jar on ground, wide margins.",
    expressions:
      "Monkey: stern refusal, hands on hips, two arms only. Crocodile: firm no nod on log body.",
  },
};

function soloScene(member: JungleCastMember, word: string): string {
  const label = MEMBER_LABEL[member];
  return `ONLY ${label} on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of "${word}". Entire body fully inside frame with at least 12% margin on every side.`;
}

function soloExpression(member: JungleCastMember): string {
  const map: Record<JungleCastMember, string> = {
    monkey:
      "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible.",
    elephant:
      "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame.",
    crocodile:
      "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame.",
    tiger:
      "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame.",
  };
  return map[member];
}

function duoScene(cast: readonly JungleCastMember[], word: string): string {
  const labels = cast.map((m) => MEMBER_LABEL[m]).join(" and ");
  return `ONLY ${labels} on white — two small centered mascots (each max 50% frame height) acting out "${word}". Both entire bodies fully inside frame with wide margins, no clipping.`;
}

function duoExpression(cast: readonly JungleCastMember[]): string {
  return cast.map((m) => soloExpression(m).split(".")[0]!).join(". ") + ".";
}

function allFourScene(word: string): string {
  return `All four mascots on white — small centered group (each max 40% frame height) acting out "${word}". All four entire bodies fully inside frame with generous margins, no clipping at edges.`;
}

function allFourExpression(): string {
  return "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only.";
}

function assignSoloMember(word: string, index: number): JungleCastMember {
  return MEMBERS[index % MEMBERS.length]!;
}

function cleanScene(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

const rankWords = getWordsInRange(1, 100).map((e) => e.word);
let soloIndex = 0;
const rebalance: Record<string, JungleWordImageEntry> = {};

for (const word of rankWords) {
  let cast: readonly JungleCastMember[];
  if (CAST_FOUR.has(word)) {
    cast = MEMBERS;
  } else if (CAST_DUO[word]) {
    cast = CAST_DUO[word]!;
  } else {
    cast = [assignSoloMember(word, soloIndex++)];
  }

  const patch = SCENE_PATCH[word];
  let scene: string;
  let expressions: string;

  if (patch) {
    scene = cleanScene(patch.scene);
    expressions = patch.expressions;
  } else if (cast.length === 1) {
    scene = soloScene(cast[0]!, word);
    expressions = soloExpression(cast[0]!);
  } else if (cast.length === 2) {
    scene = duoScene(cast, word);
    expressions = duoExpression(cast);
  } else {
    scene = allFourScene(word);
    expressions = allFourExpression();
  }

  rebalance[word] = { cast: [...cast], scene, expressions };
}

const header = readFileSync("src/data/jungle-cast-word-image-prompts.ts", "utf8")
  .split("export const JUNGLE_WORD_IMAGE_ENTRIES")[0];

const tail = readFileSync("src/data/jungle-cast-word-image-prompts.ts", "utf8")
  .split("} as const;")
  .slice(1)
  .join("} as const;");

writeFileSync(
  "src/data/jungle-cast-word-image-prompts.ts",
  `${header}export const JUNGLE_WORD_IMAGE_ENTRIES: Readonly<
  Record<string, JungleWordImageEntry>
> = ${JSON.stringify(rebalance, null, 2)} as const;${tail}`,
);

const sizes = { 1: 0, 2: 0, 3: 0, 4: 0 };
const totals = Object.fromEntries(MEMBERS.map((m) => [m, 0]));
const solos = Object.fromEntries(MEMBERS.map((m) => [m, 0]));

for (const e of Object.values(rebalance)) {
  sizes[e.cast.length as 1 | 2 | 3 | 4]++;
  for (const m of e.cast) {
    totals[m]++;
    if (e.cast.length === 1) solos[m]++;
  }
}

console.log("Rebalanced sizes:", sizes);
console.log("Total appearances:", totals);
console.log("Solo counts:", solos);
