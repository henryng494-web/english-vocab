import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)[1].trim();
const h = { apikey: key, Authorization: `Bearer ${key}` };

const tables = ["user_learning", "word_bank", "word_details"];
for (const t of tables) {
  const cols = [
    "id", "word", "word_id", "word_bank_id", "user_id", "status",
    "review_count", "last_reviewed_at", "created_at", "rank", "importance",
    "frequency_rank", "popularity", "tier", "guest_id", "session_id",
  ];
  const ok = [];
  for (const c of cols) {
    const res = await fetch(`${url}/rest/v1/${t}?select=${c}&limit=1`, { headers: h });
    if (res.status === 200) ok.push(c);
  }
  console.log(t + ":", ok.join(", "));
}

// sample word_bank rank values
const wb = await fetch(`${url}/rest/v1/word_bank?select=word,rank&limit=5`, { headers: h });
console.log("word_bank sample:", await wb.text());
