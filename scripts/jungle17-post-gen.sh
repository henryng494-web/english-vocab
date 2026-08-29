#!/usr/bin/env bash
# Verify artifact + copy to public for one jungle17 word, then show counts.
set -euo pipefail
word="$1"
ART="/opt/cursor/artifacts/assets/jungle17-word-${word}"
if [[ ! -f "$ART" ]] || [[ ! -s "$ART" ]]; then
  echo "FAIL: missing or zero-byte artifact for ${word}" >&2
  exit 1
fi
./scripts/jungle-copy-artifact.sh "$word" jungle17
python3 /workspace/scripts/jungle17-loop-090-099.py counts
