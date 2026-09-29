#!/usr/bin/env bash
# Standard translation backfill env (new Gemini keys: 3.6-flash, ~5 RPM).
set -euo pipefail
cd "$(dirname "$0")/.."

export GEMINI_TRANSLATION_MODEL="${GEMINI_TRANSLATION_MODEL:-gemini-3.6-flash}"
export GEMINI_MAX_RPM="${GEMINI_MAX_RPM:-5}"

exec npx tsx scripts/backfill-translations.ts "$@"
