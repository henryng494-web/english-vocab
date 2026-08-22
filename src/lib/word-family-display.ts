import { PRIMARY_SENSES } from "@/data/primary-senses";
import { getStandardVocab } from "@/data/standard-vocab";
import { getFamilyDisplayWords, type WordFamilyMember } from "@/lib/word-family";
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

function guessPos(
  word: string,
  headword: string,
  index: number,
  headPos?: string | null,
): string {
  const known = normalizeWordType(null, word);
  if (word === headword) {
    return normalizeWordType(headPos, word) ?? known ?? "noun";
  }
  if (known && known !== "unknown") {
    if (word.endsWith("ing") || word.endsWith("ed")) {
      // Shape heuristics miss participle vs gerund; use family context below.
    } else {
      return known;
    }
  }
  if (word.endsWith("ly") && word.length > headword.length) return "adverb";
  if (
    /(?:tion|sion|ness|ment|ity|ance|ence|hood|ship|ism|age)$/.test(word) &&
    word !== headword
  ) {
    return "noun";
  }
  if (/(?:ful|less|ous|ive|able|ible|ical)$/.test(word)) return "adjective";
  if (word.endsWith("al") && word.length > headword.length) return "adjective";
  if (isVerbStemOfNoun(word, headword)) return "verb";
  if (word.endsWith("en") && word.length > headword.length) return "verb";
  if (word.endsWith("or") && word.length > headword.length) return "noun";
  if (word.endsWith("er") && headPos === "verb" && word.length > headword.length) {
    return "noun";
  }
  if (word.endsWith("ing")) {
    if (headPos === "verb") return "noun";
    return "adjective";
  }
  if (word.endsWith("ed")) return "adjective";
  if (index === 0) return "noun";
  return "verb";
}

function firstGloss(meaning: string): string {
  return meaning
    .split(/[;/•]| - /)[0]
    .split(",")[0]
    .trim();
}

function viKernel(meaning: string): string {
  return firstGloss(meaning)
    .replace(/^(mối |sự |cái |con |cuộc |việc |nỗi |niềm |ca |các |những |một )/i, "")
    .replace(/\.$/, "")
    .trim();
}

function lowerVi(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function glossKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function deriveVi(
  word: string,
  pos: string,
  headMeaning: string,
  headPos: string,
): string {
  const kernel = lowerVi(viKernel(headMeaning));
  if (!kernel) return "";
  if (pos === "verb") return kernel;
  if (pos === "adverb") return `một cách ${kernel}`;
  if (pos === "noun" && word.endsWith("ing")) return `việc ${kernel}`;
  if (
    pos === "noun" &&
    (word.endsWith("or") || (word.endsWith("er") && headPos === "verb"))
  ) {
    return `người ${kernel}`;
  }
  if (pos === "noun") return `sự ${kernel}`;
  if (pos === "adjective" && word.endsWith("ed")) {
    return headPos === "verb" ? `đã ${kernel}` : `bị ${kernel}`;
  }
  if (pos === "adjective" && word.endsWith("ing")) return `đang ${kernel}`;
  if (pos === "adjective") return `thuộc ${kernel}`;
  return kernel;
}

function lookupVi(word: string): string {
  const standard = getStandardVocab(word)?.meaning?.trim();
  if (standard) return firstGloss(standard);
  return firstGloss(PRIMARY_SENSES[word]?.vietnamese?.trim() ?? "");
}

function uniquifyGlosses(
  entries: WordFamilyMember[],
  headMeaning: string,
  headPos: string,
): WordFamilyMember[] {
  const seen = new Set<string>();
  return entries.map((entry, index) => {
    let vi = entry.vi.trim();
    const take = (value: string) => {
      vi = value;
      seen.add(glossKey(value));
    };
    if (index === 0 && vi) {
      take(vi);
      return { ...entry, vi };
    }
    if (vi && !seen.has(glossKey(vi))) {
      take(vi);
      return { ...entry, vi };
    }
    const derived = deriveVi(entry.word, entry.pos, headMeaning, headPos);
    if (derived && !seen.has(glossKey(derived))) {
      take(derived);
      return { ...entry, vi: derived };
    }
    const kernel = lowerVi(viKernel(headMeaning));
    const alt =
      entry.pos === "noun"
        ? `quá trình ${kernel}`
        : entry.pos === "adjective"
          ? `có tính ${kernel}`
          : `làm ${kernel}`;
    if (kernel && !seen.has(glossKey(alt))) {
      take(alt);
      return { ...entry, vi: alt };
    }
    if (vi) seen.add(glossKey(vi));
    return { ...entry, vi };
  });
}

export function posAbbreviation(pos: string | null | undefined): string {
  const normalized = normalizeWordType(pos) ?? pos?.trim().toLowerCase() ?? "";
  return POS_ABBREV[normalized] ?? (normalized ? `${normalized}.` : "");
}

export function buildWordFamilyEntries(
  word: string,
  headMeaning?: string | null,
  headPos?: string | null,
): WordFamilyMember[] {
  const display = getFamilyDisplayWords(word);
  if (display.length <= 1) return [];
  const head = display[0];
  const resolvedHeadPos =
    normalizeWordType(headPos, head) ?? guessPos(head, head, 0, headPos);
  const fallbackMeaning = headMeaning?.trim() || lookupVi(head);
  const entries = display.map((member, index) => {
    const pos = guessPos(member, head, index, resolvedHeadPos);
    const lexicon = lookupVi(member);
    let vi = "";
    if (index === 0 && fallbackMeaning) {
      vi = fallbackMeaning;
    } else if (lexicon && glossKey(lexicon) !== glossKey(fallbackMeaning)) {
      vi = lexicon;
    } else {
      vi = deriveVi(member, pos, fallbackMeaning, resolvedHeadPos);
    }
    return { word: member, pos, vi };
  });
  return uniquifyGlosses(entries, fallbackMeaning, resolvedHeadPos);
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
