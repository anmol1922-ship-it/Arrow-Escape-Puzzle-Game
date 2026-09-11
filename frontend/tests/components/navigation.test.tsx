import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { GameProvider } from "../../src/app/providers";
import { AppRoutes } from "../../src/app/routes";

function renderHome() {
  return render(
    <MemoryRouter initialEntries={["/home"]}>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </MemoryRouter>
  );
}

describe("home navigation", () => {
  beforeEach(() => localStorage.clear());
  it("exposes the core game destinations", async () => {
    const user = userEvent.setup();
    renderHome();
    expect(
      screen.getByRole("button", { name: /Play now/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Levels/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Settings/ }));
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
  });
});
