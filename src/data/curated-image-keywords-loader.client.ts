/**
 * Client-bundle stand-in for curated-image-keywords-loader (swapped in by
 * next.config.ts). The ~1.5 MB curated tables stay server-only; /api/word-image
 * always re-resolves the keyword with the full tables.
 */
export function lookupCuratedImageKeyword(_word: string): string | undefined {
  return undefined;
}

export function countCuratedImageKeywords(): number {
  return 0;
}

export const CURATED_BY_WORD: Readonly<Record<string, string>> = {};
