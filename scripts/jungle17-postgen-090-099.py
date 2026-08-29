#!/usr/bin/env python3
"""One-step post-gen: verify artifact + copy JPEG for jungle17 090-099 loop."""
import json
import os
import subprocess
import sys

ART = "/opt/cursor/artifacts/assets"
ROOT = "/workspace"


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def postgen(word, filename):
    if not ok(filename):
        print(f"FAIL:{word}", file=sys.stderr)
        return False
    for attempt in range(3):
        r = subprocess.run(
            ["./scripts/jungle-copy-artifact.sh", word, "jungle17"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        if r.returncode == 0:
            print(f"OK:{word}")
            return True
        if attempt < 2:
            import time
            time.sleep(1)
    print(f"COPY_FAIL:{word}:{r.stderr.strip()}", file=sys.stderr)
    return False


if __name__ == "__main__":
    if len(sys.argv) >= 3:
        postgen(sys.argv[1], sys.argv[2])
    else:
        j = json.load(open("/tmp/jungle17-next.json"))
        postgen(j["word"], j["filename"])
