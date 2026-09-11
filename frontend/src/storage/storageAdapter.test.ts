import { describe, expect, it } from "vitest";
import { loadProgress, mergeBestResult } from "./gameStorage";
import { loadSettings } from "./settingsStorage";
import type { StorageAdapter } from "./storageAdapter";

function createMemory(): StorageAdapter {
  const values = new Map<string, unknown>();
  return {
    read: <T>(key: string) => (values.get(key) as T) ?? null,
    write: (key, value) => values.set(key, value),
    remove: (key) => values.delete(key),
  };
}

describe("storage recovery", () => {
  it("returns safe defaults for corrupt records", () => {
    const storage = createMemory();
    storage.write("arrow-escape-progress-v1", { broken: true });
    expect(loadProgress(storage).completedLevelIds).toEqual([]);
    expect(loadSettings(storage).soundEnabled).toBe(true);
  });
  it("keeps the better completed result", () => {
    const progress = loadProgress(createMemory());
    const next = mergeBestResult(progress, "level-001", {
      bestScore: 800,
      bestTimeSeconds: 20,
      bestStars: 2,
      lastCompletedAt: "2026-09-10T00:00:00Z",
    });
    const worse = mergeBestResult(next, "level-001", {
      bestScore: 500,
      bestTimeSeconds: 10,
      bestStars: 1,
      lastCompletedAt: "2026-09-10T00:01:00Z",
    });
    expect(worse.bestByLevel["level-001"].bestScore).toBe(800);
  });
});
