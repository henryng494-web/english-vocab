import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)[1].trim();
const h = { apikey: key, Authorization: `Bearer ${key}` };

const cols = [
  "synonym",
  "antonym",
  "collocation",
  "idiom",
  "note",
  "notes",
  "hint",
  "tips",
  "audio_url",
  "sound_url",
  "definition_text",
  "english_definition",
  "vi_definition",
  "vietnamese_meaning",
  "meaning",
  "translate",
  "translation_vi",
  "vi_translation",
  "chinese",
  "japanese",
  "korean",
  "german",
  "french",
  "spanish",
  "related_words",
  "word_family",
  "etymology",
  "register",
  "frequency",
  "difficulty",
  "topic",
  "tag",
  "tags",
  "category",
  "level",
  "rank",
  "order",
  "sort",
  "status",
  "source",
  "author",
  "user_id",
  "created_by",
];

const ok = [];
for (const c of cols) {
  const res = await fetch(`${url}/rest/v1/word_details?select=${c}&limit=1`, {
    headers: h,
  });
  if (res.status === 200) ok.push(c);
}
console.log("found:", ok.join(", "));
