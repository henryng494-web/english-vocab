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

const testWord = "full_" + Date.now();
const bodies = [
  {
    word: testWord,
    image_url: "https://images.unsplash.com/photo-1",
    phonetic: "/test/",
    word_type: "noun",
    examples: "This is a test.",
  },
  {
    word: testWord + "2",
    image_url: "https://images.unsplash.com/photo-1",
    phonetic: "/test/",
    word_type: "noun",
    examples: "Test sentence.",
    definition_en: "a test",
  },
  {
    word: testWord + "3",
    image_url: "https://images.unsplash.com/photo-1",
    phonetic: "/test/",
    word_type: "noun",
    examples: "Test.",
    vietnamese: "thử",
  },
  {
    word: testWord + "4",
    image_url: "https://images.unsplash.com/photo-1",
    phonetic: "/test/",
    word_type: "noun",
    examples: "Test.",
    meaning_vi: "thử",
  },
];

for (const body of bodies) {
  const res = await fetch(`${url}/rest/v1/word_details`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const t = await res.text();
  console.log(res.status, body.word, t.slice(0, 200));
}

// more column probes
const moreCols = [
  "definition_en",
  "definition_vi",
  "meaning_vi",
  "vietnamese",
  "english_meaning",
  "vi_meaning",
  "description",
];
const h = { apikey: key, Authorization: `Bearer ${key}` };
for (const c of moreCols) {
  const res = await fetch(`${url}/rest/v1/word_details?select=${c}&limit=1`, {
    headers: h,
  });
  if (res.status === 200) console.log("col OK:", c);
}
