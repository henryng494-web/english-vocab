import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)[1].trim();
const headers = { apikey: key, Authorization: `Bearer ${key}` };

const cols = [
  "word",
  "image_url",
  "example",
  "examples",
  "example_sentence",
  "definition",
  "definitions",
  "meaning",
  "phonetic",
  "pronunciation",
  "translation",
  "vietnamese",
  "english",
  "description",
  "note",
  "notes",
  "rank",
  "level",
  "category",
  "created_at",
  "updated_at",
  "word_type",
  "synonym",
  "antonym",
];

const ok = [];
for (const c of cols) {
  const res = await fetch(`${url}/rest/v1/word_details?select=${c}&limit=1`, {
    headers,
  });
  if (res.status === 200) ok.push(c);
}

console.log("word_details valid columns:", ok.join(", "));

// word_bank columns
const wbCols = ["id", "word", "rank", "created_at", "updated_at", "level"];
const wbOk = [];
for (const c of wbCols) {
  const res = await fetch(`${url}/rest/v1/word_bank?select=${c}&limit=1`, {
    headers,
  });
  if (res.status === 200) wbOk.push(c);
}
console.log("word_bank valid columns:", wbOk.join(", "));

// test insert word_details
const insertHeaders = {
  ...headers,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};
const testWord = "probe_" + Date.now();
let res = await fetch(`${url}/rest/v1/word_bank`, {
  method: "POST",
  headers: insertHeaders,
  body: JSON.stringify({ word: testWord, rank: 1 }),
});
const wb = await res.json();
const wbId = wb[0]?.id ?? wb.id;
console.log("word_bank insert:", res.status, wbId);

// try insert with word column matching word_bank
for (const body of [
  { word: testWord, image_url: "https://example.com/x.jpg" },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    definition: "test",
  },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    meaning: "test",
  },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    english: "test",
  },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    translation: "test",
  },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    phonetic: "/test/",
  },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    pronunciation: "/test/",
  },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    examples: "test ex",
  },
  {
    word: testWord,
    image_url: "https://example.com/x.jpg",
    example_sentence: "test ex",
  },
]) {
  const r = await fetch(`${url}/rest/v1/word_details`, {
    method: "POST",
    headers: insertHeaders,
    body: JSON.stringify(body),
  });
  const t = await r.text();
  console.log("insert", Object.keys(body).join("+"), r.status, t.slice(0, 120));
  if (r.status === 201) break;
}
