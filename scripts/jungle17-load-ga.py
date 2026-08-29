#!/usr/bin/env python3
"""Load GenerateImage spec for a word from ga-{word}.json or batch JSONL."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
word = sys.argv[1]


def artifact_ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


ga = f"/tmp/ga-{word}.json"
if os.path.isfile(ga):
    print(json.dumps(json.load(open(ga)), ensure_ascii=False))
    sys.exit(0)

for n in range(20, 30):
    with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
        for line in f:
            j = json.loads(line)
            if j["word"] == word:
                print(
                    json.dumps(
                        {
                            "description": j["description"],
                            "filename": j["filename"],
                            "reference_image_paths": j.get("reference_image_paths", []),
                            "aspect_ratio": j.get("aspect_ratio", "16:9"),
                        },
                        ensure_ascii=False,
                    )
                )
                sys.exit(0)
sys.exit(1)
