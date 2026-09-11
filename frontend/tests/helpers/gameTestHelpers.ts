import type { GameAttempt } from "../../src/types/game";

export function emptyAttempt(levelId: string): GameAttempt {
  return {
    levelId,
    activeArrowIds: [],
    moves: 0,
    mistakes: 0,
    elapsedSeconds: 0,
    status: "active",
    score: null,
    stars: null,
    hintedArrowId: null,
    startedAt: "",
    updatedAt: "",
  };
}
