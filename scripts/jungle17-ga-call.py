#!/usr/bin/env python3
"""Load sanitized GenerateImage call from loop script. Usage: jungle17-ga-call.py [word]"""
import json
import os
import subprocess
import sys

ART = "/opt/cursor/artifacts/assets"


def artifact_ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def load_job(word=None):
    if word:
        ga = f"/tmp/ga-{word}.json"
        if os.path.isfile(ga):
            return json.load(open(ga))
        for n in range(70, 80):
            with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
                for line in f:
                    j = json.loads(line)
                    if j["word"] == word:
                        break
                else:
                    continue
                break
        else:
            sys.exit(1)
        # sanitize via loop
        import importlib.util

        spec = importlib.util.spec_from_file_location(
            "loop", "/workspace/scripts/jungle17-loop-070-079.py"
        )
        # Can't import loop cleanly; shell out
        subprocess.run(
            [sys.executable, "/workspace/scripts/jungle17-loop-070-079.py", "next"],
            check=True,
            stdout=open("/tmp/jungle17-next-job.json", "w"),
        )
        j = json.load(open("/tmp/jungle17-next-job.json"))
    else:
        subprocess.run(
            [sys.executable, "/workspace/scripts/jungle17-loop-070-079.py", "next"],
            check=True,
            stdout=open("/tmp/jungle17-next-job.json", "w"),
        )
        j = json.load(open("/tmp/jungle17-next-job.json"))

    if artifact_ok(j["filename"]):
        print(json.dumps({"skip": j["word"], "reason": "artifact exists"}))
        sys.exit(0)

    call = {
        k: j[k]
        for k in ("description", "filename", "reference_image_paths", "aspect_ratio", "word")
    }
    json.dump(call, open("/tmp/ga-call.json", "w"), ensure_ascii=False)
    print(json.dumps({"word": j["word"], "filename": j["filename"]}))


if __name__ == "__main__":
    load_job(sys.argv[1] if len(sys.argv) > 1 else None)
