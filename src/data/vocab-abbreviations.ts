/**
 * Subtitle / spoken clippings that should not appear as flashcard headwords when
 * the full form is already in the learnable inventory (e.g. ref → referee).
 */
export const ABBREV_TO_CANONICAL: Readonly<Record<string, string>> = {
  // Admin / school / work clippings
  admin: "administrator",
  app: "application",
  approx: "approximately",
  appt: "appointment",
  auto: "automobile",
  bio: "biology",
  chem: "chemistry",
  dept: "department",
  demo: "demonstration",
  doc: "document",
  dorm: "dormitory",
  exam: "examination",
  exp: "experience",
  fridge: "refrigerator",
  gov: "government",
  grad: "graduate",
  info: "information",
  inf: "information",
  intro: "introduction",
  lab: "laboratory",
  misc: "miscellaneous",
  msg: "message",
  nav: "navigation",
  org: "organization",
  phone: "telephone",
  photo: "photograph",
  pic: "picture",
  prep: "preparation",
  prev: "previous",
  prof: "professor",
  prom: "promotion",
  ref: "referee",
  rep: "representative",
  tech: "technology",
  tele: "telephone",
  tel: "telephone",
  tv: "television",
  uni: "university",
  util: "utility",
  vid: "video",

  // Informal because (subtitle speech)
  cos: "because",
  coz: "because",
  cuz: "because",

  // Informal about / though / through / until (spelling clippings)
  abt: "about",
  bout: "about",
  tho: "though",
  thru: "through",
  til: "until",

  // Informal intensifiers / adverbs
  def: "definitely",
  fab: "fabulous",
  probs: "probably",

  // Time units in subtitles ("one sec", "5 mins", "2 hrs")
  sec: "second",
  mins: "minute",
  hrs: "hour",
  mos: "month",
};

/** Broken or non-headword tokens from subtitles — no canonical replacement. */
export const SUBTITLE_ABBREV_TOKENS: ReadonlySet<string> = new Set([
  // Latin / legal / units
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
  "yr",
  "yrs",

  // Text / internet shorthand (no single headword)
  "asap",
  "brb",
  "btw",
  "fax",
  "fyi",
  "idk",
  "imo",
  "imho",
  "lmao",
  "lol",
  "np",
  "nvm",
  "omg",
  "smh",
  "tbh",
  "thx",
  "u",
  "ur",

  // SMS spellings
  "plz",
  "pls",
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
