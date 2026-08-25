/**
 * Rebalance Jungle Jokers casts: 1–2 chars default, monkey sparingly, 4 only when needed.
 * Run: npx tsx scripts/rebalance-jungle-casts.ts
 */
import { writeFileSync, readFileSync } from "node:fs";
import {
  JUNGLE_WORD_IMAGE_ENTRIES,
  type JungleWordImageEntry,
} from "@/data/jungle-cast-word-image-prompts";
import type { JungleCastMember } from "@/data/jungle-cast-refs";

/** Words that genuinely need all four mascots. */
const CAST_FOUR = new Set(["we", "all", "yes", "people"]);

/** Words that need three (group / comparison). */
const CAST_THREE: Record<string, readonly JungleCastMember[]> = {
  love: ["monkey", "elephant", "tiger"],
  help: ["tiger", "crocodile", "elephant"],
  with: ["tiger", "crocodile"],
  because: ["tiger", "elephant"],
  two: ["elephant", "tiger"],
  okay: ["tiger", "crocodile"],
};

/** Explicit 1–2 character casts. Monkey used in ~35 words only. */
const CAST_OVERRIDE: Record<string, readonly JungleCastMember[]> = {
  you: ["monkey", "tiger"],
  the: ["monkey", "elephant"],
  to: ["tiger"],
  it: ["tiger"],
  that: ["tiger"],
  and: ["tiger", "elephant"],
  of: ["elephant"],
  what: ["tiger"],
  in: ["crocodile"],
  me: ["monkey"],
  is: ["tiger"],
  we: ["monkey", "elephant", "crocodile", "tiger"],
  this: ["monkey"],
  he: ["tiger"],
  on: ["tiger"],
  for: ["elephant"],
  have: ["elephant", "tiger"],
  do: ["tiger"],
  no: ["monkey", "tiger"],
  know: ["monkey"],
  not: ["monkey", "tiger"],
  can: ["tiger"],
  all: ["monkey", "elephant", "crocodile", "tiger"],
  with: ["tiger", "crocodile"],
  just: ["tiger"],
  get: ["monkey"],
  here: ["tiger"],
  but: ["elephant", "tiger"],
  there: ["tiger"],
  so: ["crocodile"],
  they: ["tiger", "elephant", "crocodile"],
  right: ["tiger"],
  like: ["tiger"],
  out: ["monkey"],
  go: ["tiger"],
  she: ["elephant"],
  up: ["tiger"],
  about: ["elephant"],
  if: ["monkey"],
  at: ["tiger"],
  now: ["tiger", "elephant"],
  come: ["tiger"],
  one: ["tiger"],
  how: ["crocodile"],
  well: ["crocodile"],
  want: ["monkey"],
  think: ["monkey"],
  good: ["tiger"],
  see: ["tiger"],
  let: ["monkey"],
  why: ["monkey", "tiger"],
  who: ["monkey", "tiger"],
  as: ["monkey"],
  will: ["tiger", "elephant"],
  from: ["monkey"],
  when: ["elephant"],
  back: ["monkey"],
  okay: ["tiger", "crocodile"],
  yes: ["monkey", "elephant", "crocodile", "tiger"],
  time: ["elephant"],
  look: ["tiger"],
  take: ["monkey"],
  an: ["tiger"],
  man: ["elephant"],
  where: ["elephant"],
  would: ["tiger"],
  some: ["elephant"],
  hey: ["tiger"],
  tell: ["monkey"],
  or: ["tiger"],
  say: ["monkey"],
  something: ["tiger"],
  down: ["monkey"],
  then: ["tiger"],
  little: ["crocodile"],
  way: ["tiger"],
  make: ["tiger", "elephant"],
  too: ["tiger"],
  never: ["tiger"],
  by: ["crocodile"],
  over: ["tiger"],
  more: ["tiger"],
  mean: ["elephant"],
  very: ["elephant"],
  off: ["monkey"],
  sorry: ["monkey", "elephant"],
  give: ["monkey"],
  thank: ["elephant"],
  love: ["monkey", "elephant", "tiger"],
  people: ["monkey", "elephant", "crocodile", "tiger"],
  please: ["elephant"],
  sure: ["tiger"],
  any: ["tiger"],
  only: ["tiger"],
  because: ["tiger", "elephant"],
  two: ["elephant", "tiger"],
  much: ["elephant"],
  sir: ["elephant"],
  maybe: ["tiger", "elephant"],
  help: ["tiger", "crocodile"],
};

const SCENE_PATCH: Record<string, { scene: string; expressions: string }> = {
  on: {
    scene:
      "ONLY orange tiger — cozy living room. Tiger sits ON TOP of brown wooden round table (clearly on surface, not beside). Simple room, one table, pink rug.",
    expressions:
      "Tiger: comfortable perched ON table, relaxed smile, sphere body unchanged. Exactly two stub arms two stub legs.",
  },
  can: {
    scene:
      "ONLY orange tiger — bright gym room. Tiger easily lifts heavy teal dumbbell, flexing — I can!",
    expressions:
      "Tiger: confident strong grin, flexing proudly. Sphere body, two stub arms two stub legs.",
  },
  but: {
    scene:
      "ONLY pink elephant (rainy left) and orange tiger (sunny right) — split-scene contrast. Elephant holds teal umbrella in rain puddles; tiger enjoys sunshine on park bench.",
    expressions:
      "Elephant: conflicted hopeful-yet-resigned rain face, BOTH thin stick arms visible holding umbrella + trunk, four stick legs. Tiger: happy sunny-side smile on bench.",
  },
  maybe: {
    scene:
      "ONLY orange tiger and pink elephant — park fork in path. Tiger balances on fence post shrugging unsure; elephant holds clipboard listing pros.",
    expressions:
      "Tiger: uncertain maybe shrug. Elephant: thinking, BOTH thin stick arms visible (one holds clipboard, one on chin), giant circle head unchanged.",
  },
  will: {
    scene:
      "ONLY orange tiger and pink elephant — home living room. Tiger points at wall calendar future picnic date; elephant marks calendar with trunk. BOTH elephant stick arms visible at sides.",
    expressions:
      "Tiger: confident future-planning smile pointing. Elephant: marking calendar, two thin stick arms visible plus trunk.",
  },
  help: {
    scene:
      "ONLY orange tiger and lime-green crocodile — suburban steps. Tiger helps tired crocodile carry heavy grocery bags upstairs.",
    expressions:
      "Tiger: supportive helpful smile carrying bags. Crocodile: relieved grateful face, four stub legs.",
  },
  see: {
    scene:
      "ONLY orange tiger — grassy cliff overlooking blue ocean. Tiger looks through telescope on tripod at sailboat.",
    expressions:
      "Tiger: excited wink pointing at ocean, sphere body, two stub arms on telescope.",
  },
  as: {
    scene:
      "ONLY purple monkey — modern kitchen, chef hat and apron. Monkey sits on stool side profile stirring pot on stove.",
    expressions:
      "Monkey: proud chef smile, sitting side profile, one hand stirring (other on lap). Exactly two arms two legs.",
  },
};

function stripOtherCharacters(
  text: string,
  cast: readonly JungleCastMember[],
): string {
  let out = text;
  const remove: Record<JungleCastMember, RegExp[]> = {
    monkey: [/purple monkey[^.]*\.?\s*/gi, /monkey:[^.]*\.?\s*/gi],
    elephant: [/pink elephant[^.]*\.?\s*/gi, /elephant:[^.]*\.?\s*/gi],
    crocodile: [
      /lime-green crocodile[^.]*\.?\s*/gi,
      /green crocodile[^.]*\.?\s*/gi,
      /crocodile:[^.]*\.?\s*/gi,
    ],
    tiger: [/orange tiger[^.]*\.?\s*/gi, /tiger:[^.]*\.?\s*/gi],
  };
  for (const member of ["monkey", "elephant", "crocodile", "tiger"] as const) {
    if (!cast.includes(member)) {
      for (const re of remove[member]) out = out.replace(re, "");
    }
  }
  return out.replace(/\s+/g, " ").trim();
}

function onlyPrefix(cast: readonly JungleCastMember[]): string {
  if (cast.length === 1) return `ONLY ${cast[0]} — `;
  if (cast.length < 4)
    return `ONLY ${cast.join(" and ")} — `;
  return "All four mascots — ";
}

const rebalance: Record<string, JungleWordImageEntry> = {};

for (const [word, entry] of Object.entries(JUNGLE_WORD_IMAGE_ENTRIES)) {
  const cast =
    CAST_OVERRIDE[word] ??
    (CAST_THREE[word] as readonly JungleCastMember[] | undefined) ??
    (CAST_FOUR.has(word)
      ? (["monkey", "elephant", "crocodile", "tiger"] as const)
      : ([entry.cast[0] ?? "tiger"] as readonly JungleCastMember[]));

  const patch = SCENE_PATCH[word];
  const scene = patch
    ? patch.scene
    : onlyPrefix(cast) +
      stripOtherCharacters(entry.scene.replace(/^ONLY[^—]+—\s*/i, ""), cast);
  const expressions = patch
    ? patch.expressions
    : stripOtherCharacters(entry.expressions, cast);

  rebalance[word] = {
    cast: [...cast],
    scene,
    expressions,
    ...(entry.outfits ? { outfits: entry.outfits } : {}),
  };
}

const body = JSON.stringify(rebalance, null, 2);
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
> = ${body} as const;${tail}`,
);

const sizes = { 1: 0, 2: 0, 3: 0, 4: 0 };
let monkeys = 0;
for (const e of Object.values(rebalance)) {
  sizes[e.cast.length as 1 | 2 | 3 | 4]++;
  if (e.cast.includes("monkey")) monkeys++;
}
console.log("Rebalanced:", sizes, "monkey:", monkeys, "/ 100");
