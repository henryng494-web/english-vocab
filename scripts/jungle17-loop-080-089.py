#!/usr/bin/env python3
"""Emit next GenerateImage call JSON for agent loop (080-089)."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(80, 90)


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def pending_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    j = json.loads(line)
                    if not ok(j["filename"]):
                        jobs.append(j)
    return jobs


def status():
    total = skipped = 0
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    total += 1
                    j = json.loads(line)
                    if ok(j["filename"]):
                        skipped += 1
    return {"total": total, "skipped": skipped, "generated": total - skipped, "pending": total - skipped}


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "next"
    if cmd == "status":
        print(json.dumps(status()))
        sys.exit(0)
    pending = pending_jobs()
    if not pending:
        print("{}")
        sys.exit(1)
    j = pending[0]
    out = {
        "description": j["description"],
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
        "word": j["word"],
    }
    print(json.dumps(out, ensure_ascii=False))
