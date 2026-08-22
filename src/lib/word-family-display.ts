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

function guessPos(word: string, headword: string, index: number): string {
  const known = normalizeWordType(null, word);
  if (known) return known;
  if (word.endsWith("ly") && word.length > headword.length) return "adverb";
  if (word.endsWith("ness") || word.endsWith("ment") || word.endsWith("tion")) {
    return "noun";
  }
  if (
    word.endsWith("ful") ||
    word.endsWith("less") ||
    word.endsWith("ous") ||
    word.endsWith("ive") ||
    word.endsWith("able")
  ) {
    return "adjective";
  }
  if (word.endsWith("en") && word.length > headword.length) return "verb";
  if (word.endsWith("ing") || word.endsWith("ed")) return "adjective";
  if (index === 0) return "noun";
  return "verb";
}

function coreMeaning(meaning: string): string {
  return meaning
    .trim()
    .replace(/^(mối |sự |cái |con |cuộc |việc |nỗi |niềm )/i, "")
    .replace(/\.$/, "");
}

function deriveVi(word: string, pos: string, headMeaning: string): string {
  const core = coreMeaning(headMeaning) || headMeaning.trim();
  if (!core) return "";
  if (pos === "adverb") return `một cách ${core}`;
  if (pos === "verb") return core;
  if (pos === "adjective" && word.endsWith("ed")) return `bị ${core}`;
  if (pos === "adjective" && word.endsWith("ing")) return `mang tính ${core}`;
  if (pos === "adjective") return core;
  if (pos === "noun" && word !== core) return core;
  return headMeaning.trim();
}

function lookupVi(word: string): string {
  const standard = getStandardVocab(word)?.meaning?.trim();
  if (standard) return standard;
  return PRIMARY_SENSES[word]?.vietnamese?.trim() ?? "";
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
  const fallbackMeaning = headMeaning?.trim() || lookupVi(head);
  return display.map((member, index) => {
    const pos =
      index === 0
        ? normalizeWordType(headPos, member) ?? guessPos(member, head, index)
        : guessPos(member, head, index);
    const vi =
      (index === 0 && fallbackMeaning) ||
      lookupVi(member) ||
      deriveVi(member, pos, fallbackMeaning);
    return { word: member, pos, vi };
  });
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
