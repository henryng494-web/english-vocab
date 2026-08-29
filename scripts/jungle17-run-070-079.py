#!/usr/bin/env python3
"""Emit pending GenerateImage jobs for 070-079 (sanitized). Agent calls GenerateImage one at a time."""
import json
import os
import sys

# Reuse loop script helpers
sys.path.insert(0, os.path.dirname(__file__))
import importlib.util

spec = importlib.util.spec_from_file_location(
    "loop", os.path.join(os.path.dirname(__file__), "jungle17-loop-070-079.py")
)
loop = importlib.util.module_from_spec(spec)
spec.loader.exec_module(loop)

ART = loop.ART
BATCHES = loop.BATCHES


def pending_jobs():
    out = []
    for n in BATCHES:
        path = f"/tmp/jungle17-batches/batch-{n:03d}.jsonl"
        for line in open(path):
            if not line.strip():
                continue
            j = json.loads(line)
            if not loop.ok(j["filename"]):
                out.append(j)
    return out


def job_call(j):
    return {
        "description": loop.desc(j),
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
        "word": j["word"],
    }


cmd = sys.argv[1] if len(sys.argv) > 1 else "counts"
if cmd == "counts":
    jobs = []
    for n in BATCHES:
        for line in open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl"):
            if line.strip():
                jobs.append(json.loads(line))
    have = sum(1 for j in jobs if loop.ok(j["filename"]))
    print(
        json.dumps(
            {
                "batches": "070-079",
                "total": len(jobs),
                "generated": have,
                "skipped": have,
                "pending": len(jobs) - have,
            }
        )
    )
elif cmd == "next":
    p = pending_jobs()
    if not p:
        sys.exit(1)
    print(json.dumps(job_call(p[0]), ensure_ascii=False))
elif cmd == "list":
    for j in pending_jobs():
        print(j["word"])
elif cmd == "dump":
    for j in pending_jobs():
        print(json.dumps(job_call(j), ensure_ascii=False))
else:
    print("Usage: jungle17-run-070-079.py counts|next|list|dump", file=sys.stderr)
    sys.exit(2)
