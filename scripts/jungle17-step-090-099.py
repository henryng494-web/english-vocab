#!/usr/bin/env python3
"""One-step: postgen current + emit next pending job + counts."""
import json
import os
import subprocess
import sys

ART = "/opt/cursor/artifacts/assets"
ROOT = "/workspace"


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def counts():
    total = have = 0
    for n in range(90, 100):
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                j = json.loads(line)
                total += 1
                if ok(j["filename"]):
                    have += 1
    return total, have, total - have


def next_job():
    for n in range(90, 100):
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                j = json.loads(line)
                if not ok(j["filename"]):
                    return j
    return None


if __name__ == "__main__":
    if len(sys.argv) >= 3:
        word, fn = sys.argv[1], sys.argv[2]
        for attempt in range(3):
            r = subprocess.run(
                ["./scripts/jungle-copy-artifact.sh", word, "jungle17"],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )
            if r.returncode == 0:
                print(f"OK:{word}")
                break
            if attempt == 2:
                print(f"COPY_FAIL:{word}:{r.stderr.strip()}", file=sys.stderr)
                sys.exit(1)
            import time
            time.sleep(1)
    t, h, p = counts()
    j = next_job()
    print(json.dumps({"total": t, "generated": h, "pending": p, "next": j["word"] if j else None}))
    if j:
        with open("/tmp/jungle17-next.json", "w") as out:
            json.dump(j, out)
