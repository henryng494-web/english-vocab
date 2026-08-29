#!/usr/bin/env python3
"""Emit next pending job from ga-{word}.json for batches 020-029."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(20, 30)


def artifact_ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def load_spec(word, fallback):
    ga = f"/tmp/ga-{word}.json"
    if os.path.isfile(ga):
        with open(ga) as f:
            return json.load(f)
    return fallback


def next_pending():
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                j = json.loads(line)
                if artifact_ok(j["filename"]):
                    continue
                spec = load_spec(j["word"], {
                    "description": j["description"],
                    "filename": j["filename"],
                    "reference_image_paths": j.get("reference_image_paths", []),
                    "aspect_ratio": j.get("aspect_ratio", "16:9"),
                })
                spec["word"] = j["word"]
                return spec
    return None


if __name__ == "__main__":
    j = next_pending()
    if j:
        print(json.dumps(j, ensure_ascii=False))
    else:
        print("{}")
