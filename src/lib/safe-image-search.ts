/**
 * Profanity / adult slang from SUBTLEX and other corpora — exclude from learning
 * lists and never send to stock-photo APIs.
 */

const IMAGE_SEARCH_WHITELIST = new Set([
  "cockade",
  "cockades",
  "cockatoo",
  "cockatoos",
  "cockfight",
  "cockfighting",
  "cockney",
  "cockpit",
  "cockpits",
  "cockroach",
  "cockroaches",
  "cocktail",
  "cocktails",
  "essex",
  "middlesex",
  "peacock",
  "peacocks",
  "penistone",
  "pussycat",
  "pussycats",
  "pussyfoot",
  "pussyfooted",
  "pussyfooting",
  "snigger",
  "sniggered",
  "sniggering",
  "sniggers",
  "stopcock",
  "sussex",
  "weathercock",
]);

const EXACT_VULGAR_WORDS = new Set([
  "arse",
  "asshole",
  "bitch",
  "bollocks",
  "cock",
  "cocks",
  "cunt",
  "dick",
  "faggot",
  "fuck",
  "nigger",
  "penis",
  "porn",
  "pussy",
  "shit",
  "slut",
  "twat",
  "vagina",
  "wanker",
  "whore",
]);

const VULGAR_COMPOUND_PATTERN =
  /(asshole|blowjob|bullshit|cock(?:suck|sucker|suckers)|cunt|faggot|fuck(?:ed|er|ers|head|heads|ing|s|wit)?|masturbat|motherfuck|nigger|orgasm|pornograph|shit(?:head|ty|ting|s|load|faced)?|slutty|vaginal|whorehouse)/;

function normalizeWord(word: string): string {
  return word.trim().toLowerCase().replace(/[^a-z0-9'-]/g, "");
}

export function isProfaneWord(word: string): boolean {
  const normalized = normalizeWord(word);
  if (!normalized) return false;
  if (IMAGE_SEARCH_WHITELIST.has(normalized)) return false;
  if (EXACT_VULGAR_WORDS.has(normalized)) return true;
  return VULGAR_COMPOUND_PATTERN.test(normalized);
}

export function requiresSafeImageOnly(word: string): boolean {
  return isProfaneWord(word);
}
