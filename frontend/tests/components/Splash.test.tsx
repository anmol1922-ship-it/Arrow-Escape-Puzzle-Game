import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { GameProvider } from "../../src/app/providers";
import { AppRoutes } from "../../src/app/routes";

describe("Splash", () => {
  it("establishes branding and leaves the artificial loading state promptly", () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Find the clear path." }),
    ).toBeVisible();
    expect(screen.getByLabelText("Loading game")).toBeVisible();
    act(() => vi.advanceTimersByTime(850));
    expect(
      screen.getByRole("heading", { name: "Every arrow has a way out." }),
    ).toBeVisible();
    vi.useRealTimers();
  });
});
