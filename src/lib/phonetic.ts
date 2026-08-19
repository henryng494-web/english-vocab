/** True when IPA is missing or just echoes the spelling (e.g. /spent/). */
export function isPlaceholderPhonetic(
  word: string,
  phonetic?: string | null,
): boolean {
  const trimmed = phonetic?.trim();
  if (!trimmed) return true;

  const normalizedWord = word.trim().toLowerCase();
  const bare = trimmed.replace(/^[/\[]|[/\]]$/g, "").toLowerCase();
  if (!bare) return true;
  if (bare === normalizedWord) return true;
  if (trimmed === `/${normalizedWord}/` || trimmed === `[${normalizedWord}]`) {
    return true;
  }
  return false;
}

export function formatIpa(ipa: string, word: string): string {
  const trimmed = ipa.trim();
  if (!trimmed || isPlaceholderPhonetic(word, trimmed)) return `/${word}/`;
  if (trimmed.startsWith("/") || trimmed.startsWith("[")) return trimmed;
  return `/${trimmed}/`;
}

/** Hide placeholder IPA in the card header. */
export function displayPhonetic(
  word: string,
  phonetic?: string | null,
): string | null {
  if (isPlaceholderPhonetic(word, phonetic)) return null;
  return phonetic?.trim() ?? null;
}
