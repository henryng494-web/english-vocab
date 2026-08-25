#!/usr/bin/env bash
# Copy jungle2-word-* or jungle-word-* artifacts into public/word-images/{word}.jpg
set -euo pipefail
ART=/opt/cursor/artifacts/assets
OUT=public/word-images
mkdir -p "$OUT"
count=0
for src in "$ART"/jungle2-word-* "$ART"/jungle-word-*; do
  [ -f "$src" ] || continue
  base=$(basename "$src")
  word=${base#jungle2-word-}
  word=${word#jungle-word-}
  word=${word%.jpg}
  word=${word%.png}
  word=${word%.jpeg}
  word=${word%.webp}
  cp "$src" "$OUT/${word}.jpg"
  count=$((count + 1))
done
echo "Copied $count jungle images to $OUT."
