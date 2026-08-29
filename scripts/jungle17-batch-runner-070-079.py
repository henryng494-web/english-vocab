#!/usr/bin/env python3
"""Progress tracker for jungle17 batches 070-079 GenerateImage loop."""
import json
import os
import sys
from datetime import datetime, timezone

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(70, 80)
FAILED = "/tmp/jungle17-failed-070-079.json"
PROGRESS = "/tmp/jungle17-batch-070-079-progress.jsonl"


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def load_failed():
    if os.path.isfile(FAILED):
        return set(json.load(open(FAILED)))
    return set()


def save_failed(words):
    json.dump(sorted(words), open(FAILED, "w"))


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
    pending = [j for j in jobs if not ok(j["filename"]) and j["word"] not in failed]
    return {
        "batches": "070-079",
        "total": len(jobs),
        "generated": skipped,
        "skipped": skipped,
        "failed": len(failed),
        "pending": len(pending),
        "failed_words": sorted(failed),
    }


def log(note=""):
    s = status()
    entry = {"ts": datetime.now(timezone.utc).isoformat(), **s}
    if note:
        entry["note"] = note
    with open(PROGRESS, "a") as f:
        f.write(json.dumps(entry) + "\n")
    print(json.dumps(entry))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "log":
        log(" ".join(sys.argv[2:]))
    elif cmd == "fail":
        s = load_failed()
        s.add(sys.argv[2])
        save_failed(s)
        print(json.dumps({"failed": sorted(s)}))
    else:
        sys.exit(1)
