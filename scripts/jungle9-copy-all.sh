#!/usr/bin/env bash
# Copy all available jungle9 artifacts to public/word-images/
set -euo pipefail
cd /workspace
copied=0
failed=0
while read -r word; do
  src="/opt/cursor/artifacts/assets/jungle9-word-${word}"
  if [[ ! -f "$src" ]]; then continue; fi
  if ./scripts/jungle8-copy-artifact.sh "$word" >/dev/null 2>&1; then
    ((copied++)) || true
  else
    ((failed++)) || true
    echo "FAIL $word" >&2
  fi
done < <(npx tsx -e "import {getWordsInRange} from './src/data/preset-vocabulary.ts'; getWordsInRange(1,100).forEach(e=>console.log(e.word))" 2>/dev/null)
echo "copied=$copied failed=$failed"
