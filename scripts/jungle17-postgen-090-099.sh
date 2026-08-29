#!/usr/bin/env bash
# Verify extensionless artifact and copy to public/word-images
set -euo pipefail
word="$1"
filename="${2:-jungle17-word-${word}}"
art="/opt/cursor/artifacts/assets/${filename}"
if [[ -f "$art" && -s "$art" ]]; then
  ./scripts/jungle-copy-artifact.sh "$word" jungle17
  echo "OK:$word"
else
  echo "FAIL:$word (missing $art)"
  exit 1
fi
