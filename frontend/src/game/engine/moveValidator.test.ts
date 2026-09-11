import { describe, expect, it } from "vitest";
import type { Level } from "../../types/game";
import { isMoveLegal, validateMove } from "./moveValidator";

const level: Level = {
  id: "test",
  title: "Test",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 2,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [
    { id: "a1", row: 1, column: 0, direction: "RIGHT" },
    { id: "a2", row: 1, column: 2, direction: "RIGHT" },
    { id: "a3", row: 3, column: 3, direction: "UP" },
  ],
};

describe("move validation", () => {
  it("blocks an arrow when an active arrow is in its path", () => {
    expect(isMoveLegal(level, ["a1", "a2", "a3"], "a1")).toBe(false);
    expect(validateMove(level, ["a1", "a2", "a3"], "a1").reason).toBe(
      "blocked",
    );
  });
  it("allows a clear path and board-edge escape", () => {
    expect(isMoveLegal(level, ["a1", "a2", "a3"], "a2")).toBe(true);
    expect(isMoveLegal(level, ["a1", "a2", "a3"], "a3")).toBe(true);
  });
  it("rejects missing and removed arrows", () => {
    expect(validateMove(level, ["a1"], "missing").reason).toBe("missing");
    expect(validateMove(level, ["a1"], "a2").reason).toBe("already-removed");
  });
});
