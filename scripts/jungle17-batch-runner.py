#!/usr/bin/env python3
"""Status + next-batch helper for jungle17 batches 011-019 GenerateImage loop."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(11, 20)
CALLS = "/tmp/jungle17-calls-011-019"
FAILED = "/tmp/jungle17-failed-011-019.json"


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
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
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
        "total": len(jobs),
        "generated": skipped,
        "skipped": skipped,
        "failed": len(failed),
        "pending": len(pending),
        "failed_words": sorted(failed),
    }


def next_batch(n=2):
    out = []
    if os.path.isdir(CALLS):
        for fn in sorted(os.listdir(CALLS)):
            j = json.load(open(f"{CALLS}/{fn}"))
            if ok(j["filename"]):
                continue
            out.append(j)
            if len(out) >= n:
                break
    else:
        for j in all_jobs():
            if ok(j["filename"]):
                continue
            out.append({
                "word": j["word"],
                "description": j["description"],
                "filename": j["filename"],
                "reference_image_paths": j.get("reference_image_paths", []),
                "aspect_ratio": j.get("aspect_ratio", "16:9"),
            })
            if len(out) >= n:
                break
    print(json.dumps(out, ensure_ascii=False))


def mark_failed(word):
    s = load_failed()
    s.add(word)
    save_failed(s)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "next":
        next_batch(int(sys.argv[2]) if len(sys.argv) > 2 else 2)
    elif cmd == "fail":
        mark_failed(sys.argv[2])
    else:
        sys.exit(1)
