#!/usr/bin/env bash
# Copy jungle2-word-* artifacts into public/word-images/{word}.jpg
# Only copies valid rank-1-100 words; skips variants like will-v2.
set -euo pipefail
ART=/opt/cursor/artifacts/assets
OUT=public/word-images
mkdir -p "$OUT"

# Rank 1-100 word list (must match preset vocabulary)
VALID_WORDS=(
  you the to what on this not can like so if at out up okay well time take an man where hey or then make over more very thank please any only sir will who why maybe
  about all and as back because but by come do down for from get give go good have he help here how in is it just know let little look love mean me much no now of off one people right say see she some something sure tell that there they think too two want way we when with would yes
)

is_valid_word() {
  local w="$1"
  for v in "${VALID_WORDS[@]}"; do
    [[ "$v" == "$w" ]] && return 0
  done
  return 1
}

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
  is_valid_word "$word" || continue
  cp "$src" "$OUT/${word}.jpg"
  count=$((count + 1))
done
echo "Copied $count jungle images to $OUT."
