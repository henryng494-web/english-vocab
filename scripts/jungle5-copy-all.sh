#!/usr/bin/env bash
# Copy all jungle5-word-* artifacts to public/word-images/{word}.jpg
set -euo pipefail
ART=/opt/cursor/artifacts/assets
OUT=/workspace/public/word-images
mkdir -p "$OUT"
ok=0
fail=0
for src in "$ART"/jungle5-word-*; do
  [ -f "$src" ] || continue
  base=$(basename "$src")
  word=${base#jungle5-word-}
  cp "$src" "$OUT/${word}.jpg"
  echo "OK $word"
  ok=$((ok + 1))
done
echo "Copied $ok artifacts"
