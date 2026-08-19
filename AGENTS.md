# English Vocab — Agent Guide

Next.js 15 (App Router) flashcard app for learning English vocabulary. Vietnamese UI copy; bilingual example sentences on cards.

## Stack

- **Framework:** Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Database / auth:** Supabase (`word_bank`, `word_details`, `user_learning`)
- **AI enrichment:** Google Gemini (`GEMINI_API_KEY`)
- **Images:** Unsplash (optional), LoremFlickr, Picsum fallbacks

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run build` | Production build — run before opening a PR |
| `npm run lint` | ESLint |

Always run `npm run build` (and fix errors) before finishing a task.

## Environment variables

Configure these in **Cursor Dashboard → Cloud Agents → Secrets** (never commit values):

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes | Word meaning, phonetic, POS, bilingual examples |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `UNSPLASH_ACCESS_KEY` | No | Primary image search; falls back to LoremFlickr |
| `GEMINI_MODEL` | No | Defaults to `gemini-3.6-flash` |

Local dev uses `.env.local` (gitignored). Cloud agents only see dashboard secrets.

## Project layout

```
src/
  app/              # Pages and API routes
  components/       # UI (discover, flashcard, layout)
  data/             # preset-vocabulary, standard-vocab, primary-senses
  lib/              # enrich-word, gemini-core, unsplash, caches
  types/            # database types
```

### Key files

- **Enrichment pipeline:** `src/lib/enrich-word.ts` → `standard-vocab` → Gemini → basic fallback
- **Gemini prompts:** `src/lib/gemini-core.ts`
- **Example quality:** `src/lib/example-fallback.ts` (`keepNaturalExamples`, no generic study templates)
- **Discover API:** `src/app/api/discover/word/route.ts`
- **Client cache:** `src/lib/discover-word-cache.ts` (key `discover-word-cache-v4`)

## Locked flashcard UI — do not change layout

Unless the user explicitly asks to redesign cards, **do not modify** the visual layout of:

- `src/components/discover/DiscoverCard.tsx`
- `src/components/flashcard/Flashcard.tsx`
- `src/components/flashcard/WordCardHeader.tsx`

Current layout (fixed):

1. Image on top
2. Word left with subtle underline; right side: Speak icon → IPA → Vietnamese POS badge
3. Orange primary Vietnamese meaning
4. Italic English examples with Vietnamese translation below
5. No definition text on card, no rank badge on image, no frequency footer

You may fix bugs inside these files but preserve the layout contract.

## Enrichment rules

- Prefer curated entries in `src/data/standard-vocab.ts` before calling Gemini.
- Examples must be natural everyday sentences (see **hole** entry as gold standard), not meta lines like "I learned the word…".
- Use `search_keyword` from enrichment for image lookup (`src/lib/unsplash.ts`).
- Bump `discover-word-cache` version only when cache schema or completeness rules change.

## Cursor Cloud specific instructions

### Boot and verify

1. Dependencies are installed via `.cursor/environment.json` (`npm install`).
2. The dev server starts in a terminal (`npm run dev` on port 3000).
3. Confirm secrets are set before testing discover/enrich flows that hit Gemini or Supabase.

### Testing checklist

- `npm run build` — must pass with no TypeScript errors.
- `npm run lint` — fix new lint issues you introduce.
- **Discover flow:** open `/discover`, load a word; card shows image, meaning, natural examples.
- **API:** `GET /api/discover/word?word=hole` returns enriched payload when secrets are configured.
- **Add word:** authenticated add flow writes to Supabase when logged in.

### Auth on cloud

Login uses Supabase auth (`src/app/auth/login`). For flows requiring a session, use test credentials from Cloud Agent secrets if provided; otherwise test unauthenticated or API-only paths.

### PR expectations

- Work on a feature branch; cloud agents push and open PRs automatically.
- Keep diffs focused; do not refactor unrelated code.
- Do not commit `.env.local` or API keys.
