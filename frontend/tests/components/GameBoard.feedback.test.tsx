import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { GameAttempt, Level } from "../../src/types/game";
import { GameBoard } from "../../src/components/GameBoard/GameBoard";

const level: Level = {
  id: "feedback-board",
  title: "Feedback board",
  difficulty: "easy",
  boardSize: 3,
  targetMoves: 1,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [
    { id: "a1", row: 0, column: 0, direction: "RIGHT" },
    { id: "a2", row: 1, column: 1, direction: "UP" },
  ],
};

const attempt: GameAttempt = {
  levelId: level.id,
  activeArrowIds: ["a2"],
  moves: 1,
  mistakes: 0,
  elapsedSeconds: 1,
  status: "active",
  score: null,
  stars: null,
  hintedArrowId: null,
  startedAt: "",
  updatedAt: "",
};

describe("GameBoard feedback", () => {
  it("keeps an escaping arrow visible as a non-interactive departure", () => {
    render(
      <GameBoard
        level={level}
        attempt={attempt}
        feedback={{ kind: "escaped", arrowId: "a1" }}
        onActivate={vi.fn()}
      />,
    );

    const departing = screen.getByTestId("departure-a1");
    expect(departing).toHaveClass("arrow-departure", "arrow-state-escaping");
    expect(departing).not.toHaveAttribute("role", "button");
    expect(departing.querySelector("svg")).toHaveAttribute(
      "data-direction",
      "RIGHT",
    );
  });

  it("renders blocked feedback on the active arrow without calculating legality", () => {
    const onActivate = vi.fn();
    render(
      <GameBoard
        level={level}
        attempt={{ ...attempt, activeArrowIds: ["a1", "a2"] }}
        feedback={{ kind: "blocked", arrowId: "a1" }}
        onActivate={onActivate}
      />,
    );

    expect(screen.getByTestId("arrow-a1")).toHaveClass("arrow-state-blocked");
    expect(screen.getByTestId("arrow-a1")).toHaveAccessibleName(
      /path blocked/i,
    );
  });
});
