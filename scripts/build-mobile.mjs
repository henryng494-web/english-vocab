/**
 * Static export for Capacitor: `npm run build:mobile`.
 * Server-only routes (API handlers, auth callback, middleware) cannot be part of a
 * static export, so they are moved aside for the build and always restored.
 * The app talks to the deployed web app (API + the large /word-images/* JPEGs, which are
 * NOT bundled). Override the production URL with NEXT_PUBLIC_API_BASE_URL.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const webOnly =
  process.argv.includes("--web-only") || process.env.MOBILE_WEB_ONLY === "1";
const DEFAULT_API_BASE_URL = "https://www.junglejokers.com";

const MOBILE_PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

function requirePublicEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(
      `[build:mobile] Missing ${name}. Set it in Capawesome/Appflow environment variables before the web build.`,
    );
    process.exit(1);
  }
  return value;
}
const MAX_OUT_MB = 50;
function normalizePublicOrigin(raw) {
  let s = String(raw ?? "").trim();
  const markdown = s.match(/\((https:\/\/[^)\s]+)\)/);
  if (markdown?.[1]) s = markdown[1];
  else {
    const bare = s.match(/https:\/\/[^\s\]\[]+/);
    if (bare?.[0]) s = bare[0];
  }
  s = s.replace(/\/+$/, "");
  if (s === "https://junglejokers.com") s = "https://www.junglejokers.com";
  return s;
}

const mobilePublicEnv = Object.fromEntries(
  MOBILE_PUBLIC_ENV_KEYS.map((key) => [key, requirePublicEnv(key)]),
);

const apiBase = normalizePublicOrigin(
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL,
);
if (!/^https:\/\/[^/\s]+$/.test(apiBase)) {
  console.error(`[build:mobile] NEXT_PUBLIC_API_BASE_URL must be an https origin, got "${apiBase}"`);
  process.exit(1);
}
const stash = join(root, ".mobile-build-stash");
const serverOnly = ["src/app/api", "src/app/auth/callback", "src/middleware.ts"];
const moved = [];

function restore() {
  for (const rel of moved.reverse()) {
    const from = join(stash, rel);
    if (existsSync(from)) renameSync(from, join(root, rel));
  }
  rmSync(stash, { recursive: true, force: true });
}

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: process.platform === "win32",
  });
  if (result.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}

process.on("SIGINT", () => {
  restore();
  process.exit(130);
});

try {
  console.log(`[build:mobile] API/asset base URL: ${apiBase}`);
  rmSync(stash, { recursive: true, force: true });
  for (const rel of serverOnly) {
    if (!existsSync(join(root, rel))) continue;
    const to = join(stash, rel);
    mkdirSync(join(to, ".."), { recursive: true });
    renameSync(join(root, rel), to);
    moved.push(rel);
  }
  rmSync(join(root, "out"), { recursive: true, force: true });
  rmSync(join(root, ".next-mobile"), { recursive: true, force: true });

  console.log("[build:mobile] Baking public env into static bundle:");
  console.log(`  NEXT_PUBLIC_API_BASE_URL=${apiBase}`);
  console.log(`  NEXT_PUBLIC_SUPABASE_URL=${mobilePublicEnv.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(
    `  NEXT_PUBLIC_SUPABASE_ANON_KEY=${mobilePublicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 8)}…`,
  );

  run("npx", ["next", "build"], {
    MOBILE_BUILD: "1",
    NEXT_PUBLIC_MOBILE_BUILD: "1",
    NEXT_PUBLIC_API_BASE_URL: apiBase,
    ...mobilePublicEnv,
    NEXT_DIST_DIR: ".next-mobile",
  });
} finally {
  restore();
}

// With `output: "export"` Next writes the site into distDir; keep only the web assets.
if (!existsSync(join(root, ".next-mobile", "index.html"))) {
  throw new Error("Static export did not produce .next-mobile/index.html");
}
renameSync(join(root, ".next-mobile"), join(root, "out"));
for (const dir of ["cache", "server", "types", "static/development"]) {
  rmSync(join(root, "out", dir), { recursive: true, force: true });
}
for (const file of ["build-manifest.json", "app-build-manifest.json", "react-loadable-manifest.json", "package.json", "trace", "diagnostics", "required-server-files.json"]) {
  rmSync(join(root, "out", file), { recursive: true, force: true });
}

// Served from the deployed site at runtime (see src/lib/api-base.ts); also unused sample art.
for (const rel of ["word-images", "mascot/cast-options", "mascot/cast-options-v3"]) {
  rmSync(join(root, "out", rel), { recursive: true, force: true });
}

function dirSize(dir) {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    total += stat.isDirectory() ? dirSize(full) : stat.size;
  }
  return total;
}
const manifestPath = join(root, "out", "mobile-build-manifest.json");
const manifest = {
  mobileBuild: true,
  apiBaseUrl: apiBase,
  supabaseUrl: mobilePublicEnv.NEXT_PUBLIC_SUPABASE_URL,
  builtAt: new Date().toISOString(),
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

run("node", ["scripts/verify-mobile-bundle.mjs"], {
  NEXT_PUBLIC_API_BASE_URL: apiBase,
  NEXT_PUBLIC_SUPABASE_URL: mobilePublicEnv.NEXT_PUBLIC_SUPABASE_URL,
});

const outMb = dirSize(join(root, "out")) / 1024 / 1024;
console.log(`[build:mobile] out/ size: ${outMb.toFixed(1)} MB (limit ${MAX_OUT_MB} MB)`);
if (outMb > MAX_OUT_MB) {
  console.error(`[build:mobile] out/ exceeds ${MAX_OUT_MB} MB`);
  process.exit(1);
}

if (webOnly) {
  console.log("[build:mobile] Skipping cap sync (--web-only)");
} else {
  run("npx", ["cap", "sync"]);
}
