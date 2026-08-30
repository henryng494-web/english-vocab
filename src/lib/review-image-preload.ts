import {
  buildReviewQuestionPlan,
  senseChoicesAreValidForPrompt,
  type ReviewChoice,
  type ReviewQuizKind,
} from "@/lib/review-quiz";
import { resolveCastPreferredImagePath } from "@/lib/cast-word-images";
import {
  prefetchWordImages,
  preloadWordImagesFromCache,
  REVIEW_IMAGE_PREFETCH_CONCURRENCY,
  type WordImagePrefetchTarget,
} from "@/lib/image-preload";
import { peekCachedWordImageUrl } from "@/lib/word-image-cache";
import { preloadWordPronunciations } from "@/lib/pronunciation-preload";
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
          meaning: choice.meaning,
        }))
      : [
          {
            word: word.word,
            imageUrl: word.image_url,
            searchKeyword: word.search_keyword,
            wordType: word.word_type,
            meaning: word.vietnamese_meaning,
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
    const castPath = resolveCastPreferredImagePath(word);
    if (castPath) {
      updates[word] = castPath;
      continue;
    }
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
  preloadWordPronunciations(targets.map((target) => target.word));
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
    if (
      plan.kind === "sense" &&
      senseChoicesAreValidForPrompt(plan.choices, word.word, pool)
    ) {
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
        const castPath = resolveCastPreferredImagePath(choice.word);
        const imageUrl = castPath ?? updates[key] ?? choice.imageUrl;
        return imageUrl ? { ...choice, imageUrl } : choice;
      }),
    );
  }

  return senseChoices;
}
