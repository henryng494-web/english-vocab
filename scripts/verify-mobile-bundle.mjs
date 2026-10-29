/**
 * Post-build sanity check: public env vars must appear in the exported client bundle.
 * Run automatically from build-mobile.mjs after out/ is written.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

function walkJs(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walkJs(full, files);
    else if (name.endsWith(".js")) files.push(full);
  }
  return files;
}

function bundleContains(needle) {
  if (!needle) return false;
  const haystacks = walkJs(join(outDir, "_next", "static"));
  return haystacks.some((file) => readFileSync(file, "utf8").includes(needle));
}

const errors = [];
if (!existsSync(join(outDir, "index.html"))) {
  errors.push("Missing out/index.html");
}
if (apiBase && !bundleContains(apiBase.replace(/\/+$/, ""))) {
  errors.push(`Client bundle does not contain API base ${apiBase}`);
}
if (supabaseUrl && !bundleContains(supabaseUrl.replace(/\/+$/, ""))) {
  errors.push("Client bundle does not contain NEXT_PUBLIC_SUPABASE_URL host");
}

if (errors.length) {
  console.error("[verify-mobile-bundle] FAILED\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log("[verify-mobile-bundle] OK — API base and Supabase URL present in client chunks");
