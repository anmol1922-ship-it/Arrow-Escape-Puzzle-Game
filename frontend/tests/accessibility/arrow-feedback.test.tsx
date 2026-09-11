import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ArrowDefinition } from "../../src/types/game";
import { Arrow } from "../../src/components/Arrow/Arrow";

const arrow: ArrowDefinition = {
  id: "accessible-arrow",
  row: 1,
  column: 0,
  direction: "RIGHT",
};

describe("arrow feedback accessibility", () => {
  it("announces position, direction, and blocked state", () => {
    render(
      <Arrow
        arrow={arrow}
        hinted={false}
        feedback="blocked"
        onActivate={vi.fn()}
      />,
    );

    expect(screen.getByRole("button")).toHaveAccessibleName(
      /row 2, column 1, pointing right.*path blocked/i,
    );
  });

  it("keeps keyboard activation semantic and visible", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <Arrow
        arrow={arrow}
        hinted={false}
        feedback={null}
        onActivate={onActivate}
      />,
    );

    await user.tab();
    const button = screen.getByRole("button");
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("data-direction", "RIGHT");
    await user.keyboard(" ");
    expect(onActivate).toHaveBeenCalledWith("accessible-arrow");
  });
});
