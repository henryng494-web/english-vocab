import {
  DEFAULT_BOOTSTRAP_RANGE,
  isBootstrapSnapshotUsable,
  type AppBootstrapSnapshot,
  type RangeBootstrapData,
} from "@/lib/app-bootstrap";
import { DISCOVER_WORD_CACHE_VERSION } from "@/lib/discover-word-cache";

const STORAGE_KEY = "jj-bootstrap-snapshot-v1";

type PersistedBootstrapSnapshot = {
  schema: typeof DISCOVER_WORD_CACHE_VERSION;
  defaultRangeId: string;
  ranges: Record<string, RangeBootstrapData>;
  savedAt: number;
};

function toAppSnapshot(persisted: PersistedBootstrapSnapshot): AppBootstrapSnapshot {
  return {
    defaultRangeId: persisted.defaultRangeId || DEFAULT_BOOTSTRAP_RANGE,
    ranges: persisted.ranges,
    wordCache: {},
    review: null,
    complete: isBootstrapSnapshotUsable({
      defaultRangeId: persisted.defaultRangeId,
      ranges: persisted.ranges,
      wordCache: {},
      review: null,
      complete: true,
    }),
  };
}

/** Synchronous read for instant Journey render after cold start. */
export function readPersistedBootstrapSnapshot(): AppBootstrapSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedBootstrapSnapshot;
    if (parsed.schema !== DISCOVER_WORD_CACHE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (!parsed.ranges || typeof parsed.ranges !== "object") return null;
    const snapshot = toAppSnapshot(parsed);
    return isBootstrapSnapshotUsable(snapshot) ? snapshot : null;
  } catch {
    return null;
  }
}

export function persistBootstrapSnapshot(snapshot: AppBootstrapSnapshot | null): void {
  if (typeof window === "undefined" || !snapshot) return;
  if (!isBootstrapSnapshotUsable(snapshot)) return;
  try {
    const payload: PersistedBootstrapSnapshot = {
      schema: DISCOVER_WORD_CACHE_VERSION,
      defaultRangeId: snapshot.defaultRangeId,
      ranges: snapshot.ranges,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota — keep in-memory snapshot only */
  }
}
