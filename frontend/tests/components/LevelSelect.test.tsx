import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { GameProvider } from "../../src/app/providers";
import { AppRoutes } from "../../src/app/routes";

describe("level select", () => {
  beforeEach(() => localStorage.clear());
  it("shows progression states and starts the first unlocked level", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/levels"]}>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: /First Steps/ })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: /Open Horizon, locked/ }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /First Steps/ }));
    expect(
      screen.getByLabelText(/First Steps, 4 by 4 arrow puzzle/),
    ).toBeInTheDocument();
  });
});
