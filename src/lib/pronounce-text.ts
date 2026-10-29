const SINGLE_WORD_PATTERN = /^[a-z][a-z'-]*$/i;
const PHRASE_PATTERN =
  /^[a-z0-9"'([][a-z0-9\s'".,?!:;()\-[\]/]*$/i;

/** Normalize curly quotes / dashes so card examples pass validation. */
function normalizePronouncePunctuation(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014]/g, "-");
}

export function isSinglePronounceWord(text: string): boolean {
  return SINGLE_WORD_PATTERN.test(text.trim());
}

/** Normalize learner text for pronunciation (single word or short phrase). */
export function normalizePronounceText(raw: string): string | null {
  const text = normalizePronouncePunctuation(raw).trim().replace(/\s+/g, " ");
  if (!text || text.length > 280) return null;
  if (SINGLE_WORD_PATTERN.test(text)) return text.toLowerCase();
  if (PHRASE_PATTERN.test(text)) return text;
  return null;
}

export function isLongPronouncePhrase(text: string): boolean {
  return !isSinglePronounceWord(text);
}

export function parsePronounceTextParam(
  textParam: string | null,
  wordParam: string | null,
): string | null {
  if (textParam?.trim()) return normalizePronounceText(textParam);
  if (wordParam?.trim()) return normalizePronounceText(wordParam);
  return null;
}
