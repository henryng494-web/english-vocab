import {
  getLocalWordsByFilter,
  type WordLibraryFilter,
  type WordLibrarySort,
} from "@/lib/learning-storage";

export type WordLibraryNavContext = {
  filter: WordLibraryFilter;
  sort: WordLibrarySort;
};

export function parseWordLibraryNavContext(
  searchParams: Pick<URLSearchParams, "get">,
): WordLibraryNavContext | null {
  if (searchParams.get("from") !== "library") return null;
  return {
    filter: searchParams.get("filter") === "known" ? "known" : "review",
    sort: searchParams.get("sort") === "rank" ? "rank" : "recent",
  };
}

export function buildWordLibraryDetailHref(
  word: string,
  context: WordLibraryNavContext,
): string {
  const params = new URLSearchParams({
    from: "library",
    filter: context.filter,
    sort: context.sort,
  });
  return `/word/${encodeURIComponent(word.toLowerCase())}?${params.toString()}`;
}

export type WordLibraryNeighbors = {
  prev: string | null;
  next: string | null;
  index: number;
  total: number;
};

export function getWordLibraryNeighbors(
  word: string,
  context: WordLibraryNavContext,
): WordLibraryNeighbors {
  const words = getLocalWordsByFilter(context.filter, context.sort).map(
    (entry) => entry.word,
  );
  const normalized = word.toLowerCase();
  const index = words.findIndex((item) => item.toLowerCase() === normalized);
  if (index === -1) {
    return { prev: null, next: null, index: -1, total: words.length };
  }
  return {
    prev: index > 0 ? words[index - 1]! : null,
    next: index < words.length - 1 ? words[index + 1]! : null,
    index,
    total: words.length,
  };
}
