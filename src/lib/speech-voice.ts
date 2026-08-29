/** Preferred youthful, natural en-US voices (platform-dependent availability). */
const PREFERRED_VOICE_PATTERNS: readonly RegExp[] = [
  /samantha.*enhanced/i,
  /enhanced.*samantha/i,
  /ava \(.*\)/i,
  /\bava\b/i,
  /\bnicky\b/i,
  /\bzoe\b/i,
  /siri.*voice.*4/i,
  /natural.*english.*us/i,
  /english.*us.*natural/i,
  /en-us.*neural/i,
  /neural.*en-us/i,
  /\bjenny\b.*neural/i,
  /\baria\b.*neural/i,
  /microsoft.*jenny/i,
  /microsoft.*aria/i,
  /google.*english.*united states/i,
  /google us english/i,
  /\bsamantha\b/i,
  /\ballison\b/i,
  /\bkaren\b/i,
  /\btessa\b/i,
  /\bmoira\b/i,
  /\bvictoria\b/i,
];

const PREFERRED_VOICE_URIS: readonly RegExp[] = [
  /enhanced.*en-us.*samantha/i,
  /en-us.*samantha.*enhanced/i,
  /compact.*en-us.*samantha/i,
  /en-us.*samantha/i,
  /enhanced.*en-us.*ava/i,
  /en-us.*ava/i,
];

const AVOID_VOICE_PATTERNS: readonly RegExp[] = [
  /robot/i,
  /cellos/i,
  /bells/i,
  /superstar/i,
  /good news/i,
  /bad news/i,
  /whisper/i,
  /zarvox/i,
  /trinoids/i,
  /boing/i,
  /bubbles/i,
  /junior/i,
  /ralph/i,
  /fred/i,
  /bruce/i,
  /grandma/i,
  /grandpa/i,
  /eloquence/i,
];

let cachedVoice: SpeechSynthesisVoice | null | undefined;
let voicesReady: Promise<SpeechSynthesisVoice | null> | null = null;

export function isAppleWebKit(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) &&
    /AppleWebKit/.test(navigator.userAgent);
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name;
  const uri = voice.voiceURI;
  const lang = voice.lang.toLowerCase();

  if (!lang.startsWith("en")) return -1000;
  if (AVOID_VOICE_PATTERNS.some((pattern) => pattern.test(name + uri))) {
    return -500;
  }

  let score = 0;
  if (lang.startsWith("en-us")) score += 40;
  else if (lang.startsWith("en-gb") || lang.startsWith("en-au")) score += 20;
  else score += 10;

  for (let index = 0; index < PREFERRED_VOICE_PATTERNS.length; index++) {
    if (PREFERRED_VOICE_PATTERNS[index].test(name)) {
      score += 120 - index * 3;
    }
  }

  for (let index = 0; index < PREFERRED_VOICE_URIS.length; index++) {
    if (PREFERRED_VOICE_URIS[index].test(uri)) {
      score += 140 - index * 4;
    }
  }

  if (/natural|neural|premium|enhanced|wavenet|online|siri/i.test(name + uri)) {
    score += 45;
  }
  if (/google|microsoft/i.test(name) && lang.startsWith("en-us")) score += 25;
  if (!voice.localService && !isAppleWebKit()) score += 28;
  if (voice.default) score += 4;

  return score;
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -Infinity;

  for (const voice of voices) {
    const score = scoreVoice(voice);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }

  return best;
}

function resolveVoiceFromList(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const best = pickBestVoice(voices);
  if (!best) return null;

  const matched = voices.find((voice) => voice.voiceURI === best.voiceURI);
  return matched ?? best;
}

export function ensureSpeechVoicesReady(): Promise<SpeechSynthesisVoice | null> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve(null);
  }

  if (cachedVoice !== undefined) {
    return Promise.resolve(cachedVoice);
  }

  if (voicesReady) return voicesReady;

  voicesReady = new Promise((resolve) => {
    let settled = false;
    let attempts = 0;
    const maxAttempts = 40;

    const finish = (voice: SpeechSynthesisVoice | null) => {
      if (settled) return;
      settled = true;
      cachedVoice = voice;
      resolve(voice);
    };

    const tryPick = (): SpeechSynthesisVoice | null => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return null;
      return resolveVoiceFromList(voices);
    };

    const onVoicesChanged = () => {
      const voice = tryPick();
      if (voice) {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        finish(voice);
      }
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);

    const voice = tryPick();
    if (voice) {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      finish(voice);
      return;
    }

    const poll = window.setInterval(() => {
      attempts += 1;
      const nextVoice = tryPick();
      if (nextVoice) {
        window.clearInterval(poll);
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        finish(nextVoice);
        return;
      }

      if (attempts >= maxAttempts) {
        window.clearInterval(poll);
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        finish(null);
      }
    }, 100);
  });

  return voicesReady;
}

export function getCachedSpeechVoice(): SpeechSynthesisVoice | null {
  return cachedVoice ?? null;
}

/** Best en-US voice without waiting — required for Safari tap-to-speak. */
export function getSpeechVoiceSync(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const picked = resolveVoiceFromList(voices);
  if (picked) cachedVoice = picked;
  return picked;
}

export function applyNaturalSpeechSettings(
  utterance: SpeechSynthesisUtterance,
  voice: SpeechSynthesisVoice | null,
): void {
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = isAppleWebKit() ? 1.06 : 1.02;
  utterance.pitch = isAppleWebKit() ? 1.12 : 1.08;
  utterance.volume = 1;
  if (voice) utterance.voice = voice;
}
