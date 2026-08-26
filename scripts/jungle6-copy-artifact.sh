#!/usr/bin/env bash
# Copy jungle6-word-* artifact to public/word-images/{word}.jpg
set -euo pipefail
word="$1"
src="/opt/cursor/artifacts/assets/jungle6-word-${word}"
dst="/workspace/public/word-images/${word}.jpg"
if [ ! -f "$src" ]; then
  echo "MISSING: $src" >&2
  exit 1
fi
cp "$src" "$dst"
# GenerateImage artifacts are often PNG — convert to real JPEG for browsers.
if ! file -b "$dst" | grep -q '^JPEG '; then
  tmp="/tmp/word-image-${word}.jpg"
  ffmpeg -y -loglevel error -i "$dst" -q:v 3 "$tmp"
  mv "$tmp" "$dst"
fi
echo "OK → $dst ($(stat -c%s "$dst") bytes, $(file -b "$dst"))"
