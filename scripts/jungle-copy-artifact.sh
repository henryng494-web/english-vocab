#!/usr/bin/env bash
# Copy GenerateImage artifact → public/word-images/{word}.jpg (JPEG, validated).
# Usage: ./scripts/jungle-copy-artifact.sh <word> [bundle-prefix]
set -euo pipefail
word="$1"
prefix="${2:-jungle12}"
ART="/opt/cursor/artifacts/assets"
dst="/workspace/public/word-images/${word}.jpg"

src=""
for p in "$prefix" jungle12 jungle11 jungle10 jungle9 jungle8-fix jungle8 jungle7; do
  if [ -f "${ART}/${p}-word-${word}" ]; then
    src="${ART}/${p}-word-${word}"
    break
  fi
done

if [ -z "$src" ]; then
  echo "MISSING artifact for ${word} (tried ${prefix}, jungle9, jungle8…)" >&2
  exit 1
fi

cp "$src" "$dst"
if ! file -b "$src" | grep -q '^JPEG '; then
  tmp="/tmp/word-image-${word}.jpg"
  ffmpeg -y -loglevel error -i "$src" -q:v 3 "$tmp"
  mv "$tmp" "$dst"
fi

dims=$(file -b "$dst")
if echo "$dims" | grep -qE '1024x576|manufacturer=sana'; then
  echo "REJECT Pollinations image for ${word}: $dims" >&2
  exit 1
fi

echo "OK → $dst ($(stat -c%s "$dst") bytes, $dims)"
