import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { GameProvider } from "../../src/app/providers";
import { DailyChallenge } from "../../src/screens/DailyChallenge/DailyChallenge";

describe("daily challenge", () => {
  beforeEach(() => localStorage.clear());
  it("presents a local featured board and start action", () => {
    render(
      <MemoryRouter initialEntries={["/daily"]}>
        <GameProvider>
          <DailyChallenge />
        </GameProvider>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Daily challenge" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Start today|Play again/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Works offline/)).toBeInTheDocument();
  });
});
