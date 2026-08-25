/** Visual search phrases for English words with multiple unrelated meanings. */

export type HomonymContext = {
  meaning?: string | null;
  englishDefinition?: string | null;
  pos?: string | null;
};

const HOMONYM_WORDS = new Set([
  "mole",
  "bat",
  "bank",
  "spring",
  "match",
  "letter",
  "watch",
  "wave",
  "right",
  "mine",
  "lead",
  "seal",
  "ring",
  "date",
  "fair",
  "fly",
  "crane",
  "pupil",
  "bark",
  "ruler",
  "tie",
  "bow",
  "park",
  "file",
  "chip",
  "court",
  "draft",
  "figure",
  "grave",
  "light",
  "present",
  "second",
  "sentence",
  "tear",
  "trip",
  "trunk",
  "yard",
]);

function contextText(context: HomonymContext): string {
  return [
    context.meaning ?? "",
    context.englishDefinition ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function isHomonymWord(word: string): boolean {
  return HOMONYM_WORDS.has(word.trim().toLowerCase());
}

/**
 * Pick a concrete stock-photo phrase from card meaning/definition when the
 * English headword alone would return the wrong sense (animal mole vs skin mole).
 */
export function resolveHomonymImageKeyword(
  word: string,
  context: HomonymContext = {},
): string | null {
  const key = word.trim().toLowerCase();
  const text = contextText(context);

  if (key === "mole") {
    if (
      matchesAny(text, [
        /nốt ruồi/,
        /not ruoi/,
        /skin/,
        /cheek/,
        /birthmark/,
        /beauty mark/,
        /spot on (?:her|his|the|my|your)/,
        /dark spot/,
        /freckle/,
      ])
    ) {
      return "skin mole beauty mark on cheek closeup";
    }
    if (
      matchesAny(text, [
        /animal/,
        /burrow/,
        /digging/,
        /underground/,
        /mammal/,
        /garden pest/,
      ])
    ) {
      return "mole animal digging in garden soil";
    }
    return null;
  }

  if (key === "bat") {
    if (matchesAny(text, [/baseball/, /cricket/, /sport/, /hit/, /gậy/])) {
      return "baseball bat wooden sports equipment";
    }
    if (matchesAny(text, [/animal/, /dơi/, /fly/, /cave/, /nocturnal/])) {
      return "bat animal flying at night";
    }
  }

  if (key === "bank") {
    if (matchesAny(text, [/money/, /tiền/, /account/, /finance/, /loan/])) {
      return "bank building financial institution exterior";
    }
    if (matchesAny(text, [/river/, /sông/, /shore/, /water/])) {
      return "river bank shoreline water";
    }
  }

  if (key === "spring") {
    if (matchesAny(text, [/season/, /mùa xuân/, /flower/, /bloom/])) {
      return "spring season flowers blossom park";
    }
    if (matchesAny(text, [/coil/, /metal/, /jump/, /lò xo/])) {
      return "metal spring coil closeup";
    }
  }

  if (key === "match") {
    if (matchesAny(text, [/fire/, /light/, /diêm/, /flame/, /burn/])) {
      return "lighting a wooden matchstick flame";
    }
    if (matchesAny(text, [/game/, /sport/, /trận/, /competition/])) {
      return "sports match game stadium";
    }
  }

  if (key === "letter") {
    if (matchesAny(text, [/alphabet/, /chữ cái/, /abc/, /character/])) {
      return "alphabet wooden letters classroom";
    }
    if (matchesAny(text, [/mail/, /post/, /thư/, /envelope/])) {
      return "handwritten letter envelope on desk";
    }
  }

  if (key === "watch") {
    if (matchesAny(text, [/time/, /đồng hồ/, /wrist/, /clock/])) {
      return "wristwatch on hand closeup";
    }
    if (matchesAny(text, [/look/, /see/, /observe/, /nhìn/, /xem/])) {
      return "person watching sunset horizon";
    }
  }

  if (key === "wave") {
    if (matchesAny(text, [/ocean/, /sea/, /beach/, /sóng/, /water/])) {
      return "ocean wave crashing on beach";
    }
    if (matchesAny(text, [/hand/, /hello/, /goodbye/, /vẫy/])) {
      return "person waving hand hello";
    }
  }

  if (key === "lead") {
    if (matchesAny(text, [/guide/, /leader/, /dẫn/, /leadership/])) {
      return "leader guiding team walking together";
    }
    if (matchesAny(text, [/metal/, /pencil/, /chì/, /heavy/])) {
      return "pencil graphite writing closeup";
    }
  }

  if (key === "mine") {
    if (matchesAny(text, [/của tôi/, /possess/, /belong/, /my own/])) {
      return "person holding personal backpack belongings";
    }
    if (matchesAny(text, [/dig/, /coal/, /gold/, /mỏ/, /tunnel/])) {
      return "underground mine tunnel workers";
    }
  }

  return null;
}
