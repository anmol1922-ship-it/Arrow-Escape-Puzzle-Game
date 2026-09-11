import { describe, expect, it } from "vitest";
import { loadProgress, mergeBestResult } from "./gameStorage";
import { memoryStorageAdapter } from "./storageAdapter";

describe("progress merge", () => {
  it("prefers stars, then score, then time", () => {
    const base = loadProgress(memoryStorageAdapter);
    const highStars = mergeBestResult(base, "level-001", {
      bestScore: 100,
      bestTimeSeconds: 90,
      bestStars: 3,
      lastCompletedAt: "a",
    });
    const fasterButWorse = mergeBestResult(highStars, "level-001", {
      bestScore: 999,
      bestTimeSeconds: 1,
      bestStars: 2,
      lastCompletedAt: "b",
    });
    expect(fasterButWorse.bestByLevel["level-001"].bestStars).toBe(3);
  });
});
