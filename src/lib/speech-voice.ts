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

const AVOID_VOICE_PATTERNS: readonly RegExp[] = [
  /compact/i,
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
];

let cachedVoice: SpeechSynthesisVoice | null | undefined;
let voicesReady: Promise<SpeechSynthesisVoice | null> | null = null;

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name;
  const lang = voice.lang.toLowerCase();

  if (!lang.startsWith("en")) return -1000;
  if (AVOID_VOICE_PATTERNS.some((pattern) => pattern.test(name))) return -500;

  let score = 0;
  if (lang.startsWith("en-us")) score += 40;
  else if (lang.startsWith("en-gb") || lang.startsWith("en-au")) score += 20;
  else score += 10;

  for (let index = 0; index < PREFERRED_VOICE_PATTERNS.length; index++) {
    if (PREFERRED_VOICE_PATTERNS[index].test(name)) {
      score += 120 - index * 3;
    }
  }

  if (/natural|neural|premium|enhanced|wavenet|online|siri/i.test(name)) score += 45;
  if (/google|microsoft/i.test(name) && lang.startsWith("en-us")) score += 25;
  if (!voice.localService) score += 28;
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

export function ensureSpeechVoicesReady(): Promise<SpeechSynthesisVoice | null> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve(null);
  }

  if (cachedVoice !== undefined) {
    return Promise.resolve(cachedVoice);
  }

  if (voicesReady) return voicesReady;

  voicesReady = new Promise((resolve) => {
    const finalize = () => {
      const voices = window.speechSynthesis.getVoices();
      cachedVoice = pickBestVoice(voices);
      resolve(cachedVoice);
    };

    finalize();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", finalize, {
        once: true,
      });
      window.setTimeout(finalize, 800);
    }
  });

  return voicesReady;
}

export function getCachedSpeechVoice(): SpeechSynthesisVoice | null {
  return cachedVoice ?? null;
}

export function applyNaturalSpeechSettings(
  utterance: SpeechSynthesisUtterance,
  voice: SpeechSynthesisVoice | null,
): void {
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = 1.02;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  if (voice) utterance.voice = voice;
}
