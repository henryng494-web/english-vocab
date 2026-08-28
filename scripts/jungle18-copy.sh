#!/usr/bin/env bash
# Copy jungle18 artifact → public/word-images/{word}.jpg (handles extensionless, .png, .jpg)
set -euo pipefail
word="$1"
BUNDLE="${2:-jungle18}"
ART="/opt/cursor/artifacts/assets"
src="${ART}/${BUNDLE}-word-${word}"
dst="/workspace/public/word-images/${word}.jpg"

if [ ! -f "$src" ] || [ ! -s "$src" ]; then
  if [ -f "${src}.png" ] && [ -s "${src}.png" ]; then
    src="${src}.png"
  elif [ -f "${src}.jpg" ] && [ -s "${src}.jpg" ]; then
    src="${src}.jpg"
  elif [ -f "${src}.jpeg" ] && [ -s "${src}.jpeg" ]; then
    src="${src}.jpeg"
  else
    echo "MISSING artifact for ${word}" >&2
    exit 1
  fi
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
