#!/usr/bin/env python3
"""Log progress for jungle17 batches 090-099 generation."""
import json
import os
from datetime import datetime, timezone

ART = "/opt/cursor/artifacts/assets"
LOG = "/tmp/jungle17-progress-090-099.json"

def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0

jobs = []
for n in range(90, 100):
    with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
        for line in f:
            if line.strip():
                jobs.append(json.loads(line))

generated = [j["word"] for j in jobs if ok(j["filename"])]
pending = [j["word"] for j in jobs if not ok(j["filename"])]
data = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "batches": "090-099",
    "total": len(jobs),
    "generated": len(generated),
    "skipped": len(generated),
    "pending": len(pending),
    "generated_words": generated,
    "pending_words": pending,
}
json.dump(data, open(LOG, "w"), indent=2)
print(json.dumps({k: data[k] for k in ["batches", "total", "generated", "skipped", "pending"]}))
