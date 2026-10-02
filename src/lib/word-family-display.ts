import { getFamilyDisplayWords, type WordFamilyMember } from "@/lib/word-family";
import { NGSL_FREQUENCY_RANKS } from "@/data/ngsl-frequency-ranks";
import { SPOKEN_FREQUENCY_RANKS } from "@/data/spoken-frequency-ranks";
import { normalizeWordType } from "@/lib/word-type";

const POS_ABBREV: Record<string, string> = {
  noun: "n.",
  verb: "v.",
  adjective: "adj.",
  adverb: "adv.",
  preposition: "prep.",
  pronoun: "pron.",
  conjunction: "conj.",
  interjection: "interj.",
  article: "art.",
  number: "num.",
  determiner: "det.",
};

/** Role nouns whose -ed/-ing forms are the related verb, not the job title. */
const ROLE_HEADS = new Set([
  "nurse",
  "teacher",
  "doctor",
  "driver",
  "singer",
  "actor",
  "painter",
  "writer",
  "farmer",
  "cook",
  "guard",
  "judge",
  "coach",
  "guide",
  "manager",
  "leader",
  "worker",
  "player",
  "dancer",
  "builder",
  "cleaner",
  "trainer",
]);

function isVerbStemOfNoun(stem: string, noun: string): boolean {
  const clipped = stem.endsWith("e") ? stem.slice(0, -1) : stem;
  return (
    noun === `${clipped}ion` ||
    noun === `${clipped}ation` ||
    noun === `${stem}ion` ||
    noun === `${stem}ation` ||
    noun === `${stem}ment` ||
    noun === `${clipped}ment`
  );
}

const FUNCTION_WORD_POS: Readonly<Record<string, string>> = {
  my: "determiner",
  your: "determiner",
  his: "determiner",
  her: "determiner",
  its: "determiner",
  our: "determiner",
  their: "determiner",
  mine: "pronoun",
  yours: "pronoun",
  hers: "pronoun",
  ours: "pronoun",
  theirs: "pronoun",
  me: "pronoun",
  you: "pronoun",
  him: "pronoun",
  us: "pronoun",
  them: "pronoun",
  myself: "pronoun",
  yourself: "pronoun",
  himself: "pronoun",
  herself: "pronoun",
  itself: "pronoun",
  ourselves: "pronoun",
  yourselves: "pronoun",
  themselves: "pronoun",
};

function guessPos(
  word: string,
  headword: string,
  index: number,
  headPos?: string | null,
): string {
  const functionPos = FUNCTION_WORD_POS[word];
  if (functionPos) return functionPos;
  const known = normalizeWordType(null, word);
  if (word === headword) {
    return normalizeWordType(headPos, word) ?? known ?? "noun";
  }
  if (word.endsWith("ly") && word.length > headword.length) return "adverb";
  if (
    (word.endsWith("er") || word.endsWith("est")) &&
    (headPos === "adjective" || headPos === "adverb") &&
    word.length > headword.length
  ) {
    return headPos;
  }
  if (
    /(?:tion|sion|ness|ment|ity|ance|ence|hood|ship|ism|age)$/.test(word) &&
    word !== headword
  ) {
    return "noun";
  }
  if (/(?:ful|less|ous|ive|able|ible|ical)$/.test(word)) return "adjective";
  if (word.endsWith("ure") && word.length > headword.length) return "noun";
  if (word.endsWith("al") && word.length > headword.length) return "adjective";
  if (isVerbStemOfNoun(word, headword)) return "verb";
  if (word.endsWith("en") && word.length > headword.length) return "verb";
  if (word.endsWith("or") && word.length > headword.length) return "noun";
  if (word.endsWith("er") && headPos === "verb" && word.length > headword.length) {
    return "noun";
  }
  if (word.endsWith("ing")) {
    if (headPos === "verb" || ROLE_HEADS.has(headword)) return "noun";
    if (headPos === "adjective") return "verb";
    return "adjective";
  }
  if (word.endsWith("ed")) {
    if (headPos === "adjective" || ROLE_HEADS.has(headword)) return "verb";
    return "adjective";
  }
  if (known && known !== "unknown") return known;
  if (index === 0) return "noun";
  return "verb";
}

export function posAbbreviation(pos: string | null | undefined): string {
  const normalized = normalizeWordType(pos) ?? pos?.trim().toLowerCase() ?? "";
  return POS_ABBREV[normalized] ?? (normalized ? `${normalized}.` : "");
}

function isKnownVocabWord(word: string): boolean {
  const key = word.trim().toLowerCase();
  if (!key) return false;
  if (NGSL_FREQUENCY_RANKS[key] !== undefined) return true;
  const rank = SPOKEN_FREQUENCY_RANKS[key];
  return rank !== undefined && rank <= 12000;
}

/** Link -ity/-iety nouns to -ous/-iously forms when corpus maps miss the cluster. */
function derivationalFamilyCandidates(headword: string): string[] {
  const key = headword.trim().toLowerCase();
  const out = [key];

  if (key.endsWith("iety")) {
    out.push(`${key.slice(0, -4)}ious`, `${key.slice(0, -4)}iously`);
  } else if (key.endsWith("ity")) {
    out.push(`${key.slice(0, -3)}ous`, `${key.slice(0, -3)}ously`);
  } else if (key.endsWith("ness")) {
    const stem = key.slice(0, -4);
    if (stem.endsWith("i")) {
      out.push(`${stem.slice(0, -1)}y`, `${stem.slice(0, -1)}ily`);
    } else if (stem.endsWith("y")) {
      out.push(stem, `${stem}ly`);
    } else {
      out.push(`${stem}y`, `${stem}ily`);
    }
  }

  return [...new Set(out.filter((item) => item && item !== key && isKnownVocabWord(item)))];
}

/** Derivational relatives (expose ↔ exposure) accepted only when they are real vocabulary. */
function sharedPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return i;
}

function derivedRelatives(word: string): string[] {
  const w = word.trim().toLowerCase();
  const out = new Set<string>();
  if (w.length < 5) return [];
  const related = (cand: string) =>
    sharedPrefix(w, cand) >= Math.max(4, Math.min(w.length, cand.length) - 3);
  const stems = new Set<string>([w]);
  const reverse: [RegExp, string[]][] = [
    [/ure$/, ["e"]],
    [/ation$/, ["e", "", "ate"]],
    [/ition$/, ["e", ""]],
    [/ion$/, ["e", "", "ate"]],
    [/ment$/, [""]],
    [/ness$/, [""]],
    [/ity$/, ["", "e"]],
    [/ly$/, [""]],
    [/er$/, ["", "e"]],
    [/ful$/, [""]],
  ];
  for (const [re, repl] of reverse) {
    if (!re.test(w)) continue;
    for (const r of repl) stems.add(w.replace(re, r));
  }
  const suffixes = ["ure", "ion", "ation", "ment", "ness", "ity", "ly", "er", "ful", "ing", "ed"];
  for (const stem of stems) {
    if (stem !== w && stem.length >= 3 && related(stem) && isKnownVocabWord(stem)) out.add(stem);
    const base = stem.endsWith("e") ? stem.slice(0, -1) : stem;
    for (const suf of suffixes) {
      for (const cand of [stem + suf, base + suf]) {
        if (cand !== w && cand.length >= 4 && related(cand) && isKnownVocabWord(cand)) out.add(cand);
      }
    }
  }
  return [...out];
}

export function buildWordFamilyEntries(
  word: string,
  _headMeaning?: string | null,
  headPos?: string | null,
): WordFamilyMember[] {
  const display = getFamilyDisplayWords(word);
  const derivational = derivationalFamilyCandidates(word);
  const key = word.trim().toLowerCase();
  const base =
    display.length > 1
      ? display
      : derivational.length
        ? [key, ...derivational]
        : display;
  const members = [
    ...new Set([...(base.length ? base : [key]), ...derivedRelatives(base[0] ?? key)]),
  ].slice(0, 6);

  if (members.length <= 1) return [];
  const head = members[0] ?? word.trim().toLowerCase();
  const resolvedHeadPos =
    normalizeWordType(headPos, head) ?? guessPos(head, head, 0, headPos);

  return members.map((member, index) => ({
    word: member,
    pos: guessPos(member, head, index, resolvedHeadPos),
    vi: "",
  }));
}

export function withWordFamily<
  T extends {
    word: string;
    vietnamese_meaning?: string | null;
    word_type?: string | null;
  },
>(data: T): T & { word_family: WordFamilyMember[] } {
  return {
    ...data,
    word_family: buildWordFamilyEntries(
      data.word,
      data.vietnamese_meaning,
      data.word_type,
    ),
  };
}
