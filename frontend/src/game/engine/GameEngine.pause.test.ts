import { describe, expect, it } from "vitest";
import type { Level } from "../../types/game";
import {
  pauseAttempt,
  resumeAttempt,
  tickAttempt,
  createAttempt,
} from "./gameState";

const level: Level = {
  id: "pause",
  title: "Pause",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 1,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [{ id: "a1", row: 0, column: 0, direction: "RIGHT" }],
};

describe("pause recovery", () => {
  it("freezes time while paused and preserves the board", () => {
    const initial = createAttempt(level);
    const paused = pauseAttempt({ ...initial, elapsedSeconds: 4 });
    expect(tickAttempt(paused, 10).elapsedSeconds).toBe(4);
    expect(resumeAttempt(paused).activeArrowIds).toEqual(["a1"]);
  });
});
