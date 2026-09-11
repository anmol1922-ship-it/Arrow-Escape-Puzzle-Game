import { describe, expect, it } from "vitest";
import { getScoringProfile } from "../../data/scoringProfiles";
import type { GameAttempt, Level } from "../../types/game";
import { calculateScore, calculateStars } from "./scoreCalculator";

const level: Level = {
  id: "score-test",
  title: "Score",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 2,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [{ id: "a1", row: 0, column: 0, direction: "RIGHT" }],
};
const attempt: GameAttempt = {
  levelId: level.id,
  activeArrowIds: [],
  moves: 2,
  mistakes: 0,
  elapsedSeconds: 30,
  status: "completed",
  score: null,
  stars: null,
  hintedArrowId: null,
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("scoring", () => {
  it("keeps a clean target attempt at the profile base score", () => {
    const profile = getScoringProfile("easy");
    expect(calculateScore(level, attempt, profile)).toBe(profile.baseScore);
    expect(calculateStars(profile.baseScore, profile)).toBe(3);
  });
  it("penalizes excess time, moves, and mistakes", () => {
    const profile = getScoringProfile("easy");
    const result = calculateScore(
      level,
      { ...attempt, moves: 4, elapsedSeconds: 40, mistakes: 1 },
      profile,
    );
    expect(result).toBeLessThan(profile.baseScore);
    expect(calculateStars(result, profile)).toBeGreaterThanOrEqual(1);
  });
});
