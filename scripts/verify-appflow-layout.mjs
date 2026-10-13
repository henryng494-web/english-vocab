/**
 * Sanity-check repo layout for Ionic Appflow + Capacitor (native projects at repo root).
 * Run: node scripts/verify-appflow-layout.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function requirePath(rel, label) {
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) {
    errors.push(`Missing ${label}: ${rel}`);
    return null;
  }
  return abs;
}

requirePath("capacitor.config.json", "Capacitor config");
requirePath("ionic.config.json", "Ionic config");
requirePath("android/settings.gradle", "Android native project");
requirePath("android/app/build.gradle", "Android app module");
requirePath("ios/App/App.xcodeproj", "iOS native project");

const cap = JSON.parse(readFileSync(join(repoRoot, "capacitor.config.json"), "utf8"));
const androidPath = cap.android?.path ?? "android";
const iosPath = cap.ios?.path ?? "ios";
const webDir = cap.webDir ?? "www";

if (webDir !== "out") {
  errors.push(`capacitor.config.json webDir must be "out" for Next static export (got "${webDir}")`);
}

const nextConfigPath = join(repoRoot, "next.config.ts");
if (!existsSync(nextConfigPath)) {
  errors.push("Missing next.config.ts");
} else {
  const nextConfig = readFileSync(nextConfigPath, "utf8");
  if (!/output:\s*["']export["']/.test(nextConfig)) {
    errors.push('next.config.ts must set output: "export" for mobile/Appflow builds');
  }
  if (!nextConfig.includes("MOBILE_BUILD")) {
    errors.push("next.config.ts should gate static export on MOBILE_BUILD (Vercel uses non-export build)");
  }
}

if (androidPath.includes("..") || iosPath.includes("..")) {
  errors.push("Capacitor platform paths must not escape the repo root");
}

for (const [name, rel] of [
  ["android", androidPath],
  ["ios", iosPath],
]) {
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) {
    errors.push(`Capacitor ${name}.path "${rel}" is not a directory at repo root`);
  } else if (dirname(abs) !== repoRoot) {
    errors.push(
      `Capacitor ${name}.path "${rel}" is not directly under repo root (Appflow expects android/ and ios/ at root unless appflow.config.json root is set)`,
    );
  }
}

if (existsSync(join(repoRoot, "appflow.config.json"))) {
  const appflow = JSON.parse(readFileSync(join(repoRoot, "appflow.config.json"), "utf8"));
  for (const app of appflow.apps ?? []) {
    if (app.root && app.root !== ".") {
      errors.push(
        `appflow.config.json app ${app.appId ?? "?"} uses root "${app.root}" — native paths must be relative to that root`,
      );
    }
    const ap = app.androidPath ?? "android";
    const ip = app.iosPath ?? "ios";
    if (join(repoRoot, ap) !== join(repoRoot, androidPath)) {
      errors.push(`appflow androidPath "${ap}" does not match capacitor android.path "${androidPath}"`);
    }
    if (join(repoRoot, ip) !== join(repoRoot, iosPath)) {
      errors.push(`appflow iosPath "${ip}" does not match capacitor ios.path "${iosPath}"`);
    }
    const webBuild = app.webBuildCommand ?? "";
    if (!webBuild.includes("build:mobile")) {
      errors.push(
        `appflow webBuildCommand must run npm run build:mobile (sets MOBILE_BUILD + writes out/); got "${webBuild || "(default)"}"`,
      );
    }
  }
}

if (errors.length) {
  console.error("[verify-appflow-layout] FAILED\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  "[verify-appflow-layout] OK — webDir=out, next.config.ts mobile export, android/ at repo root",
);
