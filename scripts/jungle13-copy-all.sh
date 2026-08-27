#!/usr/bin/env bash
# Copy all jungle13 artifacts → public/word-images/{word}.jpg
set -euo pipefail
ART="/opt/cursor/artifacts/assets"
ok=0 fail=0
while IFS= read -r line; do
  word=$(echo "$line" | node -e 'const j=JSON.parse(require("fs").readFileSync(0,"utf8")); process.stdout.write(j.word)')
  if [ -f "${ART}/jungle13-word-${word}" ]; then
    if ./scripts/jungle-copy-artifact.sh "$word" jungle13; then
      ok=$((ok+1))
    else
      fail=$((fail+1))
    fi
  else
    echo "MISSING artifact jungle13-word-${word}" >&2
    fail=$((fail+1))
  fi
done < /tmp/jungle13-jobs.jsonl
echo "COPY DONE ok=$ok fail=$fail"
