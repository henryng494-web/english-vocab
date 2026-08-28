#!/usr/bin/env bash
# Copy jungle17 artifact → public/word-images/{word}.jpg (handles PNG/JPEG).
set -euo pipefail
word="$1"
ART="/opt/cursor/artifacts/assets"
src="${ART}/jungle17-word-${word}"
dst="/workspace/public/word-images/${word}.jpg"

if [ ! -f "$src" ] || [ ! -s "$src" ]; then
  echo "MISSING artifact for ${word}" >&2
  exit 1
fi

if file -b "$src" | grep -q '^JPEG '; then
  cp "$src" "$dst"
else
  ffmpeg -y -loglevel error -i "$src" -q:v 3 "$dst"
fi

dims=$(file -b "$dst")
if echo "$dims" | grep -qE '1024x576|manufacturer=sana'; then
  echo "REJECT Pollinations image for ${word}: $dims" >&2
  exit 1
fi

echo "OK → $dst ($(stat -c%s "$dst") bytes, $dims)"
