#!/usr/bin/env python3
"""Write /tmp/ga-call.json for next pending 080-089 job."""
import json
import importlib.util
import sys

spec = importlib.util.spec_from_file_location("gen", "/workspace/scripts/jungle17-gen-080-089.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

pending = gen.pending()
if not pending:
    print(json.dumps({"done": True, **gen.status()}))
    sys.exit(0)

c = gen.prepare_call(pending[0])
if len(c["description"]) > 400:
    c["description"] = (
        f'Flat 2D humorous cartoon illustration, wide 16:9 landscape. Copy EXACT silhouettes from refs. '
        f'Word "{c["word"]}" on white #FFFFFF with clear grounded props teaching meaning. '
        f"Mascots max 55% frame height, centered, no text."
    )
call = {k: c[k] for k in ("description", "filename", "reference_image_paths", "aspect_ratio", "word")}
json.dump(call, open("/tmp/ga-call.json", "w"), ensure_ascii=False)
print(json.dumps({"word": c["word"], "pending": len(pending), **gen.status()}))
