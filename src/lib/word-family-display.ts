import {
  ACTION_SENSE_VI,
  FAMILY_MEMBER_GLOSSES,
  ROLE_VERB_VI,
} from "@/data/family-glosses";
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

const PERSON_VI_PATTERN =
  /^(y tá|bác sĩ|giáo viên|cảnh sát|công an|lính|chiến sĩ|công nhân|nông dân|luật sư|kỹ sư|nghệ sĩ|ca sĩ|diễn viên|đầu bếp|tài xế|phi công|thư ký|nhân viên|học sinh|sinh viên|giám đốc|quản lý|huấn luyện viên)/i;

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

function isDeverbalNoun(word: string): boolean {
  return /(?:tion|sion|ment|ance|ence)$/.test(word);
}

function isHeadInflection(member: string, head: string): boolean {
  if (member === `${head}ed` || member === `${head}ing` || member === `${head}s`) {
    return true;
  }
  if (head.endsWith("e") && (member === `${head}d` || member === `${head.slice(0, -1)}ing`)) {
    return true;
  }
  if (head.endsWith("y") && member === `${head.slice(0, -1)}ied`) return true;
  return false;
}

function guessPos(
  word: string,
  headword: string,
  index: number,
  headPos?: string | null,
): string {
  const curated = FAMILY_MEMBER_GLOSSES[word];
  if (curated) return curated.pos;
  const known = normalizeWordType(null, word);
  if (word === headword) {
    return normalizeWordType(headPos, word) ?? known ?? "noun";
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
    if (headPos === "verb" || ROLE_VERB_VI[headword]) return "noun";
    if (headPos === "adjective") return "verb";
    return "adjective";
  }
  if (word.endsWith("ed")) {
    if (headPos === "adjective" || ROLE_VERB_VI[headword]) return "verb";
    return "adjective";
  }
  if (known && known !== "unknown") return known;
  if (index === 0) return "noun";
  return "verb";
}

function firstGloss(meaning: string): string {
  return meaning
    .split(/[;/•]| - /)[0]
    .trim();
}

function viKernel(meaning: string): string {
  return firstGloss(meaning)
    .split(",")[0]
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

function adverbFromAdj(meaning: string): string {
  const parts = meaning
    .split(/[,;/]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const quality = lowerVi(parts[parts.length - 1] || meaning);
  return quality ? `một cách ${quality}` : "";
}

function actionLemma(head: string, headPos: string, headMeaning: string): string | null {
  if (ACTION_SENSE_VI[head]) return ACTION_SENSE_VI[head];
  if (ROLE_VERB_VI[head]) return ROLE_VERB_VI[head];
  if (headPos === "verb") return lowerVi(viKernel(headMeaning)) || null;
  if (headPos === "noun" && isDeverbalNoun(head)) {
    return lowerVi(viKernel(headMeaning)) || null;
  }
  return null;
}

function isPersonRole(head: string, headPos: string, headMeaning: string): boolean {
  if (ROLE_VERB_VI[head]) return true;
  return headPos === "noun" && PERSON_VI_PATTERN.test(headMeaning.trim());
}

function deriveMember(
  word: string,
  pos: string,
  head: string,
  headPos: string,
  headMeaning: string,
): { pos: string; vi: string } | null {
  const curated = FAMILY_MEMBER_GLOSSES[word];
  if (curated) return curated;

  const action = actionLemma(head, headPos, headMeaning);
  const kernel = lowerVi(viKernel(headMeaning));

  if (pos === "adverb" || (word.endsWith("ly") && word.length > head.length)) {
    const vi = adverbFromAdj(headMeaning);
    return vi ? { pos: "adverb", vi } : null;
  }

  if (headPos === "adjective") {
    if (word.endsWith("ness") || word.endsWith("ity")) {
      return kernel ? { pos: "noun", vi: `sự ${kernel}` } : null;
    }
    if (!action) return null;
    if (/(?:tion|sion|ation|ment)$/.test(word)) {
      return { pos: "noun", vi: `sự ${action}` };
    }
    if (word.endsWith("ed")) return { pos: "adjective", vi: `đã được ${action}` };
    if (word.endsWith("ing")) return { pos: "verb", vi: `đang ${action}` };
    return null;
  }

  if (isPersonRole(head, headPos, headMeaning) && isHeadInflection(word, head)) {
    if (!action) return null;
    if (word.endsWith("ing")) return { pos: "noun", vi: `nghề ${kernel}` };
    if (word.endsWith("ed")) return { pos: "verb", vi: `đã ${action}` };
    return null;
  }

  if (isHeadInflection(word, head) && headPos === "noun" && !action) {
    return null;
  }

  if (!kernel && !action) return null;
  const lemma = action ?? kernel;

  if (pos === "verb") return { pos, vi: lemma };
  if (pos === "noun" && word.endsWith("ing")) return { pos, vi: `việc ${lemma}` };
  if (
    pos === "noun" &&
    (word.endsWith("or") || (word.endsWith("er") && headPos === "verb"))
  ) {
    return { pos, vi: `người ${lemma}` };
  }
  if (pos === "noun") return { pos, vi: `sự ${lemma}` };
  if (pos === "adjective" && word.endsWith("ed")) {
    return { pos, vi: headPos === "verb" ? `đã ${lemma}` : `bị ${lemma}` };
  }
  if (pos === "adjective" && word.endsWith("ing")) return { pos, vi: `đang ${lemma}` };
  if (pos === "adjective") return { pos, vi: `thuộc ${lemma}` };
  return { pos, vi: lemma };
}

function lookupVi(word: string): string {
  const standard = getStandardVocab(word)?.meaning?.trim();
  if (standard) return firstGloss(standard);
  return firstGloss(PRIMARY_SENSES[word]?.vietnamese?.trim() ?? "");
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
  const entries: WordFamilyMember[] = [];
  const seen = new Set<string>();

  for (const [index, member] of display.entries()) {
    const pos = guessPos(member, head, index, resolvedHeadPos);
    let vi = "";
    let resolvedPos = pos;
    if (index === 0 && fallbackMeaning) {
      vi = fallbackMeaning;
    } else {
      const lexicon = lookupVi(member);
      if (lexicon && glossKey(lexicon) !== glossKey(fallbackMeaning)) {
        vi = lexicon;
      } else {
        const derived = deriveMember(
          member,
          pos,
          head,
          resolvedHeadPos,
          fallbackMeaning,
        );
        if (!derived?.vi) continue;
        vi = derived.vi;
        resolvedPos = derived.pos;
      }
    }
    const key = glossKey(vi);
    if (!vi || (index > 0 && seen.has(key))) continue;
    seen.add(key);
    entries.push({ word: member, pos: resolvedPos, vi });
  }

  return entries.length > 1 ? entries : [];
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
