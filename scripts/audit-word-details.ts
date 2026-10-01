import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
for (const l of readFileSync(resolve(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const i = l.indexOf("="); if (i > 0 && !l.startsWith("#") && !process.env[l.slice(0, i)]) process.env[l.slice(0, i)] = l.slice(i + 1);
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
(async () => {
  const rows: any[] = [];
  for (let f = 0; ; f += 1000) {
    const { data, error } = await sb.from("word_details").select("word,phonetic,word_type,examples,collocations,english_definition,vietnamese_meaning,phrase_translations").range(f, f + 999);
    if (error) throw error; rows.push(...(data ?? [])); if ((data ?? []).length < 1000) break;
  }
  const c: Record<string, string[]> = { noPhonetic: [], noType: [], noExamples: [], noColloc: [], noDef: [], noVi: [], collocNoVi: [] };
  for (const r of rows) {
    if (!r.phonetic?.trim()) c.noPhonetic.push(r.word);
    if (!r.word_type?.trim()) c.noType.push(r.word);
    if (!r.examples?.trim()) c.noExamples.push(r.word);
    if (!r.collocations?.trim()) c.noColloc.push(r.word);
    if (!r.english_definition?.trim()) c.noDef.push(r.word);
    if (!r.vietnamese_meaning?.trim()) c.noVi.push(r.word);
    const pc = r.phrase_translations?.collocations;
    if (r.collocations?.trim() && (!Array.isArray(pc) || pc.some((x: any) => !x?.vi?.trim()))) c.collocNoVi.push(r.word);
  }
  console.log("total", rows.length);
  for (const [k, v] of Object.entries(c)) console.log(k, v.length, v.slice(0, 8).join(","));
  const bg = rows.find((r) => r.word === "bodyguard"), ld = rows.find((r) => r.word === "loud");
  console.log(JSON.stringify({ bg, ld }, null, 1).slice(0, 2500));
})();
