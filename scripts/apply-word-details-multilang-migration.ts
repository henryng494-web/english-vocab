/**
 * Apply multilang JSONB columns on remote Supabase (DDL).
 *
 * Requires direct Postgres credentials (service role JWT cannot run DDL):
 *   SUPABASE_DB_PASSWORD=... NEXT_PUBLIC_SUPABASE_URL=... npx tsx scripts/apply-word-details-multilang-migration.ts
 *
 * Optional: DATABASE_URL=postgresql://postgres.[ref]:[password]@.../postgres
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const dbPassword = process.env.SUPABASE_DB_PASSWORD?.trim();
const databaseUrl = process.env.DATABASE_URL?.trim();

function projectRef(supabaseUrl: string): string {
  const match = supabaseUrl.match(/https:\/\/([^.]+)\./);
  if (!match?.[1]) throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");
  return match[1];
}

function buildPoolerUrl(ref: string, password: string): string {
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;
}

async function probeViaRest(): Promise<string[]> {
  if (!url || !serviceKey) return [];
  const supabase = createClient(url, serviceKey);
  const candidates = [
    "meanings",
    "example_translations",
    "phrase_translations",
  ] as const;
  const present: string[] = [];
  for (const col of candidates) {
    const { error } = await supabase.from("word_details").select(col).limit(1);
    if (!error) present.push(col);
  }
  return present;
}

async function runSqlFile(client: pg.Client, relativePath: string): Promise<void> {
  const sql = readFileSync(join(process.cwd(), relativePath), "utf8");
  await client.query(sql);
}

async function main(): Promise<void> {
  const before = await probeViaRest();
  console.log("Columns before (REST probe):", before.join(", ") || "(none of multilang set)");

  const needsDdl =
    !before.includes("meanings") ||
    !before.includes("example_translations") ||
    !before.includes("phrase_translations");

  if (!needsDdl) {
    console.log("All multilang columns already present — nothing to do.");
    return;
  }

  if (!databaseUrl && !dbPassword) {
    console.error(
      "Missing SUPABASE_DB_PASSWORD or DATABASE_URL — cannot run DDL via REST API.",
    );
    console.error(
      "Add SUPABASE_DB_PASSWORD to Cloud Agent secrets, rebuild, and re-run this script.",
    );
    console.error("Or paste supabase/migrations/20260925_word_details_multilang.sql and 20260925_word_details_phrase_translations.sql in Supabase SQL Editor.");
    process.exit(1);
  }

  if (!url) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
  }

  const ref = projectRef(url);
  const connectionString =
    databaseUrl ?? buildPoolerUrl(ref, dbPassword!);

  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 15000 });
  await client.connect();
  try {
    console.log("Applying multilang migration SQL…");
    await runSqlFile(client, "supabase/migrations/20260925_word_details_multilang.sql");
    await runSqlFile(client, "supabase/migrations/20260925_word_details_phrase_translations.sql");
    console.log("DDL applied.");
  } finally {
    await client.end();
  }

  const after = await probeViaRest();
  console.log("Columns after (REST probe):", after.join(", "));
  if (
    !after.includes("meanings") ||
    !after.includes("example_translations") ||
    !after.includes("phrase_translations")
  ) {
    console.error("Migration finished but some columns still missing.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
