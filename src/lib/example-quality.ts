import type { VocabExample } from "@/lib/parse-examples";
import { normalizeWordType } from "@/lib/word-type";

const TARGET_COUNT = 2;

const GENERIC_EXAMPLE =
  /i learned the word|please use .+ in a(?: short)? sentence|this is a sentence with|use ["“'].+["”'] in a sentence|this is a sentence using/i;

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

function isFallbackTemplate(text: string): boolean {
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
    /^i have .+ books at home\.?$/i.test(text) ||
    /^she is .+ years old\.?$/i.test(text) ||
    /^the keys are .+ the bag\.?$/i.test(text) ||
    /^we sat .+ the old tree\.?$/i.test(text) ||
    /^i like tea .+ coffee\.?$/i.test(text) ||
    /^stay here .+ wait for me\.?$/i.test(text) ||
    /^i like .+ song a lot\.?$/i.test(text) ||
    /^i saw .+ at school today\.?$/i.test(text) ||
    /^.+ is waiting outside\.?$/i.test(text) ||
    /^.+ cat sat on the chair\.?$/i.test(text) ||
    /^.+! the food is ready\.?$/i.test(text) ||
    /^.+ students arrived early\.?$/i.test(text)
  );
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
  if (isFallbackTemplate(text)) return true;
  return false;
}

export function isNaturalExample(
  example: VocabExample,
  word: string,
  pos?: string | null,
): boolean {
  const en = example.en?.trim() ?? "";
  if (!en || isGenericExample(en)) return false;
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
  return true;
}

export function keepNaturalExamples(
  word: string,
  examples: VocabExample[] | undefined,
  pos?: string | null,
): VocabExample[] {
  return (examples ?? [])
    .filter((item) => isNaturalExample(item, word, pos))
    .slice(0, TARGET_COUNT);
}

export function hasQualityExamples(
  word: string,
  examples: VocabExample[] | undefined,
  pos?: string | null,
): boolean {
  const kept = keepNaturalExamples(word, examples, pos).filter((item) =>
    Boolean(item.vi?.trim()),
  );
  return kept.length >= TARGET_COUNT;
}
