#!/usr/bin/env python3
"""Prepare next GenerateImage call JSON for 070-079 loop."""
import json
import subprocess
import sys

subprocess.run(
    [sys.executable, "/workspace/scripts/jungle17-loop-070-079.py", "next"],
    check=True,
    stdout=open("/tmp/jungle17-next-job.json", "w"),
)
j = json.load(open("/tmp/jungle17-next-job.json"))
call = {
    k: j[k]
    for k in ("description", "filename", "reference_image_paths", "aspect_ratio")
}
json.dump(call, open("/tmp/ga-call.json", "w"), ensure_ascii=False)
print(j["word"])
