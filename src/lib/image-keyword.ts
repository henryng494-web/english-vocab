/**
 * Turn a vocabulary word into a concrete stock-photo search phrase so the
 * image on a flashcard is easy to understand at a glance (object, action, or
 * scene — not an abstract English word alone).
 */

const CURATED_VISUAL_KEYWORDS: Record<string, string> = {
  hole: "hole in ground",
  organic: "organic vegetables garden",
  run: "person running outdoors",
  walk: "person walking street",
  eat: "person eating meal",
  drink: "glass of water",
  happy: "smiling happy person",
  sad: "sad person face",
  angry: "angry person face",
  think: "person thinking",
  learn: "student studying books",
  teach: "teacher classroom",
  love: "couple holding hands",
  help: "helping hand support",
  break: "broken glass",
  open: "open door",
  close: "closed door",
  hot: "hot sunny weather",
  cold: "cold winter snow",
  big: "large elephant",
  small: "small kitten",
  fast: "fast car speed",
  slow: "snail slow",
  color: "colorful paint palette",
  time: "wall clock",
  way: "road path direction",
  money: "coins cash",
  work: "office desk laptop",
  make: "hands making pottery",
  home: "cozy house exterior",
  food: "healthy food plate",
  water: "clear water glass",
  fire: "campfire flames",
  light: "sunlight window",
  dark: "dark night sky",
  clean: "clean tidy room",
  dirty: "dirty muddy shoes",
  over: "coat hanging over chair",
  under: "cat under table",
  above: "lamp hanging above table",
  below: "shoes below table",
  in: "cat sitting in cardboard box",
  into: "person walking into room",
  inside: "person sitting inside tent",
  on: "book on wooden table",
  upon: "cat sitting on sofa",
  at: "people sitting at cafe table",
  by: "person sitting by window",
  near: "house near lake",
  beside: "dog sitting beside owner",
  between: "person standing between two trees",
  through: "person walking through doorway",
  across: "person walking across street",
  from: "package arriving from mailbox",
  with: "two friends walking together",
  without: "empty plate without food",
  for: "gift wrapped for birthday",
  of: "bowl of fresh fruit",
  to: "road sign pointing forward",
  too: "overflowing coffee cup",
  also: "two matching coffee cups",
  and: "two people holding hands",
  or: "choice between tea and coffee",
  but: "stop sign at street corner",
  if: "person thinking at crossroads",
  than: "two apples compared on table",
  then: "hourglass sand falling",
  so: "person nodding agreement",
  just: "wristwatch showing exact time",
  only: "single red apple on table",
  not: "red no entry traffic sign",
  no: "person shaking head no",
  the: "the sun in blue sky",
  a: "single wooden chair",
  an: "an open book on desk",
  i: "person pointing at themself",
  you: "person pointing at camera",
  he: "man waving outdoors",
  she: "woman waving outdoors",
  we: "group of friends together",
  they: "people walking together",
  me: "person looking in mirror",
  him: "man sitting on bench",
  her: "woman sitting on bench",
  them: "group sitting at picnic table",
  my: "person holding personal backpack",
  your: "hands giving keys to friend",
  our: "family around dinner table",
  their: "kids sharing toys together",
  this: "hand pointing at nearby object",
  that: "hand pointing into distance",
  these: "hands holding several apples",
  those: "people pointing at distant hills",
  who: "person asking question",
  what: "person looking confused",
  which: "person choosing between two shirts",
  when: "calendar on wall",
  how: "person reading instruction manual",
  there: "empty park bench over there",
  here: "welcome mat at front door",
  up: "person climbing stairs",
  out: "person walking out of door",
  back: "person walking back home",
  after: "sunset after the rain",
  about: "people talking about a book",
  as: "twins dressed the same",
  can: "open metal can of food",
  will: "person writing to-do list",
  would: "person imagining travel photos",
  could: "person reaching for high shelf",
  have: "hands holding a gift",
  be: "person standing still outdoors",
  do: "person doing household chores",
  get: "hands receiving a package",
  go: "person walking down sidewalk",
  come: "person waving come here",
  see: "person looking through binoculars",
  look: "person looking out window",
  know: "student raising hand in class",
  take: "hands taking an apple",
  like: "person giving thumbs up",
  say: "person speaking into microphone",
  use: "person using a laptop",
  all: "crowd of people together",
  some: "few apples in a basket",
  other: "two different colored doors",
  first: "gold medal first place",
  well: "person drinking from a well",
  now: "digital clock showing time now",
  it: "small dog sitting on rug",
  its: "dog wagging its own tail",
  his: "man holding his own wallet",
  us: "friends taking a group selfie",
  because: "child asking parent why question",
  any: "person choosing any apple from basket",
  each: "person handing out one gift each",
  every: "calendar marked every single day",
  several: "several apples in a row",
  many: "many colorful balloons together",
  much: "large pile of autumn leaves",
  such: "amazed person pointing at rainbow",
  whom: "person addressing an envelope",
  whose: "lost umbrella with a name tag",
  itself: "cat grooming itself",
  myself: "person taking a selfie",
  himself: "man looking at himself in mirror",
  herself: "woman looking at herself in mirror",
  yourself: "person looking in bathroom mirror",
  ourselves: "friends taking a selfie together",
  themselves: "kids admiring their own drawing",
  quickly: "person running fast on track",
  slowly: "person walking slowly with cane",
  never: "clock with crossed out red circle",
  always: "sunrise every single morning",
  often: "person watering plants routine",
  sometimes: "half full half empty glass",
  again: "person redoing a puzzle",
  very: "extremely tall skyscraper building",
  more: "second helping of food on plate",
  most: "largest slice of pizza on plate",
  yes: "person giving thumbs up",
  keep: "person holding treasure box",
  suggest: "people brainstorming with sticky notes",
  decide: "person choosing between two doors",
  prove: "legal proof document certificate",
  evidence: "court evidence folder documents",
  score: "sports scoreboard game",
  strip: "colorful paper strip",
  bang: "fireworks celebration night",
  touch: "hand touching soft fabric",
  hard: "hard rock stone surface",
  wet: "wet rain umbrella",
  suck: "straw drinking juice",
  blow: "person blowing birthday candles",
  fraction: "sliced cake equal pieces",
  multiply: "multiplication chalkboard",
  vowel: "aeiou vowel letters",
  syllable: "dictionary pronunciation",
  decimal: "decimal number calculator",
  numeral: "roman numerals clock",
  equate: "equals sign chalkboard",
  consonant: "english alphabet wooden letters",
  triangle: "red triangle shape",
};

export function hasCuratedVisualKeyword(word: string): boolean {
  return Boolean(CURATED_VISUAL_KEYWORDS[cleanPhrase(word)]);
}

const ABSTRACT_POS = new Set([
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "determiner",
  "pronoun",
]);

function cleanPhrase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isConcretePhrase(phrase: string, word: string): boolean {
  const tokens = phrase.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) return true;
  return tokens.length === 1 && tokens[0] !== word;
}

type ImageKeywordOptions = {
  searchKeyword?: string | null;
  meaning?: string | null;
  pos?: string | null;
};

/**
 * Best single query for Unsplash / LoremFlickr.
 */
export function resolveImageSearchKeyword(
  word: string,
  options: ImageKeywordOptions = {},
): string {
  const normalizedWord = cleanPhrase(word) || "vocabulary";
  const curated = CURATED_VISUAL_KEYWORDS[normalizedWord];
  if (curated) return curated;

  const candidate = cleanPhrase(options.searchKeyword ?? "");
  if (candidate && isConcretePhrase(candidate, normalizedWord)) {
    return candidate;
  }

  const pos = options.pos?.trim().toLowerCase();
  if (pos && ABSTRACT_POS.has(pos)) {
    if (pos === "verb") return `${normalizedWord} action person`;
    if (pos === "adjective") return `${normalizedWord} everyday scene`;
    if (pos === "adverb") return `${normalizedWord} moment`;
  }

  if (candidate) return candidate;
  return normalizedWord;
}

/**
 * A long, specific stock-photo phrase (e.g. "hand pointing at nearby
 * object") rarely appears verbatim in a photo's title/tags, so full-text
 * image search engines (Openverse, Wikimedia Commons) often return zero
 * results for it even though a real photo exists. Shorter 2-word slices of
 * the same phrase — which usually keep the core subject + action — match
 * far more reliably. Returns the slices in an order most likely to preserve
 * the meaning of the original phrase.
 */
function shortenPhraseVariants(phrase: string): string[] {
  const tokens = phrase.split(/\s+/).filter(Boolean);
  if (tokens.length <= 2) return [];

  const variants: string[] = [];
  variants.push(tokens.slice(0, 2).join(" "));
  if (tokens.length >= 3) variants.push(tokens.slice(0, 3).join(" "));
  variants.push(tokens.slice(-2).join(" "));

  return [...new Set(variants)].filter((variant) => variant !== phrase);
}

/**
 * Ordered fallbacks when the first Unsplash query returns nothing useful.
 */
export function buildImageSearchQueries(
  word: string,
  options: ImageKeywordOptions = {},
): string[] {
  const primary = resolveImageSearchKeyword(word, options);
  const normalizedWord = cleanPhrase(word) || "vocabulary";
  const queries = new Set<string>([primary]);
  const hasCuratedKeyword = hasCuratedVisualKeyword(normalizedWord);

  const pos = options.pos?.trim().toLowerCase();
  if (
    primary !== normalizedWord &&
    !hasCuratedKeyword &&
    pos === "noun"
  ) {
    queries.add(normalizedWord);
  }

  if (pos === "noun" && !primary.includes(" ")) {
    queries.add(`${primary} object`);
  }

  for (const variant of shortenPhraseVariants(primary)) {
    queries.add(variant);
  }

  return [...queries];
}
