import { buildImageSearchQueries } from "@/lib/image-keyword";
import { cleanPhrase } from "@/lib/image-keyword-utils";
import {
  errWordImageResult,
  okWordImageResult,
  WORD_IMAGE_SOURCES,
  type WordImageFetchResult,
  type WordImageResult,
} from "@/lib/word-image-result";
import {
  FUNCTION_WORD_IMAGE_MARKER,
  isApprovedFunctionWordStockUrl,
} from "@/lib/function-word-images";
import {
  getStaticCastWordImagePath,
  isCastWordImageWord,
  isLegacyMascotPipelineUrl,
  isStaticCastWordImageUrl,
} from "@/lib/cast-word-images";
import {
  isClosedClassWord,
  resolveWordImagePlan,
} from "@/lib/word-image-strategy";
import { isUnsafeImageMetadata, isUnsafeImageUrl } from "@/lib/safe-image-metadata";
import { requiresSafeImageOnly } from "@/lib/safe-image-search";

export type UnsplashPhoto = {
  id: string;
  url: string;
  alt: string;
  photographer: string;
};

type UnsplashSearchResponse = {
  results: Array<{
    id: string;
    alt_description: string | null;
    urls: { regular: string };
    user: { name: string };
  }>;
};

const GENERIC_QUERY_TOKENS = new Set([
  "action",
  "everyday",
  "moment",
  "object",
  "outdoors",
  "person",
  "photo",
  "photography",
  "scene",
  "still",
  "life",
  "illustration",
  "educational",
  "concept",
  "professional",
  "workplace",
  "portrait",
  "natural",
  "light",
  "descriptive",
  "candid",
  "activity",
  "closeup",
]);

const SEMANTIC_IMAGE_VERSION = "33";
/** Only URLs from a successful Gemini→Unsplash run carry this marker. */
export const IMAGE_PIPELINE_ID = "gemini-unsplash-v4";
/** Rule-based keyword queries with metadata score > 0. */
export const RULE_STOCK_PIPELINE_ID = "rule-stock-v1";

function markFunctionWordStockUrl(url: string): string | null {
  const tagged = markRuleStockImageUrl(url);
  if (!tagged) return null;
  try {
    const parsed = new URL(tagged);
    parsed.searchParams.set("fw", FUNCTION_WORD_IMAGE_MARKER);
    return parsed.toString();
  } catch {
    return tagged;
  }
}

function tagStockPhotoUrl(
  url: string,
  word: string,
  pos?: string | null,
): string | null {
  if (isClosedClassWord(word, pos)) {
    return markFunctionWordStockUrl(url);
  }
  return markRuleStockImageUrl(url);
}

/** Only Pexels and Unsplash are trusted learning-card photo sources. */
const STOCK_IMAGE_HOSTS = new Set(["images.pexels.com", "images.unsplash.com"]);

function isDisplayableImageHost(hostname: string): boolean {
  return STOCK_IMAGE_HOSTS.has(hostname.toLowerCase());
}

export function isStockImageUrl(url: string | null | undefined): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("http")) return false;
  try {
    return isDisplayableImageHost(new URL(trimmed).hostname);
  } catch {
    return false;
  }
}

/** Openverse API proxy thumbs often 424 in the browser — never display them. */
export function isBrokenOpenverseProxyUrl(
  url: string | null | undefined,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return (
      parsed.hostname === "api.openverse.org" &&
      parsed.pathname.includes("/images/")
    );
  } catch {
    return false;
  }
}

function pickDisplayableMediaUrl(url?: string | null): string | null {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("https://")) return null;
  if (isBrokenOpenverseProxyUrl(trimmed)) return null;
  if (isUnsafeImageUrl(trimmed)) return null;
  try {
    const parsed = new URL(trimmed);
    if (!isDisplayableImageHost(parsed.hostname)) return null;
    const pathText = decodeURIComponent(parsed.pathname).replace(/[_-]+/g, " ");
    if (isUnsafeImageMetadata(pathText)) return null;
  } catch {
    return null;
  }
  return trimmed;
}

function getStockUrlMarkers(url: string): {
  semantic: string | null;
  imgpipe: string | null;
} {
  try {
    const parsed = new URL(url);
    return {
      semantic: parsed.searchParams.get("semantic"),
      imgpipe: parsed.searchParams.get("imgpipe"),
    };
  } catch {
    return { semantic: null, imgpipe: null };
  }
}

/** Internal picker — safe stock host, no pipeline tag required yet. */
function isSelectableStockPhotoUrl(
  url: string | null | undefined,
  word?: string | null,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("https://")) return false;
  if (isUnsafeImageUrl(trimmed)) return false;
  if (word && requiresSafeImageOnly(word)) return false;
  if (isStalePresetFallbackUrl(trimmed)) return false;
  if (isUntrustedRandomImageUrl(trimmed)) return false;
  if (isBrokenOpenverseProxyUrl(trimmed)) return false;
  try {
    if (!isDisplayableImageHost(new URL(trimmed).hostname)) return false;
  } catch {
    return false;
  }
  return true;
}

function hashWord(word: string): number {
  let hash = 0;
  for (const char of word.trim().toLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

/**
 * Keyword-relevant, unique-per-word photo. LoremFlickr sources a real photo
 * tagged with `word` from Flickr; `lock` pins it to one deterministic image
 * per word so the same card never shuffles between reloads.
 */
export function getLoremFlickrImageUrl(word: string): string {
  const normalized = word.trim().toLowerCase() || "vocabulary";
  const lock = hashWord(normalized) % 100000;
  return `https://loremflickr.com/600/350/${encodeURIComponent(normalized)}?lock=${lock}`;
}

/**
 * Deterministic, always-available photo keyed by word seed. Used when the
 * keyword-relevant source is unavailable — still unique per word, never a
 * shared static image.
 */
export function getPicsumFallbackImageUrl(word: string): string {
  const normalized = word.trim().toLowerCase() || "vocabulary";
  return `https://picsum.photos/seed/${encodeURIComponent(normalized)}/600/350`;
}

/**
 * Detects image URLs generated by the old fixed 8-photo fallback pool
 * (`images.unsplash.com/photo-...?w=800&h=600&fit=crop&q=80&auto=format`).
 * Those photo IDs now 404 and were shared across many words, causing both
 * the "mất ảnh" and "trùng ảnh" bugs — treat them as stale so callers
 * regenerate a fresh, unique image instead of reusing them.
 */
export function isStalePresetFallbackUrl(url: string | null | undefined): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  return (
    trimmed.includes("images.unsplash.com/photo-") &&
    trimmed.includes("w=800&h=600&fit=crop&q=80&auto=format")
  );
}

/**
 * Random-photo providers cannot guarantee that the returned image depicts the
 * requested word. Treat their URLs as stale instead of presenting an unrelated
 * photo as learning content.
 */
export function isUntrustedRandomImageUrl(
  url: string | null | undefined,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  try {
    const hostname = new URL(trimmed).hostname.toLowerCase();
    return (
      hostname === "loremflickr.com" ||
      hostname.endsWith(".loremflickr.com") ||
      hostname === "picsum.photos" ||
      hostname.endsWith(".picsum.photos")
    );
  } catch {
    return false;
  }
}

export function isCurrentPipelineImageUrl(
  url: string | null | undefined,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("http") || !isStockImageUrl(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return (
      parsed.searchParams.get("semantic") === SEMANTIC_IMAGE_VERSION &&
      parsed.searchParams.get("imgpipe") === IMAGE_PIPELINE_ID
    );
  } catch {
    return false;
  }
}

export function isRuleStockImageUrl(url: string | null | undefined): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("http") || !isStockImageUrl(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return (
      parsed.searchParams.get("semantic") === SEMANTIC_IMAGE_VERSION &&
      parsed.searchParams.get("imgpipe") === RULE_STOCK_PIPELINE_ID
    );
  } catch {
    return false;
  }
}

/** Gemini or scored rule-based stock — safe to skip re-fetch. */
export function isFreshTaggedStockImageUrl(
  url: string | null | undefined,
): boolean {
  return isCurrentPipelineImageUrl(url) || isRuleStockImageUrl(url);
}

export function isPexelsImageUrl(url: string | null | undefined): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("http")) return false;
  try {
    return new URL(trimmed).hostname.toLowerCase() === "images.pexels.com";
  } catch {
    return false;
  }
}

export function isOutdatedSemanticImageUrl(
  url: string | null | undefined,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const requiresSemanticVersion =
      host === "images.unsplash.com" || host === "images.pexels.com";
    return (
      requiresSemanticVersion &&
      parsed.searchParams.get("semantic") !== SEMANTIC_IMAGE_VERSION
    );
  } catch {
    return false;
  }
}

/** Client display — show safe stock photos; pipeline v2 is preferred but not required. */
export function isDisplayableHttpImageUrl(
  url: string | null | undefined,
  word?: string | null,
  pos?: string | null,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("http")) return false;
  if (isUnsafeImageUrl(trimmed)) return false;
  if (word && requiresSafeImageOnly(word)) return false;
  if (isStalePresetFallbackUrl(trimmed)) return false;
  if (isUntrustedRandomImageUrl(trimmed)) return false;
  if (isPlaceholderIllustrationUrl(trimmed)) return false;
  if (isBrokenOpenverseProxyUrl(trimmed)) return false;
  if (isStockImageUrl(trimmed)) {
    if (
      word &&
      isClosedClassWord(word, pos) &&
      !isApprovedFunctionWordStockUrl(trimmed, word)
    ) {
      return false;
    }
    const { imgpipe } = getStockUrlMarkers(trimmed);
    const trustedPipe =
      !imgpipe ||
      imgpipe === IMAGE_PIPELINE_ID ||
      imgpipe === RULE_STOCK_PIPELINE_ID;
    if (!trustedPipe) {
      return false;
    }
    return true;
  }
  try {
    return isDisplayableImageHost(new URL(trimmed).hostname);
  } catch {
    return false;
  }
}

export function isPlaceholderIllustrationUrl(
  url: string | null | undefined,
): boolean {
  return Boolean(url?.trim().startsWith("data:image/svg+xml"));
}

/** Stock photo or intentional SVG fallback — both are OK to show a complete card. */
export function hasAcceptableWordImage(
  url: string | null | undefined,
  word?: string | null,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  if (isStaticCastWordImageUrl(trimmed)) return true;
  if (isPlaceholderIllustrationUrl(trimmed)) return true;
  if (!isStockImageUrl(trimmed)) return false;
  return !shouldRefreshImageUrl(trimmed, word);
}

/** True when the URL is a real photo/illustration, not the local SVG fallback. */
export function isRealCardImageUrl(
  url: string | null | undefined,
  word?: string | null,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  if (isStaticCastWordImageUrl(trimmed)) return true;
  if (isPlaceholderIllustrationUrl(trimmed)) return false;
  return isUsableCardImageUrl(trimmed, word);
}

export function isUsableCardImageUrl(
  url: string | null | undefined,
  word?: string | null,
  pos?: string | null,
): boolean {
  if (isStaticCastWordImageUrl(url)) return true;
  if (isPlaceholderIllustrationUrl(url)) return true;
  return isDisplayableHttpImageUrl(url, word, pos);
}

export function shouldRefreshImageUrl(
  url: string | null | undefined,
  word?: string | null,
  pos?: string | null,
): boolean {
  const trimmed = url?.trim();
  if (word && isCastWordImageWord(word)) {
    const bundled = getStaticCastWordImagePath(word);
    if (bundled && trimmed === bundled) return false;
    if (isStaticCastWordImageUrl(trimmed)) return trimmed !== bundled;
    return true;
  }
  if (word && requiresSafeImageOnly(word)) {
    return !trimmed || trimmed.startsWith("http") || isUnsafeImageUrl(trimmed);
  }
  if (!trimmed) return true;
  if (isPlaceholderIllustrationUrl(trimmed)) return false;
  if (isUnsafeImageUrl(trimmed)) return true;
  if (word && isClosedClassWord(word, pos) && isStockImageUrl(trimmed)) {
    return !isApprovedFunctionWordStockUrl(trimmed, word);
  }
  if (trimmed.startsWith("http") && !isStockImageUrl(trimmed)) return true;
  if (
    trimmed.startsWith("http") &&
    !isDisplayableHttpImageUrl(trimmed, word, pos)
  ) {
    return true;
  }
  if (isStockImageUrl(trimmed)) {
    const { semantic, imgpipe } = getStockUrlMarkers(trimmed);
    if (semantic !== SEMANTIC_IMAGE_VERSION) return true;
    if (
      imgpipe === IMAGE_PIPELINE_ID ||
      imgpipe === RULE_STOCK_PIPELINE_ID
    ) {
      return false;
    }
    return true;
  }
  return (
    isStalePresetFallbackUrl(trimmed) ||
    isUntrustedRandomImageUrl(trimmed) ||
    isOutdatedSemanticImageUrl(trimmed) ||
    isBrokenOpenverseProxyUrl(trimmed)
  );
}

/**
 * Local, word-specific illustration for concepts that stock photos cannot
 * represent reliably (especially prepositions and function words).
 */
export function getDefaultLearningImageDataUrl(
  word = "word",
  pos?: string | null,
): string {
  const normalizedWord =
    word.trim().toLowerCase().replace(/[^a-z0-9'-]/g, "") || "word";
  const safePos = (pos?.trim().toUpperCase() || "VOCABULARY")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const relationGraphic = (() => {
    if (["over", "above"].includes(normalizedWord)) {
      return `<rect x="230" y="205" width="140" height="22" rx="11"/><circle cx="300" cy="125" r="34"/><path d="M300 170v-24m-12 12 12-12 12 12" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if (["under", "below"].includes(normalizedWord)) {
      return `<rect x="230" y="95" width="140" height="22" rx="11"/><circle cx="300" cy="195" r="34"/><path d="M300 145v24m-12-12 12 12 12-12" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if (["in", "inside", "into"].includes(normalizedWord)) {
      return `<rect x="215" y="85" width="170" height="150" rx="20" fill="none" stroke="#fff" stroke-width="12"/><circle cx="300" cy="160" r="38"/>`;
    }
    if (["on", "upon"].includes(normalizedWord)) {
      return `<rect x="215" y="195" width="170" height="24" rx="12"/><circle cx="300" cy="151" r="36"/>`;
    }
    if (["near", "beside", "by", "with"].includes(normalizedWord)) {
      return `<circle cx="245" cy="160" r="42"/><rect x="330" y="118" width="84" height="84" rx="16"/><path d="M292 160h28" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
    }
    if (normalizedWord === "between") {
      return `<rect x="165" y="115" width="80" height="90" rx="16"/><circle cx="300" cy="160" r="36"/><rect x="355" y="115" width="80" height="90" rx="16"/>`;
    }
    if (["through", "across"].includes(normalizedWord)) {
      return `<circle cx="300" cy="160" r="72" fill="none" stroke="#fff" stroke-width="14"/><path d="M175 160h250m-28-24 28 24-28 24" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if (normalizedWord === "too") {
      return `<rect x="175" y="205" width="250" height="14" rx="7" opacity=".6"/><rect x="205" y="165" width="42" height="40" rx="8"/><rect x="279" y="125" width="42" height="80" rx="8"/><rect x="353" y="70" width="42" height="135" rx="8"/><path d="M374 58l18 18m-18-18-18 18" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
    }
    if (["that", "those"].includes(normalizedWord)) {
      return `<circle cx="220" cy="160" r="28"/><path d="M248 152h120m-18-16 18 16-18 16" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><rect x="390" y="130" width="56" height="56" rx="10" opacity=".75"/>`;
    }
    if (["this", "these"].includes(normalizedWord)) {
      return `<circle cx="220" cy="160" r="28"/><path d="M248 160h52" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/><rect x="310" y="130" width="56" height="56" rx="10"/>`;
    }
    if (normalizedWord === "what") {
      return `<circle cx="220" cy="145" r="30"/><path d="M220 178v16m-10 12h20" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M205 132c4-12 30-18 15 0-12 14 10 10 10 24" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
    }
    if (normalizedWord === "and") {
      return `<circle cx="245" cy="160" r="34"/><circle cx="355" cy="160" r="34"/><path d="M279 160h42" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`;
    }
    if (normalizedWord === "of") {
      return `<rect x="250" y="120" width="100" height="80" rx="14"/><circle cx="280" cy="155" r="12"/><circle cx="320" cy="165" r="10"/><path d="M255 205h90" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
    }
    if (pos?.toLowerCase() === "pronoun") {
      return `<circle cx="220" cy="125" r="30" opacity=".55"/><circle cx="300" cy="110" r="38"/><circle cx="380" cy="125" r="30" opacity=".55"/><path d="M170 220c8-50 34-72 50-72s42 22 50 72m-30 0c8-64 38-90 60-90s52 26 60 90m-30 0c8-50 34-72 50-72s42 22 50 72" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".9"/>`;
    }
    if (
      ["conjunction", "determiner", "article"].includes(
        pos?.toLowerCase() ?? "",
      )
    ) {
      return `<rect x="150" y="105" width="125" height="105" rx="18"/><rect x="325" y="105" width="125" height="105" rx="18"/><path d="M275 158h50" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="300" cy="158" r="12" fill="#F97316"/>`;
    }
    return `<circle cx="230" cy="160" r="48"/><circle cx="370" cy="160" r="48" opacity=".65"/><path d="M284 160h66m-18-18 18 18-18 18" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  })();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#60A5FA"/>
        <stop offset="55%" stop-color="#2563EB"/>
        <stop offset="100%" stop-color="#F97316"/>
      </linearGradient>
    </defs>
    <rect width="600" height="350" fill="url(#bg)"/>
    <rect x="24" y="22" width="128" height="30" rx="15" fill="#1D4ED8" opacity=".88"/>
    <text x="88" y="43" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#fff">${safePos}</text>
    <g fill="#ffffff" opacity="0.94">
      ${relationGraphic}
    </g>
  </svg>`;
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/** Never write SVG placeholders to the database. */
export function isPersistableWordImageUrl(
  url: string | null | undefined,
  word?: string | null,
): boolean {
  return isRealCardImageUrl(url, word);
}

/** Prefer a fresh stock photo, then any existing stock, then SVG. */
export function coalesceWordImageUrl(
  candidate: string | null | undefined,
  existing: string | null | undefined,
  word: string,
  pos?: string | null,
): string {
  const functionWord = isClosedClassWord(word, pos);
  if (candidate && isRealCardImageUrl(candidate, word)) return candidate;
  if (functionWord) {
    return getDefaultLearningImageDataUrl(word, pos);
  }
  if (existing && isRealCardImageUrl(existing, word)) return existing;
  if (existing && isLegacyDisplayableStockUrl(existing, word)) return existing;
  return getDefaultLearningImageDataUrl(word, pos);
}

/** Safe legacy stock URLs — show while a pipeline refresh is in flight. */
function isLegacyDisplayableStockUrl(
  url: string | null | undefined,
  word?: string | null,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("https://")) return false;
  if (isUnsafeImageUrl(trimmed)) return false;
  if (word && requiresSafeImageOnly(word)) return false;
  if (isStalePresetFallbackUrl(trimmed)) return false;
  if (isUntrustedRandomImageUrl(trimmed)) return false;
  if (isBrokenOpenverseProxyUrl(trimmed)) return false;
  if (isPlaceholderIllustrationUrl(trimmed)) return false;
  return isStockImageUrl(trimmed);
}

export function resolveWordImageUrl(
  word: string,
  imageUrl?: string | null,
  searchKeyword?: string | null,
  pos?: string | null,
): string {
  if (requiresSafeImageOnly(word)) {
    return getDefaultLearningImageDataUrl(word, pos);
  }
  if (isCastWordImageWord(word)) {
    return (
      getStaticCastWordImagePath(word) ??
      getDefaultLearningImageDataUrl(word, pos)
    );
  }
  if (isClosedClassWord(word, pos)) {
    const trimmed = imageUrl?.trim();
    if (trimmed && isApprovedFunctionWordStockUrl(trimmed, word)) {
      return trimmed;
    }
    return getDefaultLearningImageDataUrl(word, pos);
  }
  const trimmed = imageUrl?.trim();
  if (isStaticCastWordImageUrl(trimmed)) return trimmed!;
  if (isLegacyMascotPipelineUrl(trimmed)) {
    const bundled = getStaticCastWordImagePath(word);
    if (bundled) return bundled;
  }
  if (isDisplayableHttpImageUrl(trimmed, word, pos)) {
    return trimmed!;
  }
  if (isLegacyDisplayableStockUrl(trimmed, word)) {
    return trimmed!;
  }
  return getDefaultLearningImageDataUrl(word, pos);
}

/** Pick the URL to show/store — never resurrect stale function-word stock. */
export function finalizeWordImageDisplayUrl(
  candidate: string | null | undefined,
  stored: string | null | undefined,
  word: string,
  pos?: string | null,
): string {
  const resolved = candidate?.trim() ?? "";
  const existing = stored?.trim() ?? "";

  if (isCastWordImageWord(word)) {
    if (resolved && isStaticCastWordImageUrl(resolved)) return resolved;
    const bundled = getStaticCastWordImagePath(word);
    if (bundled) return bundled;
  }

  if (isClosedClassWord(word, pos)) {
    if (resolved && isApprovedFunctionWordStockUrl(resolved, word)) {
      return resolved;
    }
    return getDefaultLearningImageDataUrl(word, pos);
  }

  if (resolved && isRealCardImageUrl(resolved, word)) return resolved;
  if (resolved && isPlaceholderIllustrationUrl(resolved)) return resolved;
  if (
    existing &&
    isRealCardImageUrl(existing, word) &&
    !shouldRefreshImageUrl(existing, word, pos)
  ) {
    return existing;
  }
  if (resolved) return resolved;
  return getDefaultLearningImageDataUrl(word, pos);
}

type PexelsSearchResponse = {
  photos?: Array<{
    alt?: string | null;
    photographer?: string | null;
    src?: { medium?: string; large?: string; landscape?: string };
  }>;
};

async function searchPexelsPhotos(
  query: string,
): Promise<Array<{ url: string; alt: string }>> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return [];

  const params = new URLSearchParams({
    query,
    per_page: "8",
    orientation: "landscape",
  });

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: apiKey },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = (await response.json()) as PexelsSearchResponse;
    return (data.photos ?? [])
      .map((photo) => ({
        url: pickDisplayableMediaUrl(photo.src?.medium) ??
          pickDisplayableMediaUrl(photo.src?.landscape) ??
          pickDisplayableMediaUrl(photo.src?.large) ??
          "",
        alt: photo.alt ?? query,
      }))
      .filter((photo) => photo.url);
  } catch {
    return [];
  }
}

function isWeakStockQuery(query: string): boolean {
  const cleaned = cleanPhrase(query);
  if (!cleaned) return true;
  return (
    cleaned.endsWith(" everyday scene") ||
    cleaned.endsWith(" object") ||
    cleaned.includes(" action everyday") ||
    cleaned.endsWith(" mood visual scene") ||
    cleaned.split(/\s+/).filter(Boolean).length < 2
  );
}

function isConcreteMeaningQuery(query: string): boolean {
  return semanticTokens(query).size >= 2;
}

/** Last resort for concrete meaning queries when metadata scoring finds no match. */
function pickHashedSafeStockPhoto(
  word: string,
  photos: Array<{ url: string; alt: string; extra?: string }>,
  query: string,
): string | null {
  if (isWeakStockQuery(query) || !isConcreteMeaningQuery(query)) return null;

  const safe: string[] = [];
  for (const photo of photos) {
    if (isUnsafeImageMetadata(photo.alt, photo.extra, query)) continue;
    if (!photo.url || isUnsafeImageUrl(photo.url)) continue;
    const versioned = markSemanticImageUrl(photo.url);
    if (!versioned || !isSelectableStockPhotoUrl(versioned, word)) continue;
    safe.push(versioned);
  }
  if (safe.length === 0) return null;
  return safe[hashWord(word) % safe.length]!;
}

async function pickScoredStockPhoto(
  word: string,
  query: string,
  photos: Array<{ url: string; alt: string; extra?: string }>,
  pos?: string | null,
): Promise<string | null> {
  const plan = resolveWordImagePlan(word, pos);
  const minScore = plan.minMetadataScore;
  const candidates: Array<{ url: string; score: number }> = [];
  for (const photo of photos) {
    if (isUnsafeImageMetadata(photo.alt, photo.extra, query)) continue;
    if (!photo.url || isUnsafeImageUrl(photo.url)) continue;
    const score = scoreImageMetadata(word, query, photo.alt);
    if (score <= minScore) continue;
    const versioned = tagStockPhotoUrl(photo.url, word, pos);
    if (!versioned || !isSelectableStockPhotoUrl(versioned, word)) continue;
    candidates.push({ url: versioned, score });
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    const topScore = candidates[0]!.score;
    const topTier = candidates.filter((candidate) => candidate.score >= topScore);
    const idx = hashWord(word) % topTier.length;
    return topTier[idx]!.url;
  }
  if (plan.skipHashFallback) return null;
  return pickHashedSafeStockPhoto(word, photos, query);
}

async function pickUnsplashFromQueries(
  word: string,
  queries: string[],
  pos?: string | null,
): Promise<string | null> {
  if (!process.env.UNSPLASH_ACCESS_KEY?.trim()) return null;

  for (const query of queries) {
    try {
      const photos = await searchPhotos(query, 8);
      const mapped = photos.map((photo) => ({
        url: photo.url,
        alt: photo.alt,
        extra: photo.photographer,
      }));
      const url = await pickScoredStockPhoto(word, query, mapped, pos);
      if (url) return url;
    } catch (error) {
      console.warn(`Unsplash search skipped for "${query}":`, error);
    }
  }
  return null;
}

async function pickPexelsFromQueries(
  word: string,
  queries: string[],
  pos?: string | null,
): Promise<string | null> {
  if (!process.env.PEXELS_API_KEY?.trim()) return null;

  for (const query of queries) {
    try {
      const photos = await searchPexelsPhotos(query);
      const url = await pickScoredStockPhoto(word, query, photos, pos);
      if (url) return url;
    } catch (error) {
      console.warn(`Pexels search skipped for "${query}":`, error);
    }
  }
  return null;
}

/** Search Pexels for one query and return the best scored photo. */
export async function fetchPexelsImageForQuery(
  word: string,
  query: string,
): Promise<string | null> {
  if (!process.env.PEXELS_API_KEY?.trim()) return null;

  const trimmed = query.trim();
  if (!trimmed) return null;

  const photos = await searchPexelsPhotos(trimmed);
  return pickScoredStockPhoto(word, trimmed, photos);
}

/** Try Unsplash then Pexels for one stock search phrase. */
export async function fetchStockImageForQuery(
  word: string,
  query: string,
): Promise<string | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const unsplashUrl = await fetchUnsplashImageForQuery(word, trimmed);
  if (unsplashUrl) return unsplashUrl;

  return fetchPexelsImageForQuery(word, trimmed);
}

/** Search Unsplash for one Gemini/rule-based query and return the best scored photo. */
export async function fetchUnsplashImageForQuery(
  word: string,
  query: string,
): Promise<string | null> {
  if (!process.env.UNSPLASH_ACCESS_KEY?.trim()) return null;

  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    const photos = await searchPhotos(trimmed, 8);
    const mapped = photos.map((photo) => ({
      url: photo.url,
      alt: photo.alt,
      extra: photo.photographer,
    }));
    return pickScoredStockPhoto(word, trimmed, mapped);
  } catch (error) {
    console.warn(
      `Unsplash search failed for "${trimmed}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export async function searchPhotos(
  query: string,
  perPage = 1,
): Promise<UnsplashPhoto[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is not set");
  }

  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
    orientation: "landscape",
    content_filter: "high",
  });

  const response = await fetch(
    `https://api.unsplash.com/search/photos?${params}`,
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  const data = (await response.json()) as UnsplashSearchResponse;

  return data.results.map((photo) => ({
    id: photo.id,
    url: photo.urls.regular,
    alt: photo.alt_description ?? query,
    photographer: photo.user.name,
  }));
}

function stemSemanticToken(token: string): string {
  if (token.endsWith("ing") && token.length > 5) {
    let stem = token.slice(0, -3);
    if (stem.at(-1) === stem.at(-2)) stem = stem.slice(0, -1);
    if (stem === "mak" || stem === "tak") stem += "e";
    return stem;
  }
  if (token.endsWith("ies") && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }
  if (
    token.endsWith("es") &&
    token.length > 4 &&
    /(?:ch|sh|ss|x|z|o)es$/.test(token)
  ) {
    return token.slice(0, -2);
  }
  if (token.endsWith("s") && token.length > 3 && !token.endsWith("ss")) {
    return token.slice(0, -1);
  }
  return token;
}

function semanticTokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((token) => !GENERIC_QUERY_TOKENS.has(token))
      .map(stemSemanticToken)
      .filter((token) => token.length > 2 && !GENERIC_QUERY_TOKENS.has(token)),
  );
}

function overlapCount(left: Set<string>, right: Set<string>): number {
  let count = 0;
  for (const token of left) {
    if (right.has(token)) count += 1;
  }
  return count;
}

function queryCoversWord(wordTokens: Set<string>, queryTokens: Set<string>): boolean {
  return overlapCount(wordTokens, queryTokens) > 0;
}

function queryOverlapScore(
  queryTokens: Set<string>,
  metaTokens: Set<string>,
  queryMatches: number,
): number {
  if (queryMatches === 0) return 0;
  const requiredMatches = queryTokens.size > 1 ? 2 : 1;
  if (queryMatches < requiredMatches) {
    const focus = [...queryTokens].at(-1);
    if (!focus || focus.length < 4 || !metaTokens.has(focus)) return 0;
  }
  return queryMatches * 2;
}

/** >0 only when photo metadata actually mentions the word or the search phrase. */
export function scoreImageMetadata(
  word: string,
  query: string,
  metadata: string,
): number {
  const wordTokens = semanticTokens(word);
  const queryTokens = semanticTokens(query);
  const metaTokens = semanticTokens(metadata);
  if (metaTokens.size === 0) return 0;

  const wordMatches = overlapCount(wordTokens, metaTokens);
  const queryMatches = overlapCount(queryTokens, metaTokens);
  if (wordMatches === 0 && queryMatches === 0) return 0;

  // Scene queries ("thumbs up" for "good") must match the scene, not the
  // English word — otherwise book titles / homonyms win (Why, water well).
  if (!queryCoversWord(wordTokens, queryTokens)) {
    if (isUngroundedSingleTokenQuery(wordTokens, queryTokens)) return 0;
    return queryOverlapScore(queryTokens, metaTokens, queryMatches);
  }

  if (isUngroundedSingleTokenQuery(wordTokens, queryTokens) && wordMatches === 0) {
    return 0;
  }

  const requiredMatches = queryTokens.size > 1 ? 2 : 1;
  if (queryMatches < requiredMatches && wordMatches === 0) {
    const focus = [...queryTokens].at(-1);
    if (!focus || focus.length < 4 || !metaTokens.has(focus)) return 0;
  }
  return wordMatches * 5 + queryMatches * 2;
}

/**
 * A multi-word query phrase like "brown everyday scene" or "person
 * shivering" collapses to a single meaningful token once generic words
 * ("everyday", "scene", "person") are filtered out — "brown" and "shiver"
 * respectively. That lone token is safe to match on its own only when it
 * *is* the vocabulary word itself ("brown" for the word "brown"): then a
 * title match is exactly a literal-word match, which is always trustworthy.
 * When the lone token is an unrelated proxy for an abstract word ("shiver"
 * for "rather"), a single coincidental match (e.g. a product named
 * "Shiver") is not enough evidence — that case must additionally require
 * the literal word to appear in the metadata, which it never will for a
 * generated proxy phrase, correctly failing this query variant closed so
 * the caller tries a more specific fallback instead.
 */
function isUngroundedSingleTokenQuery(
  wordTokens: Set<string>,
  queryTokens: Set<string>,
): boolean {
  return queryTokens.size === 1 && overlapCount(wordTokens, queryTokens) === 0;
}

export function markSemanticImageUrl(url: string): string | null {
  try {
    const versionedUrl = new URL(url);
    versionedUrl.searchParams.set("semantic", SEMANTIC_IMAGE_VERSION);
    versionedUrl.searchParams.delete("imgpipe");
    return versionedUrl.toString();
  } catch {
    return null;
  }
}

/** Tag URLs from scored rule-based keyword queries (not Gemini). */
export function markRuleStockImageUrl(url: string): string | null {
  try {
    const versionedUrl = new URL(url);
    versionedUrl.searchParams.set("semantic", SEMANTIC_IMAGE_VERSION);
    versionedUrl.searchParams.set("imgpipe", RULE_STOCK_PIPELINE_ID);
    return versionedUrl.toString();
  } catch {
    return null;
  }
}

/** Tag URLs produced only by the Gemini→Unsplash vocabulary pipeline. */
export function markGeminiPipelineImageUrl(url: string): string | null {
  try {
    const versionedUrl = new URL(url);
    versionedUrl.searchParams.set("semantic", SEMANTIC_IMAGE_VERSION);
    versionedUrl.searchParams.set("imgpipe", IMAGE_PIPELINE_ID);
    return versionedUrl.toString();
  } catch {
    return null;
  }
}

export type { WordImageFetchResult, WordImageResult } from "@/lib/word-image-result";

async function tryGeminiVocabImage(
  word: string,
  pos: string | null | undefined,
  meaning: string,
): Promise<{ imageUrl: string; searchPhrase: string } | null> {
  if (!meaning.trim()) return null;
  try {
    const { fetchVocabIllustrationImage } = await import(
      "@/lib/gemini-unsplash-image"
    );
    const result = await fetchVocabIllustrationImage({
      word,
      partOfSpeech: pos?.trim() || "noun",
      meaning,
    });
    if (result.source !== "gemini-stock") return null;
    return {
      imageUrl: result.imageUrl,
      searchPhrase: result.searchPhrase ?? word,
    };
  } catch (error) {
    console.warn(
      `[fetchWordImageUrl] Gemini pipeline skipped for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Primary stock resolver — routes by word tier (see word-image-strategy.ts).
 *
 * Function words: curated scene → strict stock → SVG (Gemini skipped).
 * Concrete words: Gemini → curated → stock → SVG.
 */
function finalizePipelineResult(
  word: string,
  pos: string | null | undefined,
  url: string,
  source: string,
  searchKeyword?: string | null,
  pipelineFailed = false,
): WordImageResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return errWordImageResult(
      getDefaultLearningImageDataUrl(word, pos),
      WORD_IMAGE_SOURCES.ERROR,
      searchKeyword,
    );
  }
  if (pipelineFailed && isPlaceholderIllustrationUrl(trimmed)) {
    return errWordImageResult(trimmed, source, searchKeyword);
  }
  return okWordImageResult(trimmed, source, searchKeyword);
}

export async function fetchWordImageUrlDetailed(
  word: string,
  searchKeyword?: string | null,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
  existingImageUrl?: string | null,
): Promise<WordImageFetchResult> {
  const plan = resolveWordImagePlan(word, pos);
  const keywordOut = searchKeyword?.trim() || null;

  if (plan.tier === "safe-svg") {
    return okWordImageResult(
      getDefaultLearningImageDataUrl(word, pos),
      WORD_IMAGE_SOURCES.SVG_PLACEHOLDER,
    );
  }

  if (isCastWordImageWord(word)) {
    const bundled = getStaticCastWordImagePath(word);
    if (bundled) {
      return okWordImageResult(
        bundled,
        WORD_IMAGE_SOURCES.MASCOT_ILLUSTRATION,
        keywordOut,
      );
    }
  }

  const options = { searchKeyword, pos, meaning, englishDefinition };
  const geminiContext =
    meaning?.trim() || englishDefinition?.trim() || "";

  if (geminiContext && !plan.skipGemini) {
    try {
      const pipeline = await tryGeminiVocabImage(word, pos, geminiContext);
      if (pipeline) {
        return okWordImageResult(
          pipeline.imageUrl,
          WORD_IMAGE_SOURCES.GEMINI_STOCK,
          pipeline.searchPhrase,
        );
      }
    } catch (error) {
      console.warn(
        `[fetchWordImageUrl] Gemini step failed for "${word}":`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  let queries: string[] = [];
  try {
    queries = buildImageSearchQueries(word, options);
  } catch (error) {
    console.warn(
      `[fetchWordImageUrl] Query build failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
  }

  if (queries.length === 0) {
    const coalesced = coalesceWordImageUrl(
      null,
      existingImageUrl,
      word,
      pos,
    );
    const source = isPlaceholderIllustrationUrl(coalesced)
      ? WORD_IMAGE_SOURCES.SVG_PLACEHOLDER
      : WORD_IMAGE_SOURCES.COALESCE;
    return finalizePipelineResult(
      word,
      pos,
      coalesced,
      source,
      keywordOut,
      source === WORD_IMAGE_SOURCES.SVG_PLACEHOLDER,
    );
  }

  try {
    const unsplashUrl = await pickUnsplashFromQueries(word, queries, pos);
    if (unsplashUrl) {
      return okWordImageResult(
        unsplashUrl,
        WORD_IMAGE_SOURCES.UNSPLASH,
        keywordOut || queries[0] || null,
      );
    }
  } catch (error) {
    console.warn(
      `[fetchWordImageUrl] Unsplash pipeline failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
  }

  try {
    const pexelsUrl = await pickPexelsFromQueries(word, queries, pos);
    if (pexelsUrl) {
      return okWordImageResult(
        pexelsUrl,
        WORD_IMAGE_SOURCES.PEXELS,
        keywordOut || queries[0] || null,
      );
    }
  } catch (error) {
    console.warn(
      `[fetchWordImageUrl] Pexels pipeline failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
  }

  const coalesced = coalesceWordImageUrl(
    null,
    existingImageUrl,
    word,
    pos,
  );
  const source = isPlaceholderIllustrationUrl(coalesced)
    ? WORD_IMAGE_SOURCES.SVG_PLACEHOLDER
    : WORD_IMAGE_SOURCES.COALESCE;
  return finalizePipelineResult(
    word,
    pos,
    coalesced,
    source,
    keywordOut,
    source === WORD_IMAGE_SOURCES.SVG_PLACEHOLDER,
  );
}

/** @see fetchWordImageUrlDetailed */
export async function fetchWordImageUrl(
  word: string,
  searchKeyword?: string | null,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
  existingImageUrl?: string | null,
): Promise<string> {
  const result = await fetchWordImageUrlDetailed(
    word,
    searchKeyword,
    pos,
    meaning,
    englishDefinition,
    existingImageUrl,
  );
  return result.url;
}
