/**
 * Learner content stores (vi | es)
 *
 * Menu “Ngôn ngữ học” selects the active store via `readAppSettings().learnerLocale`.
 *
 * Pipeline (mirrors Vietnamese end-to-end):
 * 1. Bundled — VI: standard-vocab + preset JSON; ES: `data/learner-stores/es/overrides`
 * 2. Session — `discover-word-cache-v*` keys `locale:word`
 * 3. Remote — `/api/discover/word?locale=` enrich + localize, then `putCached`
 *
 * All tabs should resolve gloss/examples through `getLearnerContentRepository()`.
 */
export {
  getBundledLearnerContent,
  hasBundledLearnerGloss,
} from "@/lib/learner-content/bundled";
export {
  getLearnerContentRepository,
  LearnerContentRepository,
} from "@/lib/learner-content/repository";
export type { LearnerContentSlice } from "@/lib/learner-content/types";
export { LEARNER_CONTENT_STORE_VERSION } from "@/lib/learner-content/types";
