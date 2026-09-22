import {
  DISCOVER_WORD_CACHE_VERSION,
  purgeLegacyDiscoverWordCaches,
} from "@/lib/discover-word-cache";

const CHUNK_CACHE_KEYS = [
  "learning-chunk-vi-cache-v3",
  "learning-chunk-supplement-cache-v1",
];

/** Drop all session word content so the next fetch matches `userLanguage`. */
export function clearAllWordContentCaches(): void {
  if (typeof window === "undefined") return;

  try {
    purgeLegacyDiscoverWordCaches();
    sessionStorage.removeItem(
      `discover-word-cache-v${DISCOVER_WORD_CACHE_VERSION}`,
    );
    for (const key of CHUNK_CACHE_KEYS) {
      sessionStorage.removeItem(key);
    }
    for (let v = 100; v <= DISCOVER_WORD_CACHE_VERSION; v++) {
      sessionStorage.removeItem(`discover-word-cache-v${v}`);
    }
  } catch {
    /* private mode */
  }

  window.dispatchEvent(new CustomEvent("word-content-cache-cleared"));
}
