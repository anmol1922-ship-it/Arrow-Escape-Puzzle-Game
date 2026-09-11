import axe from "axe-core";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { GameAttempt, Level } from "../../src/types/game";
import { GameProvider } from "../../src/app/providers";
import { Game } from "../../src/screens/Game/Game";
import { Home } from "../../src/screens/Home/Home";
import { LevelSelect } from "../../src/screens/LevelSelect/LevelSelect";
import { Settings } from "../../src/screens/Settings/Settings";
import { DailyChallenge } from "../../src/screens/DailyChallenge/DailyChallenge";
import { LevelComplete } from "../../src/screens/LevelComplete/LevelComplete";
import { GameBoard } from "../../src/components/GameBoard/GameBoard";
import { PauseModal } from "../../src/components/PauseModal/PauseModal";

const level: Level = {
  id: "a11y",
  title: "Accessible board",
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

describe("screen accessibility", () => {
  it("has no axe violations on the board state", async () => {
    const { container } = render(
      <GameBoard
        level={level}
        attempt={attempt}
        feedback={{ kind: null, arrowId: null }}
        onActivate={() => undefined}
      />,
    );
    const result = await axe.run(container);
    expect(result.violations).toEqual([]);
  });

  async function expectNoViolations(container: HTMLElement) {
    const result = await axe.run(container);
    expect(result.violations).toEqual([]);
  }

  it("covers Home, Level Select, Game, Pause, Completion, Settings, and Daily Challenge", async () => {
    const screens = [
      <Home key="home" />,
      <LevelSelect key="levels" />,
      <Settings key="settings" />,
      <DailyChallenge key="daily" />,
      <LevelComplete key="complete" />,
      <GameBoard
        key="board"
        level={level}
        attempt={attempt}
        feedback={{ kind: null, arrowId: null }}
        onActivate={() => undefined}
      />,
      <PauseModal
        key="pause"
        onResume={() => undefined}
        onRestart={() => undefined}
        onHome={() => undefined}
      />,
    ];
    for (const screen of screens) {
      const { container, unmount } = render(
        <MemoryRouter>
          <GameProvider>{screen}</GameProvider>
        </MemoryRouter>,
      );
      await expectNoViolations(container);
      unmount();
    }
  });

  it("covers the routed Game screen", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/game/level-001"]}>
        <GameProvider>
          <Routes>
            <Route path="/game/:levelId" element={<Game />} />
          </Routes>
        </GameProvider>
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(container.querySelector(".game-board")).toBeTruthy(),
    );
    await expectNoViolations(container);
  });
});
