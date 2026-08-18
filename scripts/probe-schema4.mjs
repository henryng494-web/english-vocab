import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)[1].trim();
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const testWord = "complete_" + Date.now();
const body = {
  word: testWord,
  phonetic: "/kəmˈpliːt/",
  word_type: "adjective",
  english_definition: "having all necessary parts",
  vietnamese_meaning: "hoàn chỉnh, đầy đủ",
  examples: "The project is complete.",
  image_url: "https://images.unsplash.com/photo-1",
};

const res = await fetch(`${url}/rest/v1/word_details`, {
  method: "POST",
  headers,
  body: JSON.stringify(body),
});
console.log("insert:", res.status, await res.text());

// test join query - word_bank with word_details by word
const wbRes = await fetch(`${url}/rest/v1/word_bank`, {
  method: "POST",
  headers,
  body: JSON.stringify({ word: testWord, rank: 1 }),
});
const wb = await wbRes.json();
console.log("word_bank:", wbRes.status, JSON.stringify(wb));

// select word_details for word
const sel = await fetch(
  `${url}/rest/v1/word_details?word=eq.${testWord}&select=*`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
);
console.log("select details:", await sel.text());

// test relationship select from word_bank
const join = await fetch(
  `${url}/rest/v1/word_bank?word=eq.${testWord}&select=*,word_details(*)`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
);
console.log("join:", join.status, await join.text());
