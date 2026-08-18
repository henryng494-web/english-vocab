// Quick diagnostic - run: node scripts/diagnose.mjs
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const val = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

async function testSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("\n--- Supabase ---");
  console.log("URL:", url);
  console.log("Key prefix:", key?.slice(0, 20) + "...");

  const res = await fetch(`${url}/rest/v1/word_bank?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text.slice(0, 500));
}

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("\n--- Gemini ---");
  console.log("Key prefix:", apiKey?.slice(0, 15) + "...");

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent("Say hi in one word");
    console.log("OK:", result.response.text());
  } catch (e) {
    console.log("Error:", e.message || e);
  }
}

async function testUnsplash() {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  console.log("\n--- Unsplash ---");
  const res = await fetch(
    "https://api.unsplash.com/search/photos?query=cat&per_page=1",
    { headers: { Authorization: `Client-ID ${key}` } },
  );
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text.slice(0, 300));
}

await testSupabase();
await testGemini();
await testUnsplash();
