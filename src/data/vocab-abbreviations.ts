/**
 * Subtitle / spoken clippings that should not appear as flashcard headwords when
 * the full form is already in the learnable inventory (e.g. ref → referee).
 */
export const ABBREV_TO_CANONICAL: Readonly<Record<string, string>> = {
  admin: "administrator",
  app: "application",
  auto: "automobile",
  bio: "biology",
  chem: "chemistry",
  demo: "demonstration",
  doc: "document",
  dorm: "dormitory",
  exam: "examination",
  exp: "experience",
  fridge: "refrigerator",
  gov: "government",
  info: "information",
  inf: "information",
  intro: "introduction",
  lab: "laboratory",
  misc: "miscellaneous",
  nav: "navigation",
  org: "organization",
  phone: "telephone",
  photo: "photograph",
  prep: "preparation",
  prom: "promotion",
  ref: "referee",
  rep: "representative",
  tech: "technology",
  tele: "telephone",
  tv: "television",
  uni: "university",
  util: "utility",
};

/** Broken or non-headword tokens from subtitles — no canonical replacement. */
export const SUBTITLE_ABBREV_TOKENS: ReadonlySet<string> = new Set([
  "aka",
  "bbs",
  "ccm",
  "cia",
  "cli",
  "cst",
  "etc",
  "ext",
  "inv",
  "mph",
  "mpg",
  "pct",
  "ppl",
  "rte",
  "sch",
  "scr",
  "sym",
  "tsp",
  "tty",
  "yds",
  "yrs",
]);

export function getAbbrevCanonical(word: string): string | undefined {
  const key = word.trim().toLowerCase();
  return ABBREV_TO_CANONICAL[key];
}

export function isSubtitleAbbrevToken(word: string): boolean {
  return SUBTITLE_ABBREV_TOKENS.has(word.trim().toLowerCase());
}

/** True for clippings and junk abbrev tokens that must not be learned as headwords. */
export function isVocabAbbreviation(word: string): boolean {
  const key = word.trim().toLowerCase();
  if (!key) return false;
  if (isSubtitleAbbrevToken(key)) return true;
  return key in ABBREV_TO_CANONICAL;
}
