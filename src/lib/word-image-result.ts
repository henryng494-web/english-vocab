/**
 * Unified return shape for every word-image pipeline (Gemini, Unsplash, Pexels, DB, SVG).
 * Callers must always receive a displayable `url` — never null/undefined.
 */

export const WORD_IMAGE_SOURCES = {
  STORED: "stored",
  GEMINI_STOCK: "gemini-stock",
  RULE_STOCK: "rule-stock",
  UNSPLASH: "unsplash",
  PEXELS: "pexels",
  DIRECT_STOCK: "direct-stock",
  SVG_PLACEHOLDER: "svg-placeholder",
  COALESCE: "coalesce",
  MASCOT_ILLUSTRATION: "mascot-illustration",
  ERROR: "error",
} as const;

export type WordImageSource =
  (typeof WORD_IMAGE_SOURCES)[keyof typeof WORD_IMAGE_SOURCES];

/** Canonical pipeline / API result. */
export type WordImageResult = {
  url: string;
  source: string;
  /** True when an upstream step failed and a placeholder was used unexpectedly. */
  error: boolean;
  searchKeyword?: string | null;
};

/** JSON body for `/api/word-image` — includes legacy `image_url`. */
export type WordImageApiResponse = WordImageResult & {
  image_url: string;
};

/** @deprecated Use {@link WordImageResult} — kept for existing imports. */
export type WordImageFetchResult = WordImageResult;

export function okWordImageResult(
  url: string,
  source: string,
  searchKeyword?: string | null,
): WordImageResult {
  const trimmed = url.trim();
  return {
    url: trimmed,
    source,
    error: false,
    searchKeyword: searchKeyword?.trim() || null,
  };
}

export function errWordImageResult(
  url: string,
  source: string = WORD_IMAGE_SOURCES.ERROR,
  searchKeyword?: string | null,
): WordImageResult {
  const trimmed = url.trim();
  return {
    url: trimmed,
    source,
    error: true,
    searchKeyword: searchKeyword?.trim() || null,
  };
}

export function toWordImageApiResponse(
  result: WordImageResult,
): WordImageApiResponse {
  return {
    ...result,
    image_url: result.url,
  };
}

function readUrlField(record: Record<string, unknown>): string {
  const direct =
    (typeof record.url === "string" ? record.url : null)?.trim() ||
    (typeof record.image_url === "string" ? record.image_url : null)?.trim() ||
    (typeof record.imageUrl === "string" ? record.imageUrl : null)?.trim() ||
    "";
  return direct;
}

/** Parse single or batch API payloads; falls back to `fallbackUrl` when missing. */
export function parseWordImageApiPayload(
  data: unknown,
  fallbackUrl: string,
): WordImageResult {
  if (!data || typeof data !== "object") {
    return errWordImageResult(fallbackUrl);
  }

  const record = data as Record<string, unknown>;
  const url = readUrlField(record);
  if (!url) {
    return errWordImageResult(fallbackUrl);
  }

  return {
    url,
    source:
      typeof record.source === "string" && record.source.trim()
        ? record.source.trim()
        : WORD_IMAGE_SOURCES.STORED,
    error: Boolean(record.error),
    searchKeyword:
      typeof record.searchKeyword === "string"
        ? record.searchKeyword.trim() || null
        : null,
  };
}

/** Batch map may contain legacy string URLs or unified objects. */
export function parseWordImageBatchEntry(
  entry: unknown,
  fallbackUrl: string,
): WordImageResult {
  if (typeof entry === "string") {
    const trimmed = entry.trim();
    if (trimmed) {
      return okWordImageResult(trimmed, WORD_IMAGE_SOURCES.STORED);
    }
    return errWordImageResult(fallbackUrl);
  }
  return parseWordImageApiPayload(entry, fallbackUrl);
}
