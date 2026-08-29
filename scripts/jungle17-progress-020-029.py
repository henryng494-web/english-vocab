#!/usr/bin/env python3
"""Progress tracker for jungle17 batches 020-029 GenerateImage loop."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"
LOG = "/tmp/jungle17-progress-020-029.json"
BATCHES = range(20, 30)


def artifact_ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def load_log():
    if os.path.isfile(LOG):
        with open(LOG) as f:
            return json.load(f)
    return {"generated": [], "failed": [], "skipped": []}


def save_log(log):
    with open(LOG, "w") as f:
        json.dump(log, f, indent=2)


def all_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    jobs.append(json.loads(line))
    return jobs


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


def status():
    jobs = all_jobs()
    have = sum(1 for j in jobs if artifact_ok(j["filename"]))
    miss = len(jobs) - have
    log = load_log()
    return {
        "batches": "020-029",
        "total": len(jobs),
        "generated": have,
        "skipped": have,
        "pending": miss,
        "session_generated": len(log.get("generated", [])),
        "session_failed": len(log.get("failed", [])),
    }


def next_job():
    for j in all_jobs():
        if artifact_ok(j["filename"]):
            continue
        return load_spec(j)
    return None


def mark(word, ok=True):
    log = load_log()
    key = "generated" if ok else "failed"
    if word not in log[key]:
        log[key].append(word)
    save_log(log)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "next":
        j = next_job()
        if j:
            print(json.dumps(j, ensure_ascii=False))
        else:
            print("{}")
    elif cmd == "mark-ok":
        mark(sys.argv[2], True)
    elif cmd == "mark-fail":
        mark(sys.argv[2], False)
    else:
        sys.exit(1)
