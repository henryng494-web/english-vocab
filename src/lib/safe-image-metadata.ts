/**
 * Block NSFW / suggestive stock-photo metadata before it reaches learners.
 * Openverse `mature=false` and Unsplash content_filter are not sufficient alone.
 */

const NSFW_METADATA_PATTERN =
  /\b(?:nsfw|porn(?:o|ography|ographic)?|xxx|nude|nudes|naked|topless|bottomless|nipple|nipples|breast(?:s)?|genital|penis|vagina|erotic|erotica|sexual(?:ly)?|sex(?:y|uality)?|stripper|striptease|stripping|lingerie|fetish|bdsm|hentai|orgasm|masturbat|boob(?:s)?|tits?\b|playboy|onlyfans|thong|bikini\s*model|adult\s*content|explicit)\b/i;

/** Suggestive phrases that slip past `mature=false` on image APIs. */
const SUGGESTIVE_PHRASE_PATTERN =
  /\b(?:prove\s+(?:he|she)\s+can\s+still\s+do\s+it|asks?\s+(?:him|her)\s+to\s+prove|show(?:ing)?\s+(?:her|his)\s+(?:breasts?|boobs?|tits?)|flash(?:ing)?\s+(?:her|his)|lift(?:ing)?\s+(?:her|his)\s+shirt)\b/i;

export function isUnsafeImageMetadata(...parts: Array<string | null | undefined>): boolean {
  const text = parts
    .filter(Boolean)
    .join(" ")
    .trim();
  if (!text) return false;
  return (
    NSFW_METADATA_PATTERN.test(text) || SUGGESTIVE_PHRASE_PATTERN.test(text)
  );
}
