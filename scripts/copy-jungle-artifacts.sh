#!/usr/bin/env bash
# Copy jungle-word-* artifacts into public/word-images/{word}.jpg
set -euo pipefail
ART=/opt/cursor/artifacts/assets
OUT=public/word-images
mkdir -p "$OUT"
count=0
for src in "$ART"/jungle-word-*; do
  [ -f "$src" ] || continue
  base=$(basename "$src")
  word=${base#jungle-word-}
  word=${word%.jpg}
  word=${word%.png}
  word=${word%.jpeg}
  word=${word%.webp}
  cp "$src" "$OUT/${word}.jpg"
  echo "→ $OUT/${word}.jpg"
  count=$((count + 1))
done
for w in sorry yes no think love; do
  if [ -f "public/word-images/samples/jungle-v5/${w}.jpg" ]; then
    cp "public/word-images/samples/jungle-v5/${w}.jpg" "$OUT/${w}.jpg"
    echo "→ v5 override $OUT/${w}.jpg"
  fi
done
echo "Copied $count jungle images (+ v5 overrides)."
