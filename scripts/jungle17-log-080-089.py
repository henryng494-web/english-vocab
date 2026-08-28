#!/usr/bin/env python3
"""Log generation progress for batches 080-089."""
import json
import importlib.util
import sys
import time

spec = importlib.util.spec_from_file_location("gen", "/workspace/scripts/jungle17-gen-080-089.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

LOG = "/tmp/jungle17-progress-080-089.jsonl"
status = gen.status()
status["ts"] = int(time.time())
with open(LOG, "a") as f:
    f.write(json.dumps(status) + "\n")
print(json.dumps(status))
