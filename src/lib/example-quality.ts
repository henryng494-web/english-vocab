import type { VocabExample } from "@/lib/parse-examples";

const TARGET_COUNT = 2;

const GENERIC_EXAMPLE =
  /i learned the word|please use .+ in a(?: short)? sentence|this is a sentence with|use ["“'].+["”'] in a sentence|this is a sentence using/i;

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
): boolean {
  const en = example.en?.trim() ?? "";
  if (!en || isGenericExample(en)) return false;
  const count = wordCount(en);
  if (count < 4 || count > 14) return false;
  const needle = word.trim().toLowerCase();
  if (needle && !en.toLowerCase().includes(needle)) return false;
  return true;
}

export function keepNaturalExamples(
  word: string,
  examples: VocabExample[] | undefined,
): VocabExample[] {
  return (examples ?? [])
    .filter((item) => isNaturalExample(item, word))
    .slice(0, TARGET_COUNT);
}

export function hasQualityExamples(
  word: string,
  examples: VocabExample[] | undefined,
): boolean {
  const kept = keepNaturalExamples(word, examples).filter((item) =>
    Boolean(item.vi?.trim()),
  );
  return kept.length >= TARGET_COUNT;
}
