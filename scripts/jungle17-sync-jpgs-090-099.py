#!/usr/bin/env python3
"""Batch postgen: copy all artifacts missing JPEG for 090-099."""
import json
import os
import subprocess

ROOT = "/workspace"
ART = "/opt/cursor/artifacts/assets"


def main():
    copied = []
    failed = []
    for n in range(90, 100):
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if not line.strip():
                    continue
                j = json.loads(line)
                w = j["word"]
                fn = j["filename"]
                art = os.path.join(ART, fn)
                jpg = f"{ROOT}/public/word-images/{w}.jpg"
                if os.path.isfile(art) and os.path.getsize(art) > 0 and not os.path.isfile(jpg):
                    r = subprocess.run(
                        ["./scripts/jungle-copy-artifact.sh", w, "jungle17"],
                        cwd=ROOT,
                        capture_output=True,
                        text=True,
                    )
                    if r.returncode == 0:
                        copied.append(w)
                    else:
                        failed.append((w, r.stderr.strip()))
    print(json.dumps({"copied": len(copied), "failed": failed}))


if __name__ == "__main__":
    main()
