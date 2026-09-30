#!/usr/bin/env bash
# Standard translation backfill env (cost-optimized flash-lite, ~5 RPM).
set -euo pipefail
cd "$(dirname "$0")/.."

export GEMINI_TRANSLATION_MODEL="${GEMINI_TRANSLATION_MODEL:-gemini-flash-lite-latest}"
export GEMINI_MAX_RPM="${GEMINI_MAX_RPM:-5}"

exec npx tsx scripts/backfill-translations.ts "$@"
