import { createClientIfConfigured } from "@/lib/supabase/client";
import {
  LEARNER_DISPLAY_NAME_EVENT,
  persistLearnerDisplayName,
  readLearnerDisplayName,
} from "@/lib/user-display-name";

const NICKNAME_MAX_LEN = 32;

/** True when the learner has not chosen a display nickname yet. */
export function needsLearnerNicknamePrompt(): boolean {
  return !readLearnerDisplayName().trim();
}

export function normalizeLearnerNickname(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, NICKNAME_MAX_LEN);
}

/** Persist locally and push to Supabase user_metadata when signed in. */
export async function saveLearnerNickname(raw: string): Promise<string | null> {
  const nickname = normalizeLearnerNickname(raw);
  if (!nickname) return null;
  persistLearnerDisplayName(nickname);
  await syncLearnerNicknameToSupabase(nickname);
  return nickname;
}

export async function syncLearnerNicknameToSupabase(nickname: string): Promise<void> {
  const supabase = createClientIfConfigured();
  if (!supabase) return;
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return;
    await supabase.auth.updateUser({
      data: {
        display_name: nickname,
        nickname,
      },
    });
  } catch {
    /* offline — local nickname still applies */
  }
}

export { LEARNER_DISPLAY_NAME_EVENT, readLearnerDisplayName };
