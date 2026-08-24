/**
 * One-off: generate bundled fox word images via Pollinations (legacy endpoint).
 * Usage: node scripts/generate-pollinations-images.mjs [word ...]
 * Default: the 10 pollinations trial words in ai-word-image.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/word-images");

const FOX =
  "The app's navy-black chibi fox mascot: huge round head, tiny body, pointed ears, teal collar with a small bell. Flat children's-book illustration, 16:9, cream/teal palette. No text, no letters, no watermark.";

const PROMPTS = {
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

const DEFAULT_WORDS = Object.keys(PROMPTS);
const DELAY_MS = 16_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPollinationsImage(prompt, seed) {
  const apiKey = process.env.POLLINATIONS_API_KEY?.trim();
  const encoded = encodeURIComponent(prompt);

  const urls = apiKey
    ? [
        `https://gen.pollinations.ai/image/${encoded}?model=flux&width=1280&height=720&seed=${seed}`,
      ]
    : [
        `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=1280&height=720&seed=${seed}`,
      ];

  let lastError;
  for (const url of urls) {
    try {
      const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(120_000) });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
      }
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/")) {
        const body = await res.text();
        throw new Error(`Not an image (${type}): ${body.slice(0, 200)}`);
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function main() {
  const words = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_WORDS;
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`Generating ${words.length} images via Pollinations…`);
  if (!process.env.POLLINATIONS_API_KEY?.trim()) {
    console.log("(no POLLINATIONS_API_KEY — using legacy image.pollinations.ai)");
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();
    const prompt = PROMPTS[word];
    if (!prompt) {
      console.warn(`Skip "${word}": no prompt`);
      continue;
    }
    if (i > 0) {
      console.log(`Waiting ${DELAY_MS / 1000}s (rate limit)…`);
      await sleep(DELAY_MS);
    }
    const seed = 9000 + i;
    console.log(`[${i + 1}/${words.length}] ${word} (seed ${seed})…`);
    const buf = await fetchPollinationsImage(prompt, seed);
    const out = path.join(OUT_DIR, `${word}.jpg`);
    await writeFile(out, buf);
    console.log(`  → ${out} (${buf.length} bytes)`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
