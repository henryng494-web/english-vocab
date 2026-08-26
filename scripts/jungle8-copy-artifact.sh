#!/usr/bin/env bash
# Copy jungle8-word-* artifact to public/word-images/{word}.jpg
set -euo pipefail
word="$1"
src="/opt/cursor/artifacts/assets/jungle9-word-${word}"
if [ ! -f "$src" ]; then
  src="/opt/cursor/artifacts/assets/jungle8-word-${word}"
fi
dst="/workspace/public/word-images/${word}.jpg"
if [ ! -f "$src" ]; then
  echo "MISSING: $src" >&2
  exit 1
fi
cp "$src" "$dst"
# GenerateImage artifacts are often PNG — convert to real JPEG for browsers.
if ! file -b "$src" | grep -q '^JPEG '; then
  tmp="/tmp/word-image-${word}.jpg"
  ffmpeg -y -loglevel error -i "$src" -q:v 3 "$tmp"
  mv "$tmp" "$dst"
fi
# Reject Pollinations fallback (no ref PNGs → random humans, wrong size).
dims=$(file -b "$dst")
if echo "$dims" | grep -qE '1024x576|manufacturer=sana'; then
  echo "REJECT Pollinations image for ${word}: $dims" >&2
  exit 1
fi
echo "OK → $dst ($(stat -c%s "$dst") bytes, $(file -b "$dst"))"
