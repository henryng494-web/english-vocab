#!/usr/bin/env python3
"""Queue + compact/sanitized prompts for jungle17 batches 011-019."""
import json
import os
import re
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(11, 20)

CAST_LABELS = {
    "monkey": "purple monkey",
    "elephant": "pink elephant circle head",
    "crocodile": "lime crocodile log body",
    "tiger": "orange tiger sphere",
}

SANITIZED = {
    "jungle17-word-nigga": (
        "Flat 2D cartoon, 16:9 white background. Copy refs: purple monkey + orange tiger. "
        "Two mascots as close friends fist-bumping warmly (slang friend vocabulary). "
        "No text, no slurs, no offensive content."
    ),
    "jungle17-word-pee": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: lime crocodile. "
        "Crocodile waits outside a simple cartoon restroom door with crossed legs (urgency vocabulary). "
        "No text, no explicit content."
    ),
    "jungle17-word-assault": (
        "Flat 2D cartoon, 16:9 white background. Copy refs: purple monkey + pink elephant. "
        "Police officer mascot silhouette with stop hand gesture; mascots step back (attack vocabulary). "
        "No violence, no weapons, no text."
    ),
    "jungle17-word-virgin": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: orange tiger. "
        "Tiger holds unopened gift box with ribbon, curious expression (first-time unused vocabulary). "
        "No text, no sexual content."
    ),
    "jungle17-word-slave": (
        "Flat 2D cartoon, 16:9 white background. Copy refs: elephant + crocodile. "
        "Heavy chain broken open on ground; mascots celebrate freedom (historical forced labor vocabulary). "
        "No violence, no text."
    ),
    "jungle17-word-spit": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: tiger. "
        "Tiger near water fountain rinsing mouth after brushing teeth (saliva vocabulary). "
        "No text, no gross content."
    ),
    "jungle17-word-revenge": (
        "Flat 2D cartoon, 16:9 white background. Copy refs: monkey + crocodile. "
        "Scoreboard showing tied game; mascots shake hands for rematch (payback vocabulary). "
        "No violence, no text."
    ),
    "jungle17-word-trigger": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: elephant. "
        "Elephant finger presses big red button on simple machine that starts toy train (cause/start vocabulary). "
        "No weapons, no text."
    ),
    "jungle17-word-vampire": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: tiger. "
        "Tiger in playful Halloween cape near juice box with silly fangs prop (folklore monster vocabulary). "
        "No blood, no horror, no text."
    ),
    "jungle17-word-liquor": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: elephant. "
        "Elephant behind grocery shelf with sealed bottles on high shelf, age-restricted sign shape (alcohol vocabulary). "
        "No drinking, no text."
    ),
    "jungle17-word-heck": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: monkey. "
        "Monkey covers mouth surprised at spilled ice cream (mild exclamation vocabulary). No text."
    ),
    "jungle17-word-gimme": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: crocodile. "
        "Crocodile reaches open paw toward offered apple (casual request vocabulary). No text."
    ),
    "jungle17-word-custody": (
        "Flat 2D cartoon, 16:9 white background. Copy refs: monkey + elephant. "
        "Parent mascots walk child mascot between them holding hands (legal care vocabulary). No text."
    ),
    "jungle17-word-defendant": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: tiger. "
        "Tiger stands at courtroom podium with judge gavel on bench (accused person vocabulary). No text."
    ),
    "jungle17-word-trauma": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: elephant. "
        "Elephant sits with bandage on knee, friend offers tissue ( emotional injury vocabulary). No gore, no text."
    ),
    "jungle17-word-molly": (
        "Flat 2D cartoon, 16:9 white background. Copy ref: monkey. "
        "Monkey holds name tag sticker on shirt (female name vocabulary). No drugs, no text."
    ),
}

BLOCKED_WORDS = re.compile(
    r"\b(nigga|pee|assault|virgin|slave|spit|revenge|trigger|vampire|liquor|"
    r"fuck|shit|asshole|bitch|cunt|rape|nazi|kill|murder|blood|gun|weapon|"
    r"champagne|wine|beer|drunk|naked|sex|porn|hell|damn|bastard|whore)\b",
    re.I,
)


def artifact_ok(fn: str) -> bool:
    path = os.path.join(ART, fn)
    return os.path.isfile(path) and os.path.getsize(path) > 0


def extract_word(desc: str) -> str:
    m = re.search(r'Word "([^"]+)"', desc)
    return m.group(1) if m else "word"


def extract_cast(refs):
    cast = []
    for p in refs:
        name = os.path.basename(p).replace(".png", "")
        cast.append(CAST_LABELS.get(name, name))
    return ", ".join(cast)


def compact_desc(j, force_sanitize=False):
    fn = j["filename"]
    if fn in SANITIZED or force_sanitize:
        if fn in SANITIZED:
            return SANITIZED[fn]
        word = j.get("word") or extract_word(j["description"])
        cast = extract_cast(j["reference_image_paths"])
        return (
            f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast}. "
            f'Illustrate the English vocabulary word "{word}" with clear grounded props teaching its meaning. '
            f"Educational scene. Mascots max 55% frame height, centered. No text."
        )
    desc = j["description"]
    word = j.get("word") or extract_word(desc)
    if BLOCKED_WORDS.search(word):
        return compact_desc(j, force_sanitize=True)
    return desc


def get_all_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    jobs.append(json.loads(line))
    return jobs


def pending():
    return [j for j in get_all_jobs() if not artifact_ok(j["filename"])]


def prepare_call(j, sanitize=False):
    return {
        "description": compact_desc(j, force_sanitize=sanitize),
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
        "word": j["word"],
    }


def cmd_status():
    jobs = get_all_jobs()
    skip = sum(1 for j in jobs if artifact_ok(j["filename"]))
    pend = [j for j in jobs if not artifact_ok(j["filename"])]
    print(json.dumps({"total": len(jobs), "skipped": skip, "pending": len(pend)}, indent=2))


def cmd_next(n=2, sanitize=False, offset=0):
    batch = [prepare_call(j, sanitize=sanitize) for j in pending()[offset : offset + n]]
    print(json.dumps(batch, ensure_ascii=False))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        cmd_status()
    elif cmd == "next":
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 2
        offset = int(sys.argv[3]) if len(sys.argv) > 3 else 0
        sanitize = "--sanitize" in sys.argv
        cmd_next(n, sanitize=sanitize, offset=offset)
    else:
        print("usage: status|next [n] [offset] [--sanitize]", file=sys.stderr)
        sys.exit(1)
