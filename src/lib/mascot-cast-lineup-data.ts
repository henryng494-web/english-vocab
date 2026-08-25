import { readFileSync } from "node:fs";
import { join } from "node:path";

/** In-memory cache — cast PNG embedded so SVG works inside `<img>` tags. */
let cachedLineupDataUrl: string | null = null;

/** Approved cast lineup as a data URL (server-only). */
export function getCastLineupDataUrl(): string {
  if (cachedLineupDataUrl) return cachedLineupDataUrl;
  const filePath = join(process.cwd(), "public/mascot/cast-lineup.png");
  const base64 = readFileSync(filePath).toString("base64");
  cachedLineupDataUrl = `data:image/png;base64,${base64}`;
  return cachedLineupDataUrl;
}
