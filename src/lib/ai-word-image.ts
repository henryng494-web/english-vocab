/**
 * Trial: AI photos for a few grammar words that stock search cannot depict.
 *
 * Gemini image models on this project's API key currently report quota 0
 * (free tier). The four trial JPEGs in /public/word-images were generated
 * with a Flux image model so the cards can be reviewed. When Gemini image
 * quota is available, set GEMINI_IMAGE_MODEL and the generator will run
 * once per word and can replace these files.
 */

export const AI_IMAGE_TRIAL_WORDS: ReadonlySet<string> = new Set([
  "too",
  "then",
  "way",
  "more",
]);

const STYLE =
  "Photorealistic photograph, 16:9 landscape, natural lighting, sharp focus. No text, no letters, no watermark, no logo, no collage grid.";

export const AI_IMAGE_PROMPTS: Readonly<Record<string, string>> = {
  too: `${STYLE} A white coffee cup overflowing, hot coffee spilling over the rim onto the saucer — too full to drink. Cafe table.`,
  then: `${STYLE} Sequence in one scene: a finished breakfast plate in the foreground, and beyond it an open front door with a work bag — eat first, then leave for work.`,
  way: `${STYLE} A clear paved path leading to a small train station building. The way to the station, daylight.`,
  more: `${STYLE} A hand pouring more coffee from a glass carafe into a mug that already has coffee. Adding more.`,
};

const STATIC_PATH_RE = /^\/word-images\/[a-z]+\.jpg$/;

export function isAiImageTrialWord(word: string): boolean {
  return AI_IMAGE_TRIAL_WORDS.has(word.trim().toLowerCase());
}

export function getStaticAiWordImagePath(word: string): string | null {
  const key = word.trim().toLowerCase();
  if (!AI_IMAGE_TRIAL_WORDS.has(key)) return null;
  return `/word-images/${key}.jpg`;
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
