/**
 * Sense-aware Vietnamese for word-family members. Headword meaning is often
 * a different lemma than -ed/-ing/-ion forms (correct = đúng vs sửa).
 */

export type FamilyGloss = {
  pos: string;
  vi: string;
};

/** Overrides for specific relatives — used before any template. */
export const FAMILY_MEMBER_GLOSSES: Record<string, FamilyGloss> = {
  nursed: { pos: "verb", vi: "đã chăm sóc" },
  nursing: { pos: "noun", vi: "ngành điều dưỡng" },
  correctly: { pos: "adverb", vi: "một cách chính xác" },
  corrected: { pos: "adjective", vi: "đã được sửa" },
  correction: { pos: "noun", vi: "sự sửa lỗi" },
  correcting: { pos: "verb", vi: "đang sửa" },
};

/**
 * Action/verb sense for adjective (or noun) homographs.
 * "correct" as adj is đúng; as a verb/noun family it is sửa.
 */
export const ACTION_SENSE_VI: Record<string, string> = {
  correct: "sửa",
  complete: "hoàn thành",
  open: "mở",
  close: "đóng",
  clean: "làm sạch",
  clear: "làm sạch",
  empty: "làm trống",
  fill: "làm đầy",
  free: "giải phóng",
  dry: "làm khô",
  wet: "làm ướt",
  slow: "làm chậm",
  warm: "làm ấm",
  cool: "làm mát",
  quiet: "làm yên",
  calm: "trấn an",
  ready: "chuẩn bị",
  secure: "bảo vệ",
  separate: "tách",
  perfect: "hoàn thiện",
  dirty: "làm bẩn",
  tidy: "dọn gọn",
  narrow: "thu hẹp",
  wide: "mở rộng",
  tight: "siết chặt",
  loose: "nới lỏng",
  sharp: "mài sắc",
  smooth: "làm mịn",
  rough: "làm thô",
};

/** Verb sense of a person/role noun (nurse the person vs to nurse). */
export const ROLE_VERB_VI: Record<string, string> = {
  nurse: "chăm sóc",
  teacher: "dạy",
  doctor: "khám",
  driver: "lái",
  singer: "hát",
  actor: "diễn",
  painter: "vẽ",
  writer: "viết",
  farmer: "canh tác",
  cook: "nấu",
  guard: "canh gác",
  judge: "xét xử",
  coach: "huấn luyện",
  guide: "hướng dẫn",
  manager: "quản lý",
  leader: "lãnh đạo",
  worker: "làm việc",
  player: "chơi",
  dancer: "nhảy",
  builder: "xây",
  cleaner: "dọn",
  trainer: "huấn luyện",
};
