#!/usr/bin/env python3
"""Emit next pending 090-099 job JSON (artifact missing)."""
import json
import os
import sys

ART = "/opt/cursor/artifacts/assets"


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


for n in range(90, 100):
    with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
        for line in f:
            if not line.strip():
                continue
            j = json.loads(line)
            if not ok(j["filename"]):
                print(json.dumps(j))
                sys.exit(0)
print(json.dumps({"done": True}))
