# English Vocab — Agent Guide

Next.js 15 (App Router) flashcard app for learning English vocabulary. Vietnamese UI copy; bilingual example sentences on cards.

## Stack

- **Framework:** Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Database / auth:** Supabase (`word_bank`, `word_details`, `user_learning`)
- **AI enrichment:** Google Gemini (`GEMINI_API_KEY`)
- **Images:** Pexels (primary stock) → Unsplash fallback → local SVG placeholder for abstract/safe words only

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run build` | Production build — only when TypeScript or Next.js config changed, and not while `npm run dev` is on port 3000 |
| `npm run lint` | ESLint — only on files you edited |
| `npm run test:pexels` | Sample curated keywords against live Pexels scoring |
| `npm run backfill:images` | Refresh stale `word_details.image_url` rows to stock photos |

Do not run `npm run build` for docs, copy, or CSS-only changes.

## Environment variables

Configure these in **Cursor Dashboard → Cloud Agents → Secrets** (never commit values):

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes | Word meaning, phonetic, POS, bilingual examples |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (client + read paths) |
| `SUPABASE_SERVICE_ROLE_KEY` | Batch scripts | DB writes for `npm run re-enrich:all`, `audit:meanings`, backfill scripts |
| `PEXELS_API_KEY` | No | Primary stock-photo search (curated keywords + alt-text scoring) |
| `UNSPLASH_ACCESS_KEY` | No | Secondary stock search fallback when Pexels has no match |
| `GEMINI_MODEL` | No | Defaults to `gemini-3.6-flash` |

After adding or changing secrets in **Cursor Dashboard → Cloud Agents → Secrets**, **Rebuild environment** and start a **new** Cloud Agent task — existing sessions do not pick up new values.

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
- **Word image API:** `src/app/api/word-image/route.ts` (fast stock lookup, no Gemini)
- **Stock image pipeline:** `src/lib/unsplash.ts` (`fetchWordImageUrl`, `SEMANTIC_IMAGE_VERSION`)
- **Client cache:** `src/lib/discover-word-cache.ts` (key `discover-word-cache-v53`)

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
- Use `search_keyword` from enrichment for image lookup (`src/lib/image-keyword.ts` → `src/lib/unsplash.ts`).
- Only `images.pexels.com` and `images.unsplash.com` URLs are displayed on cards; stale/non-stock DB URLs auto-refresh via `/api/word-image`.
- Bump `SEMANTIC_IMAGE_VERSION` in `unsplash.ts` and `DISCOVER_WORD_CACHE_VERSION` when image scoring or cache rules change.

## Jungle Jokers cast word images (rank 1–300) — LOCKED FRAMEWORK

Bundled mascot scenes for preset rank 1–300. **Do not regress** to Pollinations, lineup refs, or generic prompts.

| Item | Location |
|------|----------|
| Framework spec (single source of truth) | `src/data/jungle-cast-image-framework.ts` |
| Locked manifest snapshot | `public/word-images/jungle-cast-framework.json` |
| Word prompts + cast assignments | `src/data/jungle-cast-word-image-prompts.ts` |
| Shape/style rules | `src/data/jungle-cast-samples.ts` |
| Character ref PNGs | `public/mascot/jungle-jokers/*.png` |
| Bundle cache key | `CAST_WORD_IMAGE_BUNDLE` in `src/data/jungle-cast-image-framework.ts` (currently `jungle12`) |

**Add rank 101–150 prompts:** `npm run build:jungle-casts-101-150`
**Add rank 151–160 prompts:** `npm run build:jungle-casts-151-160`
**Add rank 161–300 prompts:** `npm run build:jungle-casts-161-300`

**Regenerate workflow (ALWAYS use GenerateImage — not Gemini API batch)**

1. Edit prompts via `scripts/rebuild-jungle-semantic-prompts.ts` or `scripts/build-jungle-casts-rank-101-150.ts`, or edit entries directly.
2. `npm run jungle:gen-args -- [rankFrom] [rankTo] 0 50 --pending` → job specs with ref PNGs.
3. **GenerateImage** (Cursor) for each job — 16:9, `reference_image_paths` from step 2.
4. `./scripts/jungle-copy-artifact.sh {word}` → JPEG + reject Pollinations.
5. `npm run detect:pollinations-cast-images` → must be `bad: 0`.
6. Bump `CAST_WORD_IMAGE_BUNDLE`, `npm run export:jungle-cast-framework`, commit images + manifest.

**Never use Gemini batch** (`generate:cast-word-images`) unless the user explicitly asks — prefer GenerateImage only.

**Never:** Pollinations without refs, lineup PNG in generation, PNG-as-JPG without ffmpeg, scenes without teaching props.


### Boot and verify

1. Dependencies are installed via `.cursor/environment.json` (`npm install`).
2. The dev server starts in a terminal (`npm run dev` on port 3000).
3. Confirm secrets are set before testing discover/enrich flows that hit Gemini or Supabase.

### Speed — skip low-value steps

Van prefers a faster turnaround. Drop anything that does not change the product:

- **Do not** record screen videos or take screenshots for chat or PRs, and **do not** use computer-use / GUI walkthroughs unless Van explicitly asks.
- **Do not** bump `LAYOUT_VERSION` unless Van asks or the change is a mobile shell/layout fix they need to verify on device.
- **Do not** run Discover / Review / API / auth checks unless the diff touches those paths.
- **Do not** run `npm run build` for docs, copy, or CSS-only changes. For TypeScript, `npx tsc --noEmit` is enough; skip a full build while `npm run dev` is already on port 3000.
- **Do not** lint files you did not change.
- Keep chat replies short. Do not narrate git/PR steps.
- Feature branches and PRs are a Cursor Cloud requirement; still **push `HEAD` to `main`** when the task is done so Production Vercel updates. Do not wait on Preview CI (it fails on every branch).
- Use `/no-test` only when Van wants to skip testing entirely.

### Testing checklist (only when the diff needs it)

- TypeScript changes: `npx tsc --noEmit`; fix new lint issues in files you edited.
- Discover/enrichment: `GET /api/discover/word?word=hole` when secrets are set.
- Auth/add-word: only if that flow changed.

### Auth on cloud

Login uses Supabase auth (`src/app/auth/login`). For flows requiring a session, use test credentials from Cloud Agent secrets if provided; otherwise test unauthenticated or API-only paths.

### PR expectations

- Work on a feature branch; cloud agents push and open PRs automatically.
- **Auto-merge policy:** Van has granted permission to automatically merge PRs into `main` and push to `origin/main` immediately after completing any assigned task and running checks.
- Keep diffs focused; do not refactor unrelated code.
- Do not commit `.env.local` or API keys.
