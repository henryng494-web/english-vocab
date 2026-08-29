#!/usr/bin/env python3
"""Emit GenerateImage-ready JSON for pending jungle17 batches 050-059."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(50, 60)


def pending_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                job = json.loads(line)
                path = os.path.join(ART, job["filename"])
                if not (os.path.isfile(path) and os.path.getsize(path) > 0):
                    jobs.append(job)
    return jobs


def counts():
    total = 0
    have = 0
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                total += 1
                job = json.loads(line)
                path = os.path.join(ART, job["filename"])
                if os.path.isfile(path) and os.path.getsize(path) > 0:
                    have += 1
    return {"total": total, "skipped": have, "pending": total - have}


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "count":
        print(json.dumps(counts()))
        sys.exit(0)
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    for job in pending_jobs()[:n]:
        out = {
            "description": job["description"],
            "filename": job["filename"],
            "reference_image_paths": job.get("reference_image_paths", []),
            "aspect_ratio": job.get("aspect_ratio", "16:9"),
            "word": job["word"],
        }
        print(json.dumps(out, ensure_ascii=False))
