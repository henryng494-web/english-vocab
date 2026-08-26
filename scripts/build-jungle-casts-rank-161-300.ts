/**
 * Build Jungle Jokers cast prompts for rank 161–300 and merge into existing entries.
 * Cast policy: solo rotation (evenly spread), duo for interactive scenes, max 25% all-four.
 *
 * Run: npx tsx scripts/build-jungle-casts-rank-161-300.ts
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

const RANK_FROM = 161;
const RANK_TO = 300;

/** Collective / group words in 161–300 -> all four mascots. */
const CAST_FOUR = new Set([
  "world",
  "together",
  "family",
  "everybody",
  "hundred",
  "thousand",
  "school",
  "both",
  "year",
  "team",
  "all",
  "party",
  "group",
  "whole",
]);

/** Interactive / duo words in 161–300 -> duo mascots. */
const CAST_DUO: Record<string, readonly JungleCastMember[]> = {
  listen: ["monkey", "elephant"],
  remember: ["elephant", "tiger"],
  show: ["monkey", "crocodile"],
  care: ["elephant", "crocodile"],
  ask: ["monkey", "tiger"],
  understand: ["monkey", "elephant"],
  friend: ["tiger", "monkey"],
  meet: ["elephant", "tiger"],
  play: ["crocodile", "tiger"],
  watch: ["monkey", "crocodile"],
  check: ["elephant", "crocodile"],
  hit: ["tiger", "monkey"],
  deal: ["elephant", "crocodile"],
  worry: ["monkey", "tiger"],
  brother: ["monkey", "tiger"],
};

const LABEL: Record<JungleCastMember, string> = {
  monkey: "purple monkey",
  elephant: "pink elephant",
  crocodile: "lime-green crocodile",
  tiger: "orange tiger",
};

/** Teaching props on white canvas — concrete visual metaphor for each word. */
const WORD_PROPS: Record<string, string> = {
  bad: "spoiled brown banana peel with small flies doodle",
  listen: "large cupped ear gesture listening to acoustic sound wave rings",
  remember: "glowing yellow lightbulb popping above head with thought cloud",
  boy: "young boy stick-figure silhouette kicking small teal soccer ball",
  wrong: "large red X mark on test paper with unhappy head shake",
  stay: "wooden garden bench with 'STAY HERE' grounded arrow sign",
  house: "small cozy red-roof cottage with stone chimney and garden fence",
  ten: "ten shiny gold stars arranged in neat double rows of five",
  baby: "tiny sleeping baby silhouette wrapped in soft blue blanket with pacifier",
  another: "cookie jar with hand reaching in to take another fresh cookie",
  dad: "tall gentle dad stick-figure silhouette tossing child up happily in air",
  enough: "balanced full plate of fruits with satisfied hand push-back gesture",
  eleven: "neat desk clock showing exactly eleven o'clock with two hands",
  show: "theater stage curtain drawn back revealing sparkling surprise pedestal",
  course: "three-course dinner setting: soup bowl, plate, dessert dish lined up",
  care: "first aid kit box, gentle bandage being placed with loving heart sparkles",
  mind: "sparkling glowing brain silhouette surrounded by floating idea stars",
  left: "bold teal directional arrow curving sharply to the left on a sidewalk",
  ask: "raised hand with floating question mark curve shape",
  twelve: "wall clock showing twelve o'clock high noon with both hands aligned",
  understand: "two puzzle pieces clicking perfectly together with bright light flash",
  mother: "mother silhouette gently hugging young child with floating heart dots",
  which: "two different colorful gift boxes with wondering hand pointing between them",
  try: "jumping high to reach a shiny star dangling on a string with determination",
  hell: "funny cartoon comic heatwave steam puffs with melting red ice cream cone",
  miss: "target dartboard with dart landed just outside the bullseye ring",
  fifteen: "fifteen colorful marbles counted out into neat groups of five",
  own: "stamping personal crown emblem onto wooden toy chest",
  world: "colorful globe stand showing blue oceans and green continents",
  guess: "closed mystery treasure box with question mark hook shape above it",
  next: "row of stepping stones with glowing arrow pointing to the very NEXT stone",
  kill: "comical fly swatter tapping a tiny pesky mosquito doodle flat on table",
  else: "menu board with two items crossed out and pointing to third option",
  dead: "wilted drooping brown sunflower losing its last petal",
  someone: "mysterious hooded silhouette outline under a warm street lamp",
  real: "magnifying glass inspecting authentic sparkling genuine gemstone vs plastic fake",
  sixteen: "sixteen bright birthday cake candles glowing in neat rows",
  room: "four simple cozy floor walls showing bed, rug, and window with sun",
  hold: "both hands firmly gripping a warm steaming mug of cocoa",
  woman: "friendly woman stick-figure silhouette with wavy hair waving hello",
  yourself: "standing before a large clean mirror smiling at own reflection",
  today: "calendar page with large bold TODAY circle and bright sunshine doodle",
  twenty: "twenty crisp shiny coins stacked into two equal towers of ten",
  mom: "loving mom silhouette baking cookies and offering one with a warm smile",
  friend: "two mascots locking arms in a friendly high-five handshake",
  move: "trio of packed cardboard moving boxes on a teal hand dolly cart",
  same: "two identical twin blue teddy bears sitting side by side",
  job: "office desk with laptop, work clipboard, and hardhat tool belt",
  tonight: "dark crescent moon night sky poster framed with cozy bedside table lamp",
  son: "little boy silhouette proudly walking beside parent matching strides",
  thirty: "calendar showing date number 30 with celebration star sticker",
  found: "metal detector digging up a buried gleaming gold coin in sand",
  pretty: "vase with fresh blooming pink and purple flowers with butterfly",
  ready: "laced running shoes on start line awaiting the starter whistle",
  whole: "complete unbroken circular pizza pie with all eight slices intact",
  together: "four mascots holding hands in a unified circle on grassy patch",
  minute: "sand timer hourglass running out with tiny seconds hand ticking",
  forty: "odometer dial rolling to number 40 with speed lines",
  head: "pointing both paws to own round smiling head with graduation cap",
  matter: "balance scales weighing an important gold brick vs light feather",
  haven: "safe cozy birdhouse sheltered under a sturdy wooden roof",
  excuse: "polite bow with hand over chest apologizing gently",
  many: "huge overflowing basket containing dozens of ripe red apples",
  idea: "bright glowing yellow lightbulb with sparkle rays around head",
  without: "open empty pocket turned inside out with sad empty shrug",
  play: "colorful toy xylophone and building block castle on play rug",
  family: "cozy family portrait frame with parents and two young children",
  fifty: "large shiny gold 50 medal ribbon with winner laurel leaves",
  meet: "two friends walking from opposite sides shaking hands warmly at a signpost",
  most: "tallest tower of blocks towering high above two much shorter stacks",
  run: "speed lines trailing behind energetic running shoes on running track",
  while: "reading a book on sofa WHILE listening to music through headphones",
  wife: "smiling wife silhouette wearing wedding ring standing beside garden",
  once: "single candle being lit for the first time with '1' cake topper",
  live: "green potted plant bursting with fresh flowers and healthy leaves",
  somebody: "knock on the front door with friendly silhouette peeking through window",
  everybody: "cheering crowd of varied animal silhouettes waving confetti together",
  hundred: "giant 10x10 grid of one hundred colorful square tiles fully filled",
  use: "holding a hammer driving a nail cleanly into wooden plank",
  myself: "pointing thumbs proudly at own chest with confident happy grin",
  yet: "present wrapped in box with 'DO NOT OPEN YET' ribbon clock tag",
  start: "checkered start-line flag waving at the beginning of a race track",
  kid: "young energetic kid silhouette skipping rope in sunny park",
  tomorrow: "calendar arrow flipping forward from today page to tomorrow sunrise",
  happy: "giant bright yellow smiley face balloon floating high with rainbow",
  thousand: "large treasure chest overflowing with countless gold coins",
  school: "charming brick schoolhouse with bell tower and playground swing",
  problem: "tangled knot of colorful string being carefully unraveled",
  watch: "classic wristwatch with leather strap showing moving gear hands",
  business: "briefcase and blueprint chart showing upward profit arrow",
  hope: "wishing upon a bright falling star in twilight sky with clasped paws",
  open: "wide open wooden front door welcoming sunlight into room",
  already: "checklist with every single box checked with green checkmarks",
  since: "timeline chart tracing a growth line starting from small seedling year",
  sit: "relaxing comfortably on a soft padded armchair with footstool",
  cause: "first domino tipping over triggering a chain reaction of falling tiles",
  alone: "single solitary lighthouse beam on quiet peaceful ocean cliff",
  hard: "heavy solid steel anvil struck by hammer with small spark",
  stuff: "open toy box packed with assorted toys, balls, and gadgets",
  white: "clean pristine white canvas easel with white daisy flower in vase",
  turn: "winding road sign with curved U-turn arrow pointing to new direction",
  until: "alarm clock set to ring when hands reach 5:00 mark with dotted trail",
  few: "plate with only three small grapes scattered sparingly",
  honey: "dripping honeycomb wooden dipper over ceramic jar of golden honey",
  blue: "paint bucket spilling vivid bright sky blue paint onto paper",
  both: "two hands simultaneously holding two ice cream cones (strawberry & mint)",
  door: "polished oak front door with brass handle and keyhole",
  later: "clock face with dashed curved arrow pointing to future evening hours",
  such: "magnifying glass highlighting a uniquely sparkling patterned seashell",
  face: "pointing to own cheerful smiling face with rosy pink cheeks",
  worry: "fretting with paws on cheeks looking at a wobbly teetering cup tower",
  ago: "sepia-toned antique photograph album with dates from the past",
  green: "lush green leaf sprout bathed in fresh morning dewdrop",
  second: "silver medal with number 2 on the second-place podium step",
  brother: "two boy silhouettes in baseball caps sharing high-five in yard",
  damn: "stubbed toe comedic reaction with swirly dizzy cartoon stars",
  case: "sturdy vintage leather travel suitcase with brass luggage tags",
  probably: "weather forecast board showing 80% sunshine with tiny cloud chance",
  beautiful: "vibrant rainbow arching over blooming botanical garden meadow",
  hand: "open friendly paw palm facing viewer showing clean lines",
  check: "green highlighter ticking off items on a clear checklist clipboard",
  year: "four seasons wheel displaying spring blossom, summer sun, autumn leaf, winter snowflake",
  yellow: "bright sunny sunflower in full bloom with yellow paint palette",
  forget: "scratching head with empty thought bubble and question marks",
  hit: "wooden baseball bat cleanly striking a baseball with impact starburst",
  lost: "spinning compass with wandering confused footprint trails in sand",
  crazy: "fun carnival roller coaster car zooming through dizzy loop-de-loop",
  phone: "retro teal rotary telephone ringing with sound vibration arcs",
  nobody: "empty theater auditorium seats with quiet spotlight on stage",
  end: "black-and-white checkered finish line ribbon torn at end of sprint",
  black: "sleek shiny black bowler hat resting on white pedestal",
  easy: "simple two-piece baby puzzle assembled in one second with thumbs-up",
  doctor: "doctor stethoscope and medical clipboard with red cross emblem",
  shut: "solid wooden window shutters closed tight with sturdy latch bolt",
  under: "small friendly turtle sheltered under a large mushroom cap umbrella",
  part: "single missing jigsaw puzzle piece fitting into larger landscape puzzle",
  deal: "firm handshake over signed agreement document with gold seal",
  die: "single candle wick with wisp of white smoke after being blown out",
  soon: "sand timer with just a few grains left before ringing bell",
  anyone: "open welcome gate inviting any passerby into sunny orchard",
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
  .replace(/rank 1–\d+/, "rank 1–300");

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
