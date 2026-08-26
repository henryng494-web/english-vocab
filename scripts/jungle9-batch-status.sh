#!/usr/bin/env bash
# Report jungle9 artifact + copy progress
set -euo pipefail
ART=/opt/cursor/artifacts/assets
OUT=/workspace/public/word-images
ok=0; art=0; miss=0
while read -r word; do
  if [[ -f "$ART/jungle9-word-$word" ]]; then ((art++)); fi
  if [[ -f "$OUT/$word.jpg" ]] && [[ $(stat -c%s "$OUT/$word.jpg") -gt 10000 ]]; then ((ok++)); else ((miss++)); fi
done < <(npx tsx -e "import {getWordsInRange} from './src/data/preset-vocabulary.ts'; getWordsInRange(1,100).forEach(e=>console.log(e.word))" 2>/dev/null)
echo "artifacts=$art copied_ok=$ok missing_or_small=$miss"
