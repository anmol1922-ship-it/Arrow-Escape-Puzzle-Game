import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { GameProvider } from "../../src/app/providers";
import { AppRoutes } from "../../src/app/routes";

describe("Home hierarchy", () => {
  beforeEach(() => localStorage.clear());

  it("makes Play Now dominant while exposing all secondary destinations", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </MemoryRouter>,
    );

    const play = screen.getByRole("button", { name: /Play now/i });
    expect(play).toHaveClass("button-primary");
    expect(screen.getByRole("button", { name: /Levels/ })).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Daily challenge/ }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /Settings/ })).toBeVisible();
  });
});
