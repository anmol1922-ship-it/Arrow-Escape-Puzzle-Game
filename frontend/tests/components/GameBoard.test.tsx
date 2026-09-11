import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { GameAttempt, Level } from "../../src/types/game";
import { GameBoard } from "../../src/components/GameBoard/GameBoard";

const level: Level = {
  id: "board-test",
  title: "Board",
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
const attempt: GameAttempt = {
  levelId: level.id,
  activeArrowIds: ["a1", "a2"],
  moves: 0,
  mistakes: 0,
  elapsedSeconds: 0,
  status: "active",
  score: null,
  stars: null,
  hintedArrowId: "a2",
  startedAt: "",
  updatedAt: "",
};

describe("GameBoard", () => {
  it("exposes directional labels and routes activation to the caller", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <GameBoard
        level={level}
        attempt={attempt}
        feedback={{ kind: "blocked", arrowId: "a1" }}
        onActivate={onActivate}
      />,
    );
    expect(screen.getByRole("group")).toHaveAccessibleName(
      "Board, 4 by 4 arrow puzzle",
    );
    expect(
      screen.getByRole("button", { name: /row 2, column 1, pointing right/i }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /row 2, column 2, pointing right/i }),
    );
    expect(onActivate).toHaveBeenCalledWith("a2");
  });
});
