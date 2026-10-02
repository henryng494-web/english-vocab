/**
 * Static export for Capacitor: `npm run build:mobile`.
 * Server-only routes (API handlers, auth callback, middleware) cannot be part of a
 * static export, so they are moved aside for the build and always restored.
 * Set NEXT_PUBLIC_API_BASE_URL to the deployed web app (e.g. https://app.example.com)
 * so the bundled app can reach /api/*.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const stash = join(root, ".mobile-build-stash");
const serverOnly = ["src/app/api", "src/app/auth/callback", "src/app/auth/login/layout.tsx", "src/middleware.ts"];
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
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.warn(
      "[build:mobile] NEXT_PUBLIC_API_BASE_URL is not set — /api calls will not work in the app.",
    );
  }
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
  run("npx", ["next", "build"], {
    MOBILE_BUILD: "1",
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

run("npx", ["cap", "sync"]);
