import {
  buildReviewQuestionPlan,
  type ReviewChoice,
  type ReviewQuizKind,
} from "@/lib/review-quiz";
import {
  prefetchWordImages,
  preloadWordImagesFromCache,
  REVIEW_IMAGE_PREFETCH_CONCURRENCY,
  type WordImagePrefetchTarget,
} from "@/lib/image-preload";
import { peekCachedWordImageUrl } from "@/lib/word-image-cache";
import type { VocabWord } from "@/types/database";

export type ReviewImageTarget = WordImagePrefetchTarget;

export function collectReviewQuestionImageTargets(
  word: VocabWord,
  pool: VocabWord[],
  questionIndex: number,
): {
  kind: ReviewQuizKind;
  choices: ReviewChoice[];
  targets: ReviewImageTarget[];
} {
  const { kind, choices } = buildReviewQuestionPlan(word, pool, questionIndex);
  const targets =
    kind === "sense"
      ? choices.map((choice) => ({
          word: choice.word,
          imageUrl: choice.imageUrl,
          searchKeyword: choice.searchKeyword,
          wordType: choice.wordType,
        }))
      : [
          {
            word: word.word,
            imageUrl: word.image_url,
            searchKeyword: word.search_keyword,
            wordType: word.word_type,
          },
        ];
  return { kind, choices, targets };
}

function collectUpdates(
  targets: ReviewImageTarget[],
): Record<string, string> {
  const updates: Record<string, string> = {};
  for (const target of targets) {
    const word = target.word.trim().toLowerCase();
    const known = peekCachedWordImageUrl(word, target.imageUrl);
    if (known) updates[word] = known;
  }
  return updates;
}

/** Resolve and browser-preload photos for review questions. */
export async function prefetchReviewImages(
  targets: ReviewImageTarget[],
): Promise<Record<string, string>> {
  preloadWordImagesFromCache(targets);
  const fetched = await prefetchWordImages(
    targets,
    REVIEW_IMAGE_PREFETCH_CONCURRENCY,
  );
  return { ...collectUpdates(targets), ...fetched };
}

export function preloadReviewImageBatch(targets: ReviewImageTarget[]): void {
  preloadWordImagesFromCache(targets);
}

/** Warm images for the next N review slots (includes sense-quiz distractors). */
export async function prefetchReviewQuestionRange(
  queue: VocabWord[],
  pool: VocabWord[],
  startIndex: number,
  count: number,
): Promise<Map<number, ReviewChoice[]>> {
  const senseChoices = new Map<number, ReviewChoice[]>();
  const batches: ReviewImageTarget[] = [];

  for (let offset = 0; offset < count; offset++) {
    const questionIndex = startIndex + offset;
    const word = queue[questionIndex];
    if (!word) break;
    const plan = collectReviewQuestionImageTargets(word, pool, questionIndex);
    if (plan.kind === "sense" && plan.choices.length === 3) {
      senseChoices.set(questionIndex, plan.choices);
    }
    batches.push(...plan.targets);
  }

  preloadReviewImageBatch(batches);
  const updates = await prefetchReviewImages(batches);

  if (Object.keys(updates).length === 0) return senseChoices;

  for (const [questionIndex, choices] of senseChoices.entries()) {
    senseChoices.set(
      questionIndex,
      choices.map((choice) => {
        const key = choice.word.trim().toLowerCase();
        return updates[key] ? { ...choice, imageUrl: updates[key] } : choice;
      }),
    );
  }

  return senseChoices;
}
