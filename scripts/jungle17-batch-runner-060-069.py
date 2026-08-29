#!/usr/bin/env python3
"""Batch runner status for jungle17 batches 060-069."""
import json
import os
import sys

sys.path.insert(0, "/workspace/scripts")
from importlib.util import spec_from_loader, module_from_spec
from importlib.machinery import SourceFileLoader

mod = SourceFileLoader("gen", "/workspace/scripts/jungle17-gen-060-069.py").load_module()

ART = "/opt/cursor/artifacts/assets"
FAILED = "/tmp/jungle17-failed-060-069.json"
PROGRESS = "/tmp/jungle17-batch-060-069-progress.jsonl"


def load_failed():
    if os.path.isfile(FAILED):
        return set(json.load(open(FAILED)))
    return set()


def save_failed(words):
    json.dump(sorted(words), open(FAILED, "w"))


def status():
    jobs = []
    for n in range(60, 70):
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    jobs.append(json.loads(line))
    skipped = sum(1 for j in jobs if mod.artifact_ok(j["filename"]))
    failed = load_failed()
    pending = [j for j in jobs if not mod.artifact_ok(j["filename"]) and j["word"] not in failed]
    return {
        "batches": "060-069",
        "total": len(jobs),
        "generated": skipped,
        "skipped": skipped,
        "failed": len(failed),
        "pending": len(pending),
        "failed_words": sorted(failed),
    }


def log(note=""):
    s = status()
    entry = {"ts": __import__("datetime").datetime.utcnow().isoformat() + "Z", **s}
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
