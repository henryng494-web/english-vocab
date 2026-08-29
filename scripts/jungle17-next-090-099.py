#!/usr/bin/env python3
"""Emit GenerateImage args for next pending job (batches 090-099)."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"

def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0

for n in range(90, 100):
    with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
        for line in f:
            if not line.strip():
                continue
            j = json.loads(line)
            if ok(j["filename"]):
                continue
            print(json.dumps({
                "word": j["word"],
                "description": j["description"],
                "filename": j["filename"],
                "reference_image_paths": j.get("reference_image_paths", []),
                "aspect_ratio": j.get("aspect_ratio", "16:9"),
            }, ensure_ascii=False))
            sys.exit(0)
print("null")
