#!/usr/bin/env bash
# Sequential one-locale-at-a-time translation backfill (2605 words × N locales).
set -euo pipefail
cd "$(dirname "$0")/.."

export GEMINI_TRANSLATION_MODEL="${GEMINI_TRANSLATION_MODEL:-gemini-3.6-flash}"
export GEMINI_MAX_RPM="${GEMINI_MAX_RPM:-5}"
export GEMINI_TRANSLATION_TIMEOUT_MS="${GEMINI_TRANSLATION_TIMEOUT_MS:-20000}"
export CONCURRENCY=1
export BATCH_DELAY_MS=0
export LOCALE_DELAY_MS=0

LOG="${BACKFILL_FREE_LOG:-/opt/cursor/artifacts/backfill-free-tier.log}"
PROGRESS="${BACKFILL_FREE_PROGRESS:-/opt/cursor/artifacts/backfill-free-progress.txt}"

LOCALES_ORDER="${LOCALES_ORDER:-es pt ja ko zh th id fr de it tr ar}"

for arg in "$@"; do
  case "$arg" in
    --locales=*)
      LOCALES_ORDER="${arg#--locales=}"
      LOCALES_ORDER="${LOCALES_ORDER//,/ }"
      ;;
  esac
done

write_progress() {
  {
    echo "updated_at_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "current_locale=${CURRENT_LOCALE:-idle}"
    echo "model=${GEMINI_TRANSLATION_MODEL}"
    echo "max_rpm=${GEMINI_MAX_RPM}"
    echo "translation_timeout_ms=${GEMINI_TRANSLATION_TIMEOUT_MS}"
    if [[ -f "$LOG" ]]; then
      echo "processed_total=$(grep -c 'Processed word' "$LOG" 2>/dev/null || true)"
      echo "failed_total=$(grep -cE " failed '" "$LOG" 2>/dev/null || true)"
    fi
  } >"$PROGRESS"
}

touch "$LOG"
write_progress

for loc in $LOCALES_ORDER; do
  CURRENT_LOCALE=$loc
  write_progress
  {
    echo ""
    echo "======== $(date -u +%Y-%m-%dT%H:%M:%SZ) LOCALE $loc ========"
  } | tee -a "$LOG"
  LOCALES=$loc npm run backfill:translations 2>&1 | tee -a "$LOG"
  write_progress
done

CURRENT_LOCALE=done
write_progress
echo "All locales finished $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG"
