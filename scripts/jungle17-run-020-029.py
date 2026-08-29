#!/usr/bin/env python3
"""Load next pending jungle17 job (batches 020-029) from ga-{word}.json or batch JSONL."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(20, 30)


def artifact_ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def load_spec(j):
    ga = f"/tmp/ga-{j['word']}.json"
    if os.path.isfile(ga):
        with open(ga) as f:
            return json.load(f)
    return {
        "description": j["description"],
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
    }


def iter_pending():
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                j = json.loads(line)
                if not artifact_ok(j["filename"]):
                    yield j


def status():
    total = have = 0
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                total += 1
                j = json.loads(line)
                if artifact_ok(j["filename"]):
                    have += 1
    return {"batches": "020-029", "total": total, "generated": have, "skipped": have, "pending": total - have}


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "next"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "next":
        for j in iter_pending():
            print(json.dumps(load_spec(j), ensure_ascii=False))
            break
    elif cmd == "word":
        w = sys.argv[2]
        for j in iter_pending():
            if j["word"] == w:
                print(json.dumps(load_spec(j), ensure_ascii=False))
                break
    else:
        sys.exit(1)
