import { describe, expect, it } from "vitest";
import { getDailyChallenge, getDateKey } from "./dailyChallenges";

describe("daily challenge selection", () => {
  it("is deterministic for a calendar date and points to a bundled level", () => {
    const date = new Date("2026-09-10T12:00:00Z");
    expect(getDateKey(date)).toBe("2026-09-10");
    expect(getDailyChallenge(date)).toEqual(getDailyChallenge(date));
    expect(getDailyChallenge(date).levelId).toMatch(/^level-/);
  });
});
