/**
 * Trial: the coach-fox mascot acting out a few grammar words that stock
 * photos cannot depict clearly (too / then / way / more).
 *
 * Bundled JPEGs live in /public/word-images. Concrete nouns still use photos.
 * Gemini live image gen is off unless GEMINI_IMAGE_LIVE=true.
 */

export const AI_IMAGE_TRIAL_WORDS: ReadonlySet<string> = new Set([
  "too",
  "then",
  "way",
  "more",
]);

const FOX =
  "The app's navy-black chibi fox mascot: huge round head, tiny body, pointed ears, teal collar with a small bell. Flat children's-book illustration, 16:9, cream/teal palette. No text, no letters, no watermark.";

export const AI_IMAGE_PROMPTS: Readonly<Record<string, string>> = {
  too: `${FOX} Thinking pose (paw on chin). A white mug on a wooden table is too full — coffee overflowing down the side into a puddle.`,
  then: `${FOX} Seen from behind in an open doorway, about to walk outside. Behind it, a table with an empty plate (crumbs only) and empty mug — breakfast is finished, then leave.`,
  way: `${FOX} Happy squint eyes, sitting at the start of a beige path that leads to a small white house with a teal roof. Green fields, blue sky. The way home.`,
  more: `${FOX} Excited pose. A teal jar pours more chocolate-chip cookies onto a plate that already has cookies.`,
};

const STATIC_PATH_RE = /^\/word-images\/[a-z]+\.jpg(?:\?v=[\w-]+)?$/;

export function isAiImageTrialWord(word: string): boolean {
  return AI_IMAGE_TRIAL_WORDS.has(word.trim().toLowerCase());
}

export function getStaticAiWordImagePath(word: string): string | null {
  const key = word.trim().toLowerCase();
  if (!AI_IMAGE_TRIAL_WORDS.has(key)) return null;
  return `/word-images/${key}.jpg?v=fox1`;
}

export function isStaticAiWordImageUrl(url: string | null | undefined): boolean {
  return STATIC_PATH_RE.test(url?.trim() ?? "");
}

export function isAiImageDataUrl(url: string | null | undefined): boolean {
  return /^data:image\/(?:jpeg|jpg|png|webp);base64,/i.test(url?.trim() ?? "");
}

function extractInlineImage(
  payload: unknown,
): { mime: string; data: string } | null {
  const candidates =
    (payload as { candidates?: Array<{ content?: { parts?: unknown[] } }> })
      .candidates ?? [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts ?? [];
    for (const part of parts) {
      const raw = part as Record<string, { mimeType?: string; mime_type?: string; data?: string } | undefined>;
      const inline = raw.inlineData ?? raw.inline_data;
      const mime = inline?.mimeType ?? inline?.mime_type;
      const data = inline?.data;
      if (mime && data) return { mime, data };
    }
  }
  return null;
}

/** Returns a data URL, or null if Gemini image quota/models are unavailable. */
export async function generateAiWordImageDataUrl(
  word: string,
): Promise<string | null> {
  const key = word.trim().toLowerCase();
  const prompt = AI_IMAGE_PROMPTS[key];
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!prompt || !apiKey) return null;

  const models = [
    process.env.GEMINI_IMAGE_MODEL?.trim(),
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-lite-image",
  ].filter((name): name is string => Boolean(name));

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
          }),
        },
      );
      if (!response.ok) {
        console.warn(
          `Gemini image ${model} skipped for "${key}": ${response.status}`,
        );
        continue;
      }
      const inline = extractInlineImage(await response.json());
      if (!inline) continue;
      return `data:${inline.mime};base64,${inline.data}`;
    } catch (error) {
      console.warn(`Gemini image ${model} failed for "${key}":`, error);
    }
  }
  return null;
}
