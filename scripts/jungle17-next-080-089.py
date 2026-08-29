#!/usr/bin/env python3
"""Emit single next GenerateImage call for 080-089 loop."""
import json
import importlib.util
import sys

spec = importlib.util.spec_from_file_location("gen", "/workspace/scripts/jungle17-gen-080-089.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

if len(sys.argv) > 1 and sys.argv[1] == "status":
    print(json.dumps(gen.status()))
    sys.exit(0)

jobs = [gen.prepare_call(j) for j in gen.pending()]
if not jobs:
    print("{}")
    sys.exit(1)

j = jobs[0]
out = {k: j[k] for k in ("description", "filename", "reference_image_paths", "aspect_ratio", "word")}
print(json.dumps(out, ensure_ascii=False))
