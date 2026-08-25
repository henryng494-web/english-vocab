#!/usr/bin/env bash
# Copy Cursor GenerateImage cast-word-* artifacts into public/word-images/*.jpg
set -euo pipefail
ART=/opt/cursor/artifacts/assets
OUT=public/word-images
mkdir -p "$OUT"
count=0
for src in "$ART"/cast-word-*; do
  [ -f "$src" ] || continue
  base=$(basename "$src")
  word=${base#cast-word-}
  cp "$src" "$OUT/${word}.jpg"
  echo "→ $OUT/${word}.jpg"
  count=$((count + 1))
done
echo "Copied $count images."
