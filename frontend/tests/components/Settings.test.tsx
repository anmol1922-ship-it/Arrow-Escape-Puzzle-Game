import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { GameProvider } from "../../src/app/providers";
import { Settings } from "../../src/screens/Settings/Settings";

describe("settings", () => {
  beforeEach(() => localStorage.clear());
  it("allows feedback and motion preferences to be changed", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <GameProvider>
          <Settings />
        </GameProvider>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("checkbox", { name: /Sound effects/ }));
    await user.selectOptions(
      screen.getByRole("combobox", { name: /Motion/ }),
      "on",
    );
    expect(
      screen.getByRole("checkbox", { name: /Sound effects/ }),
    ).not.toBeChecked();
    expect(screen.getByRole("combobox", { name: /Motion/ })).toHaveValue("on");
  });
});
