/**
 * Rebuild jungle word prompts: balanced casts + semantic scenes + teaching props.
 * Run: npx tsx scripts/rebuild-jungle-semantic-prompts.ts
 */
import { writeFileSync, readFileSync } from "node:fs";
import { getWordsInRange } from "@/data/preset-vocabulary";
import { CAST_WORD_IMAGE_ENTRIES } from "@/data/cast-word-image-prompts";
import type { JungleWordImageEntry } from "@/data/jungle-cast-word-image-prompts";
import type { JungleCastMember } from "@/data/jungle-cast-refs";

const MEMBERS: readonly JungleCastMember[] = [
  "monkey",
  "elephant",
  "crocodile",
  "tiger",
];

const CAST_FOUR = new Set([
  "we", "all", "yes", "people", "love", "help", "with", "because", "two",
  "okay", "they", "some", "come", "give", "thank", "please", "sure",
  "never", "more", "well", "good", "know", "think", "see", "want",
]);

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

const LABEL: Record<JungleCastMember, string> = {
  monkey: "purple monkey",
  elephant: "pink elephant",
  crocodile: "lime-green crocodile",
  tiger: "orange tiger",
};

/** Extra props per word — teach meaning on white canvas. */
const WORD_PROPS: Partial<Record<string, string>> = {
  if: "two teal arrow signs at path fork, dotted path lines",
  at: "bus stop bench, round clock on post, simple stop sign",
  now: "large wall clock with hands at current time, calendar page",
  the: "one bright red apple on wooden table, faded gray apples behind",
  to: "teal arrow path leading to open cottage door",
  you: "sunny path, welcome mat, small flower pot",
  and: "shared plate of cookies on picnic blanket",
  or: "cupcake on left plate, ice cream cone on right plate",
  because: "dark rain clouds, open umbrella, puddle",
  down: "playground slide, downward arrow on sand",
  up: "upward arrow, fluffy cloud above",
  in: "large orange cardboard box, peeking out",
  on: "brown wooden table, mascot clearly ON top",
  out: "open front door, sunshine rays",
  here: "small flag planted at feet, HERE spot marker",
  there: "distant tiny house on hill, pointing arm",
  when: "hourglass with falling sand",
  then: "empty breakfast plate then open door — sequence",
  what: "closed mystery gift box with ribbons, question-curve shapes",
  who: "curtain lineup, mystery peek",
  why: "scattered puzzle pieces, shrug pose",
  how: "tools, blueprint, wrench",
  not: "cake slice being pushed away on plate",
  no: "giant candy jar, stop gesture, stepping back",
  yes: "checkmark flag in birthday cake, confetti dots",
  can: "teal dumbbell, flex pose",
  will: "wall calendar with future picnic date circled",
  would: "thought cloud with fantasy dragon",
  could: "teal dumbbell",
  people: "four stick-figure people silhouettes in park",
  he: "male stick-figure silhouette waving in doorway",
  she: "female stick-figure silhouette in window, flower bouquet",
  man: "gardener stick-figure with rake",
  sir: "elderly gentleman silhouette with cane",
  two: "exactly two cupcakes on tray, two fingers up",
  some: "strawberry bush, small basket partially full",
  all: "table full of every fruit type",
  more: "cookie jar pouring onto already-full plate",
  much: "mountain of pillows burying mascot",
  only: "single cookie on empty plate, guarding pose",
  any: "three identical teal doors, pick any",
  very: "giant ice cream tower twice mascot height",
  too: "mug overflowing hot cocoa",
  little: "tiny stool vs tall comparison",
  time: "round analog clock with visible hands",
  about: "floating icons: clock, heart, book, apple",
  mean: "broken blue vase on ground",
  sorry: "flower bouquet, broken vase",
  thank: "thank-you flower bouquet, bow",
  please: "empty cup, pleading paws together",
  sure: "thumbs up, confident nod",
  okay: "OK paw circle gesture",
  love: "floating heart shapes, group hug",
  help: "heavy grocery bags on steps",
  give: "wrapped gift box being handed over",
  come: "cozy open door with warm light, beckoning paw",
  get: "star-shaped cookie falling mid-air, catching leap",
  take: "last cookie on plate, careful taking",
  make: "mixing bowl, flour, eggs — baking",
  look: "binoculars, colorful bird in tree",
  see: "telescope on tripod, sailboat on horizon",
  think: "puzzle pieces, half-built block tower, question-hook shapes",
  know: "glowing lightbulb above head",
  want: "shiny star cookie on high shelf, reaching",
  good: "gold star sticker being awarded",
  well: "water glass, thumbs up, rosy cheeks",
  say: "speech-bubble shapes with NO letters",
  tell: "whispering secret, cupped paw at ear",
  hey: "waving both paws from behind fence",
  right: "big green checkmark card",
  like: "fish-shaped plush toy hug",
  go: "motion lines on path, running pose",
  way: "winding path to small white house",
  by: "two easels side by side, paintings",
  over: "low teal hurdle mid-jump",
  off: "lamp switch, going dark",
  never: "treasure chest with NEVER X sign",
  back: "footprints leading to cozy house",
  let: "open gate, passing through",
  as: "chef hat, stirring pot",
  something: "mystery object under teal cloth",
  maybe: "fence balance between two paths",
  from: "blue mailbox, letter envelope",
  one: "one finger up, single item shown",
  an: "single orange fruit offered",
  where: "map with red X destination",
  so: "spicy red pepper, steam from ears",
  they: "three identical teal birds on branch",
  for: "heart-shaped cookie gift",
  have: "stack of colorful donuts",
  do: "sink with soap bubbles, washing dishes",
  just: "single tiny cookie vs huge empty jar",
  with: "shared blue umbrella in gentle rain",
  but: "sunshine on one side, rain umbrella on other",
  we: "four mascots holding paws in line",
};

function assignCast(word: string, soloIndex: number): readonly JungleCastMember[] {
  if (CAST_FOUR.has(word)) return MEMBERS;
  if (CAST_DUO[word]) return CAST_DUO[word]!;
  return [MEMBERS[soloIndex % MEMBERS.length]!];
}

function castPrefix(cast: readonly JungleCastMember[]): string {
  if (cast.length === 4) return "All four mascots";
  if (cast.length === 1) return `ONLY ${LABEL[cast[0]!]}`;
  return `ONLY ${cast.map((m) => LABEL[m]).join(" and ")}`;
}

function neutralizeFoxScene(scene: string, cast: readonly JungleCastMember[]): string {
  const [a, b] = cast;
  const lead = a ? LABEL[a] : "mascot";
  const partner = b ? LABEL[b] : lead;

  let out = scene
    .replace(/All four mascots|All mascots/gi, "all four mascots")
    .replace(/Gray cat/gi, "__A__")
    .replace(/Golden dog/gi, "__B__")
    .replace(/Tall blue cow/gi, "__A__")
    .replace(/Pink pig/gi, "__B__");

  if (cast.length === 4) {
    out = out.replace(/__A__|__B__/g, "mascot");
  } else if (cast.length === 2) {
    out = out.replace(/__A__/g, lead).replace(/__B__/g, partner);
  } else {
    out = out.replace(/__A__|__B__/g, lead);
  }

  const duoLabel = cast.length === 2 ? `${lead} and ${partner}` : null;
  if (duoLabel) {
    out = out.replace(/all four mascots/gi, duoLabel);
  } else if (cast.length === 1) {
    out = out.replace(/all four mascots/gi, lead);
  }

  return out.replace(/\s+/g, " ").trim();
}

function adaptExpressions(
  foxExpr: string,
  cast: readonly JungleCastMember[],
): string {
  const mood = foxExpr
    .replace(/\(NOT[^)]*\)/gi, "")
    .replace(/Cat:|Dog:|Cow:|Pig:/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  const parts: string[] = [];
  for (const m of cast) {
    const name = m.charAt(0).toUpperCase() + m.slice(1);
    if (m === "monkey") {
      parts.push(
        `${name}: ${mood || "expressive face matching word"} — sitting side profile, exactly two arms two legs`,
      );
    } else if (m === "elephant") {
      parts.push(
        `${name}: ${mood || "expressive face matching word"} — BOTH thin stick arms visible, circle head unchanged`,
      );
    } else if (m === "tiger") {
      parts.push(
        `${name}: ${mood || "expressive face matching word"} — orange sphere body, two stub arms two stub legs`,
      );
    } else {
      parts.push(
        `${name}: ${mood || "expressive face matching word"} — horizontal log body low, four stub legs`,
      );
    }
  }
  return parts.join(". ") + ".";
}

function buildScene(
  word: string,
  cast: readonly JungleCastMember[],
  foxScene: string,
): string {
  const props = WORD_PROPS[word];
  const action = neutralizeFoxScene(foxScene, cast);
  const propNote = props
    ? ` PROPS (grounded on white): ${props}.`
    : " PROPS: 2-3 simple objects that clearly teach the word meaning.";
  const accent =
    " Accent doodle: small grass tuft OR swing silhouette OR flower.";
  return `${castPrefix(cast)} on plain white #FFFFFF — ${action}.${propNote}${accent} Word "${word}" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.`;
}

let soloIndex = 0;
const entries: Record<string, JungleWordImageEntry> = {};

for (const word of getWordsInRange(1, 100).map((e) => e.word)) {
  const fox = CAST_WORD_IMAGE_ENTRIES[word];
  if (!fox) continue;
  const cast = assignCast(word, soloIndex);
  if (cast.length === 1) soloIndex++;

  entries[word] = {
    cast: [...cast],
    scene: buildScene(word, cast, fox.scene),
    expressions: adaptExpressions(fox.expressions, cast),
  };
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
> = ${JSON.stringify(entries, null, 2)} as const;${tail}`,
);

console.log("Rebuilt", Object.keys(entries).length, "semantic jungle prompts");
console.log("Sample if:", entries.if?.scene.slice(0, 120) + "...");
