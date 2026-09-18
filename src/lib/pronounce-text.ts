const SINGLE_WORD_PATTERN = /^[a-z][a-z'-]*$/i;
const PHRASE_PATTERN = /^[a-z0-9][a-z0-9\s'".,?!-]*$/i;

export function isSinglePronounceWord(text: string): boolean {
  return SINGLE_WORD_PATTERN.test(text.trim());
}

/** Normalize learner text for pronunciation (single word or short phrase). */
export function normalizePronounceText(raw: string): string | null {
  const text = raw.trim().replace(/\s+/g, " ");
  if (!text || text.length > 280) return null;
  if (SINGLE_WORD_PATTERN.test(text)) return text.toLowerCase();
  if (PHRASE_PATTERN.test(text)) return text;
  return null;
}

export function parsePronounceTextParam(
  textParam: string | null,
  wordParam: string | null,
): string | null {
  if (textParam?.trim()) return normalizePronounceText(textParam);
  if (wordParam?.trim()) return normalizePronounceText(wordParam);
  return null;
}
