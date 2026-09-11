import { describe, expect, it } from "vitest";
import type { Level } from "../../types/game";
import { getLocalHint } from "../../ai/aiFallback";
import { solvePuzzle } from "./puzzleSolver";
import { createAttempt } from "../engine/gameState";

const level: Level = {
  id: "solver-test",
  title: "Solver",
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

describe("solver and local hint", () => {
  it("finds the shortest deterministic path", () => {
    expect(solvePuzzle(level)).toEqual(["a2", "a1"]);
  });
  it("returns the solver first move without mutating an attempt", () => {
    const attempt = createAttempt(level);
    const hint = getLocalHint(level, attempt);
    expect(hint.arrowId).toBe("a2");
    expect(attempt.moves).toBe(0);
  });
});
