import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { GameProvider } from "../../src/app/providers";
import { AppRoutes } from "../../src/app/routes";

describe("Level Select progression states", () => {
  beforeEach(() => localStorage.clear());

  it("exposes availability and completion semantics without color alone", () => {
    render(
      <MemoryRouter initialEntries={["/levels"]}>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </MemoryRouter>,
    );

    const first = screen.getByRole("button", { name: /First Steps/ });
    const locked = screen.getByRole("button", { name: /Open Horizon, locked/ });
    expect(first).toHaveAttribute("data-level-state", "current");
    expect(first).toHaveAttribute("aria-describedby");
    expect(locked).toBeDisabled();
    expect(locked).toHaveAttribute("data-level-state", "locked");
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(30);
  });
});
