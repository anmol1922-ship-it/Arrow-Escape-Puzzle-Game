import type { GameAttempt, Hint, Level } from "../types/game";
import { getLegalMoves } from "../game/engine/moveValidator";
import { solvePuzzle } from "../game/solver/puzzleSolver";

export function getLocalHint(level: Level, attempt: GameAttempt): Hint {
  const solution = solvePuzzle(level, attempt.activeArrowIds);
  const arrowId =
    solution?.[0] ?? getLegalMoves(level, attempt.activeArrowIds)[0] ?? null;
  if (!arrowId) {
    return {
      arrowId: null,
      message: "No clear move yet.",
      reason: "Try restarting this level to find a new path.",
      source: "local",
      confidence: null,
    };
  }
  return {
    arrowId,
    message: "Try the highlighted arrow first.",
    reason: "Its complete path is currently clear.",
    source: "local",
    confidence: null,
  };
}
