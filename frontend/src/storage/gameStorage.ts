import type { BestResult, GameAttempt, ProgressRecord } from "../types/game";
import {
  createBrowserStorageAdapter,
  type StorageAdapter,
} from "./storageAdapter";

export const PROGRESS_KEY = "arrow-escape-progress-v1";
export const DEFAULT_PROGRESS: ProgressRecord = {
  schemaVersion: 1,
  completedLevelIds: [],
  bestByLevel: {},
  activeAttempt: null,
  dailyCompletions: {},
};

export function loadProgress(
  storage: StorageAdapter = createBrowserStorageAdapter(),
): ProgressRecord {
  const value = storage.read<ProgressRecord>(PROGRESS_KEY);
  if (
    !value ||
    value.schemaVersion !== 1 ||
    !Array.isArray(value.completedLevelIds) ||
    !value.bestByLevel
  ) {
    return structuredClone(DEFAULT_PROGRESS);
  }
  return {
    ...DEFAULT_PROGRESS,
    ...value,
    completedLevelIds: [...new Set(value.completedLevelIds)],
    dailyCompletions: value.dailyCompletions ?? {},
  };
}

export function saveProgress(
  progress: ProgressRecord,
  storage: StorageAdapter = createBrowserStorageAdapter(),
): void {
  storage.write(PROGRESS_KEY, progress);
}

export function mergeBestResult(
  progress: ProgressRecord,
  levelId: string,
  result: BestResult,
): ProgressRecord {
  const previous = progress.bestByLevel[levelId];
  const isBetter =
    !previous ||
    result.bestStars > previous.bestStars ||
    (result.bestStars === previous.bestStars &&
      result.bestScore > previous.bestScore) ||
    (result.bestStars === previous.bestStars &&
      result.bestScore === previous.bestScore &&
      result.bestTimeSeconds < previous.bestTimeSeconds);
  if (!isBetter) return progress;
  return {
    ...progress,
    completedLevelIds: progress.completedLevelIds.includes(levelId)
      ? progress.completedLevelIds
      : [...progress.completedLevelIds, levelId],
    bestByLevel: { ...progress.bestByLevel, [levelId]: result },
  };
}

export function saveActiveAttempt(
  progress: ProgressRecord,
  attempt: GameAttempt | null,
): ProgressRecord {
  return { ...progress, activeAttempt: attempt };
}
