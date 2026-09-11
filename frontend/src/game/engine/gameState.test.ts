import { describe, expect, it } from "vitest";
import type { Level } from "../../types/game";
import {
  createAttempt,
  pauseAttempt,
  resumeAttempt,
  tickAttempt,
} from "./gameState";

const level: Level = {
  id: "state-test",
  title: "State",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 1,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [{ id: "a1", row: 0, column: 0, direction: "RIGHT" }],
};

describe("game state transitions", () => {
  it("ticks only while active and freezes while paused", () => {
    const attempt = createAttempt(level);
    expect(tickAttempt(attempt, 2).elapsedSeconds).toBe(2);
    const paused = pauseAttempt(attempt);
    expect(tickAttempt(paused, 2).elapsedSeconds).toBe(0);
    expect(resumeAttempt(paused).status).toBe("active");
  });
});
