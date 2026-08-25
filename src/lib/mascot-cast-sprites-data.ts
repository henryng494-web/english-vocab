import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MascotCharacter } from "@/lib/mascot-cast";

/** Cached transparent sprite data URLs (server-only). */
let cachedSpriteDataUrls: Readonly<Record<MascotCharacter, string>> | null =
  null;

const SPRITE_FILES: Record<MascotCharacter, string> = {
  cat: "cat.png",
  cow: "cow.png",
  dog: "dog.png",
  pig: "pig.png",
};

/** Individual cast PNGs with transparent backgrounds — safe inside `<img>` SVG. */
export function getMascotSpriteDataUrls(): Readonly<
  Record<MascotCharacter, string>
> {
  if (cachedSpriteDataUrls) return cachedSpriteDataUrls;
  const root = join(process.cwd(), "public/mascot/cast");
  const urls = {} as Record<MascotCharacter, string>;
  for (const character of Object.keys(SPRITE_FILES) as MascotCharacter[]) {
    const file = join(root, SPRITE_FILES[character]);
    const base64 = readFileSync(file).toString("base64");
    urls[character] = `data:image/png;base64,${base64}`;
  }
  cachedSpriteDataUrls = urls;
  return urls;
}
