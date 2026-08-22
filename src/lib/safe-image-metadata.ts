/**
 * Block NSFW / suggestive stock-photo metadata before it reaches learners.
 * Openverse `mature=false` and Unsplash content_filter are not sufficient alone.
 */

const NSFW_METADATA_PATTERN =
  /\b(?:nsfw|porn(?:o|ography|ographic)?|xxx|nude|nudes|naked|topless|bottomless|nipple|nipples|breast(?:s)?|areola|genital|penis|vagina|erotic|erotica|sexual(?:ly)?|sex(?:y|uality)?|stripper|striptease|stripping|lingerie|fetish|bdsm|hentai|orgasm|masturbat|boob(?:s)?|tits?\b|busty|busts?\b|cleavage|boudoir|sensual|seductive|glamour\s*model|playboy|onlyfans|fansly|milena|velba|thong|bikini\s*model|adult\s*(?:content|model|site)|explicit|camgirl|chaturbate)\b/i;

/** Suggestive phrases that slip past `mature=false` on image APIs. */
const SUGGESTIVE_PHRASE_PATTERN =
  /\b(?:prove\s+(?:he|she)\s+can\s+still\s+do\s+it|asks?\s+(?:him|her)\s+to\s+prove|show(?:ing)?\s+(?:her|his)\s+(?:breasts?|boobs?|tits?)|flash(?:ing)?\s+(?:her|his)|lift(?:ing)?\s+(?:her|his)\s+shirt)\b/i;

/** "Chicken breast" food photos are fine; anatomical "breast" is not. */
const FOOD_BREAST_PATTERN =
  /\b(?:chicken|turkey|duck|quail|roasted|grilled|baked|fried)\s+breasts?\b/i;

const ADULT_HOST_PATTERN =
  /(?:^|\.)(?:milena-velba\.de|onlyfans\.com|fansly\.com|pornhub\.com|xvideos\.com|xhamster\.com|xnxx\.com|redtube\.com|youporn\.com|spankbang\.com|chaturbate\.com|manyvids\.com|brazzers\.com|pornpics\.com|imagefap\.com|pornhat\.com)$/i;

const ADULT_URL_HINT_PATTERN =
  /milena-?velba|onlyfans|pornhub|xvideos|xhamster|chaturbate|fansly|manyvids|hentai|nsfw|xxx[-_]|\/porn/i;

function scrubFoodBreast(text: string): string {
  return text.replace(FOOD_BREAST_PATTERN, " ");
}

export function isUnsafeImageMetadata(
  ...parts: Array<string | null | undefined>
): boolean {
  const text = parts
    .filter(Boolean)
    .join(" ")
    .trim();
  if (!text) return false;
  if (SUGGESTIVE_PHRASE_PATTERN.test(text)) return true;
  const scrubbed = scrubFoodBreast(text);
  return NSFW_METADATA_PATTERN.test(scrubbed);
}

/** Adult site hosts and URL hints — including stored DB rows from old fetches. */
export function isUnsafeImageUrl(url: string | null | undefined): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (ADULT_HOST_PATTERN.test(parsed.hostname.toLowerCase())) return true;
    if (ADULT_URL_HINT_PATTERN.test(trimmed)) return true;
  } catch {
    return ADULT_URL_HINT_PATTERN.test(trimmed);
  }
  return false;
}

/** Wikipedia/Wikimedia anatomy pages for these words are usually nude diagrams. */
export function shouldSkipEncyclopediaImage(word: string): boolean {
  return isUnsafeImageMetadata(word);
}
