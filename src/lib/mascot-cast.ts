/** Mascot cast v1 — Cat 😒, Cow 😛, Dog 😲, Pig 😫 */

export const MASCOT_CAST_VERSION = "mascot-cast-v1";
export const MASCOT_TOP_RANK_LIMIT = 1000;

export type MascotCharacter = "cat" | "cow" | "dog" | "pig";

export type MascotExpression = "default" | "unamused" | "silly" | "surprised" | "tired";

export type MascotSceneType =
  | "lazy_cat"
  | "surprised_dog"
  | "tired_pig"
  | "silly_cow"
  | "tall_contrast"
  | "between"
  | "under"
  | "above"
  | "in_box"
  | "on_top"
  | "rain"
  | "cold"
  | "hot"
  | "eat"
  | "run"
  | "sleep"
  | "work"
  | "give"
  | "help"
  | "learn"
  | "home"
  | "time"
  | "money"
  | "happy_group"
  | "sad_pig"
  | "angry_cat"
  | "big_small"
  | "default_duo";

export type MascotScenePlan = {
  scene: MascotSceneType;
  /** Optional prop hint from curated keyword. */
  propHint?: string | null;
};

export const MASCOT_COLORS = {
  catBody: "#9CA3AF",
  catStripe: "#6B7280",
  catCollar: "#14B8A6",
  cowBody: "#93C5FD",
  cowPatch: "#3B82F6",
  cowHorn: "#FDE68A",
  cowHoof: "#1E3A5F",
  dogBody: "#FBBF24",
  dogEar: "#D97706",
  dogCollar: "#2563EB",
  pigBody: "#F472B6",
  pigSnout: "#EC4899",
  ground: "#FDBA74",
  skyTop: "#60A5FA",
  skyBottom: "#FB923C",
} as const;
