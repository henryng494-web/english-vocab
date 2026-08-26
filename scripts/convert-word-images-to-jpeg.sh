#!/usr/bin/env bash
# Convert PNG-as-.jpg word images to real JPEG (browser-safe).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/word-images"
WORDS=$(cd "$ROOT" && npx tsx -e "import { getWordsInRange } from './src/data/preset-vocabulary.ts'; console.log(getWordsInRange(1,100).map(w=>w.word).join(' '));")

ok=0
skip=0
fail=0
for word in $WORDS; do
  src="$OUT/${word}.jpg"
  tmp="/tmp/word-image-${word}.jpg"
  if [ ! -f "$src" ]; then
    echo "MISSING $word" >&2
    fail=$((fail + 1))
    continue
  fi
  if file -b "$src" | grep -q '^JPEG '; then
    skip=$((skip + 1))
    continue
  fi
  ffmpeg -y -loglevel error -i "$src" -q:v 3 "$tmp"
  mv "$tmp" "$src"
  ok=$((ok + 1))
done
echo "Converted: $ok, already JPEG: $skip, missing: $fail"
