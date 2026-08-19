import { readFileSync } from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)[1].trim();
const geminiKey = env.match(/GEMINI_API_KEY=(.+)/)[1].trim();

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const word = "resilient" + Date.now();

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash" });
const prompt = `For "${word}", respond ONLY JSON: {"englishDefinition":"...","vietnameseMeaning":"...","examples":"...","phonetic":"...","wordType":"...","collocations":null}`;
const result = await model.generateContent(prompt);
const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)[0]);
console.log("Gemini OK:", parsed.englishDefinition?.slice(0, 40));

const rankRes = await fetch(`${url}/rest/v1/word_bank?select=rank&order=rank.desc&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const rankData = await rankRes.json();
const rank = (rankData[0]?.rank ?? 0) + 1;

const wb = await fetch(`${url}/rest/v1/word_bank`, {
  method: "POST",
  headers,
  body: JSON.stringify({ word, rank }),
});
console.log("word_bank:", wb.status, await wb.text().slice(0, 100));

const wd = await fetch(`${url}/rest/v1/word_details`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    word,
    phonetic: parsed.phonetic,
    word_type: parsed.wordType,
    english_definition: parsed.englishDefinition,
    vietnamese_meaning: parsed.vietnameseMeaning,
    examples: parsed.examples,
    collocations: parsed.collocations,
    image_url: "https://images.unsplash.com/photo-1",
  }),
});
console.log("word_details:", wd.status, await wd.text().slice(0, 150));
