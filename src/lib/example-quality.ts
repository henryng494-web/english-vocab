import type { VocabExample } from "@/lib/parse-examples";
import {
  alignmentMeaningLines,
  glossAlignmentTerms,
} from "@/lib/word-meanings";
import { normalizeWordType } from "@/lib/word-type";

const TARGET_COUNT = 2;

const GENERIC_EXAMPLE =
  /i learned the word|please use .+ in a(?: short)? sentence|this is a sentence with|use ["“'].+["”'] in a sentence|this is a sentence using/i;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Lazy POS templates from buildNaturalExamples — never valid learning cards. */
export function isPosFallbackTemplate(en: string, word: string): boolean {
  const text = en.trim();
  const w = escapeRegExp(word.trim());
  if (!text || !w) return false;

  const patterns = [
    new RegExp(`^I saw a ${w} on the table\\.?$`, "i"),
    new RegExp(`^The ${w} is in the kitchen\\.?$`, "i"),
    new RegExp(`^She ${w} the door every morning\\.?$`, "i"),
    new RegExp(`^He ${w} it before he leaves\\.?$`, "i"),
    new RegExp(`^Good rest is ${w} after a long day\\.?$`, "i"),
    new RegExp(`^This step is ${w} for success\\.?$`, "i"),
    new RegExp(`^The room looks ${w} in this light\\.?$`, "i"),
    new RegExp(`^It feels ${w} outside today\\.?$`, "i"),
    new RegExp(`^She spoke ${w} to the whole class\\.?$`, "i"),
    new RegExp(`^He finished the race ${w}\\.?$`, "i"),
    new RegExp(`^I have ${w} books at home\\.?$`, "i"),
    new RegExp(`^She is ${w} years old\\.?$`, "i"),
    new RegExp(`^The keys are ${w} the bag\\.?$`, "i"),
    new RegExp(`^We sat ${w} the old tree\\.?$`, "i"),
    new RegExp(`^I like tea ${w} coffee\\.?$`, "i"),
    new RegExp(`^Stay here ${w} wait for me\\.?$`, "i"),
    new RegExp(`^I need ${w} new notebook\\.?$`, "i"),
    new RegExp(`^I like ${w} song a lot\\.?$`, "i"),
  ];

  return patterns.some((pattern) => pattern.test(text));
}

/** Reject article/subject patterns when POS is not a countable noun. */
export function isPosMismatchExample(
  en: string,
  word: string,
  pos?: string | null,
): boolean {
  const text = en.trim();
  const w = escapeRegExp(word.trim());
  if (!text || !w) return false;

  const normalizedPos = normalizeWordType(pos, word);
  if (!normalizedPos || normalizedPos === "noun") return false;

  if (new RegExp(`\\ba ${w}\\b`, "i").test(text)) return true;
  if (new RegExp(`\\bthe ${w} is\\b`, "i").test(text)) return true;
  if (normalizedPos !== "verb") {
    if (new RegExp(`\\bshe ${w} the\\b`, "i").test(text)) return true;
    if (new RegExp(`\\bhe ${w} it\\b`, "i").test(text)) return true;
  }

  return false;
}

/** Bare adjectives wrongly used as sentence subjects ("Clean is vital…"). */
const COMMON_ADJECTIVE_SUBJECTS = new Set([
  "clean", "happy", "sad", "good", "bad", "nice", "kind", "safe", "healthy", "fresh",
  "strong", "weak", "hard", "soft", "warm", "cold", "hot", "free", "busy", "tired",
  "full", "empty", "open", "dark", "light", "rich", "poor", "young", "old", "fast",
  "slow", "easy", "ready", "true", "false", "real", "simple", "active", "normal",
  "natural", "daily", "personal", "physical", "mental", "social", "public", "private",
  "local", "main", "final", "basic", "general", "total", "perfect", "complete",
  "positive", "negative", "formal", "casual", "direct", "honest", "lazy", "smart",
  "brave", "afraid", "angry", "hungry", "wet", "dry", "new", "clear", "dirty",
  "thin", "thick", "high", "low", "deep", "wide", "narrow", "quick", "late", "early",
  "sure", "wrong", "right", "quiet", "loud", "calm", "wild", "mild", "bitter", "sweet",
  "plain", "fancy", "polite", "rude", "friendly", "gentle", "harsh", "tight", "loose",
  "firm", "stiff", "flexible", "important", "essential", "critical", "vital",
]);

function isAdjectiveMisusedAsSubject(en: string, word: string): boolean {
  const match = en.trim().match(/^([A-Za-z]+)\s+is\s+([A-Za-z]+)/i);
  if (!match) return false;
  const subject = match[1].toLowerCase();
  const predicate = match[2].toLowerCase();
  if (predicate !== word.trim().toLowerCase()) return false;
  return COMMON_ADJECTIVE_SUBJECTS.has(subject);
}

function isBannedStudyTemplate(text: string): boolean {
  return (
    /^there is a .+ near the door\.?$/i.test(text) ||
    /^she talked about the .+\.?$/i.test(text) ||
    /^there is a .+ in my pocket\.?$/i.test(text) ||
    /^i found a .+ in the garden\.?$/i.test(text) ||
    /^please .+ the door for me\.?$/i.test(text) ||
    /^they .+ after dinner\.?$/i.test(text) ||
    /^the sky looks .+ today\.?$/i.test(text) ||
    /^she wore a .+ dress\.?$/i.test(text) ||
    /^please speak .+ to them\.?$/i.test(text) ||
    /^he walked .+ down the street\.?$/i.test(text) ||
    /^i noticed the .+ on my walk\.?$/i.test(text) ||
    /^we talked about the .+ at lunch\.?$/i.test(text)
  );
}

const VI_DIACRITICS =
  /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;

/** True when the Vietnamese line still contains the English headword untranslated. */
export function containsUntranslatedHeadword(
  vi: string,
  word: string,
): boolean {
  const viTrimmed = vi.trim();
  const head = word.trim().toLowerCase();
  if (!viTrimmed || !head || head.length < 3) return false;
  const escaped = head.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(viTrimmed);
}

export function isLikelyVietnameseGloss(text: string | null | undefined): boolean {
  const trimmed = text?.trim();
  if (!trimmed) return false;
  return VI_DIACRITICS.test(trimmed);
}

export function isQualityExampleTranslation(
  example: VocabExample,
  word: string,
): boolean {
  const vi = example.vi?.trim() ?? "";
  if (!vi) return false;
  return !containsUntranslatedHeadword(vi, word);
}

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function isGenericExample(en: string): boolean {
  const text = en.trim();
  if (!text) return true;
  if (GENERIC_EXAMPLE.test(text)) return true;
  if (isBannedStudyTemplate(text)) return true;
  return false;
}

export function isNaturalExample(
  example: VocabExample,
  word: string,
  pos?: string | null,
): boolean {
  const en = example.en?.trim() ?? "";
  if (!en || isGenericExample(en)) return false;
  if (isPosFallbackTemplate(en, word)) return false;
  if (isPosMismatchExample(en, word, pos)) return false;
  if (isAdjectiveMisusedAsSubject(en, word)) return false;
  const count = wordCount(en);
  if (count < 4 || count > 14) return false;
  const needle = word.trim().toLowerCase();
  if (needle && !en.toLowerCase().includes(needle)) return false;
  const normalizedPos = normalizeWordType(pos, word);
  if (
    normalizedPos === "adjective" &&
    /^(it|this|that)\s+(looks|feels|seems|sounds|smells|tastes)\s+[a-z]+$/i.test(
      en,
    ) &&
    !/\b(for|to|in|with|at|on|from|because|when|if|as|by)\b/i.test(en)
  ) {
    return false;
  }
  if (!isQualityExampleTranslation(example, word)) return false;
  return true;
}

export function keepNaturalExamples(
  word: string,
  examples: VocabExample[] | undefined,
  pos?: string | null,
  meaning?: string | null,
): VocabExample[] {
  const natural = (examples ?? []).filter((item) =>
    isNaturalExample(item, word, pos),
  );
  const displayed = alignmentMeaningLines(meaning);
  if (!displayed.length) return natural.slice(0, TARGET_COUNT);

  if (displayed.length === 1) {
    return natural
      .filter((item) => viTranslationMatchesGloss(item.vi, displayed[0]))
      .slice(0, TARGET_COUNT);
  }

  const used = new Set<number>();
  const paired: VocabExample[] = [];
  for (const [senseOffset, line] of displayed.entries()) {
    const idx = natural.findIndex(
      (item, index) =>
        !used.has(index) && viTranslationMatchesGloss(item.vi, line),
    );
    if (idx === -1) continue;
    used.add(idx);
    paired.push({
      ...natural[idx]!,
      senseIndex: senseOffset + 1,
    });
  }
  return paired.slice(0, TARGET_COUNT);
}

export function viTranslationMatchesGloss(
  vi: string | null | undefined,
  meaningLine: string | null | undefined,
): boolean {
  const viText = vi?.trim().toLowerCase();
  const gloss = meaningLine?.trim();
  if (!viText || !gloss) return false;

  const terms = glossAlignmentTerms(gloss);
  if (!terms.length) return true;

  return terms.some((term) => {
    if (term.includes(" ")) {
      return viText.includes(term);
    }
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[\\s,.;:!?()"'])${escaped}([\\s,.;:!?()"']|$)`, "i").test(
      viText,
    );
  });
}

export function hasMeaningAlignedExamples(
  examples: VocabExample[] | undefined,
  vietnameseMeaning?: string | null,
): boolean {
  const meaningLines = alignmentMeaningLines(vietnameseMeaning);
  if (!meaningLines.length) return true;

  const kept = (examples ?? []).filter((item) => Boolean(item.en?.trim()));
  if (kept.length < TARGET_COUNT) return false;

  for (let index = 0; index < TARGET_COUNT; index++) {
    const example = kept[index];
    if (!example) return false;
    const senseLine =
      meaningLines.length >= 2
        ? meaningLines[Math.min(index, meaningLines.length - 1)]!
        : meaningLines[0]!;
    if (!viTranslationMatchesGloss(example.vi, senseLine)) {
      return false;
    }
  }

  return true;
}

export function hasQualityExamples(
  word: string,
  examples: VocabExample[] | undefined,
  pos?: string | null,
  vietnameseMeaning?: string | null,
): boolean {
  const kept = keepNaturalExamples(word, examples, pos, vietnameseMeaning).filter(
    (item) => Boolean(item.vi?.trim()),
  );
  if (kept.length < TARGET_COUNT) return false;
  return hasMeaningAlignedExamples(kept, vietnameseMeaning);
}
