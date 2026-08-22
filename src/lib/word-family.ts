import { NGSL_FREQUENCY_RANKS } from "@/data/ngsl-frequency-ranks";
import { SPOKEN_FREQUENCY_RANKS } from "@/data/spoken-frequency-ranks";
import type { WordFamilyMember } from "@/types/database";

export type { WordFamilyMember };

const SHORT_LEMMAS = new Set([
  "be",
  "go",
  "do",
  "see",
  "say",
  "get",
  "let",
  "put",
  "run",
  "set",
  "try",
  "win",
  "buy",
  "eat",
  "sit",
  "cut",
  "hit",
  "fit",
  "pay",
  "lie",
  "die",
  "use",
]);

/** Longest-first. Includes derivational and light inflectional endings. */
const SUFFIXES = [
  "ization",
  "fulness",
  "ousness",
  "ability",
  "ibility",
  "ational",
  "ingly",
  "edly",
  "ally",
  "ation",
  "ition",
  "ment",
  "ness",
  "sion",
  "ance",
  "ence",
  "able",
  "ible",
  "less",
  "like",
  "wise",
  "ward",
  "hood",
  "ship",
  "ical",
  "ious",
  "eous",
  "uous",
  "ative",
  "ion",
  "ize",
  "ise",
  "ify",
  "ism",
  "ist",
  "ful",
  "ous",
  "ive",
  "est",
  "ing",
  "ied",
  "ies",
  "ier",
  "ers",
  "ly",
  "en",
  "ed",
  "er",
  "or",
  "al",
  "ic",
  "ty",
  "cy",
  "ry",
  "s",
];

const FUNCTION_WORDS = new Set([
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "for",
  "and",
  "or",
  "but",
  "not",
  "as",
  "at",
  "by",
  "from",
  "up",
  "so",
  "if",
  "than",
  "then",
  "out",
  "about",
  "with",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "i",
  "me",
  "my",
  "we",
  "us",
  "our",
  "you",
  "your",
  "he",
  "him",
  "his",
  "she",
  "her",
  "they",
  "them",
  "their",
  "be",
  "is",
  "am",
  "are",
  "was",
  "were",
  "been",
  "being",
  "do",
  "did",
  "does",
  "have",
  "has",
  "had",
  "will",
  "would",
  "can",
  "could",
  "should",
  "may",
  "might",
]);

const INFLECTIONAL = new Set(["s", "es", "ies", "ed", "ing", "est"]);
const ADD_E_SUFFIXES = new Set(["ing", "ed", "er", "est", "en", "ion", "sion"]);
const ION_SHORT_VERBS = new Set([
  "act",
  "add",
  "opt",
  "edit",
  "emit",
  "omit",
  "fuse",
  "pose",
  "cite",
]);
const DOUBLE_STRIP_SUFFIXES = new Set(["ing", "ed", "er", "est"]);

type FamilyMaps = {
  headByWord: Map<string, string>;
  membersByHead: Map<string, string[]>;
};

let maps: FamilyMaps | null = null;

function importance(word: string): number {
  return SPOKEN_FREQUENCY_RANKS[word] ?? NGSL_FREQUENCY_RANKS[word] ?? 9_999_999;
}

function candidateLinks(
  word: string,
): Array<{ base: string; suffix: string; viaAddE: boolean }> {
  const out: Array<{ base: string; suffix: string; viaAddE: boolean }> = [];
  const seen = new Set<string>();
  const add = (base: string, suffix: string, viaAddE = false) => {
    if (!base || seen.has(`${base}:${viaAddE}`)) return;
    seen.add(`${base}:${viaAddE}`);
    out.push({ base, suffix, viaAddE });
  };

  for (const suffix of SUFFIXES) {
    if (!word.endsWith(suffix)) continue;
    const stem = word.slice(0, -suffix.length);
    if (stem.length < 2) continue;
    add(stem, suffix, false);
    if (stem.endsWith("i")) add(`${stem.slice(0, -1)}y`, suffix, false);
    const last = stem.at(-1);
    const prev = stem.at(-2);
    if (
      DOUBLE_STRIP_SUFFIXES.has(suffix) &&
      stem.length >= 3 &&
      last &&
      last === prev &&
      !"aeiou".includes(last)
    ) {
      add(stem.slice(0, -1), suffix, false);
    }
    if (ADD_E_SUFFIXES.has(suffix)) add(`${stem}e`, suffix, true);
    if (suffix === "sion") add(`${stem}de`, suffix, true);
  }
  return out;
}

function regularlyDerives(base: string, derived: string): boolean {
  if (!base || !derived || base === derived) return false;
  const stem = base.endsWith("e") ? base.slice(0, -1) : base;
  if (
    derived === `${base}s` ||
    derived === `${base}es` ||
    derived === `${base}ed` ||
    derived === `${base}ing` ||
    derived === `${base}er` ||
    derived === `${base}ers` ||
    derived === `${base}est` ||
    derived === `${base}ly` ||
    derived === `${base}ness` ||
    derived === `${base}less` ||
    derived === `${base}ful` ||
    derived === `${base}ment` ||
    derived === `${base}able` ||
    derived === `${base}en` ||
    derived === `${stem}en` ||
    derived === `${base}ive` ||
    derived === `${stem}ive` ||
    derived === `${base}or` ||
    derived === `${stem}or`
  ) {
    return true;
  }
  if (derived === `${base}al` || derived === `${stem}al`) {
    return base.length >= 5 || base.endsWith("ion") || base.endsWith("ic");
  }
  if (derived === `${stem}ing` || derived === `${stem}ed` || derived === `${stem}er`) {
    return true;
  }
  if (base.endsWith("y") && derived === `${base.slice(0, -1)}ies`) return true;
  if (base.endsWith("y") && derived === `${base.slice(0, -1)}ied`) return true;
  if (base.length >= 3) {
    const last = base.at(-1);
    if (last && (derived === `${base}${last}ing` || derived === `${base}${last}ed`)) {
      return true;
    }
  }
  const ionOk = base.length >= 5 || ION_SHORT_VERBS.has(base);
  if (!ionOk) return false;
  return (
    derived === `${stem}ion` ||
    derived === `${stem}ation` ||
    derived === `${base}ion` ||
    derived === `${base}ation`
  );
}

function mayLink(
  word: string,
  base: string,
  suffix: string,
  viaAddE = false,
): boolean {
  if (base === word) return false;
  if (FUNCTION_WORDS.has(base)) return false;
  if (viaAddE && base.length < 4 && !SHORT_LEMMAS.has(base)) return false;
  if (
    viaAddE &&
    (suffix === "ion" || suffix === "sion" || suffix === "ation") &&
    NGSL_FREQUENCY_RANKS[base] === undefined
  ) {
    return false;
  }
  if (suffix === "er" || suffix === "or" || suffix === "est") {
    if (!(base.length >= 4 || SHORT_LEMMAS.has(base))) return false;
  } else if (base.length < 4 && !SHORT_LEMMAS.has(base)) {
    if (!(base.length === 3 && INFLECTIONAL.has(suffix))) return false;
  }
  const ngslWord = NGSL_FREQUENCY_RANKS[word];
  const ngslBase = NGSL_FREQUENCY_RANKS[base];
  const ngslConflict =
    ngslWord !== undefined &&
    ngslBase !== undefined &&
    ngslWord !== ngslBase;
  const derivedOk =
    regularlyDerives(base, word) || regularlyDerives(word, base);
  if (INFLECTIONAL.has(suffix)) {
    if (ngslConflict && !derivedOk) return false;
    return true;
  }
  return derivedOk;
}

class UnionFind {
  parent = new Map<string, string>();

  add(word: string) {
    if (!this.parent.has(word)) this.parent.set(word, word);
  }

  find(word: string): string {
    const parent = this.parent.get(word) ?? word;
    if (parent !== word) {
      const root = this.find(parent);
      this.parent.set(word, root);
      return root;
    }
    return word;
  }

  union(a: string, b: string) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    if (importance(ra) < importance(rb) || (importance(ra) === importance(rb) && ra < rb)) {
      this.parent.set(rb, ra);
    } else {
      this.parent.set(ra, rb);
    }
  }
}

function isLearnableToken(word: string): boolean {
  return /^[a-z]+$/.test(word) && word.length > 1;
}

function buildMaps(): FamilyMaps {
  const uf = new UnionFind();
  const words = new Set<string>();

  for (const word of Object.keys(NGSL_FREQUENCY_RANKS)) {
    if (!isLearnableToken(word)) continue;
    words.add(word);
    uf.add(word);
  }
  for (const word of Object.keys(SPOKEN_FREQUENCY_RANKS)) {
    if (!isLearnableToken(word)) continue;
    words.add(word);
    uf.add(word);
  }

  const ngslGroups = new Map<number, string[]>();
  for (const [word, rank] of Object.entries(NGSL_FREQUENCY_RANKS)) {
    if (!words.has(word)) continue;
    const list = ngslGroups.get(rank) ?? [];
    list.push(word);
    ngslGroups.set(rank, list);
  }
  for (const group of ngslGroups.values()) {
    const first = group[0];
    for (let i = 1; i < group.length; i++) uf.union(first, group[i]);
  }

  for (const word of words) {
    for (const { base, suffix, viaAddE } of candidateLinks(word)) {
      if (!words.has(base) || base === word) continue;
      if (!mayLink(word, base, suffix, viaAddE)) continue;
      uf.union(word, base);
    }
  }

  const grouped = new Map<string, string[]>();
  for (const word of words) {
    const root = uf.find(word);
    const list = grouped.get(root) ?? [];
    list.push(word);
    grouped.set(root, list);
  }

  const headByWord = new Map<string, string>();
  const membersByHead = new Map<string, string[]>();

  for (const members of grouped.values()) {
    const head = pickHeadword(members);
    membersByHead.set(head, members);
    for (const member of members) headByWord.set(member, head);
  }

  return { headByWord, membersByHead };
}

function isInflectedForm(word: string): boolean {
  if (/(?:ed|ing|est|ly)$/.test(word)) return true;
  if (word.length > 3 && word.endsWith("s") && !/(?:ss|us|is|ous)$/.test(word)) {
    return true;
  }
  return false;
}

function pickHeadword(members: string[]): string {
  return [...members].sort((a, b) => {
    const inflected = Number(isInflectedForm(a)) - Number(isInflectedForm(b));
    if (inflected !== 0) return inflected;
    return importance(a) - importance(b) || a.length - b.length || a.localeCompare(b);
  })[0];
}

function isDisplayableMember(word: string): boolean {
  if (NGSL_FREQUENCY_RANKS[word] !== undefined) return true;
  const rank = SPOKEN_FREQUENCY_RANKS[word];
  return rank !== undefined && rank <= 12000;
}

function ensureMaps(): FamilyMaps {
  if (!maps) maps = buildMaps();
  return maps;
}

export function getFamilyHeadword(word: string): string {
  const key = word.trim().toLowerCase();
  if (!key) return key;
  return ensureMaps().headByWord.get(key) ?? key;
}

export function getFamilyMembers(word: string): string[] {
  const head = getFamilyHeadword(word);
  return ensureMaps().membersByHead.get(head) ?? [head];
}

export function isSameWordFamily(left: string, right: string): boolean {
  const a = left.trim().toLowerCase();
  const b = right.trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  return getFamilyHeadword(a) === getFamilyHeadword(b);
}

function isPluralOrThirdPerson(word: string, base: string): boolean {
  if (word === base) return false;
  if (word === `${base}s` || word === `${base}es`) return true;
  if (base.endsWith("y") && word === `${base.slice(0, -1)}ies`) return true;
  if (base.endsWith("e") && word === `${base}s`) return true;
  return false;
}

/** Forms shown on the card back — skip regular plurals / 3rd-person -s. */
export function getFamilyDisplayWords(word: string, limit = 6): string[] {
  const head = getFamilyHeadword(word);
  const members = getFamilyMembers(head);
  const kept: string[] = [];
  const ordered = [
    head,
    ...members
      .filter((member) => member !== head && isDisplayableMember(member))
      .sort(
        (a, b) => a.length - b.length || importance(a) - importance(b) || a.localeCompare(b),
      ),
  ];
  for (const member of ordered) {
    if (kept.some((keptWord) => isPluralOrThirdPerson(member, keptWord))) {
      continue;
    }
    kept.push(member);
    if (kept.length >= limit) break;
  }
  return kept;
}

export function familyContainsTaken(
  word: string,
  taken: Iterable<string>,
): boolean {
  const head = getFamilyHeadword(word);
  const members = new Set(getFamilyMembers(head));
  for (const item of taken) {
    const key = item.trim().toLowerCase();
    if (!key) continue;
    if (members.has(key) || getFamilyHeadword(key) === head) return true;
  }
  return false;
}
