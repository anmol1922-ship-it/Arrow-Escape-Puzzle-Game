import { describe, expect, it } from "vitest";
import { getScoringProfile } from "../../data/scoringProfiles";
import type { Level } from "../../types/game";
import { makeMove, startGame } from "./GameEngine";

const level: Level = {
  id: "engine-test",
  title: "Engine",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 2,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [
    { id: "a1", row: 0, column: 0, direction: "RIGHT" },
    { id: "a2", row: 0, column: 1, direction: "RIGHT" },
  ],
};

describe("game engine", () => {
  it("increments mistakes but not moves for blocked actions", () => {
    const attempt = startGame(level);
    const result = makeMove(level, attempt, "a1", getScoringProfile("easy"));
    expect(result.kind).toBe("blocked");
    expect(result.attempt.moves).toBe(0);
    expect(result.attempt.mistakes).toBe(1);
  });
  it("removes legal arrows and completes deterministically", () => {
    const first = makeMove(
      level,
      startGame(level),
      "a2",
      getScoringProfile("easy"),
    );
    const second = makeMove(
      level,
      first.attempt,
      "a1",
      getScoringProfile("easy"),
    );
    expect(first.kind).toBe("escaped");
    expect(second.kind).toBe("completed");
    expect(second.attempt.activeArrowIds).toEqual([]);
    expect(second.attempt.stars).toBeGreaterThanOrEqual(1);
  });
});
