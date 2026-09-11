import type { Level } from "../../src/types/game";

export const blockedFixture: Level = {
  id: "fixture-blocked",
  title: "Blocked",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 2,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [
    { id: "a1", row: 1, column: 0, direction: "RIGHT" },
    { id: "a2", row: 1, column: 1, direction: "RIGHT" },
  ],
};
export const invalidFixture = {
  ...blockedFixture,
  arrows: [{ ...blockedFixture.arrows[0], row: 9 }],
};
