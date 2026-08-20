/** Test/corrupt entries like complete_1787031029838 from automated add-word runs. */
const CORRUPT_WORD_SUFFIX = /_(\d{6,})$/;

/** Normal English vocabulary token (letters, optional hyphen or apostrophe). */
const VOCAB_WORD_PATTERN = /^[a-z]+(?:[-'][a-z]+)*$/;

export function hasCorruptWordSuffix(word: string): boolean {
  return CORRUPT_WORD_SUFFIX.test(word.trim().toLowerCase());
}

export function canonicalizeVocabWord(word: string): string {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return normalized;
  return normalized.replace(CORRUPT_WORD_SUFFIX, "");
}

export function isValidVocabWord(word: string): boolean {
  const normalized = word.trim().toLowerCase();
  if (!normalized || normalized.length > 64) return false;
  return VOCAB_WORD_PATTERN.test(normalized);
}

export function normalizeVocabInput(word: string): string | null {
  const canonical = canonicalizeVocabWord(word);
  return isValidVocabWord(canonical) ? canonical : null;
}
