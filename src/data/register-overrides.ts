import type { WordRegister } from "@/lib/word-meanings";

/**
 * Curated register fixes for headwords Gemini (or legacy rows) often mislabels.
 * Overrides win over stored DB / Gemini register at display and enrich time.
 *
 * Keep this list conservative — only clear slang, casual shortenings, or stiff
 * formal register. Do not tag everyday core verbs (get, go, think…) informal.
 */
const REGISTER_OVERRIDES: Readonly<Record<string, WordRegister>> = {
  // Slang / casual food & drink
  chow: "informal",
  grub: "informal",
  eats: "informal",
  nosh: "informal",
  munchies: "informal",
  booze: "informal",
  hooch: "informal",
  cuppa: "informal",
  java: "informal",

  // Slang money
  bucks: "informal",
  grand: "informal",
  quid: "informal",
  dough: "informal",
  moolah: "informal",

  // Casual address & fillers
  dude: "informal",
  bro: "informal",
  buddy: "informal",
  gal: "informal",
  yall: "informal",
  yeah: "informal",
  yep: "informal",
  nah: "informal",
  gonna: "informal",
  wanna: "informal",
  gotta: "informal",
  kinda: "informal",
  sorta: "informal",
  aint: "informal",
  heck: "informal",
  darn: "informal",
  dang: "informal",
  crap: "informal",

  // Casual shortenings
  fridge: "informal",
  tv: "informal",
  pics: "informal",

  // Family nicknames
  mom: "informal",
  dad: "informal",
  grandma: "informal",
  grandpa: "informal",
  granny: "informal",
  kiddo: "informal",

  // Casual verbs / phrasal (clearly chatty)
  chill: "informal",
  hangout: "informal",
  pigout: "informal",
  screwup: "informal",
  messup: "informal",

  // Casual adjectives / approval
  cool: "informal",
  awesome: "informal",
  neat: "informal",
  rad: "informal",
  lame: "informal",
  cheesy: "informal",
  hangry: "informal",
  legit: "informal",

  // Formal halves / stiff register
  obtain: "formal",
  purchase: "formal",
  assist: "formal",
  verify: "formal",
  inquire: "formal",
  commence: "formal",
  terminate: "formal",
  utilize: "formal",
  endeavor: "formal",
  elucidate: "formal",
  rectify: "formal",
  procure: "formal",
  remunerate: "formal",
  substantiate: "formal",
  disseminate: "formal",
  aforementioned: "formal",
  notwithstanding: "formal",
  pursuant: "formal",
  hereby: "formal",
  henceforth: "formal",
  therein: "formal",
  hereinafter: "formal",
  deceased: "formal",
  residence: "formal",
  automobile: "formal",
  incorrect: "formal",
  continue: "formal",
  mention: "formal",
  discuss: "formal",
  demonstrate: "formal",
  indicate: "formal",
  sufficient: "formal",
  approximately: "formal",
  nevertheless: "formal",
  furthermore: "formal",
  consequently: "formal",
};

function normalizeHeadword(word: string): string {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Lookup curated register for a headword, if any. */
export function getRegisterOverride(word: string): WordRegister | null {
  const key = normalizeHeadword(word);
  if (!key) return null;
  return REGISTER_OVERRIDES[key] ?? null;
}

/** Prefer curated override, else keep normalized register (may be null). */
export function applyRegisterOverride(
  word: string,
  register: WordRegister | null | undefined,
): WordRegister | null {
  return getRegisterOverride(word) ?? register ?? null;
}
