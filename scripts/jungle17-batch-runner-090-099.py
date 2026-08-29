#!/usr/bin/env python3
"""Status + next-job helper for jungle17 batches 090-099 GenerateImage loop."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(90, 100)
FAILED = "/tmp/jungle17-failed-090-099.json"


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def load_failed():
    if os.path.isfile(FAILED):
        return set(json.load(open(FAILED)))
    return set()


def save_failed(s):
    json.dump(sorted(s), open(FAILED, "w"))


def all_jobs():
    jobs = []
    for n in BATCHES:
        path = f"/tmp/jungle17-batches/batch-{n:03d}.jsonl"
        with open(path) as f:
            for line in f:
                if line.strip():
                    jobs.append(json.loads(line))
    return jobs


def status():
    jobs = all_jobs()
    skipped = sum(1 for j in jobs if ok(j["filename"]))
    failed = load_failed()
    pending = [j for j in jobs if not ok(j["filename"])]
    return {
        "batches": "090-099",
        "total": len(jobs),
        "skipped": skipped,
        "generated": skipped,
        "failed": len(failed),
        "pending": len(pending),
        "failed_words": sorted(failed),
    }


def next_job():
    for j in all_jobs():
        if ok(j["filename"]):
            continue
        print(json.dumps({
            "word": j["word"],
            "description": j["description"],
            "filename": j["filename"],
            "reference_image_paths": j.get("reference_image_paths", []),
            "aspect_ratio": j.get("aspect_ratio", "16:9"),
        }, ensure_ascii=False))
        return
    print("null")


def mark_failed(word):
    s = load_failed()
    s.add(word)
    save_failed(s)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "next":
        next_job()
    elif cmd == "fail":
        mark_failed(sys.argv[2])
    else:
        sys.exit(1)
