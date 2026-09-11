import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { GameAttempt, Level } from "../../src/types/game";
import { GameBoard } from "../../src/components/GameBoard/GameBoard";

const level: Level = {
  id: "keyboard",
  title: "Keyboard board",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 1,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [{ id: "a1", row: 0, column: 0, direction: "RIGHT" }],
};
const attempt: GameAttempt = {
  levelId: level.id,
  activeArrowIds: ["a1"],
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

describe("keyboard operation", () => {
  it("focuses and activates arrow buttons with keyboard input", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <GameBoard
        level={level}
        attempt={attempt}
        feedback={{ kind: null, arrowId: null }}
        onActivate={onActivate}
      />,
    );
    await user.tab();
    expect(
      screen.getByRole("button", { name: /pointing right/ }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onActivate).toHaveBeenCalledWith("a1");
  });
});
