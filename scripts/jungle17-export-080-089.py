#!/usr/bin/env python3
"""Export pending GenerateImage calls for batches 080-089 (one JSON line per job)."""
import json
import importlib.util
import sys

spec = importlib.util.spec_from_file_location("gen", "/workspace/scripts/jungle17-gen-080-089.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

cmd = sys.argv[1] if len(sys.argv) > 1 else "pending"
if cmd == "status":
    print(json.dumps(gen.status()))
elif cmd == "pending":
    for j in gen.pending():
        c = gen.prepare_call(j)
        desc = c["description"]
        if len(desc) > 400:
            desc = (
                f'Flat 2D humorous cartoon illustration, wide 16:9 landscape. Copy EXACT silhouettes from refs. '
                f'Word "{c["word"]}" on white #FFFFFF with clear grounded props teaching meaning. '
                f"Mascots max 55% frame height, centered, no text."
            )
        print(json.dumps({
            "word": c["word"],
            "filename": c["filename"],
            "aspect_ratio": c["aspect_ratio"],
            "reference_image_paths": c["reference_image_paths"],
            "description": desc,
        }, ensure_ascii=False))
elif cmd == "count":
    pending = gen.pending()
    print(len(pending))
else:
    sys.exit("usage: status|pending|count")
