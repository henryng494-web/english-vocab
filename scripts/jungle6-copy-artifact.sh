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
echo "OK → $dst ($(stat -c%s "$dst") bytes)"
