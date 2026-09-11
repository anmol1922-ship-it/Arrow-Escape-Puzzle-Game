import type { BestResult, ProgressRecord } from "../types/game";
import { saveProgress } from "./gameStorage";
import type { StorageAdapter } from "./storageAdapter";

export function saveDailyResult(
  progress: ProgressRecord,
  dateKey: string,
  result: BestResult,
  storage: StorageAdapter,
): ProgressRecord {
  const next = {
    ...progress,
    dailyCompletions: { ...progress.dailyCompletions, [dateKey]: result },
  };
  saveProgress(next, storage);
  return next;
}
