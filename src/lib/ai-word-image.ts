/**
 * Trial: the coach-fox mascot acting out words across POS.
 * Bundled JPEGs in /public/word-images (Cursor GenerateImage).
 * Live Gemini gen is off unless GEMINI_IMAGE_LIVE=true.
 */

export const AI_IMAGE_TRIAL_WORDS: ReadonlySet<string> = new Set([
  "too",
  "then",
  "way",
  "more",
  "apple",
  "book",
  "eat",
  "run",
  "big",
  "hot",
  "vital",
  "water",
  "sleep",
  "cold",
  "small",
  "walk",
  "happy",
  "dog",
  "rain",
  "help",
]);

const FOX =
  "The app's navy-black chibi fox mascot: huge round head, tiny body, pointed ears, teal collar with a small bell. Flat children's-book illustration, 16:9, cream/teal palette. No text, no letters, no watermark.";

export const AI_IMAGE_PROMPTS: Readonly<Record<string, string>> = {
  too: `${FOX} Thinking pose (paw on chin). A white mug on a wooden table is too full — coffee overflowing down the side into a puddle.`,
  then: `${FOX} Seen from behind in an open doorway, about to walk outside. Behind it, a table with an empty plate (crumbs only) and empty mug — breakfast is finished, then leave.`,
  way: `${FOX} Happy squint eyes, sitting at the start of a beige path that leads to a small white house with a teal roof. Green fields, blue sky. The way home.`,
  more: `${FOX} Excited pose. A teal jar pours more chocolate-chip cookies onto a plate that already has cookies.`,
  apple: `${FOX} Happy squint eyes. Holds a large bright red apple with a leaf in both paws. Wooden table, cream background.`,
  book: `${FOX} Thinking pose. Sits at a desk reading a thick open book (pages show a simple landscape, no letters).`,
  eat: `${FOX} Happy squint eyes. Taking a bite from a round cookie, crumbs in the air. Wooden table.`,
  run: `${FOX} Excited pose, running on a beige path through green fields, motion dashes behind the legs.`,
  big: `${FOX} Tiny fox looking up in wonder at a giant teal gift box as tall as a house. Green grass, blue sky.`,
  hot: `${FOX} Leaning away from a white mug with thick rising steam, paw shielding its face. The drink is hot. Wooden table.`,
  vital: `${FOX} Serious caring pose. Points with one paw at a glowing teal heart above a glass of water and a small green plant — all essential for life.`,
  water: `${FOX} Happy squint eyes. Holds a clear glass of water in both paws on a wooden table. Simple cream background.`,
  sleep: `${FOX} Peaceful closed eyes, curled up on a soft teal blanket with tiny Zzz bubbles floating above.`,
  cold: `${FOX} Shivering slightly, wrapped in a thick teal scarf. Light snowflakes falling, pale blue winter background.`,
  small: `${FOX} Kneeling beside a tiny teal flower in grass, looking at it with gentle wonder. Blue sky.`,
  walk: `${FOX} Calm happy pose, walking along a beige path through green fields toward a distant white house.`,
  happy: `${FOX} Jumping with joy, arms spread, big squint smile. Confetti-like teal dots in the air. Sunny cream background.`,
  dog: `${FOX} Friendly pose, gently patting a happy golden retriever puppy. Green grass, warm sunny day.`,
  rain: `${FOX} Holding a teal umbrella in light rain, one paw catching a raindrop. Soft gray-blue sky.`,
  help: `${FOX} Kind expression, helping a tiny teal bird back into a small nest on a tree branch.`,
};

const STATIC_PATH_RE = /^\/word-images\/[a-z]+\.jpg(?:\?v=[\w-]+)?$/;
const BUNDLE_VERSION = "fox3";

export function isAiImageTrialWord(word: string): boolean {
  return AI_IMAGE_TRIAL_WORDS.has(word.trim().toLowerCase());
}

export function getStaticAiWordImagePath(word: string): string | null {
  const key = word.trim().toLowerCase();
  if (!AI_IMAGE_TRIAL_WORDS.has(key)) return null;
  return `/word-images/${key}.jpg?v=${BUNDLE_VERSION}`;
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
